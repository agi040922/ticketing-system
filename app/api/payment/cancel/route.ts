import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase';
import { BillgateSocketService, BillgateCancelRequest } from '@/lib/billgate/socket-service';

interface PaymentCancelRequest {
  orderId: string;
  cancelAmount?: number; // 부분 취소 금액 (전체 취소 시 생략)
  cancelReason: string;
  isPartialCancel?: boolean; // 부분 취소 여부
}

interface CancelableOrder {
  id: string;
  total_amount: number;
  customer_name: string;
  customer_phone: string;
  billgate_transaction_id: string;
  billgate_approval_no: string;
  payment_method: string;
  created_at: string;
  status: string;
}

/**
 * 빌게이트 결제 취소 처리 API (POST)
 */
export async function POST(request: NextRequest) {
  try {
    const body: PaymentCancelRequest = await request.json();
    console.log('빌게이트 취소 요청 데이터:', body);

    const { orderId, cancelAmount, cancelReason, isPartialCancel = false } = body;

    if (!orderId || !cancelReason) {
      return NextResponse.json({
        success: false,
        message: '주문 ID와 취소 사유는 필수입니다.'
      }, { status: 400 });
    }

    const supabase = createSupabaseServerClient();

    // 1. 주문 정보 조회
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json({
        success: false,
        message: '주문을 찾을 수 없습니다.'
      }, { status: 404 });
    }

    // 2. 취소 가능한 상태인지 확인
    if (order.status !== 'completed') {
      return NextResponse.json({
        success: false,
        message: '취소 가능한 주문이 아닙니다.'
      }, { status: 400 });
    }

    if (!order.billgate_transaction_id) {
      return NextResponse.json({
        success: false,
        message: '빌게이트 거래 번호가 없어 취소할 수 없습니다.'
      }, { status: 400 });
    }

    // 3. 취소 금액 검증
    const totalAmount = order.total_amount;
    const finalCancelAmount = isPartialCancel ? (cancelAmount || totalAmount) : totalAmount;

    if (finalCancelAmount > totalAmount) {
      return NextResponse.json({
        success: false,
        message: '취소 금액이 주문 금액을 초과할 수 없습니다.'
      }, { status: 400 });
    }

    // 클라이언트 IP 주소 가져오기
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const clientIp = forwardedFor?.split(',')[0] || realIp || '127.0.0.1';

    // 4. 빌게이트 Socket 서비스로 취소 요청
    const socketService = new BillgateSocketService();
    
    const cancelRequest: BillgateCancelRequest = {
      ServiceId: process.env.BILLGATE_SERVICE_ID || 'M2103135',
      OrderData: orderId,
      TransactionNo: order.billgate_transaction_id,
      CancelAmt: finalCancelAmount.toString(),
      PartialCancel: isPartialCancel ? '1' : '0',
      CancelReason: cancelReason,
      IpAddr: clientIp
    };

    console.log('빌게이트 서버 취소 요청 시작...');
    const cancelResult = await socketService.requestCancel(cancelRequest);

    if (!cancelResult.success) {
      console.error('빌게이트 취소 실패:', cancelResult.error);
      return NextResponse.json({
        success: false,
        message: `결제 취소 실패: ${cancelResult.error}`
      }, { status: 400 });
    }

    console.log('빌게이트 취소 성공:', cancelResult.data);

    // 5. 취소 성공 시 주문 상태 업데이트
    const updateData: any = {
      status: isPartialCancel ? 'partial_cancelled' : 'cancelled',
      cancel_reason: cancelReason,
      cancel_amount: finalCancelAmount,
      cancelled_at: new Date().toISOString(),
      
      // 빌게이트 취소 정보 추가
      billgate_cancel_no: cancelResult.data?.CancelNo || cancelResult.data?.cancel_no,
    };

    // 부분 취소인 경우 남은 금액 계산
    if (isPartialCancel) {
      updateData.remaining_amount = totalAmount - finalCancelAmount;
    }

    const { data: updatedOrder, error: updateError } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', orderId)
      .select()
      .single();

    if (updateError) {
      console.error('주문 업데이트 실패:', updateError);
      return NextResponse.json({
        success: false,
        message: `주문 상태 업데이트 실패: ${updateError.message}`
      }, { status: 500 });
    }

    // 6. 성공 응답
    return NextResponse.json({
      success: true,
      message: isPartialCancel ? '부분 취소가 완료되었습니다.' : '전체 취소가 완료되었습니다.',
      orderId: orderId,
      cancelNo: cancelResult.data?.CancelNo || cancelResult.data?.cancel_no,
      cancelAmount: finalCancelAmount,
      remainingAmount: isPartialCancel ? (totalAmount - finalCancelAmount) : 0,
      order: updatedOrder,
      billgateResponse: cancelResult.data
    });

  } catch (error) {
    console.error('결제 취소 처리 중 오류:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.' 
      },
      { status: 500 }
    );
  }
}

/**
 * 취소 가능한 주문 목록 조회 (GET)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const customerPhone = searchParams.get('customerPhone');
    const orderId = searchParams.get('orderId');

    const supabase = createSupabaseServerClient();
    
    let query = supabase
      .from('orders')
      .select('*')
      .eq('status', 'completed');
    
    if (customerPhone) {
      query = query.eq('customer_phone', customerPhone);
    }
    
    if (orderId) {
      query = query.eq('id', orderId);
    }

    const { data: orders, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('주문 조회 실패:', error);
      return NextResponse.json({
        success: false,
        message: '주문 조회에 실패했습니다.'
      }, { status: 500 });
    }

    // 취소 가능한 주문만 필터링 (빌게이트 거래번호가 있는 주문)
    const cancelableOrders: CancelableOrder[] = orders
      .filter((order: any) => order.billgate_transaction_id)
      .map((order: any) => ({
        id: order.id,
        total_amount: order.total_amount,
        customer_name: order.customer_name,
        customer_phone: order.customer_phone,
        billgate_transaction_id: order.billgate_transaction_id,
        billgate_approval_no: order.billgate_approval_no,
        payment_method: order.payment_method,
        created_at: order.created_at,
        status: order.status
      }));

    return NextResponse.json({
      success: true,
      orders: cancelableOrders,
      count: cancelableOrders.length
    });

  } catch (error) {
    console.error('취소 가능한 주문 조회 중 오류:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.' 
      },
      { status: 500 }
    );
  }
} 