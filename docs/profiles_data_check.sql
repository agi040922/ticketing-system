-- ========================================
-- 🔍 Profiles 테이블 데이터 상태 점검
-- ========================================
-- 현재 profiles 테이블의 실제 데이터 상태를 확인합니다.

-- ========================================
-- 1. 테이블 스키마 확인 (NOT NULL 제약조건)
-- ========================================

SELECT 
    '📋 Profiles 스키마 정보' as check_type,
    column_name,
    data_type,
    is_nullable,
    column_default,
    CASE WHEN is_nullable = 'NO' THEN '🚨 필수' ELSE '✅ 선택' END as required_status
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'profiles'
ORDER BY ordinal_position;

-- ========================================
-- 2. 실제 데이터 확인 (NULL 값 개수)
-- ========================================

SELECT 
    '📊 NULL 값 통계' as check_type,
    COUNT(*) as total_records,
    COUNT(CASE WHEN id IS NULL THEN 1 END) as null_id,
    COUNT(CASE WHEN email IS NULL OR email = '' THEN 1 END) as null_or_empty_email,
    COUNT(CASE WHEN name IS NULL OR name = '' THEN 1 END) as null_or_empty_name,
    COUNT(CASE WHEN phone IS NULL OR phone = '' THEN 1 END) as null_or_empty_phone,
    COUNT(CASE WHEN role IS NULL OR role = '' THEN 1 END) as null_or_empty_role,
    COUNT(CASE WHEN marketing_agreed IS NULL THEN 1 END) as null_marketing_agreed,
    COUNT(CASE WHEN created_at IS NULL THEN 1 END) as null_created_at,
    COUNT(CASE WHEN updated_at IS NULL THEN 1 END) as null_updated_at
FROM profiles;

-- ========================================
-- 3. 비어있는 필수 필드 레코드 찾기
-- ========================================

SELECT 
    '🚨 문제가 있는 레코드들' as check_type,
    id,
    email,
    name,
    role,
    marketing_agreed,
    created_at,
    CASE 
        WHEN email IS NULL OR email = '' THEN '이메일 누락'
        WHEN name IS NULL OR name = '' THEN '이름 누락'
        WHEN role IS NULL OR role = '' THEN '역할 누락'
        WHEN marketing_agreed IS NULL THEN '마케팅 동의 누락'
        ELSE '기타 문제'
    END as problem_type
FROM profiles
WHERE 
    email IS NULL OR email = '' OR
    name IS NULL OR name = '' OR
    role IS NULL OR role = '' OR
    marketing_agreed IS NULL
ORDER BY created_at DESC;

-- ========================================
-- 4. Auth.users와 profiles 비교
-- ========================================

SELECT 
    '🔄 Auth-Profile 매칭 상세' as check_type,
    au.id as auth_id,
    au.email as auth_email,
    au.raw_user_meta_data->>'name' as auth_name,
    p.email as profile_email,
    p.name as profile_name,
    p.role as profile_role,
    CASE 
        WHEN p.id IS NULL THEN '❌ 프로필 누락'
        WHEN p.email IS NULL OR p.email = '' THEN '❌ 이메일 누락'
        WHEN p.name IS NULL OR p.name = '' THEN '❌ 이름 누락'
        ELSE '✅ 정상'
    END as status
FROM auth.users au
LEFT JOIN profiles p ON au.id = p.id
ORDER BY au.created_at DESC;

-- ========================================
-- 5. 데이터 품질 점검
-- ========================================

SELECT 
    '📈 데이터 품질 점수' as check_type,
    COUNT(*) as total_profiles,
    COUNT(CASE WHEN 
        email IS NOT NULL AND email != '' AND
        name IS NOT NULL AND name != '' AND
        role IS NOT NULL AND role != '' AND
        marketing_agreed IS NOT NULL
    THEN 1 END) as complete_profiles,
    ROUND(
        (COUNT(CASE WHEN 
            email IS NOT NULL AND email != '' AND
            name IS NOT NULL AND name != '' AND
            role IS NOT NULL AND role != '' AND
            marketing_agreed IS NOT NULL
        THEN 1 END) * 100.0 / COUNT(*)), 2
    ) as completion_percentage
FROM profiles;

-- ========================================
-- 6. 최근 생성된 프로필들 상태
-- ========================================

SELECT 
    '🕐 최근 프로필 상태' as check_type,
    id,
    email,
    name,
    phone,
    role,
    marketing_agreed,
    created_at,
    CASE 
        WHEN email IS NULL OR email = '' THEN '❌'
        ELSE '✅'
    END as email_ok,
    CASE 
        WHEN name IS NULL OR name = '' THEN '❌'
        ELSE '✅'
    END as name_ok
FROM profiles
ORDER BY created_at DESC
LIMIT 10;

-- ========================================
-- 7. 역할별 통계
-- ========================================

SELECT 
    '👥 역할별 통계' as check_type,
    role,
    COUNT(*) as count,
    COUNT(CASE WHEN phone IS NOT NULL AND phone != '' THEN 1 END) as has_phone,
    COUNT(CASE WHEN birth_date IS NOT NULL THEN 1 END) as has_birth_date,
    COUNT(CASE WHEN gender IS NOT NULL THEN 1 END) as has_gender,
    COUNT(CASE WHEN avatar_url IS NOT NULL THEN 1 END) as has_avatar
FROM profiles
GROUP BY role
ORDER BY count DESC;

-- ========================================
-- 완료 메시지
-- ========================================

SELECT 
    '✅ 데이터 점검 완료!' as result,
    '위 결과를 확인하여 문제가 있는 레코드를 찾아보세요.' as message; 