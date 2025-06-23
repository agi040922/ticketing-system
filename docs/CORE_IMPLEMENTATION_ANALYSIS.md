# 빌게이트 핵심 구현 코드 분석 (Next.js 포팅용)

## 🚀 중요 발견사항

### 1. ✅ SEED 암호화 구현 발견!
**파일**: `billgateClass/KISA_SEED_CBC.php`
- **828줄의 완전한 SEED-CBC 암호화 구현**
- 한국정보보안진흥원(KISA) 공식 SEED 알고리즘
- 이 코드를 Node.js로 포팅하면 SEED 암호화 문제 해결!

### 2. ✅ Socket 통신 구현 발견!
**파일**: `billgateClass/Service.php`
- **완전한 Socket 통신 클래스 구현**
- `BgSocket` 클래스로 빌게이트 서버와 통신
- 메시지 포맷, 암호화/복호화 모든 로직 포함

### 3. ✅ CHECK_SUM 생성 로직 발견!
**파일**: `billgateClass/Util.php`
- `CheckSumUtil::genCheckSum()` 메소드
- MD5 + 랜덤키 조합으로 생성

---

## 🔧 핵심 구현 분석

### 1. CHECK_SUM 생성 로직
```php
// billgateClass/Util.php
public static function genCheckSum($input) {
    $randomKey = self::getRandomKey();  // 4바이트 랜덤키
    return $randomKey.self::getMD5($randomKey.$input.self::INIT_KEY);
}

const INIT_KEY = "billgatehashkey";
```

**Next.js 포팅:**
```typescript
// lib/billgate/checksum.ts
export class CheckSumUtil {
  private static readonly INIT_KEY = "billgatehashkey";
  
  static genCheckSum(input: string): string {
    const randomKey = this.getRandomKey();
    const hash = crypto.createHash('md5')
      .update(randomKey + input + this.INIT_KEY)
      .digest('hex');
    return randomKey + hash;
  }
}
```

### 2. SEED 암호화 핵심 로직
```php
// billgateClass/KISA_SEED_CBC.php
static function SEED_CBC_Encrypt(&$pbszUserKey, &$pbszIV, &$message, $message_offset, $message_length) {
    $info = new KISA_SEED_INFO();
    // ... 복잡한 SEED 암호화 로직
}
```

**Next.js 포팅 전략:**
1. **Option 1**: PHP SEED 코드를 JavaScript로 직접 포팅
2. **Option 2**: WebAssembly로 컴파일
3. **Option 3**: 기존 Node.js SEED 라이브러리 활용

### 3. Socket 통신 구현
```php
// billgateClass/Service.php
class BgSocket {
    function __construct($hostName, $port, $read_timeout) {
        $this->socket = socket_create(AF_INET, SOCK_STREAM, SOL_TCP);
        socket_connect($this->socket, $hostName, $port);
    }
    
    function writeMessage($data) {
        socket_write($this->socket, $data, strlen($data));
    }
    
    function readMessage($length) {
        // 바이트 단위로 정확히 읽기
    }
}
```

**Next.js 포팅:**
```typescript
// lib/billgate/socket.ts
import * as net from 'net';

export class BillgateSocket {
  async connect(host: string, port: number): Promise<net.Socket> {
    return new Promise((resolve, reject) => {
      const socket = new net.Socket();
      socket.connect(port, host, () => resolve(socket));
      socket.on('error', reject);
    });
  }
}
```

### 4. 메시지 포맷 구조
```php
// billgateClass/Service.php
class Message {
    const TOTAL_LENGTH_LENGTH = 4;
    const VERSION_LENGTH = 10;
    const MERCHANT_ID_LENGTH = 20;
    // ... 각 필드별 길이 정의
    
    function getData() {
        $clear = sprintf("%-10s%-20s%-4s", $version, $merchantId, $serviceCode);
        $opaque = sprintf("%-4s%-64s%-14s%04s", $command, $orderId, $orderDate, $recordCount);
        
        if ($this->cipher != null) {
            $s = $clear.$this->cipher->encryptSEED($opaque, $this->charset);
        }
        
        return sprintf("%04s", strlen($s)).$s;
    }
}
```

---

## 🎯 Next.js 구현 계획

### Phase 1: 기본 유틸리티 구현 (3일)

#### 1.1 CHECK_SUM 생성 API
```typescript
// app/api/payment/prepare/route.ts
import { CheckSumUtil } from '@/lib/billgate/checksum';

export async function POST(request: NextRequest) {
  const { serviceId, orderId, amount } = await request.json();
  
  const input = serviceId + orderId + amount;
  const checkSum = CheckSumUtil.genCheckSum(input);
  
  return NextResponse.json({ checkSum });
}
```

#### 1.2 SEED 암호화 구현
```typescript
// lib/billgate/seed-crypto.ts
export class SeedCrypto {
  private key: Buffer;
  private iv: string;
  
  constructor(key: string, iv: string) {
    this.key = Buffer.from(key, 'base64');
    this.iv = iv;
  }
  
  encrypt(plaintext: string): string {
    // KISA_SEED_CBC 로직을 JavaScript로 포팅
    // 또는 WebAssembly 활용
  }
}
```

### Phase 2: Socket 통신 구현 (3일)

#### 2.1 빌게이트 Socket 클래스
```typescript
// lib/billgate/socket.ts
export class BillgateSocket {
  async sendApprovalRequest(message: string): Promise<BillgateResponse> {
    const socket = new net.Socket();
    
    return new Promise((resolve, reject) => {
      socket.connect(30900, 'tapi.billgate.net', () => {
        const messageData = this.buildMessage(message);
        socket.write(messageData);
      });
      
      socket.on('data', (data) => {
        const response = this.parseResponse(data);
        resolve(response);
        socket.destroy();
      });
    });
  }
}
```

#### 2.2 메시지 빌더
```typescript
// lib/billgate/message.ts
export class MessageBuilder {
  buildApprovalMessage(params: ApprovalParams): Buffer {
    const header = this.buildHeader(params);
    const body = this.buildBody(params);
    const encrypted = this.cipher.encrypt(body);
    
    const totalLength = Buffer.alloc(4);
    totalLength.writeUInt32BE(header.length + encrypted.length, 0);
    
    return Buffer.concat([totalLength, header, encrypted]);
  }
}
```

### Phase 3: API 라우트 구현 (2일)

#### 3.1 승인 처리 API
```typescript
// app/api/payment/approve/route.ts
export async function POST(request: NextRequest) {
  const { message } = await request.json();
  
  const socket = new BillgateSocket();
  const response = await socket.sendApprovalRequest(message);
  
  if (response.responseCode === '0000') {
    // 성공 처리
    await processSuccessfulPayment(response);
    return NextResponse.json({ success: true, ...response });
  } else {
    // 실패 처리
    return NextResponse.json({ success: false, ...response });
  }
}
```

#### 3.2 취소 처리 API
```typescript
// app/api/payment/cancel/route.ts
export async function POST(request: NextRequest) {
  const { transactionId, cancelAmount } = await request.json();
  
  const cancelMessage = MessageBuilder.buildCancelMessage({
    transactionId,
    cancelAmount,
    cancelType: cancelAmount ? '0000' : '' // 부분취소 vs 전체취소
  });
  
  const response = await socket.sendCancelRequest(cancelMessage);
  return NextResponse.json(response);
}
```

---

## 📋 설정 정보 (config.ini 분석)

### 테스트 환경 설정
```ini
# 테스트 서버
test_ip = tapi.billgate.net
test_batch_ip = tbos.billgate.net

# 포트 (신용카드)
0900 = 30900

# 암호화 키/IV
key = QkZJRlBDRTI4T0c1OUtBMw==  # Base64 인코딩
iv = PRJ59Q2GHPT844TQ

# 모드 (테스트: 0, 운영: 1)
mode = 0
```

### Next.js 환경변수 설정
```env
# .env.local
BILLGATE_SERVICE_ID=M2103135
BILLGATE_API_HOST=tapi.billgate.net
BILLGATE_API_PORT=30900
BILLGATE_ENCRYPTION_KEY=QkZJRlBDRTI4T0c1OUtBMw==
BILLGATE_ENCRYPTION_IV=PRJ59Q2GHPT844TQ
BILLGATE_MODE=0
```

---

## 🚨 즉시 구현 가능한 부분

### 1. CHECK_SUM 생성 (바로 구현 가능)
- PHP 로직이 단순해서 즉시 포팅 가능
- MD5 + 랜덤키 조합

### 2. 메시지 포맷 (바로 구현 가능)
- 고정 길이 필드들의 조합
- Buffer 조작으로 구현 가능

### 3. Socket 통신 기본 구조 (바로 구현 가능)
- Node.js net 모듈 활용
- 연결, 송신, 수신 로직

---

## 🔥 다음 단계

1. **SEED 암호화 구현 결정**
   - PHP 코드 직접 포팅 vs 기존 라이브러리 활용
   
2. **기본 API 구조 구현 시작**
   - CHECK_SUM 생성 API 먼저 구현
   - 단계별 테스트 진행

3. **테스트 환경 구축**
   - 빌게이트 테스트 서버와 연결 테스트

**이제 모든 핵심 로직을 파악했으므로 실제 구현을 시작할 수 있습니다!** 🚀 