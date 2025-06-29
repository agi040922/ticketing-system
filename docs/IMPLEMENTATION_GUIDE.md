# 🚀 사용자 시스템 구현 가이드

## 📋 구현 순서

### 1단계: 데이터베이스 마이그레이션 (우선 실행)

#### 1.1 Supabase SQL Editor에서 실행
```sql
-- docs/DATABASE_MIGRATION_USER_SYSTEM.sql 파일의 내용을 복사하여 실행
-- 순서대로 실행해야 함:
-- 1. 테이블 생성
-- 2. 인덱스 생성  
-- 3. RLS 정책 설정
-- 4. 트리거 함수 생성
```

#### 1.2 Google OAuth 설정
```bash
# Supabase 대시보드 → Authentication → Providers → Google
# 1. Google Cloud Console에서 OAuth 클라이언트 생성
# 2. 클라이언트 ID와 Secret을 Supabase에 설정
# 3. 리디렉션 URL: https://your-project.supabase.co/auth/v1/callback
```

### 2단계: 환경 변수 설정

#### 2.1 .env.local 파일 수정
```env
# 기존 환경변수에 추가
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
```

### 3단계: 인증 시스템 구현

#### 3.1 인증 컨텍스트 생성
```bash
# 파일 생성: contexts/AuthContext.tsx
```

```typescript
// contexts/AuthContext.tsx
'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { User, Session } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  session: Session | null
  profile: any | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (data: any) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  
  const supabase = createClientComponentClient()

  useEffect(() => {
    // 초기 세션 확인
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setUser(session?.user ?? null)
      
      if (session?.user) {
        // 프로필 정보 로드
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
        setProfile(data)
      }
      
      setLoading(false)
    }

    getSession()

    // 인증 상태 변경 리스너
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()
          setProfile(data)
        } else {
          setProfile(null)
        }
        
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase])

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
    if (error) throw error
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  const updateProfile = async (data: any) => {
    if (!user) throw new Error('No user logged in')
    
    const { error } = await supabase
      .from('profiles')
      .update(data)
      .eq('id', user.id)
    
    if (error) throw error
    
    // 프로필 다시 로드
    const { data: updatedProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    
    setProfile(updatedProfile)
  }

  const value = {
    user,
    session,
    profile,
    loading,
    signInWithGoogle,
    signOut,
    updateProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
```

#### 3.2 미들웨어 설정
```bash
# 파일 생성: middleware.ts (프로젝트 루트)
```

```typescript
// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // 인증이 필요한 페이지들
  const protectedPaths = ['/profile', '/admin']
  const isProtectedPath = protectedPaths.some(path => 
    req.nextUrl.pathname.startsWith(path)
  )

  // 관리자 전용 페이지
  const adminPaths = ['/admin']
  const isAdminPath = adminPaths.some(path => 
    req.nextUrl.pathname.startsWith(path)
  )

  if (isProtectedPath && !session) {
    // 로그인 페이지로 리디렉션
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }

  if (isAdminPath && session) {
    // 사용자 권한 확인
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (!profile || !['admin', 'manager'].includes(profile.role)) {
      // 권한 없음 페이지로 리디렉션
      return NextResponse.redirect(new URL('/unauthorized', req.url))
    }
  }

  return res
}

export const config = {
  matcher: ['/profile/:path*', '/admin/:path*']
}
```

### 4단계: 로그인/회원가입 페이지 구현

#### 4.1 로그인 페이지
```bash
# 파일 생성: app/auth/login/page.tsx
```

```typescript
// app/auth/login/page.tsx
'use client'

import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function LoginPage() {
  const { user, signInWithGoogle, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user && !loading) {
      router.push('/profile')
    }
  }, [user, loading, router])

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">로딩중...</div>
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">로그인</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={signInWithGoogle}
            className="w-full"
            variant="outline"
          >
            Google로 계속하기
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
```

#### 4.2 OAuth 콜백 페이지
```bash
# 파일 생성: app/auth/callback/page.tsx
```

```typescript
// app/auth/callback/page.tsx
'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function AuthCallbackPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { data, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('Auth callback error:', error)
        router.push('/auth/login?error=callback_failed')
        return
      }

      if (data.session) {
        // 로그인 성공 - 활동 로그 기록
        await supabase
          .from('user_activities')
          .insert({
            user_id: data.session.user.id,
            activity_type: 'login',
            description: 'Google OAuth 로그인',
            metadata: { provider: 'google' }
          })

        router.push('/profile')
      } else {
        router.push('/auth/login')
      }
    }

    handleAuthCallback()
  }, [router, supabase])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">로그인 처리 중...</h2>
        <p className="text-gray-600">잠시만 기다려주세요.</p>
      </div>
    </div>
  )
}
```

### 5단계: 마이페이지 구현

#### 5.1 마이페이지 메인
```bash
# 파일 생성: app/profile/page.tsx
```

```typescript
// app/profile/page.tsx
'use client'

import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function ProfilePage() {
  const { user, profile, signOut } = useAuth()
  const [tickets, setTickets] = useState([])
  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(true)
  
  const supabase = createClientComponentClient()

  useEffect(() => {
    if (user) {
      loadUserData()
    }
  }, [user])

  const loadUserData = async () => {
    if (!user) return

    try {
      // 사용자 티켓 조회
      const { data: ticketData } = await supabase
        .from('order_items')
        .select(`
          *,
          orders(*)
        `)
        .eq('orders.user_id', user.id)
        .order('created_at', { ascending: false })

      setTickets(ticketData || [])

      // 사용자 쿠폰 조회
      const { data: couponData } = await supabase
        .from('user_coupons')
        .select(`
          *,
          coupons(*)
        `)
        .eq('user_id', user.id)
        .eq('status', 'available')
        .order('received_at', { ascending: false })

      setCoupons(couponData || [])
    } catch (error) {
      console.error('데이터 로드 오류:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">로딩중...</div>
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* 프로필 정보 */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>내 정보</CardTitle>
            <div className="flex gap-2">
              <Link href="/profile/edit">
                <Button variant="outline" size="sm">프로필 수정</Button>
              </Link>
              <Button variant="outline" size="sm" onClick={signOut}>
                로그아웃
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p><strong>이름:</strong> {profile?.name}</p>
            <p><strong>이메일:</strong> {profile?.email}</p>
            <p><strong>권한:</strong> <Badge>{profile?.role}</Badge></p>
            {profile?.phone && <p><strong>연락처:</strong> {profile.phone}</p>}
          </div>
        </CardContent>
      </Card>

      {/* 티켓 내역 */}
      <Card>
        <CardHeader>
          <CardTitle>내 티켓 ({tickets.length}개)</CardTitle>
        </CardHeader>
        <CardContent>
          {tickets.length === 0 ? (
            <p className="text-gray-500">구매한 티켓이 없습니다.</p>
          ) : (
            <div className="space-y-3">
              {tickets.slice(0, 3).map((ticket: any) => (
                <div key={ticket.id} className="border rounded p-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{ticket.ticket_type}</p>
                      <p className="text-sm text-gray-600">
                        주문일: {new Date(ticket.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge 
                      variant={ticket.status === 'active' ? 'default' : 'secondary'}
                    >
                      {ticket.status === 'active' ? '사용가능' : '사용완료'}
                    </Badge>
                  </div>
                </div>
              ))}
              {tickets.length > 3 && (
                <Link href="/profile/tickets">
                  <Button variant="outline" className="w-full">
                    모든 티켓 보기 ({tickets.length}개)
                  </Button>
                </Link>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 쿠폰 */}
      <Card>
        <CardHeader>
          <CardTitle>보유 쿠폰 ({coupons.length}개)</CardTitle>
        </CardHeader>
        <CardContent>
          {coupons.length === 0 ? (
            <p className="text-gray-500">보유한 쿠폰이 없습니다.</p>
          ) : (
            <div className="space-y-3">
              {coupons.slice(0, 3).map((userCoupon: any) => (
                <div key={userCoupon.id} className="border rounded p-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{userCoupon.coupons.name}</p>
                      <p className="text-sm text-gray-600">
                        {userCoupon.coupons.description}
                      </p>
                    </div>
                    <Badge variant="default">사용가능</Badge>
                  </div>
                </div>
              ))}
              {coupons.length > 3 && (
                <Link href="/profile/coupons">
                  <Button variant="outline" className="w-full">
                    모든 쿠폰 보기 ({coupons.length}개)
                  </Button>
                </Link>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
```

### 6단계: 기존 시스템과 통합

#### 6.1 메인 레이아웃에 로그인 상태 추가
```bash
# 파일 수정: app/layout.tsx
```

```typescript
// app/layout.tsx에 AuthProvider 추가
import { AuthProvider } from '@/contexts/AuthContext'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>
        <AuthProvider>
          <ThemeProvider>
            {/* 기존 레이아웃 내용 */}
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
```

#### 6.2 구매 페이지에 사용자 정보 연동
```bash
# 파일 수정: app/purchase/page.tsx
```

```typescript
// app/purchase/page.tsx에 추가
import { useAuth } from '@/contexts/AuthContext'

export default function PurchasePage() {
  const { user, profile } = useAuth()
  
  // 로그인된 사용자는 정보 자동 입력
  useEffect(() => {
    if (profile) {
      setCustomerName(profile.name)
      setCustomerEmail(profile.email)
      setCustomerPhone(profile.phone || '')
    }
  }, [profile])

  // 주문 생성 시 user_id 포함
  const orderData = {
    // ... 기존 주문 데이터
    user_id: user?.id, // 사용자 ID 추가
  }
}
```

### 7단계: 관리자 기능 구현

#### 7.1 사용자 관리 페이지
```bash
# 파일 생성: app/admin/users/page.tsx
```

```typescript
// app/admin/users/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function AdminUsersPage() {
  const [users, setUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  
  const supabase = createClientComponentClient()

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      setUsers(data || [])
    } catch (error) {
      console.error('사용자 로드 오류:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter((user: any) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>사용자 관리</CardTitle>
          <Input
            placeholder="이름 또는 이메일로 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>로딩중...</p>
          ) : (
            <div className="space-y-4">
              {filteredUsers.map((user: any) => (
                <div key={user.id} className="border rounded p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{user.name}</h3>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <p className="text-sm text-gray-500">
                        가입일: {new Date(user.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                        {user.role}
                      </Badge>
                      <Button variant="outline" size="sm">
                        상세보기
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
```

### 8단계: API 구현

#### 8.1 프로필 API
```bash
# 파일 생성: app/api/auth/profile/route.ts
```

```typescript
// app/api/auth/profile/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies })
  
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(profile)
}

export async function PUT(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  
  const { data, error } = await supabase
    .from('profiles')
    .update(body)
    .eq('id', session.user.id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
```

## 📝 체크리스트

### Phase 1: 기본 설정
- [ ] 데이터베이스 마이그레이션 실행
- [ ] Google OAuth 설정
- [ ] 환경 변수 설정

### Phase 2: 인증 시스템
- [ ] AuthContext 구현
- [ ] 미들웨어 설정
- [ ] 로그인/콜백 페이지 구현

### Phase 3: 사용자 페이지
- [ ] 마이페이지 구현
- [ ] 프로필 수정 페이지
- [ ] 티켓/쿠폰 관리 페이지

### Phase 4: 관리자 기능
- [ ] 사용자 관리 페이지
- [ ] 티켓 관리 페이지
- [ ] 쿠폰 관리 페이지

### Phase 5: API 구현
- [ ] 프로필 API
- [ ] 사용자 관리 API
- [ ] 쿠폰 시스템 API

### Phase 6: 통합 테스트
- [ ] 회원가입/로그인 플로우
- [ ] 티켓 구매 → 마이페이지 연동
- [ ] 쿠폰 시스템 통합
- [ ] 관리자 기능 테스트

이 가이드를 따라 단계별로 구현하면 완성도 높은 사용자 시스템을 구축할 수 있습니다! 🚀