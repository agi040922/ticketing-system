-- RLS 완전 제거 스크립트
-- 개발용으로 보안 정책을 모두 제거하여 단순하게 만듭니다.
-- 주의: 운영 환경에서는 사용하지 마세요!

DO $$ 
BEGIN
    RAISE NOTICE '=== RLS 완전 제거 시작 ===';
END $$;

-- 1단계: 모든 테이블의 RLS 정책 삭제
DO $$ 
BEGIN
    RAISE NOTICE '1단계: 기존 RLS 정책 모두 삭제';
END $$;

-- profiles 테이블 정책 삭제
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can update own profiles" ON profiles;

-- orders 테이블 정책 삭제
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
DROP POLICY IF EXISTS "Users can update own orders" ON orders;
DROP POLICY IF EXISTS "Users can insert own orders" ON orders;

-- order_items 테이블 정책 삭제
DROP POLICY IF EXISTS "Users can view own order items" ON order_items;
DROP POLICY IF EXISTS "Users can update own order items" ON order_items;
DROP POLICY IF EXISTS "Users can insert own order items" ON order_items;

-- coupons 테이블 정책 삭제
DROP POLICY IF EXISTS "Everyone can view coupons" ON coupons;
DROP POLICY IF EXISTS "Only admins can manage coupons" ON coupons;

-- user_coupons 테이블 정책 삭제
DROP POLICY IF EXISTS "Users can view own coupons" ON user_coupons;
DROP POLICY IF EXISTS "Users can update own coupons" ON user_coupons;
DROP POLICY IF EXISTS "Users can insert own coupons" ON user_coupons;

-- user_activities 테이블 정책 삭제
DROP POLICY IF EXISTS "Users can view own activities" ON user_activities;
DROP POLICY IF EXISTS "Users can insert own activities" ON user_activities;

-- notices 테이블 정책 삭제
DROP POLICY IF EXISTS "Everyone can view notices" ON notices;
DROP POLICY IF EXISTS "Only admins can manage notices" ON notices;

-- scan_logs 테이블 정책 삭제
DROP POLICY IF EXISTS "Only staff can view scan logs" ON scan_logs;
DROP POLICY IF EXISTS "Only staff can insert scan logs" ON scan_logs;

DO $$ 
BEGIN
    RAISE NOTICE '기존 정책 삭제 완료';
END $$;

-- 2단계: 모든 테이블에서 RLS 비활성화
DO $$ 
BEGIN
    RAISE NOTICE '2단계: 모든 테이블에서 RLS 비활성화';
END $$;

ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE order_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE coupons DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_coupons DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_activities DISABLE ROW LEVEL SECURITY;
ALTER TABLE notices DISABLE ROW LEVEL SECURITY;
ALTER TABLE scan_logs DISABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    RAISE NOTICE 'RLS 비활성화 완료';
END $$;

-- 3단계: 기본 권한 부여 (모든 사용자가 모든 테이블에 접근 가능)
DO $$ 
BEGIN
    RAISE NOTICE '3단계: 기본 권한 부여';
END $$;

-- authenticated 역할에 모든 테이블 권한 부여
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- anon 역할에 SELECT 권한 부여
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon;

DO $$ 
BEGIN
    RAISE NOTICE '권한 부여 완료';
END $$;

-- 4단계: 확인 쿼리
DO $$ 
BEGIN
    RAISE NOTICE '4단계: 설정 확인';
END $$;

-- RLS 상태 확인
SELECT 
    schemaname,
    tablename,
    rowsecurity as "RLS 활성화됨"
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

DO $$ 
BEGIN
    RAISE NOTICE '=== RLS 완전 제거 완료 ===';
    RAISE NOTICE '주의: 이제 모든 사용자가 모든 데이터에 접근할 수 있습니다!';
    RAISE NOTICE '개발용으로만 사용하고, 운영 환경에서는 다시 보안 설정을 해주세요.';
END $$; 