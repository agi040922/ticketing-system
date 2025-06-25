import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase';
import { BillgateSocketService, BillgateApprovalRequest } from '@/lib/billgate/socket-service';
import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode';

interface PaymentApproveRequest {
  // 빌게이트 결제창에서 리턴되는 데이터
  ServiceId: string;
  PayMethod: string;
  OrderData: string;
  Amt: string;
  Key: string;
  PlainMsgOk: string;
  TransactionNo: string;
  AuthType: string;
  Iden: string;
  
  // 추가 고객 정보 (localStorage에서 가져온 데이터)
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  adultCount: number;
  childCount: number;
}

/**
 * 빌게이트 결제 승인 처리 API
 * 
 * 프로세스:
 * 1. 빌게이트 결제창에서 리턴된 데이터 검증
 * 2. Socket 통신으로 빌게이트 서버에 승인 요청
 * 3. 승인 성공 시 주문 정보 DB 저장
 * 4. QR코드 생성 및 Storage 업로드
 */
export async function POST(request: NextRequest) {
  try {
    const body: PaymentApproveRequest = await request.json();
    console.log('빌게이트 승인 요청 데이터:', body);

    const {
      ServiceId,
      PayMethod,
      OrderData,
      Amt,
      Key,
      PlainMsgOk,
      TransactionNo,
      AuthType,
      Iden,
      customerName,
      customerPhone,
      customerEmail,
      adultCount,
      childCount
    } = body;

    // 클라이언트 IP 주소 가져오기
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const clientIp = forwardedFor?.split(',')[0] || realIp || '127.0.0.1';

    // 1. 빌게이트 Socket 서비스로 승인 요청
    const socketService = new BillgateSocketService();
    
    const approvalRequest: BillgateApprovalRequest = {
      ServiceId,
      PayMethod,
      OrderData,
      Amt,
      Key,
      PlainMsgOk,
      TransactionNo,
      AuthType,
      Iden,
      IpAddr: clientIp
    };

    console.log('빌게이트 서버 승인 요청 시작...');
    const approvalResult = await socketService.requestApproval(approvalRequest);

    if (!approvalResult.success) {
      console.error('빌게이트 승인 실패:', approvalResult.error);
      return NextResponse.json({
        success: false,
        message: `결제 승인 실패: ${approvalResult.error}`
      }, { status: 400 });
    }

    console.log('빌게이트 승인 성공:', approvalResult.data);

    // 2. 승인 성공 시 주문 정보 DB 저장
    const supabase = createSupabaseServerClient();
    const orderId = OrderData; // OrderData가 주문 ID

    // 주문 정보를 데이터베이스에 저장
    const totalAmount = parseInt(Amt);
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        id: orderId,
        customer_id: uuidv4(),
        total_amount: totalAmount,
        status: 'completed',
        customer_phone: customerPhone,
        customer_name: customerName,
        customer_email: customerEmail,
        
        // 빌게이트 관련 정보 추가
        billgate_approval_no: approvalResult.data?.ApprovalNo || approvalResult.data?.approval_no,
        billgate_transaction_id: TransactionNo,
        payment_method: PayMethod,
        
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (orderError) {
      console.error('주문 저장 실패:', orderError);
      return NextResponse.json({
        success: false,
        message: `주문 저장 실패: ${orderError.message}`
      }, { status: 500 });
    }

    // 3. 주문 아이템들 저장 (대인/소인 구분)
    const orderItems = [];
    
    // 대인 티켓
    if (adultCount > 0) {
      orderItems.push({
        order_id: orderId,
        ticket_type: '대인',
        quantity: adultCount,
        price: 25000
      });
    }
    
    // 소인 티켓
    if (childCount > 0) {
      orderItems.push({
        order_id: orderId,
        ticket_type: '소인',
        quantity: childCount,
        price: 18000
      });
    }

    if (orderItems.length > 0) {
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        console.error('주문 아이템 저장 실패:', itemsError);
        // 주문 아이템 저장 실패는 주문 자체를 실패로 처리하지 않음
      }
    }

    // 4. QR코드 생성 및 Storage 저장
    const qrCodeData = `TICKET:${orderId}:${customerPhone}`;
    const ticketUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/scanner?code=${encodeURIComponent(qrCodeData)}`;
    const qrImageUrl = await createAndUploadQRCode(supabase, orderId, ticketUrl);

    // 5. 성공 응답
    return NextResponse.json({
      success: true,
      message: '결제 승인 및 입장권 발급이 완료되었습니다.',
      orderId: orderId,
      approvalNo: approvalResult.data?.ApprovalNo || approvalResult.data?.approval_no,
      transactionNo: TransactionNo,
      qrImageUrl: qrImageUrl,
      ticketUrl: ticketUrl,
      order: orderData,
      billgateResponse: approvalResult.data
    });

  } catch (error) {
    console.error('결제 승인 처리 중 오류:', error);
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
 * QR코드 생성 및 Supabase Storage 업로드 함수
 */
async function createAndUploadQRCode(supabase: any, orderId: string, ticketUrl: string): Promise<string> {
  try {
    // QR코드 생성 (링크 형태, Base64 데이터 URL 형태)
    const qrCodeDataURL = await QRCode.toDataURL(ticketUrl, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'M'
    });

    // Base64 데이터를 Buffer로 변환
    const base64Data = qrCodeDataURL.split(',')[1];
    const buffer = Buffer.from(base64Data, 'base64');

    // Supabase Storage에 QR코드 이미지 업로드
    const fileName = `qr-codes/${orderId}.png`;
    const { error: uploadError } = await supabase.storage
      .from('ticket-images')
      .upload(fileName, buffer, {
        contentType: 'image/png',
        upsert: true // 이미 존재하면 덮어쓰기
      });

    if (uploadError) {
      console.error('QR코드 업로드 오류:', uploadError);
      // Storage 업로드에 실패해도 기본 QR코드 반환
      return qrCodeDataURL;
    }

    // 업로드된 이미지의 공개 URL 가져오기
    const { data: { publicUrl } } = supabase.storage
      .from('ticket-images')
      .getPublicUrl(fileName);

    return publicUrl;

  } catch (error) {
    console.error('QR코드 생성 중 오류:', error);
    throw error;
  }
}

/**
 * 결제 상태 조회 (GET 요청)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');
    const transactionNo = searchParams.get('transactionNo');

    if (!orderId && !transactionNo) {
      return NextResponse.json({
        success: false,
        message: '주문 ID 또는 거래 번호가 필요합니다.'
      }, { status: 400 });
    }

    const supabase = createSupabaseServerClient();
    
    let query = supabase
      .from('orders')
      .select('*');
    
    if (orderId) {
      query = query.eq('id', orderId);
    } else if (transactionNo) {
      query = query.eq('billgate_transaction_id', transactionNo);
    }

    const { data: order, error } = await query.single();

    if (error) {
      return NextResponse.json({
        success: false,
        message: '주문을 찾을 수 없습니다.'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      order: order
    });

  } catch (error) {
    console.error('결제 상태 조회 중 오류:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.' 
      },
      { status: 500 }
    );
  }
} 