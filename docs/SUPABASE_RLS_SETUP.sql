-- ====================================
-- Supabase RLS (Row Level Security) 설정
-- ====================================
-- 이 스크립트를 Supabase SQL Editor에서 실행하세요

-- 1. 모든 테이블에 RLS 활성화
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scan_logs ENABLE ROW LEVEL SECURITY;

-- 2. orders 테이블 정책
-- 서비스 역할로는 모든 접근 허용 (서버 API용)
CREATE POLICY "orders_service_role_all" ON public.orders
FOR ALL USING (auth.role() = 'service_role');

-- 일반 사용자는 자신의 휴대폰 번호로만 조회 가능
CREATE POLICY "orders_user_select" ON public.orders
FOR SELECT USING (
  auth.role() = 'anon' AND 
  customer_phone = current_setting('request.headers', true)::json->>'customer-phone'
);

-- 3. order_items 테이블 정책
-- 서비스 역할로는 모든 접근 허용
CREATE POLICY "order_items_service_role_all" ON public.order_items
FOR ALL USING (auth.role() = 'service_role');

-- 일반 사용자는 자신의 주문과 연관된 아이템만 조회 가능
CREATE POLICY "order_items_user_select" ON public.order_items
FOR SELECT USING (
  auth.role() = 'anon' AND
  order_id IN (
    SELECT id FROM public.orders 
    WHERE customer_phone = current_setting('request.headers', true)::json->>'customer-phone'
  )
);

-- 4. scan_logs 테이블 정책
-- 서비스 역할로는 모든 접근 허용
CREATE POLICY "scan_logs_service_role_all" ON public.scan_logs
FOR ALL USING (auth.role() = 'service_role');

-- 일반 사용자는 스캔 로그 조회 불가 (관리자 전용)
-- 필요시 나중에 정책 추가 가능

-- ====================================
-- 개발/테스트용 간단한 정책 (선택사항)
-- ====================================
-- 만약 위의 정책이 복잡하다면, 개발 단계에서는 아래 간단한 정책을 사용할 수 있습니다.
-- 위의 정책들을 지우고 아래를 사용하세요.

/*
-- 모든 정책 삭제 (필요시)
DROP POLICY IF EXISTS "orders_service_role_all" ON public.orders;
DROP POLICY IF EXISTS "orders_user_select" ON public.orders;
DROP POLICY IF EXISTS "order_items_service_role_all" ON public.order_items;
DROP POLICY IF EXISTS "order_items_user_select" ON public.order_items;
DROP POLICY IF EXISTS "scan_logs_service_role_all" ON public.scan_logs;

-- 간단한 정책: 서비스 역할은 모든 접근 허용, 일반 사용자는 읽기만 허용
CREATE POLICY "orders_simple" ON public.orders
FOR ALL USING (
  auth.role() = 'service_role' OR 
  (auth.role() = 'anon' AND current_setting('request.method', true) = 'GET')
);

CREATE POLICY "order_items_simple" ON public.order_items
FOR ALL USING (
  auth.role() = 'service_role' OR 
  (auth.role() = 'anon' AND current_setting('request.method', true) = 'GET')
);

CREATE POLICY "scan_logs_simple" ON public.scan_logs
FOR ALL USING (auth.role() = 'service_role');
*/

-- ====================================
-- 확인용 쿼리
-- ====================================
-- RLS가 활성화되었는지 확인
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled,
  hasrls as has_rls_policies
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('orders', 'order_items', 'scan_logs');

-- 정책 목록 확인
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE schemaname = 'public'; 