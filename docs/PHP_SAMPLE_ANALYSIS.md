# 빌게이트 PHP 샘플 코드 분석 결과

## 🔍 전체 구조 분석

### 1. PayInput.php - 결제 요청 페이지 분석

#### 핵심 설정 정보
```php
$serviceId = "M2103135";          // 테스트 서비스ID (일반결제 : M2103135)
$returnUrl = "http://127.0.0.1/BillgatePay-PHP/PayReturn.php"; // 리턴URL
```

#### CHECK_SUM 생성 방식
```javascript
// JavaScript에서 Ajax로 CHECK_SUM 요청
var CheckSum = HForm.SERVICE_ID.value + HForm.ORDER_ID.value + HForm.AMOUNT.value;
// PayCheckSum.php로 전송하여 암호화된 CHECK_SUM 받아옴
```

#### 결제창 호출 방식
```javascript
// 빌게이트 JavaScript 라이브러리 사용
// 테스트: https://tpay.billgate.net/paygate/plugin/gx_web_client.js
// 상용: https://pay.billgate.net/paygate/plugin/gx_web_client.js

GX_pay("payment", viewType, "https_tpay");
// viewType: layerpopup, popup, submit
```

#### 주요 파라미터 목록
- `SERVICE_ID`: 서비스 식별자
- `SERVICE_CODE`: 결제수단 코드 (신용카드: 0900)
- `ORDER_ID`: 주문번호
- `ORDER_DATE`: 주문일시 (YYYYMMDDHHMISS)
- `AMOUNT`: 결제금액
- `RETURN_URL`: 결제 완료 후 리턴 URL
- `CHECK_SUM`: **핵심** - 데이터 위변조 방지용 암호화 값

---

### 2. PayCheckSum.php - CHECK_SUM 생성 분석

```php
require_once('billgateClass/Util.php');

$checkSumUtil = new ChecksumUtil(); // 체크섬 Class 생성
$checksum = $checkSumUtil->genCheckSum($CheckSum);
echo $checksum;
```

**핵심 발견사항:**
- `billgateClass/Util.php` 파일에 `ChecksumUtil` 클래스 존재
- `genCheckSum()` 메소드가 실제 SEED 암호화 수행
- 입력값: `SERVICE_ID + ORDER_ID + AMOUNT` 문자열

---

### 3. PayReturn.php - 승인 처리 분석

#### 핵심 클래스들
```php
include_once ("BillgateConfig.php");      // 설정 파일
include_once ("billgateClass/Service.php"); // 서비스 클래스

$reqMsg = new Message();       // 요청 메시지
$resMsg = new Message();       // 응답 메시지
$configInfo = new ConfigInfo($INI_FILE, $SERVICE_CODE);
$bgCipher = new BgCipher($configInfo);    // 암호화 클래스
$broker = new ServiceBroker($configInfo, $SERVICE_CODE); // 통신 클래스
```

#### Socket 통신 방식
```php
$reqMsg->setCipher($bgCipher);     // 암호화 설정
$reqMsg->setMessages($MESSAGE);    // MESSAGE 파라미터 설정
$resMsg = $broker->invoke($reqMsg); // 승인 요청 실행
```

#### 응답 데이터 파싱
```php
$RES_RESPONSE_CODE = $resMsg->get("1002");    // 결과코드(1002)
$RES_RESPONSE_MESSAGE = $resMsg->get("1003"); // 결과메시지(1003)
$RES_TRANSACTION_ID = $resMsg->get("1001");   // 거래번호(1001)
$RES_AUTH_AMOUNT = $resMsg->get("1007");      // 승인금액(1007)
```

---

### 4. 취소 처리 분석 (CancelInput.php, CancelReturn.php)

#### 취소 요청 파라미터
- `TRANSACTION_ID`: 취소할 거래번호
- `CANCEL_TYPE`: 취소유형 (전체취소/부분취소)
- `CANCEL_AMOUNT`: 취소금액 (부분취소시)

#### 취소 Command 구분
```php
// 신용카드
if($SERVICE_CODE == "0900") {
    $reqMsg->setCommand("9010"); // 신용카드 부분취소
    $reqMsg->setCommand("9200"); // 신용카드 전체취소
}
// 계좌체크
else if($SERVICE_CODE == "1000") {
    $reqMsg->setCommand("9300"); // 계좌체크 부분취소
    $reqMsg->setCommand("9000"); // 계좌체크 전체취소
}
```

---

## 🚨 중요한 발견사항

### 1. 누락된 핵심 파일들
PHP 샘플에서 다음 파일들이 실제 암호화/통신을 담당하지만 업로드되지 않았음:

```
billgateClass/
├── Util.php          ⚠️ CHECK_SUM 생성 핵심
├── Service.php       ⚠️ Socket 통신 핵심
└── ...

BillgateConfig.php     ⚠️ 설정 파일
config.ini            ⚠️ 암호화 키/IV 설정
```

### 2. 테스트 환경 정보 확인
```php
// 테스트용 설정
$serviceId = "M2103135";  // 일반결제 테스트 ID

// JavaScript 라이브러리
// 테스트: https://tpay.billgate.net/paygate/plugin/gx_web_client.js
// 상용: https://pay.billgate.net/paygate/plugin/gx_web_client.js
```

---

## 🎯 Next.js 포팅 전략

### Phase 1: 기본 구조 구현 (1주)

#### 1.1 CHECK_SUM 생성 API 구현
```typescript
// app/api/payment/prepare/route.ts
export async function POST(request: NextRequest) {
  const { serviceId, orderId, amount } = await request.json();
  
  // SEED 암호화 라이브러리로 CHECK_SUM 생성
  const plainText = serviceId + orderId + amount;
  const checkSum = await generateSeedCheckSum(plainText);
  
  return NextResponse.json({ checkSum });
}
```

#### 1.2 구매 페이지 수정
```typescript
// app/purchase/page.tsx 수정
const handleBillgatePayment = async () => {
  // 1. CHECK_SUM 요청
  const checkSumResponse = await fetch('/api/payment/prepare', {
    method: 'POST',
    body: JSON.stringify({ serviceId, orderId, amount })
  });
  
  // 2. 빌게이트 결제창 호출
  const form = createPaymentForm(checkSum);
  form.submit();
};
```

#### 1.3 결제 완료 페이지 구현
```typescript
// app/payment/return/page.tsx
export default function PaymentReturnPage() {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const message = urlParams.get('MESSAGE');
    
    if (message) {
      // 승인 처리 API 호출
      fetch('/api/payment/approve', {
        method: 'POST',
        body: JSON.stringify({ message })
      });
    }
  }, []);
}
```

### Phase 2: Socket 통신 구현 (1주)

#### 2.1 Socket 통신 유틸 구현
```typescript
// lib/billgate/socket.ts
export class BillgateSocket {
  async sendApprovalRequest(message: string): Promise<BillgateResponse> {
    const socket = new net.Socket();
    
    return new Promise((resolve, reject) => {
      socket.connect(30900, 'tapi.billgate.net', () => {
        socket.write(message);
      });
      
      socket.on('data', (data) => {
        const response = this.parseResponse(data.toString());
        resolve(response);
        socket.destroy();
      });
    });
  }
}
```

#### 2.2 승인 처리 API 구현
```typescript
// app/api/payment/approve/route.ts
export async function POST(request: NextRequest) {
  const { message } = await request.json();
  
  const socket = new BillgateSocket();
  const response = await socket.sendApprovalRequest(message);
  
  if (response.responseCode === '0000') {
    // 성공 - 기존 complete API 호출
    await processSuccessfulPayment(response);
  }
  
  return NextResponse.json(response);
}
```

---

## ⚠️ 즉시 필요한 작업

### 1. 누락된 파일들 요청
**가장 중요한 파일들이 누락되었습니다:**

```
📁 BillgatePay-PHP/
├── billgateClass/
│   ├── Util.php          ← 🚨 SEED 암호화 핵심!
│   ├── Service.php       ← 🚨 Socket 통신 핵심!
│   └── (기타 클래스들)
├── BillgateConfig.php    ← 🚨 설정 파일
└── config.ini           ← 🚨 암호화 키/IV
```

### 2. SEED 암호화 라이브러리 테스트
```bash
# 먼저 korea-forge 테스트
npm install git+https://github.com/jc-lab/korea-forge.git
```

### 3. 테스트 환경 구성
```env
# .env.local
BILLGATE_SERVICE_ID=M2103135
BILLGATE_API_HOST=tapi.billgate.net
BILLGATE_API_PORT=30900
BILLGATE_PAYMENT_URL=https://tpay.billgate.net/pay/
```

---

## 🚀 다음 단계

1. **`billgateClass/` 폴더 전체 업로드 요청**
2. **SEED 암호화 라이브러리 테스트 시작**
3. **기본 API 구조 구현 시작**

**`billgateClass/Util.php`와 `Service.php` 파일이 가장 중요합니다. 이 파일들이 있어야 정확한 SEED 암호화 구현과 Socket 통신 방법을 파악할 수 있습니다!** 🔑 