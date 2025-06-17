# 🎯 새로운 데이터베이스 구조 (마이그레이션 완료 후)

## 변경된 테이블 구조

### 1. orders 테이블 (변경 없음)
| 컬럼명 | 데이터 타입 | NULL 허용 | 기본값 | 설명 |
|--------|-------------|-----------|--------|------|
| id | text | NO | null | 주문 ID (Primary Key) |
| customer_id | text | YES | null | 고객 ID |
| customer_name | text | NO | null | 고객 이름 |
| customer_phone | text | NO | null | 고객 전화번호 |
| customer_email | text | YES | null | 고객 이메일 |
| total_amount | integer | NO | null | 총 결제 금액 |
| status | text | YES | 'pending' | 주문 상태 |
| created_at | timestamp with time zone | YES | CURRENT_TIMESTAMP | 생성 시간 |

### 2. order_items 테이블 (✅ 개별 티켓 관리 가능)
| 컬럼명 | 데이터 타입 | NULL 허용 | 기본값 | 설명 |
|--------|-------------|-----------|--------|------|
| id | integer | NO | nextval('order_items_id_seq') | 티켓 ID (Primary Key) |
| order_id | text | NO | null | 주문 ID (Foreign Key) |
| ticket_type | text | NO | null | 티켓 유형 (대인/소인) |
| quantity | integer | NO | 1 | 수량 (항상 1) |
| price | integer | NO | null | 가격 |
| **unique_code** | text | YES | null | **🔑 고유 티켓 코드** |
| **qr_image_url** | text | YES | null | **📱 QR코드 이미지 URL** |
| **status** | text | YES | 'active' | **🎫 티켓 상태 (active/used)** |
| **used_at** | timestamp with time zone | YES | null | **⏰ 사용 시간** |
| **scanner_id** | text | YES | null | **👤 스캐너 ID** |
| **scan_location** | text | YES | null | **📍 스캔 위치** |
| **ticket_number** | integer | YES | 1 | **🔢 티켓 번호 (주문내 순서)** |
| created_at | timestamp with time zone | YES | CURRENT_TIMESTAMP | 생성 시간 |

### 3. scan_logs 테이블 (기존 유지)
| 컬럼명 | 데이터 타입 | NULL 허용 | 기본값 | 설명 |
|--------|-------------|-----------|--------|------|
| id | integer | NO | nextval('scan_logs_id_seq') | 로그 ID (Primary Key) |
| ticket_id | integer | YES | null | 티켓 ID (order_items.id 참조) |
| unique_code | text | NO | null | 고유 코드 |
| scanner_id | text | NO | null | 스캐너 ID |
| scan_location | text | YES | null | 스캔 위치 |
| scanned_at | timestamp with time zone | YES | CURRENT_TIMESTAMP | 스캔 시간 |

## 🚀 해결된 문제점들

### ✅ 1. 개별 티켓 관리 가능
- **해결**: 각 `order_items` 레코드가 개별 티켓을 의미 (quantity = 1)
- **예시**: "대인 2매" → 2개의 별도 레코드로 분할됨
- **결과**: 각 티켓별로 독립적인 상태 관리 가능

### ✅ 2. QR코드 정보 저장
- **추가된 필드**: `unique_code`, `qr_image_url`
- **결과**: 각 티켓별 고유 코드와 QR 이미지 URL 저장 가능

### ✅ 3. 티켓 상태 관리
- **추가된 필드**: `status`, `used_at`, `scanner_id`, `scan_location`
- **결과**: 실시간 티켓 상태 변경 및 사용 기록 추적 가능

### ✅ 4. 스캔 기록과 개별 티켓 연결
- **개선**: `scan_logs.ticket_id`가 개별 티켓 레코드 참조
- **결과**: 정확한 티켓별 사용 기록 추적 가능

## 🔄 데이터 변환 예시

### 변환 전 (문제 상황)
```sql
-- 하나의 레코드로 관리되어 개별 제어 불가
order_items:
| id | order_id | ticket_type | quantity | price |
|----|----------|-------------|----------|-------|
| 1  | ord_123  | 대인        | 2        | 25000 |
```

### 변환 후 (해결된 상황)
```sql
-- 개별 티켓으로 분할되어 각각 제어 가능
order_items:
| id | order_id | ticket_type | quantity | price | unique_code              | status | ticket_number |
|----|----------|-------------|----------|-------|--------------------------|--------|---------------|
| 1  | ord_123  | 대인        | 1        | 25000 | TICKET:ord_123:010-...:1 | active | 1             |
| 2  | ord_123  | 대인        | 1        | 25000 | TICKET:ord_123:010-...:2 | used   | 2             |
```

## 🎯 새로운 기능들

### 1. 티켓 상태 즉시 변경
```sql
-- 특정 티켓 사용 처리
UPDATE order_items 
SET 
    status = 'used',
    used_at = CURRENT_TIMESTAMP,
    scanner_id = 'scanner_01',
    scan_location = '메인 게이트'
WHERE unique_code = 'TICKET:ord_123:010-1234-5678:1';
```

### 2. 사용 기록 추적
```sql
-- 특정 주문의 모든 티켓 사용 현황
SELECT 
    oi.ticket_number,
    oi.ticket_type,
    oi.status,
    oi.used_at,
    oi.scanner_id,
    oi.scan_location
FROM order_items oi
WHERE oi.order_id = 'ord_123'
ORDER BY oi.ticket_number;
```

### 3. 개별 티켓 정보 조회
```sql
-- QR코드 스캔으로 티켓 정보 조회
SELECT 
    o.customer_name,
    o.customer_phone,
    oi.ticket_type,
    oi.ticket_number,
    oi.status,
    oi.used_at
FROM order_items oi
JOIN orders o ON oi.order_id = o.id
WHERE oi.unique_code = 'TICKET:ord_123:010-1234-5678:1';
```

## 📋 인덱스 추가

성능 최적화를 위한 새로운 인덱스들:

```sql
CREATE INDEX idx_order_items_unique_code ON order_items(unique_code);
CREATE INDEX idx_order_items_status ON order_items(status);
CREATE INDEX idx_order_items_used_at ON order_items(used_at);
CREATE INDEX idx_order_items_order_id_ticket_number ON order_items(order_id, ticket_number);
```

## 🔧 API 수정 필요 사항

1. **결제 완료 API** (`/api/payment/complete`):
   - 수량만큼 개별 티켓 레코드 생성
   - 각 티켓별 unique_code 생성

2. **티켓 정보 API** (`/api/tickets/info`):
   - unique_code로 개별 티켓 조회
   - 티켓별 상태 정보 반환

3. **티켓 상태 변경 API** (`/api/tickets/status`):
   - 개별 티켓의 상태 변경 (use/unuse)
   - 스캔 정보 업데이트

4. **스캔 API** (`/api/tickets/scan`):
   - unique_code로 티켓 식별
   - 개별 티켓 사용 처리

## ⚠️ 주의사항

1. **기존 데이터**: 마이그레이션 시 기존 수량 기반 데이터가 개별 티켓으로 분할됨
2. **백업**: `order_items_backup`, `scan_logs_backup` 테이블로 기존 데이터 백업됨
3. **API 호환성**: 기존 API 로직을 새로운 구조에 맞게 수정 필요
4. **unique_code 형식**: `TICKET:주문ID:전화번호:티켓번호` 형식으로 생성됨

이제 개별 티켓별로 상태 관리와 사용 기록 추적이 완벽하게 가능합니다! 🎉 