import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';

interface GenerateRequest {
  code: string;
  type: 'qr';
  width?: number;
  height?: number;
  format?: 'png' | 'svg' | 'base64';
  asLink?: boolean; // 링크 형태로 QR코드 생성 여부
}

/**
 * QR코드 생성 API
 * - 주어진 코드로 QR코드를 생성
 * - 다양한 형식으로 출력 가능 (PNG, SVG, Base64)
 * - 크기 조정 가능
 * - 링크 형태로 생성 가능
 * - GET 및 POST 요청 모두 지원
 */

// GET 요청 처리 (URL 파라미터 사용)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const type = searchParams.get('type') as 'qr';
    const width = parseInt(searchParams.get('width') || '300');
    const format = searchParams.get('format') as 'png' | 'svg' | 'base64' || 'base64';
    const asLink = searchParams.get('asLink') === 'true';

    if (!code) {
      return NextResponse.json(
        { success: false, message: '코드가 필요합니다.' },
        { status: 400 }
      );
    }

    // QR코드만 지원
    if (type && type !== 'qr') {
      return NextResponse.json(
        { success: false, message: 'QR코드만 지원됩니다.' },
        { status: 400 }
      );
    }

    const result = await generateQRCode(code, width, format, asLink);
    
    return NextResponse.json({
      success: true,
      data: result.qrCode,
      url: result.url,
      format: format
    });
  } catch (error) {
    console.error('QR코드 생성 오류 (GET):', error);
    return NextResponse.json(
      { success: false, message: '코드 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// POST 요청 처리 (JSON 바디 사용)
export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequest = await request.json();
    const { code, type, width = 300, format = 'base64', asLink = false } = body;

    if (!code) {
      return NextResponse.json(
        { success: false, message: '코드가 필요합니다.' },
        { status: 400 }
      );
    }

    // QR코드만 지원
    if (type && type !== 'qr') {
      return NextResponse.json(
        { success: false, message: 'QR코드만 지원됩니다.' },
        { status: 400 }
      );
    }

    const result = await generateQRCode(code, width, format, asLink);
    
    return NextResponse.json({
      success: true,
      data: result.qrCode,
      url: result.url,
      format: format
    });
  } catch (error) {
    console.error('QR코드 생성 오류 (POST):', error);
    return NextResponse.json(
      { success: false, message: '코드 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

/**
 * QR코드 생성 함수
 * @param data 원본 데이터 또는 티켓 코드
 * @param size QR코드 크기
 * @param format 출력 형식
 * @param asLink 링크 형태로 생성할지 여부
 */
async function generateQRCode(
  data: string, 
  size: number, 
  format: string, 
  asLink: boolean = false
): Promise<{ qrCode: string; url: string | null }> {
  try {
    let finalUrl = data;
    
    // 링크 형태로 생성하는 경우 또는 티켓 코드인 경우
    if (asLink || data.startsWith('TICKET:')) {
      if (data.startsWith('TICKET:')) {
        // 티켓 코드를 링크로 변환
        finalUrl = `https://ticketing-system-nnmi.vercel.app/scanner?code=${encodeURIComponent(data)}`;
      } else if (!data.startsWith('http')) {
        // 일반 코드를 링크로 변환
        finalUrl = `https://ticketing-system-nnmi.vercel.app/scanner?code=${encodeURIComponent(data)}`;
      }
    }

    const options = {
      errorCorrectionLevel: 'M' as const,
      type: 'image/png' as const,
      quality: 0.92,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      width: size
    };

    if (format === 'svg') {
      const svgResult = await QRCode.toString(finalUrl, { ...options, type: 'svg' });
      return { qrCode: svgResult, url: finalUrl };
    } else {
      // PNG 또는 Base64
      const qrCodeDataURL = await QRCode.toDataURL(finalUrl, options);
      return { qrCode: qrCodeDataURL, url: finalUrl };
    }
  } catch (error) {
    console.error('QR코드 생성 실패:', error);
    throw new Error('QR코드 생성에 실패했습니다.');
  }
} 