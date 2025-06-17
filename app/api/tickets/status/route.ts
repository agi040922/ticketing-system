import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase';

interface StatusChangeRequest {
  uniqueCode: string;
  action: 'use' | 'unuse'; // 사용 처리 또는 사용 취소
  scannerId: string;
  location?: string;
}

/**
 * 티켓 상태 변경 API (운영자 전용)
 * - 티켓 사용 상태를 변경
 * - 사용 처리 또는 사용 취소 가능
 * - 스캔 로그 기록/삭제
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { uniqueCode, action, scannerId, location } = body;

    // Authorization 확인
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.includes('scanner_admin')) {
      return NextResponse.json(
        { success: false, message: '권한이 없습니다.' },
        { status: 401 }
      );
    }

    if (!uniqueCode || !action) {
      return NextResponse.json(
        { success: false, message: '필수 파라미터가 누락되었습니다.' },
        { status: 400 }
      );
    }

    // QR코드에서 주문ID 추출
    let orderId: string;
    let customerPhone: string = '';

    if (uniqueCode.startsWith('TICKET:')) {
      const parts = uniqueCode.replace('TICKET:', '').split(':');
      if (parts.length >= 2) {
        orderId = parts[0];
        customerPhone = parts[1];
      } else {
        return NextResponse.json(
          { success: false, message: '잘못된 QR코드 형식입니다.' },
          { status: 400 }
        );
      }
    } else {
      // 기존 형식 대응
      orderId = uniqueCode;
    }

    const supabase = createSupabaseServerClient();

    if (action === 'use') {
      // 사용 처리: 해당 주문의 모든 티켓을 used로 변경
      const { data: allTickets, error: fetchError } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', orderId);

      if (fetchError) {
        console.error('티켓 조회 오류:', fetchError);
        return NextResponse.json(
          { success: false, message: '티켓 조회 중 오류가 발생했습니다.' },
          { status: 500 }
        );
      }

      if (!allTickets || allTickets.length === 0) {
        return NextResponse.json(
          { success: false, message: '해당 주문의 티켓을 찾을 수 없습니다.' },
          { status: 404 }
        );
      }

      // 이미 사용된 티켓이 있는지 확인
      const usedTickets = allTickets.filter(ticket => ticket.status === 'used');
      if (usedTickets.length > 0) {
        return NextResponse.json(
          { success: false, message: '이미 사용된 티켓이 있습니다.' },
          { status: 409 }
        );
      }

      // 모든 티켓을 사용 처리
      const { error: updateError } = await supabase
        .from('order_items')
        .update({
          status: 'used',
          used_at: new Date().toISOString()
        })
        .eq('order_id', orderId);

      if (updateError) {
        console.error('티켓 상태 업데이트 오류:', updateError);
        return NextResponse.json(
          { success: false, message: '티켓 상태 업데이트 중 오류가 발생했습니다.' },
          { status: 500 }
        );
      }

      // 각 티켓에 대해 스캔 로그 기록
      const scanLogs = allTickets.map(ticket => ({
        ticket_id: ticket.id,
        unique_code: uniqueCode,
        scanner_id: scannerId || 'admin',
        scan_location: location || '운영자 터치'
      }));

      const { error: logError } = await supabase
        .from('scan_logs')
        .insert(scanLogs);

      if (logError) {
        console.error('스캔 로그 기록 오류:', logError);
        // 로그 오류는 치명적이지 않으므로 계속 진행
      }

      // 총 수량 계산
      const totalQuantity = allTickets.reduce((sum, ticket) => sum + ticket.quantity, 0);
      const ticketTypes = [...new Set(allTickets.map(ticket => ticket.ticket_type))].join(', ');

      return NextResponse.json({
        success: true,
        message: `총 ${totalQuantity}매 티켓(${ticketTypes})이 사용 처리되었습니다.`,
        ticketInfo: {
          orderId: orderId,
          totalQuantity: totalQuantity,
          ticketTypes: ticketTypes,
          usedAt: new Date().toISOString(),
          location: location || '운영자 터치'
        }
      });

    } else if (action === 'unuse') {
      // 사용 취소: 해당 주문의 모든 티켓을 active로 변경
      const { data: allTickets, error: fetchError } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', orderId);

      if (fetchError) {
        console.error('티켓 조회 오류:', fetchError);
        return NextResponse.json(
          { success: false, message: '티켓 조회 중 오류가 발생했습니다.' },
          { status: 500 }
        );
      }

      if (!allTickets || allTickets.length === 0) {
        return NextResponse.json(
          { success: false, message: '해당 주문의 티켓을 찾을 수 없습니다.' },
          { status: 404 }
        );
      }

      // 모든 티켓이 active인지 확인
      const activeTickets = allTickets.filter(ticket => ticket.status === 'active');
      if (activeTickets.length === allTickets.length) {
        return NextResponse.json(
          { success: false, message: '모든 티켓이 이미 미사용 상태입니다.' },
          { status: 409 }
        );
      }

      // 모든 티켓을 미사용으로 변경
      const { error: updateError } = await supabase
        .from('order_items')
        .update({
          status: 'active',
          used_at: null
        })
        .eq('order_id', orderId);

      if (updateError) {
        console.error('티켓 상태 업데이트 오류:', updateError);
        return NextResponse.json(
          { success: false, message: '티켓 상태 업데이트 중 오류가 발생했습니다.' },
          { status: 500 }
        );
      }

      // 총 수량 계산
      const totalQuantity = allTickets.reduce((sum, ticket) => sum + ticket.quantity, 0);
      const ticketTypes = [...new Set(allTickets.map(ticket => ticket.ticket_type))].join(', ');

      return NextResponse.json({
        success: true,
        message: `총 ${totalQuantity}매 티켓(${ticketTypes})이 사용 취소되었습니다.`,
        ticketInfo: {
          orderId: orderId,
          totalQuantity: totalQuantity,
          ticketTypes: ticketTypes,
          status: 'active'
        }
      });

    } else {
      return NextResponse.json(
        { success: false, message: '잘못된 액션입니다. (use 또는 unuse)' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('상태 변경 API 오류:', error);
    return NextResponse.json(
      { success: false, message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

/**
 * QR코드 데이터에서 주문 정보를 추출하는 함수
 */
function extractQRCodeData(qrData: string): { orderId: string | null, customerPhone: string | null } {
  try {
    // URL에서 code 파라미터 추출
    if (qrData.includes('scanner?code=')) {
      const url = new URL(qrData);
      const code = url.searchParams.get('code');
      if (code) {
        qrData = decodeURIComponent(code);
      }
    }

    // TICKET:주문ID:전화번호 형식
    if (qrData.startsWith('TICKET:')) {
      const parts = qrData.split(':');
      if (parts.length >= 3) {
        return {
          orderId: parts[1],
          customerPhone: parts[2]
        };
      }
    }
    
    // UUID 형태의 주문 ID만 있는 경우 (하위 호환성)
    if (qrData.length === 36 && qrData.includes('-')) {
      return {
        orderId: qrData,
        customerPhone: null
      };
    }
    
    return { orderId: null, customerPhone: null };
  } catch (error) {
    console.error('QR코드 데이터 파싱 오류:', error);
    return { orderId: null, customerPhone: null };
  }
} 