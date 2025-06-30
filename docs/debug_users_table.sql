-- Users 테이블 문제 진단 스크립트
-- 각 단계별로 실행해서 어디서 막히는지 확인

-- 1단계: 테이블 존재 여부 확인
DO $$ 
BEGIN
    RAISE NOTICE '=== 1단계: 테이블 존재 여부 확인 ===';
END $$;

SELECT 
    schemaname,
    tablename,
    tableowner,
    rowsecurity as "RLS 활성화됨"
FROM pg_tables 
WHERE tablename = 'users' AND schemaname = 'public';

-- 2단계: RLS 정책 확인
DO $$ 
BEGIN
    RAISE NOTICE '=== 2단계: RLS 정책 확인 ===';
END $$;

SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'users';

-- 3단계: 테이블 권한 확인
DO $$ 
BEGIN
    RAISE NOTICE '=== 3단계: 테이블 권한 확인 ===';
END $$;

SELECT 
    grantee,
    privilege_type,
    is_grantable
FROM information_schema.role_table_grants 
WHERE table_name = 'users' AND table_schema = 'public';

-- 4단계: 현재 역할 확인
DO $$ 
BEGIN
    RAISE NOTICE '=== 4단계: 현재 역할 확인 ===';
END $$;

SELECT 
    current_user as "현재_사용자",
    session_user as "세션_사용자",
    current_setting('role') as "현재_역할";

-- 5단계: auth.users 테이블 확인
DO $$ 
BEGIN
    RAISE NOTICE '=== 5단계: auth.users 테이블 데이터 확인 ===';
END $$;

SELECT 
    id,
    email,
    created_at
FROM auth.users 
LIMIT 3;

-- 6단계: users 테이블 구조 확인 (테이블이 존재하는 경우)
DO $$ 
BEGIN
    RAISE NOTICE '=== 6단계: users 테이블 구조 확인 ===';
END $$;

SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'users' AND table_schema = 'public'
ORDER BY ordinal_position;

-- 7단계: 실제 데이터 조회 테스트
DO $$ 
BEGIN
    RAISE NOTICE '=== 7단계: 실제 데이터 조회 테스트 ===';
END $$;

-- 이 쿼리가 실패하면 어떤 에러가 나는지 확인
SELECT 
    id,
    email,
    name,
    role,
    created_at
FROM users 
LIMIT 3;

-- 8단계: 강제 권한 부여 (문제 해결용)
DO $$ 
BEGIN
    RAISE NOTICE '=== 8단계: 강제 권한 부여 ===';
END $$;

-- 모든 권한 재부여
GRANT ALL ON users TO authenticated;
GRANT ALL ON users TO anon;
GRANT ALL ON users TO postgres;

-- RLS 완전 비활성화
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- 9단계: 최종 테스트
DO $$ 
BEGIN
    RAISE NOTICE '=== 9단계: 최종 테스트 ===';
END $$;

SELECT 
    COUNT(*) as "총_사용자_수"
FROM users; 