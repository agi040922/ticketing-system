"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { createSupabaseClient } from '@/lib/supabase'
import { useAuth } from '@/contexts/auth-context'
import { RefreshCw, Search, Plus, Trash2, User, Shield, Users } from 'lucide-react'

interface UserData {
  id: string
  email: string
  name: string
  phone?: string
  role: 'admin' | 'manager' | 'user'
  marketing_agreed: boolean
  created_at: string
  updated_at: string
}

export default function UsersTestPage() {
  const [allUsers, setAllUsers] = useState<UserData[]>([])
  const [searchId, setSearchId] = useState('')
  const [searchResult, setSearchResult] = useState<UserData | null>(null)
  const [newUser, setNewUser] = useState({ email: '', name: '', phone: '' })
  const [loading, setLoading] = useState(false)
  const [connectionTest, setConnectionTest] = useState<any>(null)
  
  const { user, userData } = useAuth()
  const supabase = createSupabaseClient()

  // Supabase 연결 테스트
  const testConnection = async () => {
    console.log('🔗 연결 테스트 시작...')
    
    try {
      // 1단계: 기본 연결 테스트
      const { data, error, count } = await supabase
        .from('users')
        .select('id', { count: 'exact' })
        .limit(1)
      
      console.log('🔗 연결 테스트 결과:', { data, error, count })
      console.log('🔗 데이터 상세:', data)
      console.log('🔗 에러 상세:', error)
      console.log('🔗 카운트:', count)
      
      // 2단계: 더 간단한 쿼리로 테스트
      console.log('🔗 간단한 SELECT 테스트...')
      const simpleResult = await supabase
        .from('users')
        .select('*')
        .limit(3)
      
      console.log('🔗 간단한 SELECT 결과:', simpleResult)
      
      if (error) {
        console.error('🔗 연결 테스트 실패:', error)
        setConnectionTest({
          success: false,
          message: `연결 실패: ${error.message} (코드: ${error.code})`,
          timestamp: new Date().toLocaleString(),
          details: { error, simpleResult }
        })
      } else {
        console.log('🔗 연결 테스트 성공')
        setConnectionTest({
          success: true,
          message: `연결 성공 - 테이블 존재함 (레코드 수: ${count || 0})`,
          timestamp: new Date().toLocaleString(),
          details: { 
            count, 
            sampleData: data,
            simpleSelectData: simpleResult.data,
            simpleSelectError: simpleResult.error
          }
        })
      }
      
    } catch (error: any) {
      console.error('🔗 연결 테스트 예외:', error)
      setConnectionTest({
        success: false,
        message: `연결 실패 (예외): ${error.message || error}`,
        timestamp: new Date().toLocaleString(),
        details: error
      })
    }
  }

  // 모든 사용자 조회
  const fetchAllUsers = async () => {
    setLoading(true)
    console.log('🔍 사용자 조회 시작...')
    
    try {
      // 기본 연결 테스트
      console.log('📡 Supabase 클라이언트:', supabase)
      
      const { data, error, count } = await supabase
        .from('users')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })

      console.log('📊 쿼리 결과:', { data, error, count })
      console.log('📊 데이터 타입:', typeof data, Array.isArray(data))
      console.log('📊 데이터 길이:', data?.length)

      if (error) {
        console.error('❌ 사용자 조회 실패:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        })
        alert(`❌ 조회 실패: ${error.message}\n\n코드: ${error.code}\n힌트: ${error.hint || '없음'}`)
        setAllUsers([])
      } else {
        console.log('✅ 사용자 조회 성공:', data)
        setAllUsers(data || [])
      }
    } catch (error: any) {
      console.error('💥 사용자 조회 오류:', error)
      alert(`💥 예외 발생: ${error.message || error}`)
      setAllUsers([])
    } finally {
      setLoading(false)
    }
  }

  // 특정 사용자 검색
  const searchUser = async () => {
    if (!searchId.trim()) return
    
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', searchId.trim())
        .single()

      if (error) {
        console.error('사용자 검색 실패:', error)
        setSearchResult(null)
      } else {
        setSearchResult(data)
      }
    } catch (error) {
      console.error('사용자 검색 오류:', error)
      setSearchResult(null)
    } finally {
      setLoading(false)
    }
  }

  // 새 사용자 생성
  const createUser = async () => {
    if (!newUser.email || !newUser.name) return
    
    setLoading(true)
    try {
      // 임시 ID 생성 (실제로는 auth.users에서 가져와야 함)
      const tempId = crypto.randomUUID()
      
      const { data, error } = await supabase
        .from('users')
        .insert([{
          id: tempId,
          email: newUser.email,
          name: newUser.name,
          phone: newUser.phone || null,
          role: 'user',
          marketing_agreed: false
        }])
        .select()
        .single()

      if (error) {
        console.error('사용자 생성 실패:', error)
      } else {
        console.log('사용자 생성 성공:', data)
        setNewUser({ email: '', name: '', phone: '' })
        fetchAllUsers()
      }
    } catch (error) {
      console.error('사용자 생성 오류:', error)
    } finally {
      setLoading(false)
    }
  }

  // 사용자 삭제
  const deleteUser = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return
    
    setLoading(true)
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('사용자 삭제 실패:', error)
      } else {
        console.log('사용자 삭제 성공')
        fetchAllUsers()
      }
    } catch (error) {
      console.error('사용자 삭제 오류:', error)
    } finally {
      setLoading(false)
    }
  }

  // 역할 배지 컴포넌트
  const RoleBadge = ({ role }: { role: string }) => {
    const variants = {
      admin: 'destructive',
      manager: 'secondary',
      user: 'outline'
    } as const
    
    const icons = {
      admin: Shield,
      manager: Users,
      user: User
    }
    
    const Icon = icons[role as keyof typeof icons] || User
    
    return (
      <Badge variant={variants[role as keyof typeof variants] || 'outline'}>
        <Icon className="w-3 h-3 mr-1" />
        {role}
      </Badge>
    )
  }

  useEffect(() => {
    testConnection()
    fetchAllUsers()
  }, [])

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Users 테이블 테스트</h1>
        <Button onClick={() => { testConnection(); fetchAllUsers(); }} disabled={loading}>
          <RefreshCw className="w-4 h-4 mr-2" />
          새로고침
        </Button>
      </div>

      {/* 연결 상태 */}
      <Card>
        <CardHeader>
          <CardTitle>Supabase 연결 상태</CardTitle>
        </CardHeader>
        <CardContent>
          {connectionTest && (
            <div className="space-y-3">
              <Badge variant={connectionTest.success ? 'default' : 'destructive'}>
                {connectionTest.success ? '✅ 연결됨' : '❌ 연결 실패'}
              </Badge>
              <p className="text-sm text-gray-600">{connectionTest.message}</p>
              <p className="text-xs text-gray-400">{connectionTest.timestamp}</p>
              
              {connectionTest.details && (
                <details className="text-xs">
                  <summary className="cursor-pointer text-blue-600 hover:text-blue-800">
                    상세 정보 보기
                  </summary>
                  <pre className="bg-gray-100 p-2 rounded mt-2 overflow-x-auto">
                    {JSON.stringify(connectionTest.details, null, 2)}
                  </pre>
                </details>
              )}
              
              <div className="text-xs text-gray-500 space-y-1">
                <p>💡 <strong>문제 해결 단계:</strong></p>
                <ol className="list-decimal list-inside space-y-1 ml-2">
                  <li>먼저 <code>docs/debug_users_table.sql</code> 실행</li>
                  <li>문제 발견시 <code>docs/users_table_emergency_fix.sql</code> 실행</li>
                  <li>브라우저 개발자도구 콘솔에서 상세 로그 확인</li>
                </ol>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 현재 Auth 상태 */}
      <Card>
        <CardHeader>
          <CardTitle>현재 Auth 상태</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Supabase Auth 사용자</Label>
            <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
              {JSON.stringify(user ? { 
                id: user.id, 
                email: user.email, 
                created_at: user.created_at 
              } : null, null, 2)}
            </pre>
          </div>
          
          <div>
            <Label>Users 테이블 데이터</Label>
            <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
              {JSON.stringify(userData, null, 2)}
            </pre>
          </div>
        </CardContent>
      </Card>

      {/* 사용자 검색 */}
      <Card>
        <CardHeader>
          <CardTitle>사용자 검색</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input 
              placeholder="사용자 ID 입력" 
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
            />
            <Button onClick={searchUser} disabled={loading}>
              <Search className="w-4 h-4 mr-2" />
              검색
            </Button>
          </div>
          
          {searchResult && (
            <div>
              <Label>검색 결과</Label>
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                {JSON.stringify(searchResult, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 새 사용자 생성 */}
      <Card>
        <CardHeader>
          <CardTitle>새 사용자 생성 (테스트용)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>이메일</Label>
              <Input 
                value={newUser.email}
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                placeholder="test@example.com"
              />
            </div>
            <div>
              <Label>이름</Label>
              <Input 
                value={newUser.name}
                onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                placeholder="홍길동"
              />
            </div>
            <div>
              <Label>전화번호 (선택)</Label>
              <Input 
                value={newUser.phone}
                onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                placeholder="010-1234-5678"
              />
            </div>
          </div>
          <Button onClick={createUser} disabled={loading || !newUser.email || !newUser.name}>
            <Plus className="w-4 h-4 mr-2" />
            사용자 생성
          </Button>
        </CardContent>
      </Card>

      {/* 모든 사용자 목록 */}
      <Card>
        <CardHeader>
          <CardTitle>모든 사용자 목록 ({allUsers.length}명)</CardTitle>
        </CardHeader>
        <CardContent>
          {allUsers.length === 0 ? (
            <p className="text-gray-500 text-center py-4">사용자가 없습니다.</p>
          ) : (
            <div className="space-y-4">
              {allUsers.map((user) => (
                <div key={user.id} className="border rounded p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{user.name}</h3>
                        <RoleBadge role={user.role} />
                      </div>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <p className="text-xs text-gray-400">ID: {user.id}</p>
                      {user.phone && <p className="text-sm">📞 {user.phone}</p>}
                      <p className="text-xs text-gray-400">
                        생성: {new Date(user.created_at).toLocaleString()}
                      </p>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteUser(user.id)}
                      disabled={loading}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 실시간 쿼리 결과 */}
      <Card>
        <CardHeader>
          <CardTitle>실시간 쿼리 결과 (JSON)</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto max-h-96">
            {JSON.stringify(allUsers, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </div>
  )
} 