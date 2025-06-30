-- ========================================
-- 🔍 Database Roles 권한 진단 스크립트
-- ========================================
-- Supabase Database Roles 문제를 정확히 진단합니다.

-- ========================================
-- 1. 현재 연결된 역할 확인
-- ========================================

SELECT 
    '🔌 현재 연결 상태' as check_type,
    current_user as current_role,
    current_setting('role') as effective_role,
    session_user as session_role;

-- ========================================
-- 2. 주요 역할들의 존재 여부 확인
-- ========================================

SELECT 
    '👥 데이터베이스 역할 목록' as check_type,
    rolname as role_name,
    rolsuper as is_superuser,
    rolinherit as can_inherit,
    rolcreaterole as can_create_role,
    rolcreatedb as can_create_db,
    rolcanlogin as can_login,
    rolconnlimit as connection_limit
FROM pg_roles 
WHERE rolname IN ('anon', 'authenticated', 'authenticator', 'service_role', 'supabase_admin')
ORDER BY rolname;

-- ========================================
-- 3. anon 역할 권한 확인
-- ========================================

SELECT 
    '🔓 anon 역할 권한' as check_type,
    table_name,
    privilege_type,
    is_grantable
FROM information_schema.table_privileges 
WHERE grantee = 'anon' 
AND table_schema = 'public'
AND table_name IN ('profiles', 'orders', 'notices')
ORDER BY table_name, privilege_type;

-- ========================================
-- 4. authenticated 역할 권한 확인
-- ========================================

SELECT 
    '🔐 authenticated 역할 권한' as check_type,
    table_name,
    privilege_type,
    is_grantable
FROM information_schema.table_privileges 
WHERE grantee = 'authenticated' 
AND table_schema = 'public'
AND table_name IN ('profiles', 'orders', 'notices')
ORDER BY table_name, privilege_type;

-- ========================================
-- 5. RLS 정책과 역할 연결 확인
-- ========================================

SELECT 
    '🛡️ RLS 정책별 역할 확인' as check_type,
    schemaname,
    tablename,
    policyname,
    cmd as command_type,
    qual as policy_expression,
    with_check
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename = 'profiles'
ORDER BY policyname;

-- ========================================
-- 6. 역할 상속 관계 확인
-- ========================================

SELECT 
    '👑 역할 상속 관계' as check_type,
    r.rolname as role_name,
    m.rolname as member_of_role
FROM pg_roles r
LEFT JOIN pg_auth_members am ON r.oid = am.member
LEFT JOIN pg_roles m ON am.roleid = m.oid
WHERE r.rolname IN ('anon', 'authenticated', 'authenticator')
ORDER BY r.rolname, m.rolname;

-- ========================================
-- 7. 현재 세션으로 profiles 접근 테스트
-- ========================================

DO $$
DECLARE
    profile_count INTEGER;
    error_msg TEXT;
BEGIN
    -- 현재 역할로 profiles 테이블 접근 시도
    BEGIN
        SELECT COUNT(*) INTO profile_count FROM profiles;
        RAISE NOTICE '✅ profiles 테이블 접근 성공: % 개 레코드', profile_count;
    EXCEPTION
        WHEN OTHERS THEN
            GET STACKED DIAGNOSTICS error_msg = MESSAGE_TEXT;
            RAISE NOTICE '❌ profiles 테이블 접근 실패: %', error_msg;
    END;
END $$;

-- ========================================
-- 8. auth.uid() 함수 테스트
-- ========================================

SELECT 
    '🔑 auth.uid() 함수 테스트' as check_type,
    auth.uid() as current_user_id,
    CASE 
        WHEN auth.uid() IS NULL THEN '❌ 인증되지 않은 사용자'
        ELSE '✅ 인증된 사용자'
    END as auth_status;

-- ========================================
-- 9. 권한 부여 확인 및 수정 제안
-- ========================================

-- anon에게 부족한 권한이 있는지 확인
SELECT 
    '⚠️ anon 권한 문제' as check_type,
    'profiles 테이블' as table_name,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.table_privileges 
            WHERE grantee = 'anon' AND table_name = 'profiles' AND privilege_type = 'SELECT'
        ) THEN '✅ SELECT 권한 있음'
        ELSE '❌ SELECT 권한 없음 - 부여 필요'
    END as select_permission;

-- authenticated에게 부족한 권한이 있는지 확인
SELECT 
    '⚠️ authenticated 권한 문제' as check_type,
    'profiles 테이블' as table_name,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.table_privileges 
            WHERE grantee = 'authenticated' AND table_name = 'profiles' AND privilege_type = 'ALL'
        ) THEN '✅ ALL 권한 있음'
        ELSE '❌ ALL 권한 없음 - 부여 필요'
    END as all_permission;

-- ========================================
-- 10. 해결책 제시
-- ========================================

SELECT 
    '💡 권한 문제 해결 방법' as solution_type,
    '아래 SQL을 실행하여 권한을 올바르게 설정하세요:' as instruction,
    '
    -- anon 권한 부여
    GRANT USAGE ON SCHEMA public TO anon;
    GRANT SELECT ON public.profiles TO anon;
    
    -- authenticated 권한 부여  
    GRANT USAGE ON SCHEMA public TO authenticated;
    GRANT ALL ON public.profiles TO authenticated;
    GRANT ALL ON public.orders TO authenticated;
    GRANT ALL ON public.order_items TO authenticated;
    GRANT SELECT ON public.notices TO authenticated;
    
    -- auth 스키마 함수 접근 권한
    GRANT EXECUTE ON FUNCTION auth.uid() TO anon, authenticated;
    ' as fix_sql; 