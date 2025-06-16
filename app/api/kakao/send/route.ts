import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

interface KakaoMessageRequest {
  phone: string;
  templateCode: string;
  templateParams: Record<string, any>;
  attachments?: Array<{
    type: 'image' | 'file';
    url: string;
    name?: string;
  }>;
  fallbackMessage?: string; // SMS 대체 메시지
}

interface KakaoTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

/**
 * 카카오톡 알림톡/친구톡 메시지 전송 API
 * - 알림톡 템플릿을 사용한 메시지 전송
 * - 이미지 첨부 지원
 * - SMS 대체 발송 지원
 */
export async function POST(request: NextRequest) {
  try {
    const body: KakaoMessageRequest = await request.json();
    const { phone, templateCode, templateParams, attachments, fallbackMessage } = body;

    // 필수 파라미터 검증
    if (!phone || !templateCode || !templateParams) {
      return NextResponse.json(
        { success: false, message: '필수 파라미터가 누락되었습니다.' },
        { status: 400 }
      );
    }

    // 전화번호 형식 검증 및 정규화
    const normalizedPhone = normalizePhoneNumber(phone);
    if (!normalizedPhone) {
      return NextResponse.json(
        { success: false, message: '유효하지 않은 전화번호 형식입니다.' },
        { status: 400 }
      );
    }

    // 카카오톡 API 액세스 토큰 획득
    const accessToken = await getKakaoAccessToken();

    // 알림톡 메시지 전송
    const messageResult = await sendAlimtalkMessage(
      accessToken,
      normalizedPhone,
      templateCode,
      templateParams,
      attachments,
      fallbackMessage
    );

    return NextResponse.json({
      success: true,
      message: '카카오톡 메시지가 성공적으로 전송되었습니다.',
      messageId: messageResult.messageId,
      status: messageResult.status
    });

  } catch (error) {
    console.error('카카오톡 메시지 전송 중 오류:', error);
    
    // 구체적인 오류 메시지 반환
    if (error instanceof Error) {
      if (error.message.includes('TOKEN')) {
        return NextResponse.json(
          { success: false, message: '카카오톡 API 인증에 실패했습니다.' },
          { status: 401 }
        );
      } else if (error.message.includes('TEMPLATE')) {
        return NextResponse.json(
          { success: false, message: '알림톡 템플릿이 유효하지 않습니다.' },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { success: false, message: '메시지 전송에 실패했습니다.' },
      { status: 500 }
    );
  }
}

/**
 * 카카오톡 API 액세스 토큰 획득
 */
async function getKakaoAccessToken(): Promise<string> {
  const tokenUrl = 'https://kauth.kakao.com/oauth/token';
  const restApiKey = process.env.KAKAO_REST_API_KEY;
  const adminKey = process.env.KAKAO_ADMIN_KEY;

  if (!restApiKey || !adminKey) {
    throw new Error('카카오톡 API 키가 설정되지 않았습니다.');
  }

  try {
    // 관리자 키를 사용한 토큰 획득 (비즈니스 계정용)
    const response = await axios.post<KakaoTokenResponse>(
      tokenUrl,
      new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: restApiKey,
        client_secret: adminKey,
      }).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    return response.data.access_token;
  } catch (error) {
    console.error('카카오톡 토큰 획득 실패:', error);
    throw new Error('TOKEN_ACQUISITION_FAILED');
  }
}

/**
 * 알림톡 메시지 전송
 */
async function sendAlimtalkMessage(
  accessToken: string,
  phone: string,
  templateCode: string,
  templateParams: Record<string, any>,
  attachments?: Array<{ type: string; url: string; name?: string }>,
  fallbackMessage?: string
): Promise<{ messageId: string; status: string }> {

  const messageUrl = 'https://kapi.kakao.com/v2/api/talk/memo/default/send';
  const channelPublicId = process.env.KAKAO_CHANNEL_PUBLIC_ID;
  const pfId = process.env.KAKAO_PF_ID; // 플러스친구 ID

  if (!channelPublicId || !pfId) {
    throw new Error('카카오톡 채널 정보가 설정되지 않았습니다.');
  }

  // 메시지 데이터 구성
  const messageData = {
    receiver_uuids: [phone], // 수신자 목록
    template_object: {
      object_type: 'text',
      text: buildMessageText(templateCode, templateParams),
      link: {
        web_url: process.env.NEXT_PUBLIC_SITE_URL,
        mobile_web_url: process.env.NEXT_PUBLIC_SITE_URL,
      },
      button_title: '입장권 확인하기'
    }
  };

  // 이미지 첨부가 있는 경우
  if (attachments && attachments.length > 0) {
    const imageAttachments = attachments.filter(att => att.type === 'image');
    if (imageAttachments.length > 0) {
      messageData.template_object = {
        ...messageData.template_object,
        object_type: 'feed',
        content: {
          title: templateParams.customerName ? `${templateParams.customerName}님의 입장권` : '입장권 발급',
          description: buildMessageText(templateCode, templateParams),
          image_url: imageAttachments[0].url,
          image_width: 300,
          image_height: 300,
          link: {
            web_url: process.env.NEXT_PUBLIC_SITE_URL,
            mobile_web_url: process.env.NEXT_PUBLIC_SITE_URL,
          }
        },
        buttons: [
          {
            title: '입장권 확인하기',
            link: {
              web_url: process.env.NEXT_PUBLIC_SITE_URL,
              mobile_web_url: process.env.NEXT_PUBLIC_SITE_URL,
            }
          }
        ]
      };
    }
  }

  try {
    const response = await axios.post(messageUrl, messageData, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    return {
      messageId: response.data.result_code || 'unknown',
      status: 'sent'
    };

  } catch (error: any) {
    console.error('알림톡 전송 실패:', error.response?.data || error.message);
    
    // SMS 대체 발송 시도
    if (fallbackMessage) {
      console.log('SMS 대체 발송 시도...');
      return await sendFallbackSMS(phone, fallbackMessage);
    }
    
    throw new Error('TEMPLATE_SEND_FAILED');
  }
}

/**
 * SMS 대체 발송 (알림톡 실패 시)
 */
async function sendFallbackSMS(phone: string, message: string): Promise<{ messageId: string; status: string }> {
  // 여기서는 예시로 간단한 SMS 서비스 호출을 구현
  // 실제로는 NHN Cloud SMS, 네이버 클라우드 SMS 등의 서비스를 사용
  
  const smsApiUrl = process.env.SMS_API_URL;
  const smsApiKey = process.env.SMS_API_KEY;

  if (!smsApiUrl || !smsApiKey) {
    console.warn('SMS 대체 발송 설정이 없습니다.');
    return { messageId: 'fallback_failed', status: 'failed' };
  }

  try {
    const response = await axios.post(smsApiUrl, {
      to: phone,
      message: message,
      from: process.env.SMS_SENDER_NUMBER || '15990000'
    }, {
      headers: {
        'Authorization': `Bearer ${smsApiKey}`,
        'Content-Type': 'application/json',
      },
    });

    return {
      messageId: response.data.messageId || 'sms_sent',
      status: 'sms_sent'
    };

  } catch (error) {
    console.error('SMS 대체 발송 실패:', error);
    return { messageId: 'sms_failed', status: 'failed' };
  }
}

/**
 * 템플릿에 따른 메시지 텍스트 생성
 */
function buildMessageText(templateCode: string, params: Record<string, any>): string {
  switch (templateCode) {
    case 'TICKET_ISSUED':
      return `🎫 ${params.customerName || '고객'}님의 입장권이 발급되었습니다!

📍 티켓 종류: ${params.ticketType || '일반권'}
🔢 수량: ${params.quantity || 1}매
📱 QR코드를 통해 입장해주세요.

입장 시 QR코드를 제시해주시기 바랍니다.`;

    case 'TICKET_USED':
      return `✅ 입장권 사용이 완료되었습니다.

👤 ${params.customerName || '고객'}님
📅 사용 시간: ${params.usedAt || '방금 전'}
📍 입장 위치: ${params.location || '메인 게이트'}

즐거운 시간 보내세요!`;

    default:
      return `안녕하세요! ${params.customerName || '고객'}님께 알림을 드립니다.`;
  }
}

/**
 * 전화번호 정규화 (한국 전화번호 형식)
 */
function normalizePhoneNumber(phone: string): string | null {
  // 숫자만 추출
  const numbers = phone.replace(/\D/g, '');
  
  // 한국 전화번호 형식 검증
  if (numbers.length === 10 && numbers.startsWith('0')) {
    // 010-1234-5678 -> 01012345678
    return numbers;
  } else if (numbers.length === 11 && numbers.startsWith('010')) {
    // 010-1234-5678 -> 01012345678
    return numbers;
  } else if (numbers.length === 11 && numbers.startsWith('82')) {
    // +82-10-1234-5678 -> 01012345678
    return '0' + numbers.substring(2);
  }
  
  return null;
} 