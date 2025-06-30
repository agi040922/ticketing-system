-- 테스트용 사용자 생성 스크립트
-- 로그인/회원가입 테스트를 위한 샘플 데이터

-- 기존 테스트 사용자 삭제 (있다면)
DELETE FROM users WHERE email LIKE '%test%' OR email LIKE '%example%';

-- 테스트 사용자들 생성
INSERT INTO users (id, email, name, phone, role, marketing_agreed) VALUES
  (
    '11111111-1111-1111-1111-111111111111',
    'test1@example.com',
    '테스트유저1',
    '010-1111-1111',
    'user',
    false
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'test2@example.com',
    '테스트유저2',
    '010-2222-2222',
    'user',
    true
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    'admin@example.com',
    '관리자',
    '010-3333-3333',
    'admin',
    false
  ),
  (
    '44444444-4444-4444-4444-444444444444',
    'manager@example.com',
    '매니저',
    '010-4444-4444',
    'manager',
    true
  )
ON CONFLICT (id) DO NOTHING;

-- 생성된 사용자 확인
SELECT 
  id,
  email,
  name,
  phone,
  role,
  marketing_agreed,
  created_at
FROM users 
WHERE email IN ('test1@example.com', 'test2@example.com', 'admin@example.com', 'manager@example.com')
ORDER BY created_at DESC;

-- 통계 확인
SELECT 
  role,
  COUNT(*) as "사용자수",
  COUNT(CASE WHEN marketing_agreed THEN 1 END) as "마케팅동의수"
FROM users 
GROUP BY role 
ORDER BY role; 