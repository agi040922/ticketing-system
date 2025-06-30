-- Users 테이블 권한 문제 해결 스크립트
-- 데이터는 있는데 프론트엔드에서 접근이 안 되는 문제 해결

-- 1. 현재 상태 확인
DO $$ 
BEGIN
    RAISE NOTICE '=== Users 테이블 권한 수정 시작 ===';
END $$;

-- 현재 데이터 확인
SELECT 
    COUNT(*) as "총_사용자_수",
    COUNT(CASE WHEN role = 'admin' THEN 1 END) as "관리자_수",
    COUNT(CASE WHEN role = 'user' THEN 1 END) as "일반사용자_수"
FROM users;

-- 2. RLS 완전 비활성화 (가장 중요!)
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- 기존 정책들 모두 삭제
DROP POLICY IF EXISTS "users_select_policy" ON users;
DROP POLICY IF EXISTS "users_insert_policy" ON users;
DROP POLICY IF EXISTS "users_update_policy" ON users;
DROP POLICY IF EXISTS "users_delete_policy" ON users;

-- 3. 모든 역할에 전체 권한 부여
GRANT ALL ON users TO postgres;
GRANT ALL ON users TO authenticated; 
GRANT ALL ON users TO anon;
GRANT ALL ON users TO public;

-- 4. 스키마 권한도 부여
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;

-- 5. 시퀀스 권한 (혹시 있다면)
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon;

-- 6. 테이블의 소유자 확인 및 변경
ALTER TABLE users OWNER TO postgres;

-- 7. 최종 권한 확인
SELECT 
    grantee as "권한받은역할",
    privilege_type as "권한타입",
    is_grantable as "권한부여가능"
FROM information_schema.role_table_grants 
WHERE table_name = 'users' AND table_schema = 'public'
ORDER BY grantee, privilege_type;

-- 8. RLS 상태 확인
SELECT 
    schemaname,
    tablename,
    rowsecurity as "RLS활성화",
    tableowner as "테이블소유자"
FROM pg_tables 
WHERE tablename = 'users' AND schemaname = 'public';

-- 9. 간단한 조회 테스트
SELECT 
    id,
    email,
    name,
    role,
    created_at
FROM users 
ORDER BY created_at DESC
LIMIT 5;

DO $$ 
BEGIN
    RAISE NOTICE '=== Users 테이블 권한 수정 완료 ===';
    RAISE NOTICE '이제 프론트엔드에서 테스트해보세요!';
END $$; 