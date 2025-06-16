-- ===============================
-- 데이터베이스 마이그레이션 스크립트
-- 기존 구조 → 새로운 구조 변경
-- ===============================

-- 1. 기존 데이터 백업 (선택사항)
-- CREATE TABLE orders_backup AS SELECT * FROM orders;
-- CREATE TABLE order_items_backup AS SELECT * FROM order_items;
-- CREATE TABLE scan_logs_backup AS SELECT * FROM scan_logs;

-- 2. orders 테이블 수정
-- 2-1. customer_email 컬럼 추가
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS customer_email TEXT;

-- 2-2. 불필요한 컬럼들 제거 (order_items로 이관)
ALTER TABLE orders 
DROP COLUMN IF EXISTS ticket_type CASCADE,
DROP COLUMN IF EXISTS quantity CASCADE;

-- 3. order_items 테이블 구조 완전 변경
-- 3-1. 임시 테이블로 기존 데이터 백업
CREATE TEMP TABLE temp_order_items AS 
SELECT 
    order_id,
    '일반' as ticket_type,  -- 기존 데이터는 일반으로 처리
    1 as quantity,
    25000 as price  -- 기본 가격으로 설정
FROM order_items;

-- 3-2. 기존 order_items 테이블 삭제 및 재생성
DROP TABLE IF EXISTS order_items CASCADE;

CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    ticket_type TEXT NOT NULL, -- '대인', '소인'
    quantity INTEGER NOT NULL DEFAULT 1,
    price INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3-3. 임시 데이터를 새 테이블로 이관
INSERT INTO order_items (order_id, ticket_type, quantity, price)
SELECT order_id, ticket_type, quantity, price 
FROM temp_order_items;

-- 4. scan_logs 테이블 구조 변경
-- 4-1. 임시 테이블로 기존 데이터 백업 (주문 정보와 조인)
CREATE TEMP TABLE temp_scan_logs AS 
SELECT 
    sl.scanner_id,
    sl.scan_location,
    sl.scanned_at,
    oi.order_id,
    o.customer_phone
FROM scan_logs sl
JOIN order_items_backup oi ON sl.ticket_id = oi.id
JOIN orders o ON oi.order_id = o.id;

-- 4-2. 기존 scan_logs 테이블 삭제 및 재생성
DROP TABLE IF EXISTS scan_logs CASCADE;

CREATE TABLE scan_logs (
    id SERIAL PRIMARY KEY,
    order_id TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    scanner_id TEXT NOT NULL,
    scan_location TEXT,
    scanned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4-3. 임시 데이터를 새 테이블로 이관
INSERT INTO scan_logs (order_id, customer_phone, scanner_id, scan_location, scanned_at)
SELECT order_id, customer_phone, scanner_id, scan_location, scanned_at
FROM temp_scan_logs;

-- 5. 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_orders_customer_phone ON orders(customer_phone);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_scan_logs_order_id ON scan_logs(order_id);
CREATE INDEX IF NOT EXISTS idx_scan_logs_customer_phone ON scan_logs(customer_phone);

-- 6. 백업 테이블 정리 (임시 테이블은 세션 종료시 자동 삭제)
-- DROP TABLE IF EXISTS orders_backup;
-- DROP TABLE IF EXISTS order_items_backup;
-- DROP TABLE IF EXISTS scan_logs_backup;

-- ===============================
-- 마이그레이션 완료 후 검증 쿼리
-- ===============================

-- 테이블 구조 확인
\d orders
\d order_items
\d scan_logs

-- 데이터 개수 확인
SELECT 'orders' as table_name, COUNT(*) as row_count FROM orders
UNION ALL
SELECT 'order_items' as table_name, COUNT(*) as row_count FROM order_items
UNION ALL
SELECT 'scan_logs' as table_name, COUNT(*) as row_count FROM scan_logs;

-- 샘플 데이터 확인
SELECT 
    o.id as order_id,
    o.customer_name,
    o.customer_phone,
    o.total_amount,
    o.status,
    STRING_AGG(oi.ticket_type || ' x' || oi.quantity || '매', ', ') as tickets
FROM orders o
LEFT JOIN order_items oi ON o.id = oi.order_id
GROUP BY o.id, o.customer_name, o.customer_phone, o.total_amount, o.status
LIMIT 5; 