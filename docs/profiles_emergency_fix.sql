-- ========================================
-- 🚨 Profiles 테이블 긴급 수정 스크립트
-- ========================================
-- Supabase SQL Editor에서 실행하세요.
-- 현재 데이터를 보존하면서 문제를 해결합니다.

-- ========================================
-- 1. 현재 상태 확인
-- ========================================

DO $$
BEGIN
    RAISE NOTICE '=== 현재 상태 확인 ===';
    RAISE NOTICE 'Auth 사용자 수: %', (SELECT COUNT(*) FROM auth.users);
    RAISE NOTICE 'Profiles 수: %', (SELECT COUNT(*) FROM profiles);
    RAISE NOTICE 'RLS 활성화: %', (SELECT rowsecurity FROM pg_tables WHERE schemaname = 'public' AND tablename = 'profiles');
END $$;

-- ========================================
-- 2. 기존 정책/트리거 정리
-- ========================================

-- 기존 RLS 정책 삭제
DROP POLICY IF EXISTS "profiles_select_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_insert_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_admin_policy" ON profiles;

-- 기존 트리거 삭제
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS profiles_updated_at_trigger ON profiles;

-- 기존 함수 삭제
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.update_updated_at_column();

-- ========================================
-- 3. 테이블 구조 확인 및 수정
-- ========================================

-- profiles 테이블이 없으면 생성
CREATE TABLE IF NOT EXISTS public.profiles (
    id uuid NOT NULL DEFAULT auth.uid(),
    email character varying NOT NULL,
    name character varying NOT NULL,
    phone character varying,
    birth_date date,
    gender character varying CHECK (gender::text = ANY (ARRAY['male'::character varying, 'female'::character varying, 'other'::character varying]::text[])),
    role character varying NOT NULL DEFAULT 'user'::character varying CHECK (role::text = ANY (ARRAY['user'::character varying, 'admin'::character varying, 'manager'::character varying]::text[])),
    avatar_url text,
    marketing_agreed boolean NOT NULL DEFAULT false,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT profiles_pkey PRIMARY KEY (id)
);

-- 필수 인덱스 생성
CREATE INDEX IF NOT EXISTS profiles_email_idx ON profiles(email);
CREATE INDEX IF NOT EXISTS profiles_role_idx ON profiles(role);
CREATE INDEX IF NOT EXISTS profiles_created_at_idx ON profiles(created_at);

-- ========================================
-- 4. RLS 활성화 및 정책 생성
-- ========================================

-- RLS 활성화
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 1) 일반 사용자: 자신의 프로필만 조회 가능
CREATE POLICY "profiles_select_policy" ON profiles
    FOR SELECT USING (auth.uid() = id);

-- 2) 일반 사용자: 자신의 프로필만 수정 가능
CREATE POLICY "profiles_update_policy" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- 3) 새 프로필 생성 허용 (트리거에서 사용)
CREATE POLICY "profiles_insert_policy" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- 4) 관리자: 모든 프로필 접근 가능
CREATE POLICY "profiles_admin_policy" ON profiles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'manager')
        )
    );

-- ========================================
-- 5. 자동 프로필 생성 함수
-- ========================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.profiles (id, email, name, role, marketing_agreed)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
        'user',
        COALESCE((NEW.raw_user_meta_data->>'marketing_agreed')::boolean, false)
    );
    RETURN NEW;
EXCEPTION
    WHEN unique_violation THEN
        -- 이미 존재하는 경우 무시
        RETURN NEW;
    WHEN OTHERS THEN
        -- 기타 오류 발생 시 로그 출력하고 계속 진행
        RAISE WARNING '프로필 생성 실패: %', SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================================
-- 6. updated_at 자동 업데이트 함수
-- ========================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- 7. 트리거 생성
-- ========================================

-- 새 사용자 가입 시 프로필 자동 생성
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- profiles 테이블 업데이트 시 updated_at 자동 갱신
CREATE TRIGGER profiles_updated_at_trigger
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ========================================
-- 8. 기존 auth.users와 누락된 profiles 생성
-- ========================================

-- 기존 사용자 중 프로필이 없는 경우 생성
INSERT INTO public.profiles (id, email, name, role, marketing_agreed)
SELECT 
    au.id,
    au.email,
    COALESCE(au.raw_user_meta_data->>'name', au.email),
    'user',
    COALESCE((au.raw_user_meta_data->>'marketing_agreed')::boolean, false)
FROM auth.users au
LEFT JOIN profiles p ON au.id = p.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- ========================================
-- 9. 권한 설정
-- ========================================

-- anon과 authenticated 사용자에게 필요한 권한 부여
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.profiles TO authenticated;
GRANT SELECT ON public.profiles TO anon;

-- ========================================
-- 10. 결과 확인
-- ========================================

DO $$
BEGIN
    RAISE NOTICE '=== 수정 완료 후 상태 ===';
    RAISE NOTICE 'Auth 사용자 수: %', (SELECT COUNT(*) FROM auth.users);
    RAISE NOTICE 'Profiles 수: %', (SELECT COUNT(*) FROM profiles);
    RAISE NOTICE '누락된 프로필: %', (
        SELECT COUNT(*) 
        FROM auth.users au 
        LEFT JOIN profiles p ON au.id = p.id 
        WHERE p.id IS NULL
    );
    RAISE NOTICE 'RLS 정책 수: %', (
        SELECT COUNT(*) 
        FROM pg_policies 
        WHERE schemaname = 'public' AND tablename = 'profiles'
    );
    RAISE NOTICE 'Profiles 트리거 수: %', (
        SELECT COUNT(*) 
        FROM information_schema.triggers 
        WHERE event_object_table = 'profiles'
    );
    RAISE NOTICE 'Auth 트리거 수: %', (
        SELECT COUNT(*) 
        FROM information_schema.triggers 
        WHERE event_object_table = 'users' AND trigger_schema = 'public'
    );
END $$;

-- ========================================
-- 완료!
-- ========================================

SELECT '✅ Profiles 긴급 수정 완료!' as result, 
       '테스트 페이지에서 다시 로그인해보세요.' as message; 