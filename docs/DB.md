# 🗄️ 데이터베이스 구조 (최신 상태)

## 📊 전체 테이블 개요

| 테이블명 | 설명 | 주요 기능 |
|----------|------|-----------|
| **orders** | 주문 정보 | 고객 주문 관리, 결제 정보 |
| **order_items** | 주문 상품 정보 | 티켓 정보, 사용 상태 관리 |
| **scan_logs** | 스캔 기록 | 티켓 스캔 로그 관리 |
| **notices** | 공지사항 | 공지사항 관리, 이미지 지원 |

---

## 📝 테이블별 상세 구조

### 1. **orders** 테이블 (주문 정보)

| 컬럼명 | 데이터 타입 | NULL 허용 | 기본값 | 설명 |
|--------|-------------|-----------|--------|------|
| `id` | text | NO | null | 주문 ID (Primary Key) |
| `customer_id` | text | YES | null | 고객 ID |
| `customer_name` | text | NO | null | 고객 이름 |
| `customer_phone` | text | NO | null | 고객 전화번호 |
| `customer_email` | text | YES | null | 고객 이메일 |
| `total_amount` | integer | NO | null | 총 결제 금액 |
| `status` | text | YES | 'pending' | 주문 상태 (pending/completed/cancelled) |
| `created_at` | timestamp with time zone | YES | CURRENT_TIMESTAMP | 생성 시간 |
| `billgate_approval_no` | character varying | YES | null | 빌게이트 승인번호 |
| `billgate_transaction_id` | character varying | YES | null | 빌게이트 거래 ID |
| `billgate_cancel_no` | character varying | YES | null | 빌게이트 취소번호 |
| `payment_method` | character varying | YES | null | 결제 방법 |
| `cancel_reason` | text | YES | null | 취소 사유 |
| `cancel_amount` | integer | YES | null | 취소 금액 |
| `remaining_amount` | integer | YES | null | 잔여 금액 |
| `cancelled_at` | timestamp without time zone | YES | null | 취소 시간 |

### 2. **order_items** 테이블 (주문 상품 정보)

| 컬럼명 | 데이터 타입 | NULL 허용 | 기본값 | 설명 |
|--------|-------------|-----------|--------|------|
| `id` | integer | NO | nextval('order_items_id_seq') | 티켓 ID (Primary Key) |
| `order_id` | text | NO | null | 주문 ID (Foreign Key → orders.id) |
| `ticket_type` | text | NO | null | 티켓 유형 (대인/소인) |
| `quantity` | integer | NO | 1 | 수량 |
| `price` | integer | NO | null | 가격 |
| `status` | text | YES | 'active' | 티켓 상태 (active/used) |
| `used_at` | timestamp with time zone | YES | null | 사용 시간 |
| `created_at` | timestamp with time zone | YES | CURRENT_TIMESTAMP | 생성 시간 |

### 3. **scan_logs** 테이블 (스캔 기록)

| 컬럼명 | 데이터 타입 | NULL 허용 | 기본값 | 설명 |
|--------|-------------|-----------|--------|------|
| `id` | integer | NO | nextval('scan_logs_id_seq') | 로그 ID (Primary Key) |
| `ticket_id` | integer | YES | null | 티켓 ID |
| `unique_code` | text | NO | null | 고유 티켓 코드 |
| `scanner_id` | text | NO | null | 스캐너 ID |
| `scan_location` | text | YES | null | 스캔 위치 |
| `scanned_at` | timestamp with time zone | YES | CURRENT_TIMESTAMP | 스캔 시간 |

### 4. **notices** 테이블 (공지사항) ✨ **NEW**

| 컬럼명 | 데이터 타입 | NULL 허용 | 기본값 | 설명 |
|--------|-------------|-----------|--------|------|
| `id` | uuid | NO | gen_random_uuid() | 공지사항 ID (Primary Key) |
| `title` | text | NO | null | 제목 |
| `content` | text | NO | null | 내용 |
| `category` | varchar(50) | NO | '일반공지' | 카테고리 (일반공지/운영안내/이벤트/긴급공지/프로그램) |
| `is_important` | boolean | NO | FALSE | **중요 공지 여부** (팝업 표시용) |
| `author` | varchar(100) | NO | '관리자' | 작성자 |
| `status` | varchar(20) | NO | 'active' | 상태 (active/inactive) |
| `view_count` | integer | NO | 0 | 조회수 |
| `images` | jsonb | YES | '[]' | **첨부 이미지** (배열 형태) |
| `created_at` | timestamp with time zone | YES | CURRENT_TIMESTAMP | 생성 시간 |
| `updated_at` | timestamp with time zone | YES | CURRENT_TIMESTAMP | 수정 시간 |

---

## 🔗 테이블 관계

```
orders (1) ────── (N) order_items
   │
   └─ id ──────── order_id

order_items ──── scan_logs
   │                │
   └─ 티켓 정보 ──── 스캔 기록

notices (독립적)
   └─ 공지사항 관리
```

---

## 📊 인덱스 정보

### **orders** 테이블
- `idx_orders_customer_phone` : customer_phone
- `idx_orders_status` : status
- `idx_orders_created_at` : created_at

### **order_items** 테이블  
- `idx_order_items_order_id` : order_id
- `idx_order_items_ticket_type` : ticket_type

### **scan_logs** 테이블
- `idx_scan_logs_order_id` : order_id
- `idx_scan_logs_customer_phone` : customer_phone
- `idx_scan_logs_scanned_at` : scanned_at

### **notices** 테이블 ✨ **NEW**
- `idx_notices_status` : status
- `idx_notices_category` : category  
- `idx_notices_is_important` : is_important
- `idx_notices_created_at` : created_at DESC
- `idx_notices_images` : images (GIN 인덱스)

---

## 🚀 주요 기능

### 🎫 **티켓팅 시스템**
- 주문 생성 → 결제 → 티켓 발급 → QR 스캔 → 입장

### 💳 **결제 시스템** 
- 빌게이트 PG 연동
- 실시간 결제 승인/취소
- 부분 취소 지원

### 📱 **QR 스캔 시스템**
- 개별 티켓 단위 스캔 관리
- 실시간 스캔 로그 기록
- 중복 사용 방지

### 📢 **공지사항 시스템** ✨ **NEW**
- 이미지 첨부 지원 (Supabase Storage)
- 중요 공지 팝업 기능
- 카테고리별 분류
- 조회수 추적

---

## 🔧 최근 업데이트

### 2024.12 - 공지사항 시스템 추가
- ✅ **notices** 테이블 생성
- ✅ 이미지 업로드 기능 (Supabase Storage)
- ✅ 중요 공지 팝업 시스템
- ✅ 관리자 공지사항 관리 페이지
- ✅ 사용자 공지사항 조회 페이지

### 이전 업데이트
- ✅ 빌게이트 결제 시스템 연동
- ✅ QR 스캔 시스템 구축
- ✅ 관리자 대시보드 완성