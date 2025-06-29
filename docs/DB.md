# 🗄️ 데이터베이스 구조 (최신 상태)

## 📊 전체 테이블 개요

| 테이블명 | 설명 | 주요 기능 |
|----------|------|-----------|
| **orders** | 주문 정보 | 고객 주문 관리, 결제 정보, 쿠폰 할인 |
| **order_items** | 주문 상품 정보 | 티켓 정보, 사용 상태 관리, QR코드 |
| **scan_logs** | 스캔 기록 | 티켓 스캔 로그 관리 |
| **notices** | 공지사항 | 공지사항 관리, 이미지 지원 |
| **profiles** ✨ | 사용자 프로필 | 회원 정보, 권한 관리 |
| **coupons** ✨ | 쿠폰 마스터 | 쿠폰 정보, 할인 정책 |
| **user_coupons** ✨ | 사용자별 쿠폰 | 쿠폰 소유/사용 내역 |
| **user_activities** ✨ | 사용자 활동 | 로그인, 구매, 사용 기록 |

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
| `user_id` | uuid | YES | null | 사용자 ID (profiles.id 참조) ✨ |
| `coupon_id` | uuid | YES | null | 사용된 쿠폰 ID (coupons.id 참조) ✨ |
| `discount_amount` | integer | YES | 0 | 쿠폰 할인 금액 ✨ |
| `original_amount` | integer | YES | null | 할인 전 원래 금액 ✨ |

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
| `unique_code` | varchar(100) | YES | null | 고유 티켓 코드 (QR코드용) ✨ |
| `qr_image_url` | text | YES | null | QR코드 이미지 URL ✨ |

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

### 5. **profiles** 테이블 (사용자 프로필) ✨ **NEW**

| 컬럼명 | 데이터 타입 | NULL 허용 | 기본값 | 설명 |
|--------|-------------|-----------|--------|------|
| `id` | uuid | NO | auth.uid() | 사용자 ID (Primary Key, auth.users 참조) |
| `email` | varchar(255) | NO | null | 이메일 (auth.users와 동기화) |
| `name` | varchar(100) | NO | null | 사용자 이름 |
| `phone` | varchar(20) | YES | null | 전화번호 |
| `birth_date` | date | YES | null | 생년월일 |
| `gender` | varchar(10) | YES | null | 성별 (male/female/other) |
| `role` | varchar(20) | NO | 'user' | 권한 (user/admin/manager) |
| `avatar_url` | text | YES | null | 프로필 이미지 URL |
| `marketing_agreed` | boolean | NO | false | 마케팅 수신 동의 |
| `created_at` | timestamp with time zone | YES | CURRENT_TIMESTAMP | 생성일 |
| `updated_at` | timestamp with time zone | YES | CURRENT_TIMESTAMP | 수정일 |

### 6. **coupons** 테이블 (쿠폰 마스터) ✨ **NEW**

| 컬럼명 | 데이터 타입 | NULL 허용 | 기본값 | 설명 |
|--------|-------------|-----------|--------|------|
| `id` | uuid | NO | gen_random_uuid() | 쿠폰 ID (Primary Key) |
| `name` | varchar(100) | NO | null | 쿠폰명 |
| `code` | varchar(50) | NO | null | 쿠폰 코드 (UNIQUE) |
| `type` | varchar(20) | NO | 'discount' | 타입 (discount/free_ticket/extra_time) |
| `discount_type` | varchar(20) | YES | null | 할인 타입 (percentage/fixed) |
| `discount_value` | integer | YES | null | 할인값 (percentage: %, fixed: 원) |
| `min_purchase_amount` | integer | YES | 0 | 최소 주문 금액 |
| `max_discount_amount` | integer | YES | null | 최대 할인 금액 |
| `usage_limit` | integer | YES | null | 사용 한도 (null=무제한) |
| `used_count` | integer | NO | 0 | 사용 횟수 |
| `valid_from` | timestamp with time zone | NO | null | 유효 시작일 |
| `valid_until` | timestamp with time zone | NO | null | 유효 종료일 |
| `status` | varchar(20) | NO | 'active' | 상태 (active/inactive/expired) |
| `description` | text | YES | null | 쿠폰 설명 |
| `created_by` | uuid | YES | null | 생성자 (profiles.id 참조) |
| `created_at` | timestamp with time zone | YES | CURRENT_TIMESTAMP | 생성일 |

### 7. **user_coupons** 테이블 (사용자별 쿠폰) ✨ **NEW**

| 컬럼명 | 데이터 타입 | NULL 허용 | 기본값 | 설명 |
|--------|-------------|-----------|--------|------|
| `id` | uuid | NO | gen_random_uuid() | ID (Primary Key) |
| `user_id` | uuid | NO | null | 사용자 ID (profiles.id 참조) |
| `coupon_id` | uuid | NO | null | 쿠폰 ID (coupons.id 참조) |
| `order_id` | text | YES | null | 사용된 주문 ID (orders.id 참조) |
| `status` | varchar(20) | NO | 'available' | 상태 (available/used/expired) |
| `used_at` | timestamp with time zone | YES | null | 사용일 |
| `received_at` | timestamp with time zone | YES | CURRENT_TIMESTAMP | 받은 날짜 |
| `expires_at` | timestamp with time zone | YES | null | 만료일 |

### 8. **user_activities** 테이블 (사용자 활동 로그) ✨ **NEW**

| 컬럼명 | 데이터 타입 | NULL 허용 | 기본값 | 설명 |
|--------|-------------|-----------|--------|------|
| `id` | uuid | NO | gen_random_uuid() | ID (Primary Key) |
| `user_id` | uuid | NO | null | 사용자 ID (profiles.id 참조) |
| `activity_type` | varchar(50) | NO | null | 활동 타입 (login/purchase/coupon_use) |
| `description` | text | YES | null | 활동 설명 |
| `metadata` | jsonb | YES | '{}' | 추가 정보 (JSON) |
| `ip_address` | inet | YES | null | IP 주소 |
| `user_agent` | text | YES | null | 사용자 에이전트 |
| `created_at` | timestamp with time zone | YES | CURRENT_TIMESTAMP | 생성일 |

---

## 🔗 테이블 관계

```
📱 사용자 시스템
auth.users (1) ────── (1) profiles
     │
     └─ 사용자 인증 ──── 프로필 정보

👤 사용자 - 주문 관계
profiles (1) ────── (N) orders
    │                    │
    └─ user_id ───────── user_id

🎫 주문 - 티켓 관계  
orders (1) ────── (N) order_items
   │                    │
   └─ id ──────────── order_id

🔍 티켓 - 스캔 관계
order_items ──── scan_logs
   │                │
   └─ 티켓 정보 ──── 스캔 기록

🎟️ 쿠폰 시스템
coupons (1) ────── (N) user_coupons ────── (1) profiles
    │                      │                    │
    └─ 쿠폰 마스터 ──── 사용자별 쿠폰 ──── 사용자

orders ────── coupons
   │              │
   └─ coupon_id ─┘

📝 활동 로그
profiles (1) ────── (N) user_activities
    │                    │
    └─ user_id ───────── user_id

📢 공지사항 (독립적)
notices
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

### **profiles** 테이블 ✨ **NEW**
- `idx_profiles_email` : email
- `idx_profiles_role` : role
- `idx_profiles_created_at` : created_at DESC

### **coupons** 테이블 ✨ **NEW**
- `idx_coupons_code` : code (UNIQUE)
- `idx_coupons_status` : status
- `idx_coupons_valid_until` : valid_until
- `idx_coupons_type` : type

### **user_coupons** 테이블 ✨ **NEW**
- `idx_user_coupons_user_id` : user_id
- `idx_user_coupons_coupon_id` : coupon_id
- `idx_user_coupons_status` : status
- `idx_user_coupons_expires_at` : expires_at

### **user_activities** 테이블 ✨ **NEW**
- `idx_user_activities_user_id` : user_id
- `idx_user_activities_type` : activity_type
- `idx_user_activities_created_at` : created_at DESC
- `idx_user_activities_metadata` : metadata (GIN 인덱스)

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

### 👤 **사용자 시스템** ✨ **NEW**
- Supabase Auth + Google OAuth 로그인
- 사용자 프로필 관리
- 역할 기반 권한 제어 (user/admin/manager)
- 마이페이지 (티켓 내역, 쿠폰 관리)

### 🎟️ **쿠폰 시스템** ✨ **NEW**
- 할인 쿠폰 (정율/정액 할인)
- 무료 이용권 쿠폰
- 사용자별 쿠폰 관리
- 쿠폰 유효기간 및 사용 한도 관리

### 📊 **사용자 활동 추적** ✨ **NEW**
- 로그인/구매/쿠폰 사용 기록
- IP 주소 및 사용자 에이전트 로그
- JSON 메타데이터 저장
- 관리자 통계 및 분석

---

## 🔧 최근 업데이트

### 2024.12.29 - 사용자 시스템 구현 ✨ **NEW**
- ✅ **profiles** 테이블 생성 (사용자 프로필)
- ✅ **coupons** 테이블 생성 (쿠폰 마스터)
- ✅ **user_coupons** 테이블 생성 (사용자별 쿠폰)
- ✅ **user_activities** 테이블 생성 (활동 로그)
- ✅ **orders** 테이블 확장 (사용자 연결, 쿠폰 할인)
- ✅ **order_items** 테이블 확장 (QR 코드 정보)

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