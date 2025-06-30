-- ========================================
-- ✅ Profiles 재생성 결과 검증 스크립트
-- ========================================
-- 완전 재생성 후 모든 것이 정상 작동하는지 확인합니다.

-- ========================================
-- 1. 기본 통계 확인
-- ========================================

SELECT 
    '📊 전체 통계' as check_type,
    (SELECT COUNT(*) FROM auth.users) as auth_users_count,
    (SELECT COUNT(*) FROM profiles) as profiles_count,
    CASE 
        WHEN (SELECT COUNT(*) FROM auth.users) = (SELECT COUNT(*) FROM profiles) 
        THEN '✅ 완벽하게 매칭됨'
        ELSE '❌ 불일치 발견'
    END as matching_status;

-- ========================================
-- 2. 누락된 프로필 확인
-- ========================================

SELECT 
    '🧐 누락된 프로필 확인' as check_type,
    COUNT(*) as missing_profiles_count,
    CASE 
        WHEN COUNT(*) = 0 THEN '✅ 누락된 프로필 없음'
        ELSE '❌ 누락된 프로필 존재'
    END as status
FROM auth.users au
LEFT JOIN profiles p ON au.id = p.id
WHERE p.id IS NULL;

-- ========================================
-- 3. RLS 정책 확인
-- ========================================

SELECT 
    '🛡️ RLS 정책 확인' as check_type,
    COUNT(*) as policy_count,
    CASE 
        WHEN COUNT(*) >= 4 THEN '✅ 필수 정책 모두 존재'
        ELSE '❌ 필수 정책 누락'
    END as status
FROM pg_policies 
WHERE schemaname = 'public' AND tablename = 'profiles';

-- RLS 정책 목록
SELECT 
    '📋 RLS 정책 목록' as check_type,
    policyname,
    cmd as command_type,
    CASE 
        WHEN policyname LIKE '%select%' THEN '👀 조회'
        WHEN policyname LIKE '%update%' THEN '✏️ 수정'
        WHEN policyname LIKE '%insert%' THEN '➕ 생성'
        WHEN policyname LIKE '%admin%' THEN '👑 관리자'
        ELSE '❓ 기타'
    END as policy_purpose
FROM pg_policies 
WHERE schemaname = 'public' AND tablename = 'profiles'
ORDER BY policyname;

-- ========================================
-- 4. 트리거 확인
-- ========================================

SELECT 
    '⚡ 트리거 확인' as check_type,
    COUNT(*) as trigger_count,
    CASE 
        WHEN COUNT(*) >= 1 THEN '✅ 자동 프로필 생성 트리거 존재'
        ELSE '❌ 트리거 누락'
    END as status
FROM information_schema.triggers 
WHERE event_object_table = 'users' 
AND trigger_schema = 'public'
AND trigger_name = 'on_auth_user_created';

-- ========================================
-- 5. 인덱스 확인
-- ========================================

SELECT 
    '📊 인덱스 확인' as check_type,
    COUNT(*) as index_count,
    CASE 
        WHEN COUNT(*) >= 4 THEN '✅ 필수 인덱스 모두 존재'
        ELSE '❌ 인덱스 누락'
    END as status
FROM pg_indexes 
WHERE schemaname = 'public' 
AND tablename = 'profiles';

-- 인덱스 목록
SELECT 
    '📋 인덱스 목록' as check_type,
    indexname,
    CASE 
        WHEN indexname LIKE '%email%' THEN '📧 이메일'
        WHEN indexname LIKE '%role%' THEN '👤 역할'
        WHEN indexname LIKE '%created%' THEN '📅 생성일'
        WHEN indexname LIKE '%phone%' THEN '📞 전화번호'
        WHEN indexname LIKE '%pkey%' THEN '🔑 기본키'
        ELSE '❓ 기타'
    END as index_purpose
FROM pg_indexes 
WHERE schemaname = 'public' 
AND tablename = 'profiles'
ORDER BY indexname;

-- ========================================
-- 6. 데이터 품질 확인
-- ========================================

SELECT 
    '✨ 데이터 품질 확인' as check_type,
    COUNT(*) as total_profiles,
    COUNT(CASE WHEN email IS NOT NULL AND email != '' THEN 1 END) as valid_email,
    COUNT(CASE WHEN name IS NOT NULL AND name != '' THEN 1 END) as valid_name,
    COUNT(CASE WHEN role IN ('user', 'admin', 'manager') THEN 1 END) as valid_role,
    COUNT(CASE WHEN marketing_agreed IS NOT NULL THEN 1 END) as valid_marketing,
    CASE 
        WHEN COUNT(*) = COUNT(CASE WHEN 
            email IS NOT NULL AND email != '' AND
            name IS NOT NULL AND name != '' AND
            role IN ('user', 'admin', 'manager') AND
            marketing_agreed IS NOT NULL
        THEN 1 END) THEN '✅ 모든 데이터 완벽'
        ELSE '❌ 일부 데이터 문제 있음'
    END as quality_status
FROM profiles;

-- ========================================
-- 7. 외래키 관계 확인
-- ========================================

SELECT 
    '🔗 외래키 관계 확인' as check_type,
    COUNT(*) as foreign_key_count,
    CASE 
        WHEN COUNT(*) >= 3 THEN '✅ 외래키 관계 정상'
        ELSE '❌ 외래키 관계 문제'
    END as status
FROM information_schema.table_constraints tc
JOIN information_schema.constraint_column_usage ccu 
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
AND ccu.table_name = 'profiles'
AND tc.table_schema = 'public';

-- ========================================
-- 8. 최근 프로필 샘플 확인
-- ========================================

SELECT 
    '👥 최근 프로필 샘플' as check_type,
    id,
    email,
    name,
    role,
    marketing_agreed,
    created_at,
    '✅' as status
FROM profiles
ORDER BY created_at DESC
LIMIT 5;

-- ========================================
-- 9. 권한 확인
-- ========================================

SELECT 
    '🔑 테이블 권한 확인' as check_type,
    grantee,
    privilege_type,
    CASE 
        WHEN grantee = 'authenticated' AND privilege_type = 'ALL' THEN '✅ 인증된 사용자 권한 정상'
        WHEN grantee = 'anon' AND privilege_type = 'SELECT' THEN '✅ 익명 사용자 권한 정상'
        ELSE '📋 기타 권한'
    END as permission_status
FROM information_schema.table_privileges 
WHERE table_schema = 'public'
AND table_name = 'profiles'
AND grantee IN ('anon', 'authenticated')
ORDER BY grantee, privilege_type;

-- ========================================
-- 10. 최종 종합 결과
-- ========================================

SELECT 
    '🎉 최종 검증 결과' as check_type,
    CASE 
        WHEN 
            (SELECT COUNT(*) FROM auth.users) = (SELECT COUNT(*) FROM profiles) AND
            (SELECT COUNT(*) FROM pg_policies WHERE schemaname = 'public' AND tablename = 'profiles') >= 4 AND
            (SELECT COUNT(*) FROM information_schema.triggers WHERE event_object_table = 'users' AND trigger_schema = 'public' AND trigger_name = 'on_auth_user_created') >= 1 AND
            (SELECT COUNT(*) FROM pg_indexes WHERE schemaname = 'public' AND tablename = 'profiles') >= 4
        THEN '🎊 완벽! 모든 검증 통과'
        ELSE '⚠️ 일부 문제 발견 - 위 결과 확인 필요'
    END as final_result,
    '이제 Auth 테스트 페이지에서 로그인해보세요!' as next_step; 