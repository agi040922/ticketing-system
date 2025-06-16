import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Supabase 클라이언트를 생성하는 함수
 * 환경변수에서 URL과 익명 키를 가져와 클라이언트를 초기화합니다.
 */
export function createSupabaseClient() {
  return createClient(supabaseUrl, supabaseKey);
}

/**
 * 서버 사이드에서 사용할 Supabase 클라이언트 (Service Role Key 사용)
 * 관리자 권한이 필요한 작업에 사용됩니다.
 */
export function createSupabaseServerClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(supabaseUrl, serviceRoleKey);
} 