"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { createSupabaseClient } from '@/lib/supabase'
import { useAuth } from '@/contexts/auth-context'
import { 
  Shield, 
  Key, 
  Cookie, 
  User, 
  Eye,
  EyeOff,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Database,
  Chrome,
  Mail,
  LogOut,
  Settings
} from 'lucide-react'

interface SessionInfo {
  user: any
  session: any
  error: any
}

interface TokenInfo {
  accessToken: string | null
  refreshToken: string | null
  expiresAt: number | null
  isExpired: boolean
  timeToExpiry: string
}

export default function AuthTestPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [sessionInfo, setSessionInfo] = useState<SessionInfo | null>(null)
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null)
  const [cookieInfo, setCookieInfo] = useState<string>('')
  const [showTokens, setShowTokens] = useState(false)
  const [testEmail, setTestEmail] = useState('')
  const [testPassword, setTestPassword] = useState('')
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null)
  
  const { user, userData, loading: authLoading, signInWithEmail, signOut } = useAuth()
  const supabase = createSupabaseClient()

  useEffect(() => {
    fetchSessionInfo()
    fetchTokenInfo()
    fetchCookieInfo()
    
    // 5초마다 자동 새로고침
    const interval = setInterval(() => {
      fetchSessionInfo()
      fetchTokenInfo()
      fetchCookieInfo()
    }, 5000)
    
    setRefreshInterval(interval)
    
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [])

  const fetchSessionInfo = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      setSessionInfo({
        user,
        session,
        error: userError || sessionError
      })
    } catch (err) {
      setError(`세션 정보 조회 실패: ${err}`)
    }
  }

  const fetchTokenInfo = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session) {
        const now = Math.floor(Date.now() / 1000)
        const expiresAt = session.expires_at ?? null
        const isExpired = expiresAt ? now > expiresAt : false
        const timeToExpiry = expiresAt 
          ? isExpired 
            ? '만료됨' 
            : `${Math.floor((expiresAt - now) / 60)}분 ${(expiresAt - now) % 60}초`
          : '알 수 없음'
          
        setTokenInfo({
          accessToken: session.access_token,
          refreshToken: session.refresh_token,
          expiresAt,
          isExpired,
          timeToExpiry
        })
      } else {
        setTokenInfo(null)
      }
    } catch (err) {
      setError(`토큰 정보 조회 실패: ${err}`)
    }
  }

  const fetchCookieInfo = () => {
    try {
      const cookies = document.cookie
      setCookieInfo(cookies || '쿠키 없음')
    } catch (err) {
      setCookieInfo(`쿠키 조회 실패: ${err}`)
    }
  }

  const handleTestEmailLogin = async () => {
    if (!testEmail || !testPassword) {
      setError('이메일과 비밀번호를 입력하세요.')
      return
    }

    try {
      setLoading(true)
      setError('')
      setSuccess('')
      
      await signInWithEmail(testEmail, testPassword)
      setSuccess('로그인 성공!')
      
      // 즉시 새로고침
      setTimeout(() => {
        fetchSessionInfo()
        fetchTokenInfo()
        fetchCookieInfo()
      }, 1000)
    } catch (err: any) {
      setError(`로그인 실패: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      setLoading(true)
      setError('')
      setSuccess('')
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })
      
      if (error) throw error
      
      setSuccess('구글 로그인 시작!')
    } catch (err: any) {
      setError(`구글 로그인 실패: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      setLoading(true)
      setError('')
      setSuccess('')
      
      await signOut()
      setSuccess('로그아웃 성공!')
      
      // 즉시 새로고침
      setTimeout(() => {
        fetchSessionInfo()
        fetchTokenInfo()
        fetchCookieInfo()
      }, 1000)
    } catch (err: any) {
      setError(`로그아웃 실패: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleRefreshToken = async () => {
    try {
      setLoading(true)
      setError('')
      setSuccess('')
      
      const { error } = await supabase.auth.refreshSession()
      
      if (error) throw error
      
      setSuccess('토큰 갱신 성공!')
      
      // 즉시 새로고침
      setTimeout(() => {
        fetchSessionInfo()
        fetchTokenInfo()
        fetchCookieInfo()
      }, 1000)
    } catch (err: any) {
      setError(`토큰 갱신 실패: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleTestProtectedRoute = async () => {
    try {
      setLoading(true)
      setError('')
      setSuccess('')
      
      // 보호된 API 호출 테스트 (users 테이블로 변경)
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user?.id)
        .single()
      
      if (error) throw error
      
      setSuccess('보호된 라우트 접근 성공!')
    } catch (err: any) {
      setError(`보호된 라우트 접근 실패: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'expired': return 'bg-red-100 text-red-800'
      case 'loading': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Auth 시스템 테스트</h1>
              <p className="text-gray-600">인증, 토큰, 쿠키 상태 실시간 모니터링</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={authLoading ? 'secondary' : user ? 'default' : 'destructive'}>
              {authLoading && <RefreshCw className="h-3 w-3 animate-spin mr-1" />}
              {!authLoading && user && <CheckCircle className="h-3 w-3 mr-1" />}
              {!authLoading && !user && <XCircle className="h-3 w-3 mr-1" />}
              {authLoading ? '로딩 중' : user ? '로그인됨' : '비로그인'}
            </Badge>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                fetchSessionInfo()
                fetchTokenInfo()
                fetchCookieInfo()
              }}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* 알림 메시지 */}
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {/* 현재 Auth 상태 요약 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              현재 인증 상태
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>사용자 ID</Label>
                <p className="text-sm font-mono bg-gray-100 p-2 rounded">
                  {user?.id || '없음'}
                </p>
              </div>
              <div className="space-y-2">
                <Label>이메일</Label>
                <p className="text-sm bg-gray-100 p-2 rounded">
                  {user?.email || '없음'}
                </p>
              </div>
              <div className="space-y-2">
                <Label>사용자 데이터 상태</Label>
                <Badge variant={userData ? 'default' : 'secondary'}>
                  {userData ? `${userData.name} (${userData.role})` : '사용자 데이터 없음'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 탭 인터페이스 */}
        <Tabs defaultValue="session" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="session">세션 정보</TabsTrigger>
            <TabsTrigger value="tokens">토큰</TabsTrigger>
            <TabsTrigger value="cookies">쿠키</TabsTrigger>
            <TabsTrigger value="actions">인증 액션</TabsTrigger>
            <TabsTrigger value="test">테스트</TabsTrigger>
          </TabsList>

          {/* 세션 정보 탭 */}
          <TabsContent value="session">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  세션 정보
                </CardTitle>
                <CardDescription>
                  현재 Supabase 세션 상태
                </CardDescription>
              </CardHeader>
              <CardContent>
                {sessionInfo ? (
                  <div className="space-y-4">
                    <div>
                      <Label>사용자 객체</Label>
                      <Textarea
                        value={JSON.stringify(sessionInfo.user, null, 2)}
                        readOnly
                        rows={8}
                        className="font-mono text-xs"
                      />
                    </div>
                    <div>
                      <Label>세션 객체</Label>
                      <Textarea
                        value={JSON.stringify(sessionInfo.session, null, 2)}
                        readOnly
                        rows={8}
                        className="font-mono text-xs"
                      />
                    </div>
                    {sessionInfo.error && (
                      <div>
                        <Label>에러</Label>
                        <Textarea
                          value={JSON.stringify(sessionInfo.error, null, 2)}
                          readOnly
                          rows={4}
                          className="font-mono text-xs bg-red-50"
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500">세션 정보 없음</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* 토큰 정보 탭 */}
          <TabsContent value="tokens">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  토큰 정보
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowTokens(!showTokens)}
                  >
                    {showTokens ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                  </Button>
                </CardTitle>
                <CardDescription>
                  Access Token, Refresh Token 상태
                </CardDescription>
              </CardHeader>
              <CardContent>
                {tokenInfo ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>토큰 상태</Label>
                        <Badge className={getStatusColor(tokenInfo.isExpired ? 'expired' : 'active')}>
                          {tokenInfo.isExpired ? '만료됨' : '활성'}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <Label>만료까지 시간</Label>
                        <p className="text-sm font-mono bg-gray-100 p-2 rounded">
                          {tokenInfo.timeToExpiry}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label>만료 시각</Label>
                        <p className="text-sm bg-gray-100 p-2 rounded">
                          {tokenInfo.expiresAt ? formatTimestamp(tokenInfo.expiresAt) : '알 수 없음'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <Label>Access Token</Label>
                        <Textarea
                          value={showTokens ? tokenInfo.accessToken || '' : '토큰 숨김 (눈 아이콘 클릭)'}
                          readOnly
                          rows={4}
                          className="font-mono text-xs"
                        />
                      </div>
                      <div>
                        <Label>Refresh Token</Label>
                        <Textarea
                          value={showTokens ? tokenInfo.refreshToken || '' : '토큰 숨김 (눈 아이콘 클릭)'}
                          readOnly
                          rows={4}
                          className="font-mono text-xs"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">토큰 정보 없음</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* 쿠키 정보 탭 */}
          <TabsContent value="cookies">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cookie className="h-5 w-5" />
                  쿠키 정보
                </CardTitle>
                <CardDescription>
                  브라우저에 저장된 쿠키 상태
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div>
                  <Label>전체 쿠키</Label>
                  <Textarea
                    value={cookieInfo}
                    readOnly
                    rows={8}
                    className="font-mono text-xs"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 인증 액션 탭 */}
          <TabsContent value="actions">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 로그인 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    이메일 로그인 테스트
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>이메일</Label>
                    <Input
                      type="email"
                      value={testEmail}
                      onChange={(e) => setTestEmail(e.target.value)}
                      placeholder="test@example.com"
                    />
                  </div>
                  <div>
                    <Label>비밀번호</Label>
                    <Input
                      type="password"
                      value={testPassword}
                      onChange={(e) => setTestPassword(e.target.value)}
                      placeholder="password"
                    />
                  </div>
                  <Button 
                    onClick={handleTestEmailLogin} 
                    disabled={loading}
                    className="w-full"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    이메일 로그인
                  </Button>
                </CardContent>
              </Card>

              {/* 기타 액션 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    인증 관리
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    onClick={handleGoogleLogin} 
                    disabled={loading}
                    variant="outline"
                    className="w-full"
                  >
                    <Chrome className="h-4 w-4 mr-2" />
                    구글 로그인
                  </Button>
                  
                  <Button 
                    onClick={handleRefreshToken} 
                    disabled={loading || !user}
                    variant="secondary"
                    className="w-full"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    토큰 갱신
                  </Button>
                  
                  <Button 
                    onClick={handleLogout} 
                    disabled={loading || !user}
                    variant="destructive"
                    className="w-full"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    로그아웃
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* 테스트 탭 */}
          <TabsContent value="test">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  기능 테스트
                </CardTitle>
                <CardDescription>
                  인증 관련 기능들을 테스트합니다.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button 
                    onClick={handleTestProtectedRoute} 
                    disabled={loading || !user}
                    variant="outline"
                  >
                    <Database className="h-4 w-4 mr-2" />
                    Users 테이블 접근 테스트
                  </Button>
                  
                  <Button 
                    onClick={() => window.location.href = '/profile'}
                    disabled={!user}
                    variant="outline"
                  >
                    <User className="h-4 w-4 mr-2" />
                    프로필 페이지 이동
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 