-- ========================================
-- 🚨 Profiles 테이블 완전 수정 스크립트
-- ========================================
-- 이 스크립트는 profiles 테이블의 모든 문제점을 해결합니다.
-- Supabase SQL Editor에서 실행하세요.

-- ========================================
-- 1. 기존 정책 및 트리거 정리
-- ========================================

-- 기존 RLS 정책 삭제 (있다면)
DROP POLICY IF EXISTS "사용자는 자신의 프로필만 조회 가능" ON profiles;
DROP POLICY IF EXISTS "사용자는 자신의 프로필만 수정 가능" ON profiles;
DROP POLICY IF EXISTS "사용자는 자신의 프로필을 생성할 수 있음" ON profiles;
DROP POLICY IF EXISTS "관리자는 모든 프로필 접근 가능" ON profiles;

-- 기존 트리거 삭제 (있다면)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;

-- ========================================
-- 2. 테이블 구조 확인 및 수정
-- ========================================

-- profiles 테이블이 없다면 생성
CREATE TABLE IF NOT EXISTS public.profiles (
    id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    email varchar(255) NOT NULL,
    name varchar(100) NOT NULL,
    phone varchar(20),
    birth_date date,
    gender varchar(10),
    role varchar(20) NOT NULL DEFAULT 'user',
    avatar_url text,
    marketing_agreed boolean NOT NULL DEFAULT false,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

-- 기본값 설정 (테이블이 이미 존재하는 경우)
ALTER TABLE profiles 
    ALTER COLUMN role SET DEFAULT 'user',
    ALTER COLUMN marketing_agreed SET DEFAULT false,
    ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP,
    ALTER COLUMN updated_at SET DEFAULT CURRENT_TIMESTAMP;

-- ========================================
-- 3. 인덱스 생성
-- ========================================

-- 필수 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON profiles(created_at DESC);

-- ========================================
-- 4. RLS (Row Level Security) 정책 설정
-- ========================================

-- RLS 활성화
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 1. 사용자는 자신의 프로필만 조회 가능
CREATE POLICY "사용자는 자신의 프로필만 조회 가능" ON profiles
    FOR SELECT USING (auth.uid() = id);

-- 2. 사용자는 자신의 프로필만 수정 가능
CREATE POLICY "사용자는 자신의 프로필만 수정 가능" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- 3. 프로필 생성 정책 (회원가입 시)
CREATE POLICY "사용자는 자신의 프로필을 생성할 수 있음" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- 4. 관리자는 모든 프로필 접근 가능
CREATE POLICY "관리자는 모든 프로필 접근 가능" ON profiles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role IN ('admin', 'manager')
        )
    );

-- ========================================
-- 5. 자동 프로필 생성 함수 및 트리거
-- ========================================

-- 회원가입 시 자동 프로필 생성 함수
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.profiles (id, email, name, role, marketing_agreed)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
        'user',
        false
    );
    RETURN NEW;
EXCEPTION
    WHEN others THEN
        -- 에러가 발생해도 사용자 생성은 계속되도록 함
        RAISE LOG 'Error creating profile for user %: %', NEW.id, SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 트리거 생성 (회원가입 시 자동 프로필 생성)
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ========================================
-- 6. updated_at 자동 업데이트 함수 및 트리거
-- ========================================

-- updated_at 자동 업데이트 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- updated_at 트리거 생성
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- 7. 기존 auth.users에 대한 프로필 생성 (선택사항)
-- ========================================

-- 기존에 가입한 사용자들 중 프로필이 없는 사용자들을 위한 프로필 생성
INSERT INTO public.profiles (id, email, name, role, marketing_agreed)
SELECT 
    auth_users.id,
    auth_users.email,
    COALESCE(auth_users.raw_user_meta_data->>'name', split_part(auth_users.email, '@', 1)) as name,
    'user' as role,
    false as marketing_agreed
FROM auth.users auth_users
LEFT JOIN public.profiles ON auth_users.id = public.profiles.id
WHERE public.profiles.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- ========================================
-- 8. 권한 설정
-- ========================================

-- anon 역할에게 profiles 테이블 접근 권한 부여 (RLS가 보안을 담당)
GRANT SELECT, INSERT, UPDATE ON TABLE public.profiles TO anon;
GRANT SELECT, INSERT, UPDATE ON TABLE public.profiles TO authenticated;

-- ========================================
-- 9. 완료 메시지
-- ========================================

DO $$
BEGIN
    RAISE NOTICE '✅ Profiles 테이블 수정 완료!';
    RAISE NOTICE '📋 실행된 작업:';
    RAISE NOTICE '   - RLS 정책 설정';
    RAISE NOTICE '   - 자동 프로필 생성 트리거 설정';
    RAISE NOTICE '   - 인덱스 생성';
    RAISE NOTICE '   - 기본값 설정';
    RAISE NOTICE '   - 기존 사용자 프로필 생성';
    RAISE NOTICE '🎉 이제 profiles 테이블이 정상적으로 작동합니다!';
END $$; 