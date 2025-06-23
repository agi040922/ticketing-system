import { NextRequest, NextResponse } from 'next/server';
import { CheckSumUtil } from '@/lib/billgate/checksum';
import { createSupabaseServerClient } from '@/lib/supabase';

/**
 * 빌게이트 결제 취소 API
 * POST /api/payment/cancel
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('결제 취소 요청 데이터:', body);

    const {
      ORDER_NO,
      AMOUNT,
      CANCEL_AMOUNT,
      SERVICE_ID = 'M2103135', // 테스트 서비스 ID
      REASON
    } = body;

    // 필수 파라미터 검증
    if (!ORDER_NO || !AMOUNT) {
      return NextResponse.json(
        { success: false, error: '필수 파라미터가 누락되었습니다.' },
        { status: 400 }
      );
    }

    // 취소 금액이 지정되지 않으면 전체 금액 취소
    const cancelAmount = CANCEL_AMOUNT || AMOUNT;

    // Supabase에서 주문 정보 조회
    const supabase = createSupabaseServerClient();
    
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('order_number', ORDER_NO)
      .single();

    if (orderError || !orderData) {
      return NextResponse.json(
        { success: false, error: '주문 정보를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 이미 취소된 주문인지 확인
    if (orderData.status === 'cancelled') {
      return NextResponse.json(
        { success: false, error: '이미 취소된 주문입니다.' },
        { status: 400 }
      );
    }

    // 완료되지 않은 주문인지 확인
    if (orderData.status !== 'completed') {
      return NextResponse.json(
        { success: false, error: '완료되지 않은 주문은 취소할 수 없습니다.' },
        { status: 400 }
      );
    }

    // CHECK_SUM 생성 (취소 요청용)
    const cancelCheckSum = CheckSumUtil.genCheckSum(`${SERVICE_ID}${ORDER_NO}${AMOUNT}`);

    // TODO: 실제 빌게이트 취소 API 호출
    // 현재는 시뮬레이션으로 처리
    console.log('빌게이트 취소 요청 시뮬레이션...');
    const cancelResult = {
      success: true,
      data: {
        RESULT_CODE: '0000',
        RESULT_MSG: '취소 성공',
        CANCEL_NO: `CANCEL_${Date.now()}`,
        ORDER_NO: ORDER_NO,
        CANCEL_AMOUNT: cancelAmount
      }
    };

    if (!cancelResult.success) {
      console.error('취소 요청 실패:', cancelResult);
      return NextResponse.json({
        success: false,
        error: '결제 취소 처리에 실패했습니다.'
      }, { status: 500 });
    }

    const cancelData = cancelResult.data!;
    console.log('취소 응답 데이터:', cancelData);

    // 취소 성공 여부 확인
    if (cancelData.RESULT_CODE !== '0000') {
      console.error('취소 실패:', cancelData.RESULT_MSG);
      return NextResponse.json({
        success: false,
        error: cancelData.RESULT_MSG || '결제 취소가 실패했습니다.',
        resultCode: cancelData.RESULT_CODE
      });
    }

    // Supabase에 주문 정보 업데이트
    const { data: updatedOrder, error: updateError } = await supabase
      .from('orders')
      .update({
        status: 'cancelled',
        cancel_reason: REASON || '사용자 요청',
        cancel_amount: cancelAmount,
        billgate_cancel_no: cancelData.CANCEL_NO,
        cancelled_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('order_number', ORDER_NO)
      .select()
      .single();

    if (updateError) {
      console.error('주문 정보 업데이트 실패:', updateError);
      // 취소는 성공했지만 DB 업데이트 실패 - 로그 남기고 성공 응답
      console.error('WARNING: 결제는 취소되었으나 주문 정보 업데이트 실패');
    }

    // 성공 응답
    return NextResponse.json({
      success: true,
      message: '결제가 성공적으로 취소되었습니다.',
      data: {
        orderNo: ORDER_NO,
        originalAmount: AMOUNT,
        cancelAmount: cancelAmount,
        cancelNo: cancelData.CANCEL_NO,
        cancelledAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('결제 취소 처리 오류:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: '결제 취소 처리 중 오류가 발생했습니다.',
        details: error instanceof Error ? error.message : '알 수 없는 오류'
      },
      { status: 500 }
    );
  }
}

/**
 * 취소 가능한 주문 목록 조회
 * GET /api/payment/cancel?customerPhone=PHONE_NUMBER
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const customerPhone = searchParams.get('customerPhone');

    if (!customerPhone) {
      return NextResponse.json(
        { success: false, error: '고객 전화번호가 필요합니다.' },
        { status: 400 }
      );
    }

    // Supabase에서 취소 가능한 주문 목록 조회
    const supabase = createSupabaseServerClient();
    
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .eq('customer_phone', customerPhone)
      .eq('status', 'completed')
      .order('created_at', { ascending: false });

    if (ordersError) {
      console.error('주문 목록 조회 실패:', ordersError);
      return NextResponse.json(
        { success: false, error: '주문 목록 조회에 실패했습니다.' },
        { status: 500 }
      );
    }

    const cancellableOrders = orders.map(order => ({
      orderNo: order.order_number,
      customerName: order.customer_name,
      amount: order.amount,
      paymentMethod: order.payment_method,
      approvalNo: order.billgate_approval_no,
      createdAt: order.created_at,
      canCancel: true // 완료된 주문만 조회했으므로 모두 취소 가능
    }));

    return NextResponse.json({
      success: true,
      data: cancellableOrders
    });

  } catch (error) {
    console.error('취소 가능한 주문 목록 조회 오류:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: '주문 목록 조회 중 오류가 발생했습니다.',
        details: error instanceof Error ? error.message : '알 수 없는 오류'
      },
      { status: 500 }
    );
  }
} 