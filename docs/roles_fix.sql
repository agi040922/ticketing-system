-- ========================================
-- 🔧 Database Roles 권한 수정 스크립트
-- ========================================
-- anon과 authenticated 역할의 권한을 올바르게 설정합니다.

-- ========================================
-- 1. 현재 상태 확인
-- ========================================

DO $$
BEGIN
    RAISE NOTICE '=== Database Roles 권한 수정 시작 ===';
    RAISE NOTICE '현재 연결된 역할: %', current_user;
    RAISE NOTICE 'auth.uid(): %', COALESCE(auth.uid()::text, 'NULL');
END $$;

-- ========================================
-- 2. 기본 스키마 권한 부여
-- ========================================

-- public 스키마 사용 권한
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- auth 스키마 함수 접근 권한 (매우 중요!)
GRANT EXECUTE ON FUNCTION auth.uid() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION auth.role() TO anon, authenticated;

DO $$
BEGIN
    RAISE NOTICE '✅ 기본 스키마 권한 부여 완료';
END $$;

-- ========================================
-- 3. anon 역할 권한 설정 (비로그인 사용자)
-- ========================================

-- profiles 테이블 - 조회만 가능 (RLS 정책에 의해 제한됨)
GRANT SELECT ON public.profiles TO anon;

-- notices 테이블 - 공개 정보 조회 가능
GRANT SELECT ON public.notices TO anon;

-- orders, order_items - 보안상 접근 불가 (명시적으로 권한 제거)
REVOKE ALL ON public.orders FROM anon;
REVOKE ALL ON public.order_items FROM anon;

DO $$
BEGIN
    RAISE NOTICE '✅ anon 역할 권한 설정 완료';
END $$;

-- ========================================
-- 4. authenticated 역할 권한 설정 (로그인 사용자)
-- ========================================

-- profiles 테이블 - 모든 권한 (RLS로 자신의 것만 접근)
GRANT ALL ON public.profiles TO authenticated;

-- orders 테이블 - 모든 권한 (주문 생성/조회/수정)
GRANT ALL ON public.orders TO authenticated;

-- order_items 테이블 - 모든 권한 (티켓 관리)
GRANT ALL ON public.order_items TO authenticated;

-- notices 테이블 - 조회 권한 (공지사항 읽기)
GRANT SELECT ON public.notices TO authenticated;

-- scan_logs 테이블 - 조회 권한 (스캔 기록 확인)
GRANT SELECT ON public.scan_logs TO authenticated;

-- 쿠폰 관련 테이블들
GRANT SELECT ON public.coupons TO authenticated;
GRANT ALL ON public.user_coupons TO authenticated;
GRANT ALL ON public.user_activities TO authenticated;

DO $$
BEGIN
    RAISE NOTICE '✅ authenticated 역할 권한 설정 완료';
END $$;

-- ========================================
-- 5. 시퀀스 권한 설정
-- ========================================

-- order_items_id_seq 권한 (새 티켓 생성시 필요)
GRANT USAGE, SELECT ON SEQUENCE order_items_id_seq TO authenticated;

-- scan_logs_id_seq 권한 (스캔 로그 생성시 필요)  
GRANT USAGE, SELECT ON SEQUENCE scan_logs_id_seq TO authenticated;

-- notices_id_seq 권한 (관리자 공지 생성시 필요)
GRANT USAGE, SELECT ON SEQUENCE notices_id_seq TO authenticated;

DO $$
BEGIN
    RAISE NOTICE '✅ 시퀀스 권한 설정 완료';
END $$;

-- ========================================
-- 6. 역할 상속 관계 확인 및 수정
-- ========================================

-- authenticator 역할이 anon과 authenticated를 상속하는지 확인
DO $$
BEGIN
    -- anon 역할을 authenticator에 부여
    IF NOT EXISTS (
        SELECT 1 FROM pg_auth_members am
        JOIN pg_roles r1 ON am.member = r1.oid
        JOIN pg_roles r2 ON am.roleid = r2.oid
        WHERE r1.rolname = 'authenticator' AND r2.rolname = 'anon'
    ) THEN
        EXECUTE 'GRANT anon TO authenticator';
        RAISE NOTICE '✅ anon 역할을 authenticator에 부여';
    ELSE
        RAISE NOTICE '✅ anon 역할 이미 authenticator에 부여됨';
    END IF;

    -- authenticated 역할을 authenticator에 부여
    IF NOT EXISTS (
        SELECT 1 FROM pg_auth_members am
        JOIN pg_roles r1 ON am.member = r1.oid
        JOIN pg_roles r2 ON am.roleid = r2.oid
        WHERE r1.rolname = 'authenticator' AND r2.rolname = 'authenticated'
    ) THEN
        EXECUTE 'GRANT authenticated TO authenticator';
        RAISE NOTICE '✅ authenticated 역할을 authenticator에 부여';
    ELSE
        RAISE NOTICE '✅ authenticated 역할 이미 authenticator에 부여됨';
    END IF;
END $$;

-- ========================================
-- 7. RLS 정책 활성화 확인
-- ========================================

-- profiles 테이블 RLS 확인
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename = 'profiles' 
        AND rowsecurity = true
    ) THEN
        EXECUTE 'ALTER TABLE profiles ENABLE ROW LEVEL SECURITY';
        RAISE NOTICE '✅ profiles 테이블 RLS 활성화';
    ELSE
        RAISE NOTICE '✅ profiles 테이블 RLS 이미 활성화됨';
    END IF;
END $$;

-- ========================================
-- 8. 권한 설정 검증
-- ========================================

-- anon 권한 검증
SELECT 
    '🔍 anon 권한 검증' as check_type,
    table_name,
    privilege_type
FROM information_schema.table_privileges 
WHERE grantee = 'anon' 
AND table_schema = 'public'
ORDER BY table_name, privilege_type;

-- authenticated 권한 검증
SELECT 
    '🔍 authenticated 권한 검증' as check_type,
    table_name,
    privilege_type
FROM information_schema.table_privileges 
WHERE grantee = 'authenticated' 
AND table_schema = 'public'
ORDER BY table_name, privilege_type;

-- ========================================
-- 9. auth.uid() 함수 테스트
-- ========================================

DO $$
DECLARE
    current_uid UUID;
BEGIN
    SELECT auth.uid() INTO current_uid;
    
    IF current_uid IS NULL THEN
        RAISE NOTICE '⚠️ auth.uid() = NULL (정상 - SQL Editor에서는 인증되지 않은 상태)';
    ELSE
        RAISE NOTICE '✅ auth.uid() = % (인증된 사용자)', current_uid;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE '❌ auth.uid() 함수 접근 실패: %', SQLERRM;
END $$;

-- ========================================
-- 10. 최종 결과 확인
-- ========================================

DO $$
BEGIN
    RAISE NOTICE '=== 🎉 Database Roles 권한 수정 완료! ===';
    RAISE NOTICE '다음 단계:';
    RAISE NOTICE '1. Auth 테스트 페이지에서 로그인 재시도';
    RAISE NOTICE '2. 브라우저 개발자 도구 콘솔에서 에러 메시지 확인';
    RAISE NOTICE '3. Supabase Dashboard > Database > Roles에서 connections 확인';
END $$;

-- 최종 성공 메시지
SELECT 
    '🎊 Database Roles 권한 수정 완료!' as result,
    'Auth 테스트 페이지에서 다시 로그인해보세요!' as next_step,
    'authenticated 역할 connections이 0에서 증가하는지 확인하세요!' as monitoring; 