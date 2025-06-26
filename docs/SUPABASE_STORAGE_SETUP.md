# 📸 Supabase Storage 설정 가이드

공지사항 이미지 업로드 기능을 위한 Supabase Storage 설정 방법입니다.

## 1단계: Storage 버킷 생성

### Supabase 대시보드에서 설정

1. **Supabase 대시보드 접속**
   - https://supabase.com/dashboard 접속
   - 프로젝트 선택

2. **Storage 메뉴 접속**
   - 좌측 메뉴에서 `Storage` 클릭
   - `Buckets` 탭 선택

3. **새 버킷 생성**
   - `New bucket` 버튼 클릭
   - **Bucket name**: `images`
   - **Public bucket**: ✅ 체크 (공개 접근 허용)
   - `Create bucket` 클릭

## 2단계: 보안 정책 설정

### RLS (Row Level Security) 정책 생성

Storage > Policies 탭에서 다음 정책들을 추가하세요:

```sql
-- 1. 공개 읽기 정책 (모든 사용자가 이미지를 볼 수 있음)
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'images');

-- 2. 관리자만 업로드 정책 (필요시 인증 로직 추가)
CREATE POLICY "Admin Upload" ON storage.objects
FOR INSERT TO public
WITH CHECK (bucket_id = 'images');

-- 3. 관리자만 삭제 정책 (필요시 인증 로직 추가)
CREATE POLICY "Admin Delete" ON storage.objects
FOR DELETE TO public
USING (bucket_id = 'images');
```

## 3단계: 환경 변수 확인

`.env.local` 파일에 다음 환경 변수가 설정되어 있는지 확인하세요:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 4단계: 데이터베이스 마이그레이션 실행

`docs/notices_table_migration.sql` 파일의 내용을 Supabase SQL Editor에서 실행하세요:

```sql
-- notices 테이블에 images 컬럼 추가
ALTER TABLE notices 
ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb;

-- 인덱스 추가
CREATE INDEX IF NOT EXISTS idx_notices_images ON notices USING GIN(images);
```

## 5단계: 테스트

1. **관리자 페이지 접속**
   - `/admin/notices/create` 페이지 방문
   - 이미지 업로드 섹션이 표시되는지 확인

2. **이미지 업로드 테스트**
   - 5MB 이하의 이미지 파일 업로드
   - 업로드된 이미지가 미리보기에 표시되는지 확인

3. **공지사항 작성 및 확인**
   - 이미지가 포함된 공지사항 작성
   - 사용자 페이지에서 이미지 갤러리가 표시되는지 확인

## 🔧 문제 해결

### 업로드 실패 시

1. **Bucket 권한 확인**
   - Storage > Buckets에서 `images` 버킷이 Public인지 확인
   - Policies가 올바르게 설정되었는지 확인

2. **환경 변수 확인**
   - `SUPABASE_SERVICE_ROLE_KEY`가 올바른지 확인
   - 서버 재시작 후 다시 시도

3. **파일 크기/형식 확인**
   - 파일 크기가 5MB 이하인지 확인
   - 지원 형식: JPEG, PNG, WebP, GIF

### 이미지 표시 안됨

1. **URL 확인**
   - Storage에서 업로드된 파일의 Public URL이 올바른지 확인
   - 브라우저에서 직접 URL 접속해보기

2. **CORS 설정**
   - 필요시 Supabase에서 CORS 설정 확인

## 📚 추가 참고자료

- [Supabase Storage 공식 문서](https://supabase.com/docs/guides/storage)
- [Storage Security 가이드](https://supabase.com/docs/guides/storage/security/access-control)
- [이미지 최적화 가이드](https://supabase.com/docs/guides/storage/image-transformations) 