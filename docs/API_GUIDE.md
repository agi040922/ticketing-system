# 🎫 입장권 시스템 API 가이드

이 문서는 Next.js API Routes를 사용하여 구현된 입장권 시스템의 API 사용법을 안내합니다.

## 📋 목차

1. [환경 설정](#환경-설정)
2. [API 엔드포인트](#api-엔드포인트)
3. [사용 예시](#사용-예시)
4. [에러 처리](#에러-처리)
5. [보안 고려사항](#보안-고려사항)

## 🔧 환경 설정

### 필수 환경변수

다음 환경변수들을 `.env.local` 파일에 설정해야 합니다:

```env
# Next.js 설정
NEXT_PUBLIC_SITE_URL=https://your-domain.com

# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# 카카오톡 API 설정
KAKAO_REST_API_KEY=your-kakao-rest-api-key
KAKAO_ADMIN_KEY=your-kakao-admin-key
KAKAO_CHANNEL_PUBLIC_ID=your-channel-public-id
KAKAO_PF_ID=your-pf-id
KAKAO_ALIMTALK_API_URL=https://api.kakao.com/v1/alimtalk/send

# SMS 대체 발송 설정 (선택사항)
SMS_API_URL=https://api.nhncloud.com/sms/v2.0/appKeys/your-app-key/sender/sms
SMS_API_KEY=your-sms-api-key
SMS_SENDER_NUMBER=15990000
```

### 카카오톡 API 키 발급 방법

1. **카카오 개발자 콘솔** (https://developers.kakao.com) 접속
2. **애플리케이션 등록** 또는 기존 앱 선택
3. **앱 키** 탭에서 REST API 키 확인
4. **카카오톡 채널 관리자센터** (https://center-pf.kakao.com) 에서 채널 생성
5. **알림톡 템플릿** 등록 및 승인 받기

### Supabase 설정

1. **Supabase 프로젝트** 생성 (https://supabase.com)
2. **Database** 탭에서 다음 테이블들 생성:

```sql
-- 주문 테이블
CREATE TABLE orders (
  id TEXT PRIMARY KEY,
  customer_id TEXT,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  ticket_type TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  total_amount INTEGER NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 입장권 테이블
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id TEXT REFERENCES orders(id),
  unique_code TEXT UNIQUE NOT NULL,
  ticket_number INTEGER NOT NULL,
  qr_image_url TEXT,
  code_status TEXT DEFAULT 'active',
  used_at TIMESTAMP WITH TIME ZONE,
  scanner_id TEXT,
  scan_location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 스캔 로그 테이블 (선택사항)
CREATE TABLE scan_logs (
  id SERIAL PRIMARY KEY,
  ticket_id INTEGER REFERENCES order_items(id),
  unique_code TEXT NOT NULL,
  scanner_id TEXT NOT NULL,
  scan_location TEXT,
  scanned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

3. **Storage** 탭에서 `ticket-images` 버킷 생성
4. **Settings > API** 에서 URL과 키 확인

## 🌐 API 엔드포인트

### 1. 결제 완료 처리 API

**엔드포인트:** `POST /api/payment/complete`

**설명:** 결제 완료 후 입장권 생성, QR코드 생성, 카카오톡 메시지 전송을 처리합니다.

**요청 본문:**
```json
{
  "orderId": "order_123456789",
  "customerId": "customer_123",
  "ticketType": "일반권",
  "quantity": 2,
  "totalAmount": 20000,
  "customerPhone": "010-1234-5678",
  "customerName": "홍길동"
}
```

**응답 예시:**
```json
{
  "success": true,
  "message": "결제 처리 및 입장권 발급이 완료되었습니다.",
  "orderId": "order_123456789",
  "ticketCount": 2,
  "tickets": [
    {
      "id": 1,
      "uniqueCode": "uuid-1234-5678-9abc",
      "qrImageUrl": "https://supabase-url/storage/v1/object/public/ticket-images/qr-codes/order_123456789-1.png"
    }
  ]
}
```

### 2. QR코드 스캔 처리 API

**엔드포인트:** `POST /api/tickets/scan`

**설명:** QR코드 스캔 시 입장권 사용 처리를 담당합니다.

**요청 본문:**
```json
{
  "uniqueCode": "uuid-1234-5678-9abc",
  "scannerId": "scanner_01",
  "location": "메인 게이트"
}
```

**응답 예시:**
```json
{
  "success": true,
  "message": "입장권 사용이 완료되었습니다.",
  "ticketInfo": {
    "customerName": "홍길동",
    "ticketType": "일반권",
    "ticketNumber": 1,
    "usedAt": "2024-01-15T10:30:00Z",
    "scanLocation": "메인 게이트"
  }
}
```

### 3. 입장권 정보 조회 API

**엔드포인트:** `GET /api/tickets/scan?code={uniqueCode}`

**설명:** QR코드 스캔 전 입장권 정보를 미리 확인할 수 있습니다.

**응답 예시:**
```json
{
  "success": true,
  "ticketInfo": {
    "customerName": "홍길동",
    "ticketType": "일반권",
    "ticketNumber": 1,
    "status": "active",
    "usedAt": null,
    "orderDate": "2024-01-15T09:00:00Z"
  }
}
```

### 4. QR코드/바코드 생성 API

**엔드포인트:** `POST /api/qr/generate`

**설명:** 단독으로 QR코드나 바코드를 생성합니다.

**요청 본문:**
```json
{
  "code": "uuid-1234-5678-9abc",
  "type": "qr",
  "width": 300,
  "format": "base64"
}
```

**엔드포인트:** `GET /api/qr/generate?code={code}&type=qr&width=300`

**응답 예시:**
```json
{
  "success": true,
  "data": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
  "type": "qr",
  "format": "base64",
  "code": "uuid-1234-5678-9abc"
}
```

### 5. 카카오톡 메시지 전송 API

**엔드포인트:** `POST /api/kakao/send`

**설명:** 카카오톡 알림톡 또는 친구톡으로 메시지를 전송합니다.

**요청 본문:**
```json
{
  "phone": "010-1234-5678",
  "templateCode": "TICKET_ISSUED",
  "templateParams": {
    "customerName": "홍길동",
    "ticketType": "일반권",
    "quantity": 2,
    "qrImageUrl": "https://supabase-url/..."
  },
  "attachments": [
    {
      "type": "image",
      "url": "https://supabase-url/storage/v1/object/public/ticket-images/qr-codes/order_123456789-1.png"
    }
  ],
  "fallbackMessage": "[입장권 발급] 홍길동님의 일반권 2매가 발급되었습니다."
}
```

## 💡 사용 예시

### JavaScript/TypeScript 클라이언트 예시

```typescript
// 결제 완료 후 입장권 발급
async function processPaymentComplete(paymentData: any) {
  try {
    const response = await fetch('/api/payment/complete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData)
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('입장권 발급 성공:', result);
      // 성공 페이지로 리다이렉트 또는 성공 메시지 표시
    } else {
      console.error('입장권 발급 실패:', result.message);
    }
  } catch (error) {
    console.error('API 호출 오류:', error);
  }
}

// QR코드 스캔 처리
async function scanQRCode(uniqueCode: string, scannerId: string) {
  try {
    const response = await fetch('/api/tickets/scan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uniqueCode: uniqueCode,
        scannerId: scannerId,
        location: '메인 게이트'
      })
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('입장 처리 완료:', result.ticketInfo);
      // 성공 메시지 표시
    } else {
      console.error('입장 처리 실패:', result.message);
      // 에러 메시지 표시
    }
  } catch (error) {
    console.error('스캔 처리 오류:', error);
  }
}
```

## ⚠️ 에러 처리

### 공통 에러 응답 형식

```json
{
  "success": false,
  "message": "구체적인 오류 메시지"
}
```

### 주요 에러 상황들

1. **400 Bad Request:** 필수 파라미터 누락 또는 잘못된 형식
2. **401 Unauthorized:** API 키 인증 실패
3. **404 Not Found:** 존재하지 않는 입장권 코드
4. **409 Conflict:** 이미 사용된 입장권
5. **500 Internal Server Error:** 서버 내부 오류

## 🔒 보안 고려사항

### API 보안

1. **환경변수 보안**
   - `.env.local` 파일은 절대 버전 관리에 포함하지 마세요
   - 프로덕션 환경에서는 안전한 환경변수 관리 서비스를 사용하세요

2. **API 키 관리**
   - 카카오톡 API 키는 서버사이드에서만 사용하세요
   - 클라이언트에 민감한 키가 노출되지 않도록 주의하세요

3. **입력 검증**
   - 모든 API 엔드포인트에서 입력값 검증을 수행합니다
   - SQL 인젝션 방지를 위해 Supabase의 안전한 쿼리 방식을 사용합니다

4. **동시성 처리**
   - 입장권 스캔 시 동시성 문제를 방지하기 위한 트랜잭션 처리가 구현되어 있습니다

### 추가 보안 강화 방안

1. **API 키 인증** 추가
2. **Rate Limiting** 구현
3. **CORS 설정** 적절히 구성
4. **로그 모니터링** 시스템 구축

## 📞 지원 및 문의

기술적 문제나 추가 기능이 필요한 경우 개발팀에 문의해주세요.

---

이 API 시스템은 아키텍처 문서를 바탕으로 구현되었으며, 실제 운영 환경에서는 추가적인 보안 및 모니터링 설정이 필요할 수 있습니다. 