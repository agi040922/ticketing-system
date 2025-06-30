-- 단순한 users 테이블 생성 스크립트
-- profiles 테이블을 완전히 제거하고 새로운 users 테이블로 교체
-- 트리거, RLS 등 복잡한 기능 없이 단순하게 구성

-- 1단계: 기존 profiles 관련 모든 것 삭제
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS set_updated_at ON profiles;
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- 외래키 제약조건이 있는 테이블들 확인 및 임시 제거
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_user_id_fkey;
ALTER TABLE user_coupons DROP CONSTRAINT IF EXISTS user_coupons_user_id_fkey;
ALTER TABLE user_activities DROP CONSTRAINT IF EXISTS user_activities_user_id_fkey;

-- 기존 profiles 테이블 완전 삭제
DROP TABLE IF EXISTS profiles CASCADE;

-- 2단계: 새로운 users 테이블 생성 (단순한 구조)
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    phone TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'manager', 'user')),
    marketing_agreed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3단계: 기본 인덱스 생성
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_created_at ON users(created_at);

-- 4단계: 권한 설정 (RLS 없이 단순하게)
GRANT ALL ON users TO authenticated;
GRANT SELECT ON users TO anon;

-- 5단계: 외래키 관계 복원 (users 테이블로)
ALTER TABLE orders 
ADD CONSTRAINT orders_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE user_coupons 
ADD CONSTRAINT user_coupons_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE user_activities 
ADD CONSTRAINT user_activities_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- 6단계: 샘플 데이터 (선택사항)
-- 현재 auth.users에 있는사용자들을 위한 기본 users 레코드 생성
INSERT INTO users (id, email, name, role)
SELECT 
    au.id,
    au.email,
    COALESCE(au.raw_user_meta_data->>'name', au.email) as name,
    'user' as role
FROM auth.users au
WHERE NOT EXISTS (SELECT 1 FROM users u WHERE u.id = au.id)
ON CONFLICT (id) DO NOTHING;

-- 완료 메시지
SELECT 'users 테이블 생성 완료!' as status; 