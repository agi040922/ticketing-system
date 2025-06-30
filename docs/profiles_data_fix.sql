-- ========================================
-- 🔧 Profiles 데이터 수정 스크립트
-- ========================================
-- 비어있는 필수 필드들을 수정합니다.
-- 먼저 profiles_data_check.sql로 문제를 확인한 후 실행하세요!

-- ========================================
-- 1. 백업 (선택사항)
-- ========================================

-- 안전을 위해 백업 테이블 생성 (선택사항)
-- CREATE TABLE profiles_backup AS SELECT * FROM profiles;

-- ========================================
-- 2. 비어있는 이메일 수정
-- ========================================

UPDATE profiles 
SET email = (
    SELECT au.email 
    FROM auth.users au 
    WHERE au.id = profiles.id
)
WHERE (email IS NULL OR email = '')
AND EXISTS (
    SELECT 1 FROM auth.users au 
    WHERE au.id = profiles.id 
    AND au.email IS NOT NULL
);

-- ========================================
-- 3. 비어있는 이름 수정
-- ========================================

-- Auth 메타데이터에서 이름 가져오기
UPDATE profiles 
SET name = (
    SELECT COALESCE(
        au.raw_user_meta_data->>'name',
        au.raw_user_meta_data->>'full_name',
        SPLIT_PART(au.email, '@', 1),
        '사용자'
    )
    FROM auth.users au 
    WHERE au.id = profiles.id
)
WHERE (name IS NULL OR name = '')
AND EXISTS (
    SELECT 1 FROM auth.users au 
    WHERE au.id = profiles.id
);

-- 여전히 비어있는 이름들 처리
UPDATE profiles 
SET name = CONCAT('사용자_', SUBSTRING(id::text, 1, 8))
WHERE name IS NULL OR name = '';

-- ========================================
-- 4. 비어있는 역할(role) 수정
-- ========================================

UPDATE profiles 
SET role = 'user'
WHERE role IS NULL OR role = '';

-- ========================================
-- 5. 비어있는 마케팅 동의 수정
-- ========================================

UPDATE profiles 
SET marketing_agreed = false
WHERE marketing_agreed IS NULL;

-- ========================================
-- 6. 비어있는 생성/수정 시간 수정
-- ========================================

UPDATE profiles 
SET created_at = CURRENT_TIMESTAMP
WHERE created_at IS NULL;

UPDATE profiles 
SET updated_at = CURRENT_TIMESTAMP
WHERE updated_at IS NULL;

-- ========================================
-- 7. Auth 사용자 정보와 동기화
-- ========================================

-- Auth 사용자의 이메일과 프로필 이메일이 다른 경우 동기화
UPDATE profiles 
SET 
    email = au.email,
    updated_at = CURRENT_TIMESTAMP
FROM auth.users au
WHERE profiles.id = au.id
AND profiles.email != au.email
AND au.email IS NOT NULL;

-- ========================================
-- 8. 중복 확인 및 정리
-- ========================================

-- 혹시 중복된 프로필이 있는지 확인
SELECT 
    '🔍 중복 프로필 확인' as check_type,
    email,
    COUNT(*) as duplicate_count
FROM profiles
GROUP BY email
HAVING COUNT(*) > 1;

-- ========================================
-- 9. 수정 결과 확인
-- ========================================

SELECT 
    '📊 수정 후 통계' as check_type,
    COUNT(*) as total_profiles,
    COUNT(CASE WHEN email IS NULL OR email = '' THEN 1 END) as empty_email,
    COUNT(CASE WHEN name IS NULL OR name = '' THEN 1 END) as empty_name,
    COUNT(CASE WHEN role IS NULL OR role = '' THEN 1 END) as empty_role,
    COUNT(CASE WHEN marketing_agreed IS NULL THEN 1 END) as null_marketing,
    COUNT(CASE WHEN created_at IS NULL THEN 1 END) as null_created_at
FROM profiles;

-- ========================================
-- 10. 최종 검증
-- ========================================

-- 모든 필수 필드가 채워졌는지 확인
SELECT 
    '✅ 최종 검증' as check_type,
    COUNT(*) as total_records,
    COUNT(CASE WHEN 
        email IS NOT NULL AND email != '' AND
        name IS NOT NULL AND name != '' AND
        role IS NOT NULL AND role != '' AND
        marketing_agreed IS NOT NULL
    THEN 1 END) as valid_records,
    CASE 
        WHEN COUNT(*) = COUNT(CASE WHEN 
            email IS NOT NULL AND email != '' AND
            name IS NOT NULL AND name != '' AND
            role IS NOT NULL AND role != '' AND
            marketing_agreed IS NOT NULL
        THEN 1 END) THEN '✅ 모든 레코드 정상'
        ELSE '❌ 여전히 문제 있음'
    END as status
FROM profiles;

-- ========================================
-- 완료!
-- ========================================

SELECT '🎉 데이터 수정 완료!' as result, 
       'Auth 테스트 페이지에서 다시 확인해보세요.' as message; 