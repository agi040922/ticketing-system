-- =====================================================================
-- 사용자 시스템 데이터베이스 마이그레이션 스크립트
-- 작성일: 2024-12-29
-- 목적: 로그인/회원가입, 마이페이지, 쿠폰 시스템 구현을 위한 테이블 생성
-- =====================================================================

-- 1. 사용자 프로필 테이블 생성
-- =====================================================================
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT auth.uid(),
  email varchar(255) NOT NULL,
  name varchar(100) NOT NULL,
  phone varchar(20),
  birth_date date,
  gender varchar(10) CHECK (gender IN ('male', 'female', 'other')),
  role varchar(20) NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin', 'manager')),
  avatar_url text,
  marketing_agreed boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

-- 2. 쿠폰 마스터 테이블 생성
-- =====================================================================
CREATE TABLE IF NOT EXISTS coupons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(100) NOT NULL,
  code varchar(50) NOT NULL UNIQUE,
  type varchar(20) NOT NULL DEFAULT 'discount' CHECK (type IN ('discount', 'free_ticket', 'extra_time')),
  discount_type varchar(20) CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value integer,
  min_purchase_amount integer DEFAULT 0,
  max_discount_amount integer,
  usage_limit integer,
  used_count integer NOT NULL DEFAULT 0,
  valid_from timestamp with time zone NOT NULL,
  valid_until timestamp with time zone NOT NULL,
  status varchar(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'expired')),
  description text,
  created_by uuid REFERENCES profiles(id),
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

-- 3. 사용자별 쿠폰 테이블 생성
-- =====================================================================
CREATE TABLE IF NOT EXISTS user_coupons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  coupon_id uuid NOT NULL REFERENCES coupons(id) ON DELETE CASCADE,
  order_id text REFERENCES orders(id),
  status varchar(20) NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'used', 'expired')),
  used_at timestamp with time zone,
  received_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  expires_at timestamp with time zone
);

-- 4. 사용자 활동 로그 테이블 생성
-- =====================================================================
CREATE TABLE IF NOT EXISTS user_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  activity_type varchar(50) NOT NULL,
  description text,
  metadata jsonb DEFAULT '{}',
  ip_address inet,
  user_agent text,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

-- 5. 기존 테이블 수정
-- =====================================================================

-- 5.1 orders 테이블 수정 (사용자 연결 및 쿠폰 정보 추가)
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS coupon_id uuid REFERENCES coupons(id),
ADD COLUMN IF NOT EXISTS discount_amount integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS original_amount integer;

-- customer_id를 UUID로 변경 (기존 데이터가 UUID 형식이 아닐 경우를 대비)
-- 먼저 새 컬럼 추가
ALTER TABLE orders ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES profiles(id);

-- 5.2 order_items 테이블 수정 (QR 코드 정보 추가)
ALTER TABLE order_items 
ADD COLUMN IF NOT EXISTS unique_code varchar(100) UNIQUE,
ADD COLUMN IF NOT EXISTS qr_image_url text;

-- 6. 인덱스 생성
-- =====================================================================

-- profiles 테이블 인덱스
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON profiles(created_at DESC);

-- coupons 테이블 인덱스
CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);
CREATE INDEX IF NOT EXISTS idx_coupons_status ON coupons(status);
CREATE INDEX IF NOT EXISTS idx_coupons_valid_until ON coupons(valid_until);
CREATE INDEX IF NOT EXISTS idx_coupons_type ON coupons(type);

-- user_coupons 테이블 인덱스
CREATE INDEX IF NOT EXISTS idx_user_coupons_user_id ON user_coupons(user_id);
CREATE INDEX IF NOT EXISTS idx_user_coupons_coupon_id ON user_coupons(coupon_id);
CREATE INDEX IF NOT EXISTS idx_user_coupons_status ON user_coupons(status);
CREATE INDEX IF NOT EXISTS idx_user_coupons_expires_at ON user_coupons(expires_at);

-- user_activities 테이블 인덱스
CREATE INDEX IF NOT EXISTS idx_user_activities_user_id ON user_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activities_type ON user_activities(activity_type);
CREATE INDEX IF NOT EXISTS idx_user_activities_created_at ON user_activities(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_activities_metadata ON user_activities USING GIN(metadata);

-- orders 테이블 인덱스 (기존에 추가)
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_coupon_id ON orders(coupon_id);

-- 7. 기본 권한 설정 (RLS 대신 코드 레벨에서 보안 처리)
-- =====================================================================

-- authenticated 역할에 필요한 권한 부여
GRANT SELECT, INSERT, UPDATE ON profiles TO authenticated;
GRANT SELECT ON coupons TO authenticated;
GRANT SELECT, INSERT, UPDATE ON user_coupons TO authenticated;
GRANT SELECT, INSERT ON user_activities TO authenticated;
GRANT SELECT, UPDATE ON orders TO authenticated;
GRANT SELECT, UPDATE ON order_items TO authenticated;

-- anon 역할에는 제한적 권한만 부여
GRANT SELECT ON coupons TO anon;

-- 8. 트리거 함수 생성
-- =====================================================================

-- 8.1 사용자 등록 시 profiles 자동 생성 함수
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (new.id, new.email, COALESCE(new.raw_user_meta_data->>'name', new.email));
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8.2 트리거 생성 (사용자 등록 시 profiles 자동 생성)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 8.3 updated_at 자동 업데이트 함수
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 8.4 profiles 테이블에 updated_at 트리거 적용
DROP TRIGGER IF EXISTS profiles_updated_at ON profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- 8.5 쿠폰 사용 시 used_count 자동 증가 함수
CREATE OR REPLACE FUNCTION public.handle_coupon_usage()
RETURNS trigger AS $$
BEGIN
  IF NEW.status = 'used' AND OLD.status != 'used' THEN
    UPDATE coupons 
    SET used_count = used_count + 1 
    WHERE id = NEW.coupon_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 8.6 user_coupons 테이블에 쿠폰 사용 트리거 적용
DROP TRIGGER IF EXISTS user_coupons_usage ON user_coupons;
CREATE TRIGGER user_coupons_usage
  AFTER UPDATE ON user_coupons
  FOR EACH ROW EXECUTE PROCEDURE public.handle_coupon_usage();

-- 9. 샘플 데이터 삽입 (선택사항)
-- =====================================================================

-- 9.1 관리자 계정 생성을 위한 샘플 프로필 (실제 auth.users에 있는 사용자의 UUID 사용)
-- INSERT INTO profiles (id, email, name, role) 
-- VALUES ('admin-uuid-here', 'admin@example.com', '관리자', 'admin');

-- 9.2 샘플 쿠폰 생성
INSERT INTO coupons (name, code, type, discount_type, discount_value, min_purchase_amount, valid_from, valid_until, description)
VALUES 
  ('신규가입 할인쿠폰', 'WELCOME10', 'discount', 'percentage', 10, 10000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '30 days', '신규 가입자를 위한 10% 할인 쿠폰'),
  ('어린이날 특가', 'KIDS2024', 'discount', 'fixed', 5000, 20000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '7 days', '어린이날 기념 5,000원 할인'),
  ('VIP 무료이용권', 'VIP_FREE', 'free_ticket', null, null, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '90 days', 'VIP 회원 무료 이용권')
ON CONFLICT (code) DO NOTHING;

-- 10. 권한 설정
-- =====================================================================

-- authenticated 역할에 필요한 권한 부여
GRANT SELECT, INSERT, UPDATE ON profiles TO authenticated;
GRANT SELECT ON coupons TO authenticated;
GRANT SELECT, INSERT, UPDATE ON user_coupons TO authenticated;
GRANT SELECT, INSERT ON user_activities TO authenticated;

-- anon 역할에는 제한적 권한만 부여
GRANT SELECT ON coupons TO anon;

-- =====================================================================
-- 마이그레이션 완료
-- =====================================================================

-- 확인 쿼리 (선택사항)
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'coupons', 'user_coupons', 'user_activities')
ORDER BY table_name, ordinal_position;

-- 인덱스 확인
SELECT 
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes 
WHERE schemaname = 'public' 
AND tablename IN ('profiles', 'coupons', 'user_coupons', 'user_activities', 'orders', 'order_items')
ORDER BY tablename, indexname;