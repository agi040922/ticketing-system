-- Users 테이블 외래키 및 제약조건 확인 스크립트

-- 1. users 테이블 구조 상세 확인
DO $$ 
BEGIN
    RAISE NOTICE '=== 1. Users 테이블 구조 확인 ===';
END $$;

SELECT 
    column_name as "컬럼명",
    data_type as "데이터타입",
    is_nullable as "NULL허용",
    column_default as "기본값"
FROM information_schema.columns 
WHERE table_name = 'users' AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. 외래키 제약조건 확인
DO $$ 
BEGIN
    RAISE NOTICE '=== 2. 외래키 제약조건 확인 ===';
END $$;

SELECT 
    tc.constraint_name as "제약조건명",
    tc.table_name as "테이블명",
    kcu.column_name as "컬럼명",
    ccu.table_name as "참조테이블",
    ccu.column_name as "참조컬럼"
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage ccu 
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
    AND tc.table_name = 'users'
    AND tc.table_schema = 'public';

-- 3. 모든 제약조건 확인
DO $$ 
BEGIN
    RAISE NOTICE '=== 3. 모든 제약조건 확인 ===';
END $$;

SELECT 
    constraint_name as "제약조건명",
    constraint_type as "제약조건타입"
FROM information_schema.table_constraints
WHERE table_name = 'users' AND table_schema = 'public';

-- 4. auth.users와 public.users 데이터 비교
DO $$ 
BEGIN
    RAISE NOTICE '=== 4. auth.users vs public.users 데이터 비교 ===';
END $$;

-- auth.users 사용자 수
SELECT COUNT(*) as "auth_users_수" FROM auth.users;

-- public.users 사용자 수  
SELECT COUNT(*) as "public_users_수" FROM public.users;

-- 일치하지 않는 ID 확인
SELECT 
    'auth에만 존재' as "상태",
    au.id,
    au.email
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL
LIMIT 5;

SELECT 
    'public에만 존재' as "상태", 
    pu.id,
    pu.email
FROM public.users pu
LEFT JOIN auth.users au ON pu.id = au.id
WHERE au.id IS NULL
LIMIT 5;

-- 5. 실제 users 테이블 데이터 확인
DO $$ 
BEGIN
    RAISE NOTICE '=== 5. 실제 users 테이블 데이터 확인 ===';
END $$;

SELECT 
    id,
    email,
    name,
    role,
    created_at
FROM public.users 
ORDER BY created_at DESC
LIMIT 5;

-- 6. 간단한 조회 테스트 (프론트엔드와 동일한 쿼리)
DO $$ 
BEGIN
    RAISE NOTICE '=== 6. 프론트엔드 쿼리 시뮬레이션 ===';
END $$;

-- 프론트엔드에서 사용하는 것과 동일한 쿼리
SELECT 
    id,
    email,
    name,
    phone,
    role,
    marketing_agreed,
    created_at,
    updated_at
FROM public.users 
ORDER BY created_at DESC; 