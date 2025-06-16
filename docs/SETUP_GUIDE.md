# 🚀 로컬 개발 환경 설정 가이드

입장권 시스템을 로컬에서 테스트하고 개발하기 위한 설정 가이드입니다.

## 📋 1. 환경변수 설정

### 필수 환경변수 (`.env.local`)

```env
# ========================
# Next.js 설정 (로컬 개발용)
# ========================
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# ========================
# Supabase 설정 (필수)
# ========================
# Supabase 프로젝트 생성 후 아래 값들을 실제 값으로 교체하세요
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# ========================
# 개발/테스트 모드 설정
# ========================
NODE_ENV=development
ENABLE_MOCK_MESSAGING=true
```

### 선택적 환경변수 (프로덕션 배포 시 필요)

```env
# ========================
# 카카오톡 API 설정 (선택사항)
# ========================
# 카카오 개발자 센터에서 앱 생성 후 설정
# KAKAO_REST_API_KEY=your-kakao-rest-api-key
# KAKAO_ADMIN_KEY=your-kakao-admin-key
# KAKAO_CHANNEL_PUBLIC_ID=your-channel-public-id
# KAKAO_PF_ID=your-pf-id
# KAKAO_ALIMTALK_API_URL=https://api.kakao.com/v1/alimtalk/send

# ========================
# SMS 대체 발송 설정 (선택사항)
# ========================
# NHN Cloud SMS 서비스 사용 시
# SMS_API_URL=https://api.nhncloud.com/sms/v2.0/appKeys/your-app-key/sender/sms
# SMS_API_KEY=your-sms-api-key
# SMS_SENDER_NUMBER=15990000
```

## 🔧 2. Supabase 설정 방법

### 2.1 Supabase 프로젝트 생성

1. [Supabase 웹사이트](https://supabase.com)에 접속
2. 계정 생성 또는 로그인
3. 새 프로젝트 생성
4. 프로젝트 이름, 데이터베이스 비밀번호 설정
5. 지역 선택 (가까운 지역 선택 권장)

### 2.2 환경변수 값 가져오기

1. Supabase 대시보드 → **Settings** → **API**
2. 다음 값들을 복사:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role secret** → `SUPABASE_SERVICE_ROLE_KEY`

### 2.3 데이터베이스 테이블 생성

Supabase SQL Editor에서 다음 SQL을 실행:

```sql
-- 주문 테이블
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id VARCHAR(255) NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    total_amount INTEGER NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 주문 아이템 (입장권) 테이블
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    ticket_type VARCHAR(100) NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price INTEGER NOT NULL,
    unique_code UUID DEFAULT gen_random_uuid(),
    qr_image_url TEXT,
    status VARCHAR(50) DEFAULT 'active',
    used_at TIMESTAMP WITH TIME ZONE,
    scanned_by VARCHAR(255),
    scan_location VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 스캔 로그 테이블
CREATE TABLE scan_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_item_id UUID REFERENCES order_items(id),
    scanner_id VARCHAR(255) NOT NULL,
    scan_result VARCHAR(50) NOT NULL,
    scan_location VARCHAR(255),
    scanned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    customer_info JSONB
);

-- 인덱스 생성
CREATE INDEX idx_orders_customer_phone ON orders(customer_phone);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_unique_code ON order_items(unique_code);
CREATE INDEX idx_order_items_status ON order_items(status);
CREATE INDEX idx_scan_logs_scanned_at ON scan_logs(scanned_at);
```

## 🎥 3. 카메라 QR 스캔 기능

### 3.1 브라우저 권한 설정

1. **Chrome**: 주소창 왼쪽 카메라 아이콘 클릭 → 허용
2. **Firefox**: 주소창 왼쪽 카메라 아이콘 클릭 → 허용
3. **Safari**: 개발 → 실험적 기능 → MediaDevices 활성화

### 3.2 HTTPS 요구사항

- 로컬 개발: `http://localhost:3000` (자동 허용)
- 배포 환경: HTTPS 필수 (카메라 API 보안 정책)

### 3.3 지원 기능

- ✅ 실시간 카메라 스캔
- ✅ 이미지 파일 업로드 스캔
- ✅ 수동 코드 입력
- ✅ 플래시 토글 (지원 기기)
- ✅ 줌 조절 (지원 기기)

## 🔗 4. 카카오톡 API 설정 (선택사항)

### 4.1 카카오 개발자 센터 설정

1. [카카오 개발자 센터](https://developers.kakao.com) 접속
2. 애플리케이션 등록
3. 플랫폼 추가 → 웹 플랫폼 등록
4. **앱 키** 섹션에서 REST API 키 복사

### 4.2 카카오톡 채널 생성

1. [카카오톡 채널 관리자 센터](https://center-pf.kakao.com) 접속
2. 새 채널 생성
3. 채널 정보에서 **채널 ID** 확인
4. 알림톡 템플릿 등록 (별도 승인 과정 필요)

## 🧪 5. 테스트 방법

### 5.1 로컬 서버 실행

```bash
# 개발 서버 시작
pnpm dev

# 또는
npm run dev
```

### 5.2 기능별 테스트

1. **결제 완료 페이지**
   - URL: `http://localhost:3000/purchase/complete?orderId=test123&success=true`
   - localStorage에 `pendingOrder` 데이터 미리 설정

2. **예약 확인 페이지**
   - URL: `http://localhost:3000/reservation-check`
   - 휴대폰 번호 또는 주문번호로 검색

3. **QR 스캐너 페이지**
   - URL: `http://localhost:3000/scanner`
   - 카메라 권한 허용 후 QR코드 스캔

### 5.3 QR코드 생성 테스트

```bash
# API 직접 호출 테스트
curl -X POST http://localhost:3000/api/qr/generate \
  -H "Content-Type: application/json" \
  -d '{"code":"TICKET:test123:010-1234-5678","type":"qr","width":300}'
```

## 🚨 6. 문제 해결

### 6.1 카메라가 작동하지 않는 경우

1. 브라우저 권한 확인
2. HTTPS 환경인지 확인
3. 다른 애플리케이션이 카메라를 사용 중인지 확인
4. 브라우저 콘솔에서 오류 메시지 확인

### 6.2 Supabase 연결 오류

1. 환경변수 값 재확인
2. Supabase 프로젝트 상태 확인
3. 네트워크 연결 상태 확인
4. 브라우저 개발자 도구 → Network 탭에서 요청 확인

### 6.3 QR코드 스캔이 안 되는 경우

1. QR코드가 선명한지 확인
2. 충분한 조명 확보
3. 카메라 초점 맞추기
4. 이미지 업로드 방식으로 대체 시도

## 📞 7. 지원

문제가 지속될 경우 다음 정보와 함께 문의:

- 브라우저 및 버전
- 운영체제
- 오류 메시지 전체 내용
- 재현 단계

---

**참고**: 이 가이드는 개발 환경 기준으로 작성되었습니다. 
프로덕션 배포 시에는 추가 보안 설정이 필요할 수 있습니다. 