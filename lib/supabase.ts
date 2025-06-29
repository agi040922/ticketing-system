import { createClient } from '@supabase/supabase-js';
import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * 클라이언트 측에서 사용할 Supabase 클라이언트 (SSR 지원)
 * @supabase/ssr을 사용하여 브라우저 환경에서 안전하게 사용
 */
export function createSupabaseClient() {
  return createBrowserClient(supabaseUrl, supabaseKey);
}

/**
 * 기본 Supabase 클라이언트 (호환성 유지)
 */
export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * 디폴트 export (주로 사용)
 */
export default supabase;

/**
 * 서버 사이드에서 사용할 Supabase 클라이언트 (Service Role Key 사용)
 * 관리자 권한이 필요한 작업에 사용됩니다.
 */
export function createSupabaseServerClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(supabaseUrl, serviceRoleKey);
} 