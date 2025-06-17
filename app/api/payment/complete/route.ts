import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode';

interface PaymentCompleteRequest {
  orderId: string;
  customerId: string;
  ticketType: string;
  quantity: number;
  totalAmount: number;
  customerPhone: string;
  customerName: string;
  customerEmail?: string;
  adultCount?: number;
  childCount?: number;
}

/**
 * 결제 완료 후 처리 API
 * - 주문 및 입장권 정보를 데이터베이스에 저장
 * - 각 입장권에 대한 고유 QR코드 생성 (링크 형태)
 * - Supabase Storage에 QR코드 이미지 업로드
 */
export async function POST(request: NextRequest) {
  try {
    const body: PaymentCompleteRequest = await request.json();
    const { 
      orderId, 
      customerId, 
      ticketType, 
      quantity, 
      totalAmount, 
      customerPhone, 
      customerName,
      customerEmail,
      adultCount = 0,
      childCount = 0
    } = body;

    const supabase = createSupabaseServerClient();

    // 1. 주문 정보를 데이터베이스에 저장
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        id: orderId,
        customer_id: customerId,
        total_amount: totalAmount,
        status: 'completed',
        customer_phone: customerPhone,
        customer_name: customerName,
        customer_email: customerEmail,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (orderError) {
      throw new Error(`주문 저장 실패: ${orderError.message}`);
    }

    // 2. 주문 아이템들 저장 (대인/소인 구분)
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

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      throw new Error(`주문 아이템 저장 실패: ${itemsError.message}`);
    }

    // 3. QR코드 링크 생성 및 Storage 저장
    const qrCodeData = `TICKET:${orderId}:${customerPhone}`;
    const ticketUrl = `https://ticketing-system-nnmi.vercel.app/scanner?code=${encodeURIComponent(qrCodeData)}`;
    const qrImageUrl = await createAndUploadQRCode(supabase, orderId, ticketUrl);

    return NextResponse.json({
      success: true,
      message: '결제 처리 및 입장권 발급이 완료되었습니다.',
      orderId: orderId,
      qrImageUrl: qrImageUrl,
      ticketUrl: ticketUrl,
      order: orderData
    });

  } catch (error) {
    console.error('결제 완료 처리 중 오류:', error);
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

/**
 * QR코드 생성 및 Supabase Storage 업로드 함수
 * 이제 링크 형태의 QR코드를 생성합니다
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