-- ===============================
-- 티켓 시스템 DB 구조 수정 마이그레이션
-- 문제: 개별 티켓 관리 불가 → 해결: 개별 티켓 단위로 구조 변경
-- ===============================

-- 1. 백업 테이블 생성 (안전장치)
CREATE TABLE order_items_backup AS SELECT * FROM order_items;
CREATE TABLE scan_logs_backup AS SELECT * FROM scan_logs;

-- 2. order_items 테이블에 필요한 컬럼들 추가
ALTER TABLE order_items 
ADD COLUMN IF NOT EXISTS unique_code TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS qr_image_url TEXT,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active',
ADD COLUMN IF NOT EXISTS used_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS scanner_id TEXT,
ADD COLUMN IF NOT EXISTS scan_location TEXT,
ADD COLUMN IF NOT EXISTS ticket_number INTEGER DEFAULT 1;

-- 3. 기존 데이터를 개별 티켓으로 분할하는 함수 생성
CREATE OR REPLACE FUNCTION split_tickets_by_quantity()
RETURNS void AS $$
DECLARE
    item_record RECORD;
    i INTEGER;
    new_unique_code TEXT;
BEGIN
    -- quantity > 1인 레코드들을 개별 티켓으로 분할
    FOR item_record IN 
        SELECT * FROM order_items WHERE quantity > 1
    LOOP
        -- 첫 번째 티켓은 기존 레코드 업데이트
        new_unique_code := 'TICKET:' || item_record.order_id || ':' || 
                          (SELECT customer_phone FROM orders WHERE id = item_record.order_id) || ':1';
        
        UPDATE order_items 
        SET 
            quantity = 1,
            unique_code = new_unique_code,
            ticket_number = 1
        WHERE id = item_record.id;
        
        -- 나머지 티켓들은 새 레코드로 생성
        FOR i IN 2..item_record.quantity LOOP
            new_unique_code := 'TICKET:' || item_record.order_id || ':' || 
                              (SELECT customer_phone FROM orders WHERE id = item_record.order_id) || ':' || i;
            
            INSERT INTO order_items (
                order_id, 
                ticket_type, 
                quantity, 
                price, 
                unique_code, 
                status,
                ticket_number,
                created_at
            ) VALUES (
                item_record.order_id,
                item_record.ticket_type,
                1,  -- 항상 1매씩
                item_record.price,
                new_unique_code,
                'active',
                i,
                item_record.created_at
            );
        END LOOP;
    END LOOP;
    
    -- quantity = 1인 기존 레코드들에도 unique_code 생성
    FOR item_record IN 
        SELECT * FROM order_items WHERE quantity = 1 AND unique_code IS NULL
    LOOP
        new_unique_code := 'TICKET:' || item_record.order_id || ':' || 
                          (SELECT customer_phone FROM orders WHERE id = item_record.order_id) || ':1';
        
        UPDATE order_items 
        SET 
            unique_code = new_unique_code,
            ticket_number = 1
        WHERE id = item_record.id;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- 4. 함수 실행하여 데이터 분할
SELECT split_tickets_by_quantity();

-- 5. 함수 정리
DROP FUNCTION split_tickets_by_quantity();

-- 6. scan_logs 테이블 구조 변경
-- scan_logs에서 order_items.id를 직접 참조하도록 변경
-- (이제 order_items의 각 레코드가 개별 티켓을 의미함)

-- 기존 scan_logs 데이터는 그대로 유지 (ticket_id는 order_items.id 참조)
-- 새로운 스캔 시에는 개별 티켓의 order_items.id를 사용

-- 7. 인덱스 추가 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_order_items_unique_code ON order_items(unique_code);
CREATE INDEX IF NOT EXISTS idx_order_items_status ON order_items(status);
CREATE INDEX IF NOT EXISTS idx_order_items_used_at ON order_items(used_at);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id_ticket_number ON order_items(order_id, ticket_number);

-- 8. 제약조건 추가
-- unique_code는 NULL이면 안됨 (나중에 추가)
-- ALTER TABLE order_items ALTER COLUMN unique_code SET NOT NULL;

-- 9. 검증 쿼리들
-- 9-1. 분할 결과 확인
SELECT 
    order_id,
    ticket_type,
    COUNT(*) as ticket_count,
    STRING_AGG(ticket_number::text, ', ') as ticket_numbers
FROM order_items 
GROUP BY order_id, ticket_type
ORDER BY order_id;

-- 9-2. unique_code 생성 확인
SELECT 
    order_id,
    ticket_type,
    ticket_number,
    unique_code,
    status
FROM order_items 
ORDER BY order_id, ticket_number;

-- 9-3. 전체 티켓 개수 확인
SELECT 
    '분할 전 총 수량' as description,
    SUM(quantity) as count
FROM order_items_backup
UNION ALL
SELECT 
    '분할 후 총 티켓' as description,
    COUNT(*) as count
FROM order_items;

-- ===============================
-- 마이그레이션 완료 후 정리 작업
-- ===============================

-- 백업 테이블 삭제 (확인 후)
-- DROP TABLE order_items_backup;
-- DROP TABLE scan_logs_backup;

-- ===============================
-- 새로운 테이블 구조 확인
-- ===============================

-- order_items 테이블 구조 확인
\d order_items

-- 샘플 데이터 확인
SELECT 
    o.customer_name,
    o.customer_phone,
    oi.ticket_type,
    oi.ticket_number,
    oi.unique_code,
    oi.status,
    oi.used_at
FROM orders o
JOIN order_items oi ON o.id = oi.order_id
ORDER BY o.id, oi.ticket_number
LIMIT 10; 