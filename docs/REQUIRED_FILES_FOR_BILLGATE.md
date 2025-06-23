# 빌게이트 연동을 위해 필요한 파일 및 정보

## 🚨 즉시 필요한 파일들

### 1. 빌게이트 샘플 코드 (우선순위 1)
```
필요한 파일: BillgatePay-PHP.zip (가장 우선)
대안 파일: BillgatePay-JSP.zip, BillgatePay-ASP.zip

이유: 
- PHP가 JavaScript와 문법이 가장 유사해 포팅하기 쉬움
- CHECK_SUM 생성 로직 파악 필요
- Socket 통신 전문 구조 파악 필요
```

**요청사항**: `BillgatePay-PHP.zip` 파일을 압축 해제한 후, 다음 파일들의 내용을 확인해주세요:
- `PayInput.php` - 결제 요청 페이지 샘플
- `PayCheckSum.php` - CHECK_SUM 생성 로직
- `PayReturn.php` - 결제 완료 후 승인 처리
- `CancelInput.php`, `CancelReturn.php` - 취소 처리

### 2. 빌게이트 연동 가이드 문서 (우선순위 1)
```
필요한 파일: [빌게이트] 가맹점 연동 가이드_일반_3.8.2.pdf

현재 상태: 이미 보유하고 있는 것으로 보임
```

### 3. 빌게이트 테스트 계정 정보 (우선순위 2)
```
필요한 정보:
- 테스트용 SERVICE_ID (가이드에 glx_api라고 나와있음)
- 테스트용 암호화 KEY, IV
- 테스트 결제창 URL
- 테스트 API 서버 주소 및 포트

현재 상태: 가이드 문서에 일부 있을 것으로 예상
```

---

## 📋 단계별 필요 파일 목록

### Phase 1: 기본 구조 파악 (이번 주 내)
- [x] 빌게이트 연동 가이드 PDF
- [ ] **BillgatePay-PHP.zip** ← 가장 중요
- [ ] 테스트 계정 정보 정리

### Phase 2: 개발 시작 (다음 주)
- [ ] SEED 암호화 라이브러리 조사 결과
- [ ] Socket 통신 스펙 정리
- [ ] 에러 코드 매핑 테이블

### Phase 3: 테스트 (개발 완료 후)
- [ ] 빌게이트 테스트 계정 실제 발급
- [ ] 상용 계정 발급 신청

---

## 🔍 PHP 샘플 코드에서 확인해야 할 핵심 사항

### 1. CHECK_SUM 생성 로직
```php
// PayCheckSum.php 또는 PayInput.php에서 찾아야 할 내용
function makeCheckSum($serviceId, $orderId, $amount) {
    // 1. 데이터 조합 방식
    // 2. SEED 암호화 호출 방법
    // 3. Base64 인코딩 여부
}
```

### 2. 결제창 호출 파라미터
```php
// PayInput.php에서 확인할 내용
$params = array(
    'SERVICE_ID' => '...',
    'SERVICE_CODE' => '...',
    'ORDER_ID' => '...',
    'RETURN_URL' => '...',
    'CHECK_SUM' => '...',
    // ... 기타 모든 파라미터
);
```

### 3. Socket 통신 승인 로직
```php
// PayReturn.php에서 확인할 내용
function sendApprovalRequest($message) {
    // 1. Socket 연결 방법
    // 2. 전송 데이터 형식
    // 3. 응답 데이터 파싱 방법
}
```

### 4. 취소 처리 로직
```php
// CancelReturn.php에서 확인할 내용
function sendCancelRequest($transactionId) {
    // 1. 취소 전문 생성 방법
    // 2. Socket 통신 방법
    // 3. 취소 결과 처리
}
```

---

## 📤 요청드리는 작업

### 1. 파일 공유 (최우선)
다음 파일들을 프로젝트에 추가하거나 내용을 공유해주세요:

1. **BillgatePay-PHP.zip 압축 해제 후 모든 파일**
2. **빌게이트 가이드 PDF의 주요 섹션**:
   - 파라미터 목록 페이지
   - CHECK_SUM 생성 방법 페이지  
   - Socket 통신 스펙 페이지
   - 에러 코드 목록 페이지

### 2. 정보 정리
```markdown
## 빌게이트 테스트 정보
- SERVICE_ID: ___________
- 암호화 KEY: ___________
- 암호화 IV: ___________
- 테스트 결제창 URL: ___________
- 테스트 API 서버: ___________
- 신용카드 포트: ___________
```

### 3. 우선순위 확인
다음 중 어떤 결제 수단을 먼저 구현할지 알려주세요:
- [ ] 신용카드 결제 (일반적으로 우선)
- [ ] 가상계좌
- [ ] 카카오페이
- [ ] 네이버페이

---

## 💡 다음 단계 예고

파일들을 받으면 다음 순서로 진행합니다:

1. **PHP 코드 분석** (1-2일)
   - CHECK_SUM 생성 로직 파악
   - Socket 통신 방법 파악
   - 파라미터 구조 정리

2. **SEED 암호화 해결** (3-5일)
   - npm 패키지 조사
   - 테스트 코드 작성
   - 검증

3. **기본 결제 플로우 구현** (1주)
   - API Route 생성
   - 프론트엔드 수정
   - 테스트

4. **고도화 및 예외처리** (1주)
   - 에러 처리
   - 로깅
   - 보안 강화

---

## ⚡ 지금 당장 확인 가능한 것들

PHP 파일이 없어도 지금 확인할 수 있는 것들:

### 1. SEED 암호화 npm 패키지 조사
```bash
npm search seed
npm search seed-cbc
npm search korean-seed
```

### 2. 현재 프로젝트 구조 점검
- 결제 관련 DB 테이블 확인
- 기존 결제 플로우 분석
- 보안 요구사항 점검

### 3. 환경 설정 준비
- .env.local 파일 준비
- 개발/테스트/상용 환경 분리 계획

**요약: BillgatePay-PHP.zip 파일의 내용을 가장 먼저 확인해주시면 구체적인 개발 작업을 시작할 수 있습니다! 🚀** 