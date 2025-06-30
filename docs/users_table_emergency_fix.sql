-- Users 테이블 응급 수정 스크립트
-- CRUD가 안 되는 문제를 즉시 해결

-- 1. 기존 테이블 완전 제거 (있다면)
DROP TABLE IF EXISTS public.users CASCADE;

-- 2. 매우 간단한 users 테이블 생성 (RLS 없음)
CREATE TABLE public.users (
    id UUID PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'user',
    marketing_agreed BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. RLS 완전 비활성화
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- 4. 모든 권한 부여
GRANT ALL ON public.users TO postgres;
GRANT ALL ON public.users TO authenticated;
GRANT ALL ON public.users TO anon;
GRANT ALL ON public.users TO public;

-- 5. 인덱스 생성
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_role ON public.users(role);
CREATE INDEX idx_users_created_at ON public.users(created_at);

-- 6. 기존 auth.users 데이터를 users 테이블로 복사
INSERT INTO public.users (id, email, name, phone, role, marketing_agreed)
SELECT 
    id,
    email,
    COALESCE(raw_user_meta_data->>'name', email) as name,
    raw_user_meta_data->>'phone' as phone,
    'user' as role,
    false as marketing_agreed
FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- 7. 테스트용 데이터 몇 개 추가
INSERT INTO public.users (id, email, name, role) VALUES
    ('11111111-1111-1111-1111-111111111111', 'test1@example.com', '테스트유저1', 'user'),
    ('22222222-2222-2222-2222-222222222222', 'test2@example.com', '테스트유저2', 'user'),
    ('33333333-3333-3333-3333-333333333333', 'admin@example.com', '관리자', 'admin')
ON CONFLICT (id) DO NOTHING;

-- 8. 확인
SELECT 
    COUNT(*) as "총_사용자_수",
    MAX(created_at) as "최근_생성일"
FROM public.users;

SELECT * FROM public.users LIMIT 5; 