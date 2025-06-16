import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';

interface GenerateRequest {
  code: string;
  type: 'qr';
  width?: number;
  height?: number;
  format?: 'png' | 'svg' | 'base64';
}

/**
 * QR코드 생성 API
 * - 주어진 코드로 QR코드를 생성
 * - 다양한 형식으로 출력 가능 (PNG, SVG, Base64)
 * - 크기 조정 가능
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

    const result = await generateQRCode(code, width, format);
    
    return NextResponse.json({
      success: true,
      data: result,
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
    const { code, type, width = 300, format = 'base64' } = body;

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

    const result = await generateQRCode(code, width, format);
    
    return NextResponse.json({
      success: true,
      data: result,
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
 */
async function generateQRCode(data: string, size: number, format: string): Promise<string> {
  try {
    const options = {
      errorCorrectionLevel: 'M' as const,
      type: 'image/png' as const,
      quality: 0.92,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      width: size
    };

    if (format === 'svg') {
      return await QRCode.toString(data, { ...options, type: 'svg' });
    } else {
      // PNG 또는 Base64
      const qrCodeDataURL = await QRCode.toDataURL(data, options);
      return qrCodeDataURL; // 이미 data:image/png;base64, 형태
    }
  } catch (error) {
    console.error('QR코드 생성 실패:', error);
    throw new Error('QR코드 생성에 실패했습니다.');
  }
} 