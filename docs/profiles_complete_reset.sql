-- ========================================
-- 🔥 Profiles 테이블 완전 삭제 후 재생성
-- ========================================
-- 모든 것을 깨끗하게 지우고 처음부터 다시 만듭니다.
-- ⚠️ 주의: 기존 profiles 데이터가 모두 삭제됩니다!

-- ========================================
-- 1. 기존 데이터 현황 확인 (삭제 전 마지막 확인)
-- ========================================

DO $$
BEGIN
    RAISE NOTICE '=== 삭제 전 현황 ===';
    RAISE NOTICE 'Auth 사용자 수: %', (SELECT COUNT(*) FROM auth.users);
    RAISE NOTICE '현재 Profiles 수: %', (SELECT COUNT(*) FROM profiles);
    RAISE NOTICE '곧 모든 profiles 데이터가 삭제됩니다!';
END $$;

-- ========================================
-- 2. 외래키 의존성 확인 및 정리
-- ========================================

-- 다른 테이블에서 profiles를 참조하는 외래키 확인
SELECT 
    '🔗 외래키 의존성 확인' as check_type,
    tc.table_name as referencing_table,
    kcu.column_name as referencing_column,
    tc.constraint_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage ccu 
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
AND ccu.table_name = 'profiles'
AND tc.table_schema = 'public';

-- orders 테이블의 외래키 제약조건 임시 삭제 (있다면)
ALTER TABLE IF EXISTS orders DROP CONSTRAINT IF EXISTS orders_user_id_fkey;
ALTER TABLE IF EXISTS user_coupons DROP CONSTRAINT IF EXISTS user_coupons_user_id_fkey;
ALTER TABLE IF EXISTS user_activities DROP CONSTRAINT IF EXISTS user_activities_user_id_fkey;
ALTER TABLE IF EXISTS coupons DROP CONSTRAINT IF EXISTS coupons_created_by_fkey;

-- ========================================
-- 3. 기존 모든 것 완전 삭제
-- ========================================

-- RLS 정책 삭제
DROP POLICY IF EXISTS "profiles_select_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_insert_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_admin_policy" ON profiles;

-- 트리거 삭제
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS profiles_updated_at_trigger ON profiles;

-- 함수 삭제 (CASCADE로 의존성 함께 삭제)
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;

-- 인덱스 삭제 (테이블과 함께 삭제되지만 명시적으로)
DROP INDEX IF EXISTS profiles_email_idx;
DROP INDEX IF EXISTS profiles_role_idx;
DROP INDEX IF EXISTS profiles_created_at_idx;

-- 🔥 테이블 완전 삭제
DROP TABLE IF EXISTS public.profiles CASCADE;

DO $$
BEGIN
    RAISE NOTICE '✅ 기존 profiles 관련 모든 것이 삭제되었습니다!';
END $$;

-- ========================================
-- 4. 새로운 Profiles 테이블 생성
-- ========================================

CREATE TABLE public.profiles (
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

-- 테이블 생성 확인
DO $$
BEGIN
    RAISE NOTICE '✅ 새로운 profiles 테이블이 생성되었습니다!';
END $$;

-- ========================================
-- 5. 필수 인덱스 생성
-- ========================================

CREATE INDEX profiles_email_idx ON profiles(email);
CREATE INDEX profiles_role_idx ON profiles(role);
CREATE INDEX profiles_created_at_idx ON profiles(created_at);
CREATE INDEX profiles_phone_idx ON profiles(phone) WHERE phone IS NOT NULL;

DO $$
BEGIN
    RAISE NOTICE '✅ 인덱스 생성 완료!';
END $$;

-- ========================================
-- 6. RLS 활성화 및 정책 생성
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

DO $$
BEGIN
    RAISE NOTICE '✅ RLS 정책 생성 완료!';
END $$;

-- ========================================
-- 7. 자동 프로필 생성 함수 생성
-- ========================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.profiles (id, email, name, role, marketing_agreed)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(
            NEW.raw_user_meta_data->>'name',
            NEW.raw_user_meta_data->>'full_name',
            SPLIT_PART(NEW.email, '@', 1),
            '새 사용자'
        ),
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
        RAISE WARNING '새 사용자 프로필 생성 실패: %', SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================================
-- 8. updated_at 자동 업데이트 함수 생성
-- ========================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
    RAISE NOTICE '✅ 함수들 생성 완료!';
END $$;

-- ========================================
-- 9. 트리거 생성
-- ========================================

-- 새 사용자 가입 시 프로필 자동 생성
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- profiles 테이블 업데이트 시 updated_at 자동 갱신
CREATE TRIGGER profiles_updated_at_trigger
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DO $$
BEGIN
    RAISE NOTICE '✅ 트리거 생성 완료!';
END $$;

-- ========================================
-- 10. 기존 auth.users에 대한 프로필 자동 생성
-- ========================================

INSERT INTO public.profiles (id, email, name, role, marketing_agreed)
SELECT 
    au.id,
    au.email,
    COALESCE(
        au.raw_user_meta_data->>'name',
        au.raw_user_meta_data->>'full_name',
        SPLIT_PART(au.email, '@', 1),
        '기존 사용자'
    ),
    'user',
    COALESCE((au.raw_user_meta_data->>'marketing_agreed')::boolean, false)
FROM auth.users au
ON CONFLICT (id) DO NOTHING;

-- ========================================
-- 11. 권한 설정
-- ========================================

-- anon과 authenticated 사용자에게 필요한 권한 부여
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.profiles TO authenticated;
GRANT SELECT ON public.profiles TO anon;

DO $$
BEGIN
    RAISE NOTICE '✅ 권한 설정 완료!';
END $$;

-- ========================================
-- 12. 외래키 제약조건 복원
-- ========================================

-- 다른 테이블들과의 관계 복원
ALTER TABLE IF EXISTS orders 
ADD CONSTRAINT orders_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id);

ALTER TABLE IF EXISTS user_coupons 
ADD CONSTRAINT user_coupons_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id);

ALTER TABLE IF EXISTS user_activities 
ADD CONSTRAINT user_activities_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id);

ALTER TABLE IF EXISTS coupons 
ADD CONSTRAINT coupons_created_by_fkey 
FOREIGN KEY (created_by) REFERENCES public.profiles(id);

DO $$
BEGIN
    RAISE NOTICE '✅ 외래키 제약조건 복원 완료!';
END $$;

-- ========================================
-- 13. 최종 결과 확인
-- ========================================

DO $$
BEGIN
    RAISE NOTICE '=== 🎉 완전 재생성 완료! ===';
    RAISE NOTICE 'Auth 사용자 수: %', (SELECT COUNT(*) FROM auth.users);
    RAISE NOTICE '새로운 Profiles 수: %', (SELECT COUNT(*) FROM profiles);
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
        WHERE event_object_table = 'users' 
        AND trigger_schema = 'public'
    );
END $$;

-- ========================================
-- 14. 다른 테이블 트리거 복원 (CASCADE로 삭제된 것들)
-- ========================================

-- notices 테이블의 updated_at 트리거 복원 (CASCADE로 삭제되었을 수 있음)
DROP TRIGGER IF EXISTS update_notices_updated_at ON notices;
CREATE TRIGGER update_notices_updated_at
    BEFORE UPDATE ON notices
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DO $$
BEGIN
    RAISE NOTICE '✅ 다른 테이블 트리거 복원 완료!';
END $$;

-- ========================================
-- 완료!
-- ========================================

SELECT 
    '🎉 Profiles 테이블 완전 재생성 완료!' as result,
    'Auth 테스트 페이지에서 로그인을 다시 시도해보세요!' as message,
    '새로운 사용자가 가입하면 자동으로 프로필이 생성됩니다.' as note; 