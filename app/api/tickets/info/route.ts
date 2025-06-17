import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase';

/**
 * 티켓 상세 정보 조회 API
 * - 일반 사용자: 기본 티켓 정보
 * - 관리자: 상세 정보 + 사용 로그 + 결제 정보
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const isAdmin = request.headers.get('x-admin') === 'true';

    if (!code) {
      return NextResponse.json(
        { success: false, message: '티켓 코드가 필요합니다.' },
        { status: 400 }
      );
    }

    const supabase = createSupabaseServerClient();

    // QR코드에서 주문 정보 추출
    const { orderId, customerPhone } = extractQRCodeData(code);
    
    if (!orderId || !customerPhone) {
      return NextResponse.json(
        { success: false, message: '유효하지 않은 코드 형식입니다.' },
        { status: 400 }
      );
    }

    // 주문 정보와 티켓 상태 조회
    const { data: orderData, error: fetchError } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          ticket_type,
          quantity,
          price,
          status,
          used_at
        )
      `)
      .eq('id', orderId)
      .eq('customer_phone', customerPhone)
      .single();

    if (fetchError || !orderData) {
      return NextResponse.json(
        { success: false, message: '유효하지 않은 티켓입니다.' },
        { status: 404 }
      );
    }

    // 티켓 상태 확인 (모든 order_items 중 하나라도 used면 used)
    const allTickets = orderData.order_items || [];
    const usedTickets = allTickets.filter((item: any) => item.status === 'used');
    const isUsed = usedTickets.length > 0;
    
    // 가장 최근 사용 시간 찾기
    const latestUsedTicket = usedTickets
      .sort((a: any, b: any) => new Date(b.used_at).getTime() - new Date(a.used_at).getTime())[0];

    // 스캔 로그 조회 (관리자용 상세 정보)
    let scanHistory: any[] = [];
    if (isAdmin) {
      const { data: scanLogs } = await supabase
        .from('scan_logs')
        .select('*')
        .eq('unique_code', code)
        .order('scanned_at', { ascending: false });
      
      scanHistory = scanLogs || [];
    }

    // 기본 티켓 정보 구성
    const ticketInfo = {
      // 기본 정보 (모든 사용자)
      orderNumber: orderId,
      customerName: orderData.customer_name,
      customerPhone: orderData.customer_phone,
      customerEmail: orderData.customer_email,
      orderDate: orderData.created_at,
      status: isUsed ? 'used' : 'active',
      usedAt: latestUsedTicket ? latestUsedTicket.used_at : null,
      usedLocation: scanHistory.length > 0 ? scanHistory[0].scan_location : '운영자 터치',
      ticketItems: allTickets.map((item: any) => ({
        type: item.ticket_type,
        quantity: item.quantity,
        price: item.price,
        totalPrice: item.quantity * item.price,
        status: item.status,
        usedAt: item.used_at
      })),
      totalAmount: orderData.total_amount,
      orderStatus: orderData.status,
      
      // 관리자 전용 정보
      ...(isAdmin && {
        adminInfo: {
          customerId: orderData.customer_id,
          paymentMethod: orderData.payment_method || '카드결제',
          refundStatus: orderData.refund_status || 'none',
          specialNotes: orderData.special_notes || '',
          createdAt: orderData.created_at,
          updatedAt: orderData.updated_at,
          scanHistory: scanHistory.map((log: any) => ({
            scannedAt: log.scanned_at,
            scannerId: log.scanner_id,
            location: log.scan_location,
            ipAddress: log.ip_address
          })),
          ticketDetails: allTickets.map((item: any) => ({
            id: item.id,
            type: item.ticket_type,
            quantity: item.quantity,
            status: item.status,
            usedAt: item.used_at
          }))
        }
      })
    };

    return NextResponse.json({
      success: true,
      ticketInfo,
      isAdmin
    });

  } catch (error) {
    console.error('티켓 정보 조회 중 오류:', error);
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
    let processedData = qrData;
    
    // URL에서 code 파라미터 추출 (링크 형태의 QR코드 처리)
    if (qrData.includes('scanner?code=')) {
      try {
        const url = new URL(qrData);
        const code = url.searchParams.get('code');
        if (code) {
          processedData = decodeURIComponent(code);
        }
      } catch (urlError) {
        console.error('URL 파싱 오류:', urlError);
        // URL 파싱 실패 시 원본 데이터 그대로 사용
      }
    }
    
    // TICKET:주문ID:전화번호 형식
    if (processedData.startsWith('TICKET:')) {
      const parts = processedData.split(':');
      if (parts.length >= 3) {
        return {
          orderId: parts[1],
          customerPhone: parts[2]
        };
      }
    }
    
    // UUID 형태의 주문 ID만 있는 경우 (하위 호환성)
    if (processedData.length === 36 && processedData.includes('-')) {
      return {
        orderId: processedData,
        customerPhone: null
      };
    }
    
    return { orderId: null, customerPhone: null };
  } catch (error) {
    console.error('QR코드 데이터 파싱 오류:', error);
    return { orderId: null, customerPhone: null };
  }
} 