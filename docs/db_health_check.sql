-- ========================================
-- 🔍 데이터베이스 상태 점검 스크립트
-- ========================================
-- 현재 DB의 실제 상태를 확인하여 문제점을 파악합니다.
-- Supabase SQL Editor에서 실행하세요.

-- ========================================
-- 1. 테이블 존재 여부 및 구조 확인
-- ========================================

SELECT 
    '📋 테이블 목록' as check_type,
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'orders', 'order_items', 'notices', 'coupons', 'user_coupons', 'user_activities', 'scan_logs')
ORDER BY table_name;

-- ========================================
-- 2. Profiles 테이블 상세 정보
-- ========================================

SELECT 
    '👤 Profiles 테이블 구조' as check_type,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'profiles'
ORDER BY ordinal_position;

-- ========================================
-- 3. RLS (Row Level Security) 상태 확인
-- ========================================

SELECT 
    '🔒 RLS 상태' as check_type,
    schemaname,
    tablename,
    rowsecurity as rls_enabled,
    hasoids
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('profiles', 'orders', 'order_items', 'notices', 'coupons', 'user_coupons', 'user_activities', 'scan_logs');

-- ========================================
-- 4. RLS 정책 확인
-- ========================================

SELECT 
    '🛡️ RLS 정책' as check_type,
    schemaname,
    tablename,
    policyname,
    cmd as command_type,
    qual as using_expression,
    with_check
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- ========================================
-- 5. 트리거 확인
-- ========================================

SELECT 
    '⚡ 트리거 상태' as check_type,
    event_object_table as table_name,
    trigger_name,
    event_manipulation,
    action_timing,
    action_statement
FROM information_schema.triggers 
WHERE event_object_schema = 'public'
AND event_object_table IN ('profiles', 'users')
ORDER BY event_object_table, trigger_name;

-- ========================================
-- 6. 인덱스 확인
-- ========================================

SELECT 
    '📊 인덱스 상태' as check_type,
    tablename,
    indexname,
    indexdef
FROM pg_indexes 
WHERE schemaname = 'public'
AND tablename IN ('profiles', 'orders', 'order_items', 'notices', 'coupons', 'user_coupons', 'user_activities', 'scan_logs')
ORDER BY tablename, indexname;

-- ========================================
-- 7. 외래키 제약조건 확인
-- ========================================

SELECT 
    '🔗 외래키 제약조건' as check_type,
    tc.table_name,
    tc.constraint_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
AND tc.table_schema = 'public'
ORDER BY tc.table_name, tc.constraint_name;

-- ========================================
-- 8. 함수 확인 (프로필 자동 생성 등)
-- ========================================

SELECT 
    '🔧 함수 목록' as check_type,
    routine_name,
    routine_type,
    data_type as return_type
FROM information_schema.routines 
WHERE routine_schema = 'public'
AND routine_name LIKE '%user%' OR routine_name LIKE '%profile%'
ORDER BY routine_name;

-- ========================================
-- 9. 시퀀스 확인
-- ========================================

SELECT 
    '🔢 시퀀스 상태' as check_type,
    sequence_name,
    data_type,
    start_value,
    minimum_value,
    maximum_value,
    increment
FROM information_schema.sequences 
WHERE sequence_schema = 'public'
ORDER BY sequence_name;

-- ========================================
-- 10. Notices 테이블 ID 타입 확인
-- ========================================

SELECT 
    '📢 Notices ID 타입 확인' as check_type,
    column_name,
    data_type,
    character_maximum_length,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'notices'
AND column_name = 'id';

-- ========================================
-- 11. 권한 확인
-- ========================================

SELECT 
    '🔑 테이블 권한' as check_type,
    table_name,
    grantee,
    privilege_type,
    is_grantable
FROM information_schema.table_privileges 
WHERE table_schema = 'public'
AND table_name IN ('profiles', 'orders', 'order_items', 'notices', 'coupons', 'user_coupons', 'user_activities', 'scan_logs')
AND grantee IN ('anon', 'authenticated', 'service_role')
ORDER BY table_name, grantee, privilege_type;

-- ========================================
-- 12. 실제 데이터 확인 (profiles 테이블)
-- ========================================

SELECT 
    '📊 Profiles 데이터 통계' as check_type,
    COUNT(*) as total_profiles,
    COUNT(CASE WHEN role = 'admin' THEN 1 END) as admin_count,
    COUNT(CASE WHEN role = 'manager' THEN 1 END) as manager_count,
    COUNT(CASE WHEN role = 'user' THEN 1 END) as user_count,
    COUNT(CASE WHEN marketing_agreed = true THEN 1 END) as marketing_agreed_count
FROM profiles;

-- ========================================
-- 13. Auth 사용자와 Profiles 매칭 확인
-- ========================================

SELECT 
    '🔄 Auth-Profile 매칭' as check_type,
    (SELECT COUNT(*) FROM auth.users) as auth_users_count,
    (SELECT COUNT(*) FROM profiles) as profiles_count,
    (SELECT COUNT(*) FROM auth.users au LEFT JOIN profiles p ON au.id = p.id WHERE p.id IS NULL) as missing_profiles_count;

-- ========================================
-- 완료 메시지
-- ========================================

SELECT '✅ DB 상태 점검 완료!' as check_type, 
       '위 결과를 확인하여 문제점을 파악하세요.' as message; 