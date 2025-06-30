# 🗄️ 데이터베이스 구조 (Users 테이블 적용)

## 📊 전체 테이블 개요

| 테이블명 | 설명 | 주요 기능 |
|----------|------|-----------|
| **users** ✨ | 사용자 정보 | 회원 정보, 권한 관리 (profiles 대체) |
| **orders** | 주문 정보 | 고객 주문 관리, 결제 정보, 쿠폰 할인 |
| **order_items** | 주문 상품 정보 | 티켓 정보, 사용 상태 관리, QR코드 |
| **scan_logs** | 스캔 기록 | 티켓 스캔 로그 관리 |
| **notices** | 공지사항 | 공지사항 관리, 이미지 지원 |
| **coupons** ✨ | 쿠폰 마스터 | 쿠폰 정보, 할인 정책 |
| **user_coupons** ✨ | 사용자별 쿠폰 | 쿠폰 소유/사용 내역 |
| **user_activities** ✨ | 사용자 활동 | 로그인, 구매, 사용 기록 |

---

## ✅ **Users 테이블 신규 적용 (2024년 최신)**

### **🔥 변경 사항: profiles → users 테이블 교체**

기존 복잡한 profiles 테이블을 단순하고 효율적인 users 테이블로 완전 교체했습니다.

**적용 스크립트:** `docs/create_simple_users_table.sql`

### **🎯 새로운 Users 테이블 특징:**

#### **1. 단순한 구조 (복잡한 기능 제거)**
```sql
-- ✅ 트리거, RLS 등 복잡한 기능 제거
-- ✅ Auth Context에서 직접 관리
-- ✅ 개발 환경에 최적화된 단순한 권한 설정
```

#### **2. 직접 데이터 관리**
```sql
-- ✅ 회원가입 시 Auth Context에서 직접 users 테이블에 생성
-- ✅ 로그인 시 자동으로 users 데이터 조회/생성
-- ✅ 복잡한 트리거 없이 JavaScript에서 관리
```

#### **3. 기본 권한 설정**
```sql
-- ✅ RLS 비활성화 (개발 환경)
-- ✅ authenticated 역할: 모든 권한
-- ✅ anon 역할: SELECT만 허용
```

#### **4. 최적화된 인덱스**
```sql
-- ✅ 성능 최적화 인덱스:
- idx_users_email        : 이메일 검색
- idx_users_role         : 권한별 조회  
- idx_users_created_at   : 생성일 정렬
```

#### **5. 외래키 관계 유지**
```sql
-- ✅ 다른 테이블과의 연결 유지:
- orders.user_id → users.id
- user_coupons.user_id → users.id
- user_activities.user_id → users.id
```

### **🔧 적용 방법:**

**1단계: 테이블 교체 실행**
```sql
-- Supabase SQL Editor에서 실행:
-- docs/create_simple_users_table.sql
```

**2단계: Auth Context 업데이트 완료**
- `contexts/auth-context.tsx`: profiles → users로 변경
- 회원가입/로그인 시 users 테이블 직접 관리
- 복잡한 트리거 없이 JavaScript에서 처리

**3단계: 테스트 페이지 업데이트**
- `/debug/profiles-test` → 실제로는 users 테이블 테스트
- 모든 CRUD 기능 정상 작동 확인

### **📊 예상 결과:**
- ✅ Auth 사용자 수 = Users 수 (완벽 매칭)
- ✅ 복잡한 RLS/트리거 제거로 단순화
- ✅ Auth Context에서 완전한 제어
- ✅ 개발 환경에 최적화

---

## 📝 테이블별 상세 구조

### 1. **users** 테이블 (사용자 정보) ✨ **NEW**

| 컬럼명 | 데이터 타입 | NULL 허용 | 기본값 | 설명 |
|--------|-------------|-----------|--------|------|
| `id` | uuid | NO | auth.users.id | 사용자 ID (Primary Key, auth.users 참조) |
| `email` | text | NO | unique | 이메일 (auth.users와 동기화) |
| `name` | text | NO | null | 사용자 이름 |
| `phone` | text | YES | null | 전화번호 |
| `role` | text | NO | 'user' | 권한 (admin/manager/user) |
| `marketing_agreed` | boolean | NO | false | 마케팅 수신 동의 |
| `created_at` | timestamp with time zone | YES | NOW() | 생성일 |
| `updated_at` | timestamp with time zone | YES | NOW() | 수정일 |

**주요 특징:**
- Supabase Auth와 1:1 매칭
- 단순한 필드 구성 (birth_date, gender, avatar_url 등 제거)
- 필수 필드만 유지하여 복잡성 최소화
- Auth Context에서 직접 관리

### 2. **orders** 테이블 (주문 정보)

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
| `user_id` | uuid | YES | null | 사용자 ID (**users.id 참조**) ✨ |
| `coupon_id` | uuid | YES | null | 사용된 쿠폰 ID (coupons.id 참조) ✨ |
| `discount_amount` | integer | YES | 0 | 쿠폰 할인 금액 ✨ |
| `original_amount` | integer | YES | null | 할인 전 원래 금액 ✨ |

### 3. **order_items** 테이블 (주문 상품 정보)

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

### 4. **scan_logs** 테이블 (스캔 기록)

| 컬럼명 | 데이터 타입 | NULL 허용 | 기본값 | 설명 |
|--------|-------------|-----------|--------|------|
| `id` | integer | NO | nextval('scan_logs_id_seq') | 로그 ID (Primary Key) |
| `ticket_id` | integer | YES | null | 티켓 ID |
| `unique_code` | text | NO | null | 고유 티켓 코드 |
| `scanner_id` | text | NO | null | 스캐너 ID |
| `scan_location` | text | YES | null | 스캔 위치 |
| `scanned_at` | timestamp with time zone | YES | CURRENT_TIMESTAMP | 스캔 시간 |

### 5. **notices** 테이블 (공지사항)

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

### 6. **coupons** 테이블 (쿠폰 마스터)

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
| `created_by` | uuid | YES | null | 생성자 ID (**users.id 참조**) ✨ |
| `created_at` | timestamp with time zone | YES | CURRENT_TIMESTAMP | 생성일 |
| `updated_at` | timestamp with time zone | YES | CURRENT_TIMESTAMP | 수정일 |

### 7. **user_coupons** 테이블 (사용자별 쿠폰)

| 컬럼명 | 데이터 타입 | NULL 허용 | 기본값 | 설명 |
|--------|-------------|-----------|--------|------|
| `id` | uuid | NO | gen_random_uuid() | 사용자 쿠폰 ID (Primary Key) |
| `user_id` | uuid | NO | null | 사용자 ID (**users.id 참조**) ✨ |
| `coupon_id` | uuid | NO | null | 쿠폰 ID (coupons.id 참조) |
| `status` | varchar(20) | NO | 'available' | 상태 (available/used/expired) |
| `used_order_id` | text | YES | null | 사용된 주문 ID (orders.id 참조) |
| `used_at` | timestamp with time zone | YES | null | 사용 시간 |
| `obtained_at` | timestamp with time zone | YES | CURRENT_TIMESTAMP | 획득 시간 |
| `expires_at` | timestamp with time zone | YES | null | 만료 시간 |

### 8. **user_activities** 테이블 (사용자 활동)

| 컬럼명 | 데이터 타입 | NULL 허용 | 기본값 | 설명 |
|--------|-------------|-----------|--------|------|
| `id` | uuid | NO | gen_random_uuid() | 활동 ID (Primary Key) |
| `user_id` | uuid | NO | null | 사용자 ID (**users.id 참조**) ✨ |
| `activity_type` | varchar(50) | NO | null | 활동 유형 (login/purchase/ticket_use/coupon_use) |
| `activity_data` | jsonb | YES | '{}' | 활동 상세 데이터 (JSON) |
| `ip_address` | inet | YES | null | IP 주소 |
| `user_agent` | text | YES | null | 사용자 에이전트 |
| `created_at` | timestamp with time zone | YES | CURRENT_TIMESTAMP | 활동 시간 |

---

## 🔗 테이블 관계도

```
users (1) -----> (N) orders
users (1) -----> (N) user_coupons  
users (1) -----> (N) user_activities
users (1) -----> (N) coupons (created_by)

orders (1) -----> (N) order_items
orders (1) <----- (N) user_coupons (used_in)

coupons (1) -----> (N) user_coupons

order_items (1) -----> (N) scan_logs
```

---

## ⚙️ 권한 설정 (개발 환경)

현재 개발 환경에서는 **단순한 권한 설정**을 사용합니다:

```sql
-- ✅ RLS 비활성화 (모든 테이블)
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
-- ... 기타 테이블들

-- ✅ 기본 권한 부여
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon;
```

## 📊 주요 변경 사항 요약

| 이전 (profiles) | 현재 (users) | 변경 이유 |
|----------------|-------------|-----------|
| 복잡한 RLS 정책 4개 | RLS 비활성화 | 개발 환경 단순화 |
| 자동 트리거 생성 | Auth Context 직접 관리 | 제어권 향상 |
| 9개 필드 (avatar_url, birth_date 등) | 6개 핵심 필드만 | 불필요한 복잡성 제거 |
| 복잡한 에러 처리 | 단순한 CRUD | 개발 속도 향상 |

## 🎯 데이터 흐름

1. **회원가입**: Supabase Auth → Auth Context에서 users 테이블 직접 생성
2. **로그인**: Supabase Auth → Auth Context에서 users 데이터 조회/자동 생성
3. **주문**: users → orders → order_items
4. **쿠폰**: users → user_coupons → orders (사용)
5. **티켓 스캔**: order_items → scan_logs
6. **활동 기록**: 모든 활동 → user_activities

## 🚀 다음 단계

1. **테스트**: `/debug/profiles-test` 페이지에서 users 테이블 동작 확인
2. **Auth 테스트**: `/debug/auth-test` 페이지에서 인증 흐름 확인  
3. **운영 준비**: 필요 시 RLS 정책 추가 (운영 환경용)
4. **성능 최적화**: 사용량에 따른 인덱스 추가 조정