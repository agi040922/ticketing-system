import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase';

interface ScanRequest {
  uniqueCode: string;
  scannerId: string;
  location?: string;
}

interface OrderItem {
  ticket_type: string;
  quantity: number;
  price: number;
}

/**
 * QR코드 스캔 및 입장권 사용 처리 API
 * - QR코드의 주문 정보를 검증
 * - 스캔 로그를 기록
 * - 중복 스캔 방지
 */
export async function POST(request: NextRequest) {
  try {
    const body: ScanRequest = await request.json();
    const { uniqueCode, scannerId, location } = body;

    if (!uniqueCode || !scannerId) {
      return NextResponse.json(
        { success: false, message: '필수 파라미터가 누락되었습니다.' },
        { status: 400 }
      );
    }

    const supabase = createSupabaseServerClient();

    // QR코드에서 주문 정보 추출 (TICKET:주문ID:전화번호 형식)
    const { orderId, customerPhone } = extractQRCodeData(uniqueCode);
    
    if (!orderId || !customerPhone) {
      return NextResponse.json(
        { success: false, message: '유효하지 않은 QR코드 형식입니다.' },
        { status: 400 }
      );
    }

    // 주문 정보 조회
    const { data: orderData, error: fetchError } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          ticket_type,
          quantity,
          price
        )
      `)
      .eq('id', orderId)
      .eq('customer_phone', customerPhone)
      .single();

    if (fetchError || !orderData) {
      return NextResponse.json(
        { success: false, message: '유효하지 않은 입장권입니다.' },
        { status: 404 }
      );
    }

    // 주문 상태 확인
    if (orderData.status !== 'completed') {
      return NextResponse.json(
        { success: false, message: '아직 처리되지 않은 주문의 입장권입니다.' },
        { status: 400 }
      );
    }

    // 이미 스캔된 입장권인지 확인
    const { data: existingScan } = await supabase
      .from('scan_logs')
      .select('*')
      .eq('order_id', orderId)
      .single();

    if (existingScan) {
      return NextResponse.json({
        success: false,
        message: '이미 사용된 입장권입니다.',
        ticketInfo: {
          customerName: orderData.customer_name,
          customerPhone: orderData.customer_phone,
          ticketType: (orderData.order_items as OrderItem[]).map((item: OrderItem) => `${item.ticket_type} ${item.quantity}매`).join(', '),
          ticketNumber: orderId.slice(-8),
          usedAt: existingScan.scanned_at,
          scanLocation: existingScan.scan_location
        }
      }, { status: 409 });
    }

    // 스캔 로그 기록
    const { error: logError } = await supabase
      .from('scan_logs')
      .insert({
        order_id: orderId,
        customer_phone: customerPhone,
        scanner_id: scannerId,
        scan_location: location,
        scanned_at: new Date().toISOString()
      });

    if (logError) {
      console.error('스캔 로그 기록 오류:', logError);
      // 로그 기록 실패해도 입장은 허용
    }

    return NextResponse.json({
      success: true,
      message: '입장이 허용되었습니다.',
      ticketInfo: {
        customerName: orderData.customer_name,
        customerPhone: orderData.customer_phone,
        ticketType: (orderData.order_items as OrderItem[]).map((item: OrderItem) => `${item.ticket_type} ${item.quantity}매`).join(', '),
        ticketNumber: orderId.slice(-8),
        usedAt: new Date().toISOString(),
        scanLocation: location
      }
    });

  } catch (error) {
    console.error('QR코드 스캔 처리 중 오류:', error);
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

/**
 * 입장권 정보 조회 API (GET 요청)
 * QR코드 스캔 전 미리보기용으로 사용
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const uniqueCode = searchParams.get('code');

    if (!uniqueCode) {
      return NextResponse.json(
        { success: false, message: '코드가 제공되지 않았습니다.' },
        { status: 400 }
      );
    }

    const supabase = createSupabaseServerClient();
    const { orderId, customerPhone } = extractQRCodeData(uniqueCode);
    
    if (!orderId || !customerPhone) {
      return NextResponse.json(
        { success: false, message: '유효하지 않은 QR코드 형식입니다.' },
        { status: 400 }
      );
    }

    const { data: orderData, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          ticket_type,
          quantity,
          price
        )
      `)
      .eq('id', orderId)
      .eq('customer_phone', customerPhone)
      .single();

    if (error || !orderData) {
      return NextResponse.json(
        { success: false, message: '유효하지 않은 입장권입니다.' },
        { status: 404 }
      );
    }

    // 스캔 기록 확인
    const { data: scanLog } = await supabase
      .from('scan_logs')
      .select('*')
      .eq('order_id', orderId)
      .single();

    return NextResponse.json({
      success: true,
      ticketInfo: {
        customerName: orderData.customer_name,
        customerPhone: orderData.customer_phone,
        ticketType: (orderData.order_items as OrderItem[]).map((item: OrderItem) => `${item.ticket_type} ${item.quantity}매`).join(', '),
        ticketNumber: orderId.slice(-8),
        status: scanLog ? 'used' : 'active',
        usedAt: scanLog?.scanned_at,
        orderDate: orderData.created_at
      }
    });

  } catch (error) {
    console.error('입장권 정보 조회 중 오류:', error);
    return NextResponse.json(
      { success: false, message: '입장권 정보를 조회할 수 없습니다.' },
      { status: 500 }
    );
  }
}

/**
 * QR코드 데이터에서 주문 정보를 추출하는 함수
 */
function extractQRCodeData(qrData: string): { orderId: string | null, customerPhone: string | null } {
  try {
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