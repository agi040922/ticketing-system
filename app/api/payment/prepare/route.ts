import { NextRequest, NextResponse } from 'next/server';
import { generateCheckSumFromParams, CheckSumParams } from '@/lib/billgate/checksum';

/**
 * 빌게이트 결제 준비 API
 * CHECK_SUM 생성 및 결제 요청에 필요한 데이터 반환
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { serviceId, orderId, amount } = body;

    // 필수 파라미터 검증
    if (!serviceId || !orderId || !amount) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required parameters: serviceId, orderId, amount' 
        },
        { status: 400 }
      );
    }

    // 금액 유효성 검증
    const numericAmount = parseInt(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid amount: must be a positive number' 
        },
        { status: 400 }
      );
    }

    // CHECK_SUM 생성
    const checkSumParams: CheckSumParams = {
      serviceId,
      orderId,
      amount: amount.toString()
    };

    const checkSum = generateCheckSumFromParams(checkSumParams);

    // 현재 날짜/시간 생성 (YYYYMMDDHHMMSS 형식)
    const now = new Date();
    const orderDate = now.getFullYear().toString() +
      (now.getMonth() + 1).toString().padStart(2, '0') +
      now.getDate().toString().padStart(2, '0') +
      now.getHours().toString().padStart(2, '0') +
      now.getMinutes().toString().padStart(2, '0') +
      now.getSeconds().toString().padStart(2, '0');

    // 빌게이트 결제창 호출에 필요한 모든 파라미터 반환
    const response = {
      success: true,
      data: {
        // 기본 파라미터
        SERVICE_ID: serviceId,
        SERVICE_TYPE: "0000",           // 일반결제: 0000
        SERVICE_CODE: "0900",           // 신용카드: 0900
        ORDER_ID: orderId,
        ORDER_DATE: orderDate,
        AMOUNT: amount.toString(),
        CHECK_SUM: checkSum,
        
        // 테스트 환경 설정
        RETURN_URL: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/payment/return`,
        CANCEL_FLAG: "Y",               // 취소버튼 표시 여부
        
        // 빌게이트 결제창 URL (테스트)
        PAYMENT_URL: "https://tpay.billgate.net/pay/",
        
        // JavaScript 라이브러리 URL (테스트)
        SCRIPT_URL: "https://tpay.billgate.net/paygate/plugin/gx_web_client.js"
      }
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Payment prepare error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

/**
 * GET 요청 처리 (API 상태 확인용)
 */
export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Billgate payment prepare API is running',
    timestamp: new Date().toISOString()
  });
} 