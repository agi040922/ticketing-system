# 빌게이트 PG 연동 환경 설정 가이드

## 환경 변수 설정 (.env.local)

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 변수들을 설정하세요:

```env
# 빌게이트 PG 설정 (테스트 환경)
BILLGATE_SERVICE_ID=M2103135
BILLGATE_API_HOST=tapi.billgate.net
BILLGATE_API_PORT=30900
BILLGATE_ENCRYPTION_KEY=QkZJRlBDRTI4T0c1OUtBMw==
BILLGATE_ENCRYPTION_IV=PRJ59Q2GHPT844TQ
BILLGATE_MODE=0
BILLGATE_PAYMENT_URL=https://tpay.billgate.net

# Next.js 설정
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Supabase 설정 (기존 설정 유지)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 환경 변수 설명

### 빌게이트 관련 설정

- **BILLGATE_SERVICE_ID**: 빌게이트에서 발급받은 서비스 ID
  - 테스트: `M2103135`
  - 운영: 실제 발급받은 서비스 ID

- **BILLGATE_API_HOST**: 빌게이트 API 서버 호스트
  - 테스트: `tapi.billgate.net`
  - 운영: `api.billgate.net`

- **BILLGATE_API_PORT**: 빌게이트 API 포트
  - 신용카드: `30900`
  - 가상계좌: `30910`

- **BILLGATE_ENCRYPTION_KEY**: SEED 암호화 키 (Base64 인코딩)
  - 테스트: `QkZJRlBDRTI4T0c1OUtBMw==`
  - 운영: 실제 발급받은 암호화 키

- **BILLGATE_ENCRYPTION_IV**: SEED 암호화 IV
  - 테스트: `PRJ59Q2GHPT844TQ`
  - 운영: 실제 발급받은 IV

- **BILLGATE_MODE**: 운영 모드
  - 테스트: `0`
  - 운영: `1`

- **BILLGATE_PAYMENT_URL**: 빌게이트 결제창 URL
  - 테스트: `https://tpay.billgate.net`
  - 운영: `https://pay.billgate.net`

## Supabase 테이블 스키마 설정

빌게이트 PG 연동을 위해 `orders` 테이블에 다음 컬럼들을 추가해야 합니다:

```sql
-- orders 테이블에 빌게이트 관련 컬럼 추가
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS billgate_approval_no VARCHAR(50),
ADD COLUMN IF NOT EXISTS billgate_transaction_id VARCHAR(100),
ADD COLUMN IF NOT EXISTS billgate_cancel_no VARCHAR(50),
ADD COLUMN IF NOT EXISTS payment_method VARCHAR(20),
ADD COLUMN IF NOT EXISTS cancel_reason TEXT,
ADD COLUMN IF NOT EXISTS cancel_amount INTEGER,
ADD COLUMN IF NOT EXISTS remaining_amount INTEGER,
ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMP;
```

## 테스트 방법

### 1. 개발 서버 실행
```bash
npm run dev
```

### 2. 결제 테스트 진행
1. `http://localhost:3000/purchase` 접속
2. 티켓 수량 선택 및 고객 정보 입력
3. 결제 버튼 클릭 → 빌게이트 결제창 호출
4. 테스트 카드로 결제 진행
5. 결제 완료 후 승인 처리 확인

### 3. 로그 확인
브라우저 개발자 도구와 서버 콘솔에서 다음 로그들을 확인:
- CHECK_SUM 생성 로그
- SEED 암호화/복호화 로그
- Socket 통신 로그
- 승인/취소 처리 로그

## 테스트 카드 정보

빌게이트 테스트 환경에서 사용 가능한 테스트 카드:

```
카드번호: 4000-0000-0000-0002
유효기간: 12/25
CVC: 123
카드소유자명: 홍길동
```

## 문제 해결

### SEED 암호화 오류
- korea-forge 라이브러리가 올바르게 설치되었는지 확인
- 암호화 키와 IV가 정확히 설정되었는지 확인

### Socket 통신 오류
- 빌게이트 서버 호스트와 포트가 올바른지 확인
- 방화벽에서 해당 포트가 열려있는지 확인

### 결제창 호출 오류
- CHECK_SUM 생성이 올바른지 확인
- 결제창 URL이 정확한지 확인

## 운영 환경 전환

테스트가 완료되면 다음 설정을 운영 환경으로 변경:

1. **BILLGATE_SERVICE_ID**: 실제 서비스 ID로 변경
2. **BILLGATE_API_HOST**: `api.billgate.net`으로 변경
3. **BILLGATE_ENCRYPTION_KEY**: 실제 암호화 키로 변경
4. **BILLGATE_ENCRYPTION_IV**: 실제 IV로 변경
5. **BILLGATE_MODE**: `1`로 변경
6. **BILLGATE_PAYMENT_URL**: 운영 결제창 URL로 변경
7. **NEXT_PUBLIC_BASE_URL**: 실제 도메인으로 변경 