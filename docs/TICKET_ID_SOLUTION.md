# 🎫 개별 티켓 식별 해결책

## 🚨 현재 문제점

### 기존 QR코드 형식
```
TICKET:ORD001:010-1234-5678
```

### 문제 상황
- 주문 ORD001에 "대인 2매, 소인 1매" = 총 3개 티켓
- 모든 티켓이 같은 QR코드를 가짐
- 운영자가 "사용 처리" 시 어떤 티켓을 처리할지 모름

## ✅ 해결책 1: order_items.id 직접 사용 (권장)

### 새로운 QR코드 형식
```
TICKET_ID:123
TICKET_ID:124  
TICKET_ID:125
```

### 장점
- 개별 티켓 완벽 식별
- DB 조회 최적화 (Primary Key 사용)
- 단순하고 확실한 구조

### 구현 방법

#### 1. QR코드 생성 변경
```javascript
// 기존: 주문 단위
qrCode = `TICKET:${orderId}:${customerPhone}`

// 변경: 개별 티켓 단위
qrCode = `TICKET_ID:${orderItem.id}`
```

#### 2. API 수정
```javascript
// /api/tickets/info
// 기존: order_id로 조회
const order = await supabase.from('orders').select('*').eq('id', orderId)

// 변경: order_items.id로 직접 조회  
const ticket = await supabase.from('order_items').select(`
  *,
  orders(*)
`).eq('id', ticketId)
```

#### 3. 상태 변경
```javascript
// /api/tickets/status
// 개별 티켓의 status, used_at 필드 업데이트
UPDATE order_items 
SET status = 'used', used_at = NOW() 
WHERE id = ticketId
```

## ✅ 해결책 2: 티켓 번호 추가

### 새로운 QR코드 형식
```
TICKET:ORD001:010-1234-5678:1
TICKET:ORD001:010-1234-5678:2
TICKET:ORD001:010-1234-5678:3
```

### DB 수정 필요
```sql
-- order_items에 ticket_number 컬럼 추가
ALTER TABLE order_items ADD COLUMN ticket_number INTEGER;

-- 기존 데이터 업데이트 (주문별로 번호 부여)
UPDATE order_items 
SET ticket_number = ROW_NUMBER() OVER (PARTITION BY order_id ORDER BY id);
```

## 🎯 권장 구현: 해결책 1

### 1. 결제 완료 API 수정
```javascript
// /api/payment/complete
for (let i = 1; i <= quantity; i++) {
  const { data: ticket } = await supabase
    .from('order_items')
    .insert({
      order_id: orderId,
      ticket_type: '대인',
      quantity: 1,  // 항상 1
      price: unitPrice,
      status: 'active'
    })
    .select()
    .single()

  // QR코드 생성
  const qrCode = `TICKET_ID:${ticket.id}`
  const qrImageUrl = await generateQR(qrCode)
  
  // QR 이미지 URL 업데이트
  await supabase
    .from('order_items')  
    .update({ qr_image_url: qrImageUrl })
    .eq('id', ticket.id)
}
```

### 2. 티켓 정보 API 수정
```javascript
// /api/tickets/info
const ticketId = code.replace('TICKET_ID:', '')

const { data: ticket } = await supabase
  .from('order_items')
  .select(`
    *,
    orders(*)
  `)
  .eq('id', ticketId)
  .single()
```

### 3. 상태 변경 API 수정
```javascript
// /api/tickets/status  
const ticketId = uniqueCode.replace('TICKET_ID:', '')

await supabase
  .from('order_items')
  .update({
    status: action === 'use' ? 'used' : 'active',
    used_at: action === 'use' ? new Date() : null
  })
  .eq('id', ticketId)
```

## 📋 마이그레이션 단계

### 1단계: 기존 데이터 처리
```sql
-- 기존 order_items를 개별 티켓으로 분할
-- (이전에 제안한 마이그레이션 스크립트 실행)
```

### 2단계: API 수정
- QR코드 생성 로직 변경
- 모든 API에서 TICKET_ID 방식 사용

### 3단계: 테스트
- 개별 티켓 생성 확인
- 상태 변경 테스트
- 여러 티켓 있는 주문 테스트

이렇게 하면 **개별 티켓별로 완벽한 상태 관리**가 가능합니다! 🎯 