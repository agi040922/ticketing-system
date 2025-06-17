# 📊 현재 데이터베이스 상태

## 현재 테이블 구조

### 1. orders 테이블
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

### 2. order_items 테이블
| 컬럼명 | 데이터 타입 | NULL 허용 | 기본값 | 설명 |
|--------|-------------|-----------|--------|------|
| id | integer | NO | nextval('order_items_id_seq') | 아이템 ID (Primary Key) |
| order_id | text | NO | null | 주문 ID (Foreign Key) |
| ticket_type | text | NO | null | 티켓 유형 (대인/소인) |
| quantity | integer | NO | 1 | 수량 |
| price | integer | NO | null | 가격 |
| status | text | YES | 'active' | 🎫 티켓 상태 (active/used) |
| used_at | timestamp with time zone | YES | null | ⏰ 사용 시간 |
| created_at | timestamp with time zone | YES | CURRENT_TIMESTAMP | 생성 시간 |

### 3. scan_logs 테이블
| 컬럼명 | 데이터 타입 | NULL 허용 | 기본값 | 설명 |
|--------|-------------|-----------|--------|------|
| id | integer | NO | nextval('scan_logs_id_seq') | 로그 ID (Primary Key) |
| ticket_id | integer | YES | null | 티켓 ID (order_items.id 참조) |
| unique_code | text | NO | null | 고유 코드 |
| scanner_id | text | NO | null | 스캐너 ID |
| scan_location | text | YES | null | 스캔 위치 |
| scanned_at | timestamp with time zone | YES | CURRENT_TIMESTAMP | 스캔 시간 |

## 🚨 현재 구조의 문제점

### 1. 개별 티켓 관리 불가
- **문제**: `order_items`가 수량 기반으로 관리되어 개별 티켓을 구분할 수 없음
- **예시**: "대인 2매"가 하나의 레코드로 저장되어, 각 티켓의 상태를 별도 관리 불가
- **영향**: 티켓별 사용/미사용 상태 변경 불가

### 2. QR코드 정보 저장 위치 없음
- **문제**: 개별 티켓의 `unique_code`나 `qr_image_url` 저장 필드 없음
- **영향**: QR코드 생성 후 저장 및 조회 불가

### 3. 티켓 상태 관리 필드 없음
- **문제**: 티켓의 사용/미사용 상태를 저장할 `status`, `used_at` 필드 없음
- **영향**: 실시간 상태 변경 및 조회 불가

### 4. 스캔 기록과 티켓 연결 문제
- **문제**: `scan_logs.ticket_id`가 주문 항목을 참조하지만, 개별 티켓을 특정할 수 없음
- **영향**: 정확한 사용 기록 추적 불가

## 🎯 해결해야 할 기능들

1. **티켓 상태 즉시 변경**: 개별 티켓별 사용/미사용 토글
2. **사용 기록 추적**: 언제, 누가, 어디서 스캔했는지 기록
3. **QR코드 관리**: 개별 티켓별 고유 코드 및 이미지 저장
4. **관리자 기능**: 티켓 상태 조회 및 변경 권한

## 📝 다음 단계

1. **order_items 테이블 구조 변경**: 개별 티켓 단위로 관리하도록 수정
2. **필요 필드 추가**: unique_code, qr_image_url, status, used_at 등
3. **데이터 마이그레이션**: 기존 수량 기반 데이터를 개별 티켓으로 분할
4. **API 수정**: 새로운 테이블 구조에 맞게 API 로직 수정 