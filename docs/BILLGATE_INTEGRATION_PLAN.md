# 빌게이트(BillGate) PG 결제 연동 구현 계획서

## 📋 프로젝트 개요

현재 Next.js 기반 티켓팅 시스템에 빌게이트 PG 결제 연동을 추가하여 실제 결제 처리 기능을 구현합니다.

### 현재 상태 분석
- ✅ **기존 구매 페이지**: `app/purchase/page.tsx` (UI 완성)
- ✅ **기존 결제 완료 API**: `app/api/payment/complete/route.ts` (QR코드 생성 등)
- ⚠️ **현재 이슈**: 실제 PG 결제 연동 없이 바로 완료 처리됨

### 목표
1. 빌게이트 PG를 통한 실제 카드 결제 처리
2. 결제 성공/실패에 따른 적절한 처리 로직
3. 보안성 강화 (CHECK_SUM, 데이터 검증)
4. 취소/환불 기능 구현

---

## 🔧 기술적 도전 과제

### 1. SEED 암호화 문제
- **문제**: Node.js는 SEED 암호화를 기본 지원하지 않음
- **해결 방안**:
  1. `node-seed` 같은 npm 패키지 검색 및 활용
  2. WebAssembly(WASM)로 컴파일된 SEED 모듈 사용
  3. 빌게이트 측에 Node.js용 라이브러리 요청

### 2. Socket 통신 구현
- **문제**: 최종 승인/취소는 Socket 통신 필요
- **해결 방안**: Node.js `net` 모듈 활용

---

## 📁 필요한 파일 및 구조

### 새로 생성할 파일들

```
app/
├── api/
│   └── payment/
│       ├── prepare/
│       │   └── route.ts          # CHECK_SUM 생성 API
│       ├── approve/
│       │   └── route.ts          # 최종 승인 처리 API  
│       ├── cancel/
│       │   └── route.ts          # 결제 취소 API
│       └── notify/
│           └── route.ts          # 가상계좌 입금 통지 수신
├── payment/
│   ├── return/
│   │   └── page.tsx              # 결제창에서 돌아오는 페이지
│   └── result/
│       └── page.tsx              # 최종 결과 표시 페이지
└── lib/
    └── billgate/
        ├── crypto.ts             # SEED 암호화 유틸
        ├── socket.ts             # Socket 통신 유틸
        └── constants.ts          # 빌게이트 상수 정의
```

### 수정할 기존 파일들
- `app/purchase/page.tsx` - 빌게이트 결제창 호출 로직 추가
- `app/api/payment/complete/route.ts` - 실제 결제 승인 후에만 실행되도록 수정

---

## 🏗️ 단계별 구현 계획

### Phase 1: 환경 설정 및 기본 구조 (우선순위: 높음)

#### 1.1 환경 변수 설정
```bash
# .env.local
BILLGATE_SERVICE_ID=glx_api                    # 테스트용
BILLGATE_KEY=QKZJRIBDRTI4T0c1OUtBMw==         # 테스트용 
BILLGATE_IV=PRJ59Q2GHPT844TQ                  # 테스트용
BILLGATE_API_HOST=tapi.billgate.net            # 테스트용 (상용: api.billgate.net)
BILLGATE_API_PORT=30900                        # 신용카드 포트
BILLGATE_PAYMENT_URL=https://tpay.billgate.net/pay/   # 테스트용 결제창
```

#### 1.2 빌게이트 상수 정의 파일 생성
```typescript
// lib/billgate/constants.ts
export const BILLGATE_CONFIG = {
  SERVICE_CODES: {
    CARD: '0900',           // 신용카드
    VIRTUAL_ACCOUNT: '3000' // 가상계좌
  },
  RESPONSE_CODES: {
    SUCCESS: '0000',
    // ... 기타 응답 코드들
  }
  // ... 기타 상수들
}
```

### Phase 2: SEED 암호화 해결 (우선순위: 최고)

#### 2.1 SEED 암호화 라이브러리 조사
- [ ] npm에서 `seed`, `seed-cbc`, `node-seed` 패키지 검색
- [ ] 라이브러리 테스트 및 검증
- [ ] 대안책 준비 (WebAssembly 등)

#### 2.2 CHECK_SUM 생성 유틸 구현
```typescript
// lib/billgate/crypto.ts
export function generateCheckSum(
  serviceId: string,
  orderId: string, 
  amount: number
): string {
  // SEED 암호화 로직 구현
}
```

### Phase 3: 결제 프로세스 구현 (우선순위: 높음)

#### 3.1 CHECK_SUM 생성 API 구현
```typescript
// app/api/payment/prepare/route.ts
export async function POST(request: NextRequest) {
  // 1. 결제 정보 검증
  // 2. CHECK_SUM 생성  
  // 3. 임시 주문 데이터 저장 (pending 상태)
  // 4. CHECK_SUM 반환
}
```

#### 3.2 구매 페이지 수정
```typescript
// app/purchase/page.tsx에 추가할 로직
const handleBillgatePayment = async () => {
  // 1. CHECK_SUM 요청
  // 2. 결제창 Form 동적 생성
  // 3. 빌게이트 결제창으로 POST 전송
}
```

#### 3.3 결제 결과 수신 페이지 구현
```typescript
// app/payment/return/page.tsx
export default function PaymentReturnPage() {
  // 1. 빌게이트에서 전달받은 MESSAGE 추출
  // 2. 승인 API 호출
  // 3. 결과에 따른 페이지 이동
}
```

### Phase 4: Socket 통신 및 승인 처리 (우선순위: 높음)

#### 4.1 Socket 통신 유틸 구현
```typescript
// lib/billgate/socket.ts
export class BillgateSocket {
  async sendApprovalRequest(message: string): Promise<string> {
    // Socket 연결 및 승인 요청
  }
  
  async sendCancelRequest(transactionId: string): Promise<string> {
    // Socket 연결 및 취소 요청  
  }
}
```

#### 4.2 승인 처리 API 구현
```typescript
// app/api/payment/approve/route.ts
export async function POST(request: NextRequest) {
  // 1. MESSAGE 파라미터 수신
  // 2. Socket 통신으로 승인 요청
  // 3. 승인 결과 파싱 및 검증
  // 4. DB 업데이트 (orders, order_items)
  // 5. 기존 complete API 호출 (QR코드 생성 등)
}
```

### Phase 5: 취소/환불 기능 (우선순위: 중간)

#### 5.1 취소 API 구현
```typescript
// app/api/payment/cancel/route.ts
export async function POST(request: NextRequest) {
  // 1. 취소 대상 거래 조회
  // 2. 취소 전문 생성
  // 3. Socket 통신으로 취소 요청
  // 4. 취소 결과 처리
}
```

#### 5.2 관리자 페이지에 취소 기능 추가
- 주문 관리 페이지에서 결제 취소 버튼 추가

### Phase 6: 가상계좌 및 추가 기능 (우선순위: 낮음)

#### 6.1 가상계좌 입금 통지 수신
```typescript
// app/api/payment/notify/route.ts
export async function POST(request: NextRequest) {
  // 1. 빌게이트 가상계좌 입금 통지 수신
  // 2. 입금 확인 및 주문 상태 업데이트
  // 3. "RC:111" 응답 반환 (재통지 방지)
}
```

---

## 🧪 테스트 계획

### 단위 테스트
- [ ] SEED 암호화 함수 테스트
- [ ] CHECK_SUM 생성 테스트
- [ ] Socket 통신 테스트

### 통합 테스트  
- [ ] 결제 성공 시나리오
- [ ] 결제 실패 시나리오
- [ ] 결제 취소 시나리오
- [ ] 가상계좌 입금 통지 테스트

### 보안 테스트
- [ ] 데이터 위변조 방지 테스트
- [ ] 금액 검증 테스트
- [ ] 중복 결제 방지 테스트

---

## 🚀 배포 준비사항

### 상용 환경 전환
1. **환경 변수 업데이트**
   ```bash
   BILLGATE_SERVICE_ID=실제발급받은서비스ID
   BILLGATE_KEY=실제발급받은KEY  
   BILLGATE_IV=실제발급받은IV
   BILLGATE_API_HOST=api.billgate.net
   BILLGATE_PAYMENT_URL=https://pay.billgate.net/pay/
   ```

2. **방화벽 설정**
   - 빌게이트 API 서버 IP 대역 허용
   - 필요한 포트 개방 (30900 등)

3. **HTTPS 필수**
   - 모든 결제 관련 페이지 HTTPS 적용

---

## 📞 필요한 지원사항

### 빌게이트 측 요청사항
1. **Node.js용 SEED 암호화 라이브러리** 제공 요청
2. **테스트 계정** 발급 및 테스트 가이드
3. **기술 지원** 연락처 확보

### 개발팀 내부 준비사항
1. **빌게이트 샘플 코드** 분석 (PHP 버전 우선)
2. **Socket 통신 전문** 상세 스펙 파악
3. **에러 처리** 시나리오 정의

---

## ⚠️ 리스크 및 대응방안

### 주요 리스크
1. **SEED 암호화 구현 실패**
   - 대응: 빌게이트 측 기술지원 요청, 대안 라이브러리 검토

2. **Socket 통신 불안정**  
   - 대응: 재시도 로직, 타임아웃 처리, 로그 강화

3. **테스트 환경 제약**
   - 대응: 빌게이트 테스트 계정 조기 확보

### 개발 일정 리스크
- **예상 개발 기간**: 2-3주
- **핵심 의존성**: SEED 암호화 해결 여부에 따라 일정 변동 가능

---

## 🔄 마이그레이션 전략

### 기존 시스템과의 호환성
1. **기존 주문 데이터** 유지
2. **QR코드 생성 로직** 재활용
3. **단계적 적용** (테스트 → 상용)

### 롤백 계획
- 빌게이트 연동 실패 시 기존 방식으로 즉시 복구 가능한 구조 유지 