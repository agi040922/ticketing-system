## Supabase Auth 꿀팁: 토큰 문제 해결 및 활용

Supabase 인증(Auth) 기능을 사용하시면서 로그인/회원가입은 되는데 페이지에서 토큰을 못 찾는 것 같다고 하셨네요. 이 문제는 토큰 저장 방식, 클라이언트 측에서 토큰을 접근하는 방식, 그리고 라우팅 보호 설정 등 여러 가지 원인으로 발생할 수 있습니다. 아래에서 토큰 확인 및 전반적인 Supabase Auth 활용 꿀팁을 상세히 알려드리겠습니다.

-----

### 1\. 토큰 확인 및 문제 해결 팁

가장 먼저 토큰이 제대로 발행되고 저장되는지, 그리고 클라이언트 측에서 접근 가능한지 확인해야 합니다.

**1.1. 브라우저 개발자 도구 활용 (F12)**

  * **Application 탭 확인:** 로그인 성공 후, 브라우저 개발자 도구 (F12)를 열어 "Application" 탭으로 이동하세요.
      * **Local Storage 또는 Session Storage:** Supabase JavaScript 클라이언트는 기본적으로 `localStorage` 또는 `sessionStorage`에 토큰을 저장합니다. `supabase.auth.getSession()` 또는 `supabase.auth.onAuthStateChange()` 이벤트를 통해 얻는 세션 정보에 토큰이 포함되어 있는지 확인하세요.
          * `sb-`로 시작하는 키 (예: `sb-<project-ref>-auth-token`)를 찾아 그 안에 `access_token`이 존재하는지 확인합니다.
      * **Cookies:** 경우에 따라 Supabase 설정이나 특정 백엔드 로직에 따라 쿠키에 토큰이 저장될 수도 있습니다. "Cookies" 섹션도 확인해 보세요.

**1.2. Supabase Auth 이벤트 리스너 활용**

Supabase 클라이언트는 인증 상태 변경 시 이벤트를 발생시킵니다. 이를 활용하여 토큰을 실시간으로 확인하고 처리할 수 있습니다.

```javascript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth Event:', event)
  console.log('Session:', session)

  if (session) {
    console.log('Access Token:', session.access_token)
    // 여기서 토큰을 전역 상태(Context API, Zustand, Redux 등)에 저장하거나
    // 필요한 데이터를 가져오는 함수를 호출할 수 있습니다.
  } else {
    console.log('No active session.')
  }
})
```

  * `session` 객체가 `null`이 아니라면 `session.access_token`에 토큰이 들어있습니다. 이 `console.log`를 통해 토큰이 제대로 발행되고 있는지 확인할 수 있습니다.

**1.3. Supabase 클라이언트에서 세션 직접 가져오기**

특정 시점에 현재 세션 정보를 직접 가져올 수 있습니다.

```javascript
async function getCurrentUserSession() {
  const { data: { session }, error } = await supabase.auth.getSession()

  if (error) {
    console.error('Error getting session:', error)
    return null
  }

  if (session) {
    console.log('Current Session:', session)
    console.log('Current Access Token:', session.access_token)
    return session
  } else {
    console.log('No current session.')
    return null
  }
}

// 필요한 시점에 호출
getCurrentUserSession()
```

**1.4. `supabase.auth.getUser()` 활용**

현재 로그인된 사용자 정보를 가져올 때 사용합니다. 세션과 함께 사용자 정보도 확인할 수 있습니다.

```javascript
async function getUserInfo() {
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error) {
    console.error('Error getting user:', error)
    return null
  }

  if (user) {
    console.log('Current User:', user)
    // user 객체 안에 메타데이터 등이 포함될 수 있습니다.
    return user
  } else {
    console.log('No user logged in.')
    return null
  }
}

getUserInfo()
```

-----

### 2\. 페이지에서 토큰을 "못 찾는" 문제의 일반적인 원인 및 해결책

**2.1. 클라이언트 측 상태 관리 (State Management)**

가장 흔한 문제입니다. 인증 후 받은 토큰을 애플리케이션의 전역 상태(Global State)에 저장하고, 이 상태를 필요한 컴포넌트나 페이지에서 접근해야 합니다.

  * **Context API (React):** `AuthContext`와 같은 Context를 생성하여 `session` 또는 `user` 객체를 저장하고, 필요한 컴포넌트에서 `useContext` 훅으로 접근합니다.
  * **Zustand, Recoil, Jotai 등 경량 상태 관리 라이브러리:** 복잡하지 않은 경우 가볍게 사용할 수 있습니다.
  * **Redux, Vuex 등:** 대규모 애플리케이션의 경우 안정적인 상태 관리를 위해 고려할 수 있습니다.

**예시 (React Context API):**

```javascript
// AuthContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const AuthContext = createContext(null);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ session, user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

// _app.js 또는 index.js
import { AuthProvider } from '../contexts/AuthContext';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;

// ProtectedPage.js
import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/router'; // Next.js 예시

const ProtectedPage = () => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login'); // 로그인 페이지로 리다이렉트
    }
  }, [user, loading, router]);

  if (loading) {
    return <div>Loading authentication...</div>;
  }

  if (!user) {
    return null; // 리다이렉트 중에는 아무것도 렌더링하지 않음
  }

  return (
    <div>
      <h1>Welcome, {user.email}!</h1>
      <p>This is a protected page.</p>
    </div>
  );
};

export default ProtectedPage;
```

**2.2. 페이지 로드 시점의 비동기 처리**

페이지가 처음 로드될 때, Supabase Auth 클라이언트가 세션을 초기화하는 데 약간의 시간이 걸릴 수 있습니다. 이 비동기 처리가 완료되기 전에 토큰에 접근하려고 하면 `null`이나 `undefined`를 받을 수 있습니다.

  * `loading` 상태를 두어 인증 정보가 로드될 때까지 UI를 표시하지 않거나 로딩 스피너를 보여주는 것이 좋습니다. (위 Context API 예시 참고)

**2.3. SSR (Server-Side Rendering) / SSG (Static Site Generation) 환경 문제**

Next.js와 같은 프레임워크에서 SSR/SSG를 사용하는 경우, 클라이언트 측 저장소(Local Storage)에 접근할 수 없으므로 토큰을 가져오는 방식이 달라져야 합니다.

  * **Next.js의 `getServerSideProps`:** 서버 측에서 Supabase 클라이언트를 초기화하고 쿠키를 통해 세션을 가져오는 방식으로 접근해야 합니다. Supabase는 Next.js 환경을 위한 별도의 도우미 함수를 제공합니다. (`@supabase/auth-helpers-nextjs` 패키지)
  * **Edge Functions 또는 API Routes:** 서버리스 함수에서 Supabase 클라이언트를 사용하여 인증을 처리할 수 있습니다. 이때도 요청 헤더의 `Authorization` 필드에서 토큰을 가져오거나, Supabase 라이브러리가 자동으로 처리하도록 구성해야 합니다.

**2.4. 라우팅 보호 (Protected Routes)**

로그인된 사용자만 접근할 수 있는 페이지를 만들 때, 미들웨어 또는 컴포넌트 레벨에서 인증 상태를 확인하여 리다이렉트 시키는 로직이 필요합니다.

  * **클라이언트 측 라우팅 가드:** 위 `ProtectedPage.js` 예시처럼 `useEffect`를 사용하여 `user` 객체가 없으면 로그인 페이지로 리다이렉트합니다.
  * **서버 측 라우팅 가드 (Next.js `middleware.ts`):** 더 강력한 보호를 위해 미들웨어에서 인증 상태를 확인하고 리다이렉트할 수 있습니다.
      * Supabase의 `auth-helpers-nextjs`를 사용하면 `middleware`에서 쉽게 인증된 사용자만 접근 가능하도록 설정할 수 있습니다.

-----

### 3\. Supabase Auth 활용 꿀팁 추가

**3.1. Magic Link (이메일 로그인)**

비밀번호 없이 이메일로 로그인 링크를 보내는 방식입니다. 사용자 경험을 향상시키고 비밀번호 관리 부담을 줄여줍니다.

```javascript
async function signInWithMagicLink(email) {
  const { data, error } = await supabase.auth.signInWithOtp({
    email: email,
    options: {
      emailRedirectTo: 'http://localhost:3000/confirm', // 인증 후 리다이렉트 될 URL
    },
  })

  if (error) console.error('Error signing in with Magic Link:', error.message)
  else console.log('Magic link sent!', data)
}
```

  * `emailRedirectTo` URL은 Supabase 프로젝트의 **Authentication \> URL Configuration**에서 "Site URL"과 "Redirect URLs"에 등록되어 있어야 합니다.

**3.2. 소셜 로그인 (OAuth)**

Google, GitHub 등 다양한 소셜 로그인을 지원합니다. Supabase 대시보드에서 Provider를 활성화하고 Client ID/Secret을 설정해야 합니다.

```javascript
async function signInWithOAuth(provider) {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: provider, // 'google', 'github' 등
    options: {
      redirectTo: 'http://localhost:3000/callback', // 인증 후 리다이렉트 될 URL
    },
  })

  if (error) console.error('Error signing in with OAuth:', error.message)
  else console.log('Redirecting for OAuth...', data)
}
```

  * `redirectTo` URL 또한 Supabase 대시보드에 등록되어야 합니다.

**3.3. 비밀번호 재설정 (Forgot Password)**

사용자가 비밀번호를 잊었을 때 재설정 링크를 보내는 기능입니다.

```javascript
async function resetPassword(email) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: 'http://localhost:3000/update-password', // 비밀번호 재설정 페이지 URL
  })

  if (error) console.error('Error resetting password:', error.message)
  else console.log('Password reset email sent!', data)
}
```

  * `redirectTo` URL 또한 Supabase 대시보드에 등록되어야 합니다.

**3.4. 사용자 프로필 관리 (User Metadata)**

회원가입 시 또는 이후에 사용자에게 추가 정보를 저장하고 싶을 때 `user_metadata`를 활용할 수 있습니다.

  * **회원가입 시:**
    ```javascript
    const { data, error } = await supabase.auth.signUp({
      email: 'user@example.com',
      password: 'password123',
      options: {
        data: {
          full_name: 'John Doe',
          // 기타 사용자 정의 데이터
        },
      },
    });
    ```
  * **프로필 업데이트 시:**
    ```javascript
    const { data, error } = await supabase.auth.updateUser({
      data: {
        avatar_url: 'http://example.com/new_avatar.jpg',
        website: 'http://mywebsite.com',
      },
    });
    ```

**3.5. Row Level Security (RLS) 활용**

Supabase Auth의 강력한 기능 중 하나는 RLS를 통해 데이터베이스 테이블에 대한 접근 권한을 사용자 인증 상태에 따라 제어하는 것입니다.

  * `auth.uid()`: 현재 로그인된 사용자의 UID를 가져옵니다.
  * `auth.role()`: 현재 로그인된 사용자의 역할을 가져옵니다.

**예시 (RLS 정책):**
테이블 `profiles`에서 `user_id`가 현재 로그인된 사용자의 `id`와 같은 로우만 읽을 수 있도록 허용하는 정책:

```sql
CREATE POLICY "Enable read access for users based on user_id" ON "public"."profiles"
FOR SELECT USING (auth.uid() = user_id);
```

**3.6. Supabase Admin 클라이언트 (Node.js 환경)**

서버 측(Node.js, Next.js API Route 등)에서 사용자 관리, 토큰 생성/검증 등 Supabase Auth의 관리 기능을 사용해야 할 때 Supabase Admin 클라이언트를 사용합니다. 이때는 `service_role` 키를 사용합니다.

```javascript
import { createClient } from '@supabase/supabase-js'

// IMPORTANT: Never expose your service_role key to the client!
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // 서비스 역할 키 사용
)

async function createNewUser(email, password) {
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email: email,
    password: password,
    email_confirm: true, // 이메일 확인 건너뛰기 (관리자 생성용)
  })

  if (error) console.error('Error creating user:', error.message)
  else console.log('User created:', data)
}
```

-----

이 팁들을 활용하시면 Supabase Auth를 더욱 효과적으로 디버깅하고 활용하실 수 있을 겁니다. 특히 토큰을 "못 찾는" 문제의 핵심은 **인증 상태를 전역적으로 관리하고, 페이지 로드 시 비동기 처리를 고려하며, 필요한 경우 SSR/미들웨어 환경에서 토큰을 올바르게 가져오는 것**임을 기억하세요.