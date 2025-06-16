-- ===============================
-- 새로운 데이터베이스 스키마
-- (Fresh Installation용)
-- ===============================

-- 1. orders 테이블 (주문 정보)
CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,                    -- 주문 ID (UUID)
    customer_id TEXT,                       -- 고객 ID (이메일 또는 전화번호)
    customer_name TEXT NOT NULL,            -- 고객 이름
    customer_phone TEXT NOT NULL,           -- 고객 전화번호
    customer_email TEXT,                    -- 고객 이메일 (선택사항)
    total_amount INTEGER NOT NULL,          -- 총 결제 금액
    status TEXT DEFAULT 'pending',          -- 주문 상태 (pending, completed, cancelled)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. order_items 테이블 (주문 상품 정보)
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    ticket_type TEXT NOT NULL,              -- 티켓 유형 ('대인', '소인')
    quantity INTEGER NOT NULL DEFAULT 1,    -- 수량
    price INTEGER NOT NULL,                 -- 단가
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. scan_logs 테이블 (스캔 기록)
CREATE TABLE IF NOT EXISTS scan_logs (
    id SERIAL PRIMARY KEY,
    order_id TEXT NOT NULL,                 -- 주문 ID
    customer_phone TEXT NOT NULL,           -- 고객 전화번호 (검증용)
    scanner_id TEXT NOT NULL,               -- 스캐너 ID
    scan_location TEXT,                     -- 스캔 위치
    scanned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_orders_customer_phone ON orders(customer_phone);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_ticket_type ON order_items(ticket_type);

CREATE INDEX IF NOT EXISTS idx_scan_logs_order_id ON scan_logs(order_id);
CREATE INDEX IF NOT EXISTS idx_scan_logs_customer_phone ON scan_logs(customer_phone);
CREATE INDEX IF NOT EXISTS idx_scan_logs_scanned_at ON scan_logs(scanned_at);

-- 5. 함수: 주문 업데이트 시간 자동 갱신
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 6. 트리거: orders 테이블 업데이트 시간 자동 갱신
CREATE TRIGGER update_orders_updated_at 
    BEFORE UPDATE ON orders 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- ===============================
-- 샘플 데이터 삽입 (테스트용)
-- ===============================

-- 샘플 주문 1
INSERT INTO orders (id, customer_id, customer_name, customer_phone, customer_email, total_amount, status) 
VALUES (
    'order_sample_001', 
    'test@example.com', 
    '홍길동', 
    '010-1234-5678', 
    'test@example.com', 
    43000, 
    'completed'
) ON CONFLICT (id) DO NOTHING;

-- 샘플 주문 아이템들
INSERT INTO order_items (order_id, ticket_type, quantity, price) 
VALUES 
    ('order_sample_001', '대인', 1, 25000),
    ('order_sample_001', '소인', 1, 18000)
ON CONFLICT DO NOTHING;

-- 샘플 주문 2
INSERT INTO orders (id, customer_id, customer_name, customer_phone, total_amount, status) 
VALUES (
    'order_sample_002', 
    '010-9876-5432', 
    '김철수', 
    '010-9876-5432', 
    50000, 
    'completed'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO order_items (order_id, ticket_type, quantity, price) 
VALUES 
    ('order_sample_002', '대인', 2, 25000)
ON CONFLICT DO NOTHING;

-- ===============================
-- 유용한 쿼리들
-- ===============================

-- 1. 주문과 아이템 조회 (조인)
/*
SELECT 
    o.id as order_id,
    o.customer_name,
    o.customer_phone,
    o.total_amount,
    o.status,
    o.created_at,
    STRING_AGG(oi.ticket_type || ' x' || oi.quantity || '매 (' || (oi.quantity * oi.price) || '원)', ', ') as items
FROM orders o
LEFT JOIN order_items oi ON o.id = oi.order_id
GROUP BY o.id, o.customer_name, o.customer_phone, o.total_amount, o.status, o.created_at
ORDER BY o.created_at DESC;
*/

-- 2. 특정 고객의 주문 검색
/*
SELECT 
    o.*,
    json_agg(
        json_build_object(
            'ticket_type', oi.ticket_type,
            'quantity', oi.quantity,
            'price', oi.price
        )
    ) as order_items
FROM orders o
LEFT JOIN order_items oi ON o.id = oi.order_id
WHERE o.customer_phone = '010-1234-5678'
GROUP BY o.id
ORDER BY o.created_at DESC;
*/

-- 3. 스캔 로그 조회 (주문 정보 포함)
/*
SELECT 
    sl.id as scan_id,
    sl.scanned_at,
    sl.scanner_id,
    sl.scan_location,
    o.customer_name,
    o.customer_phone,
    STRING_AGG(oi.ticket_type || ' x' || oi.quantity || '매', ', ') as tickets
FROM scan_logs sl
JOIN orders o ON sl.order_id = o.id
LEFT JOIN order_items oi ON o.id = oi.order_id
GROUP BY sl.id, sl.scanned_at, sl.scanner_id, sl.scan_location, o.customer_name, o.customer_phone
ORDER BY sl.scanned_at DESC;
*/

-- 4. 일별 매출 통계
/*
SELECT 
    DATE(o.created_at) as order_date,
    COUNT(o.id) as order_count,
    SUM(o.total_amount) as total_sales,
    SUM(CASE WHEN oi.ticket_type = '대인' THEN oi.quantity ELSE 0 END) as adult_tickets,
    SUM(CASE WHEN oi.ticket_type = '소인' THEN oi.quantity ELSE 0 END) as child_tickets
FROM orders o
LEFT JOIN order_items oi ON o.id = oi.order_id
WHERE o.status = 'completed'
GROUP BY DATE(o.created_at)
ORDER BY order_date DESC;
*/ 