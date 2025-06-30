import { createClient } from '@supabase/supabase-js';
import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * 클라이언트 측에서 사용할 Supabase 클라이언트 (SSR 지원)
 * @supabase/ssr을 사용하여 브라우저 환경에서 안전하게 사용
 */
export function createSupabaseClient() {
  return createBrowserClient(supabaseUrl, supabaseKey, {
    realtime: {
      // Realtime 연결 최적화
      params: {
        eventsPerSecond: 10,
      },
    },
  });
}

/**
 * 기본 Supabase 클라이언트 (호환성 유지)
 * 웹팩 경고를 줄이기 위해 최적화된 설정 적용
 */
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    // Realtime 연결 최적화
    params: {
      eventsPerSecond: 10,
    },
  },
});

/**
 * Realtime 기능 없이 사용할 경우를 위한 클라이언트
 * 웹팩 경고를 완전히 피하고 싶을 때 사용
 */
export const supabaseWithoutRealtime = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  // Realtime을 완전히 비활성화
  realtime: {
    transport: 'websocket',
    timeout: 20000,
  },
});

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
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    // 서버에서는 Realtime 불필요
    realtime: {
      transport: 'websocket',
      timeout: 20000,
    },
  });
} 