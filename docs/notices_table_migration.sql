-- 공지사항 테이블에 이미지 지원 추가 마이그레이션
-- 실행일: 2024년 현재

-- 1. notices 테이블에 images 컬럼 추가
ALTER TABLE notices 
ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb;

-- 2. images 컬럼에 인덱스 추가 (검색 성능 향상)
CREATE INDEX IF NOT EXISTS idx_notices_images ON notices USING GIN(images);

-- 3. 이미지 데이터 구조 예시:
-- images 컬럼은 다음과 같은 JSON 배열 형태로 저장됩니다:
-- [
--   {
--     "id": "unique_image_id",
--     "url": "https://supabase-storage-url/image.jpg",
--     "filename": "original_filename.jpg",
--     "size": 1024576,
--     "alt": "이미지 설명",
--     "uploaded_at": "2024-01-01T00:00:00Z"
--   }
-- ]

-- 4. 검증 쿼리
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'notices' AND column_name = 'images'; 