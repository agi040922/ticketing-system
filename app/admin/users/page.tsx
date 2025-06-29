"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Users, 
  Search, 
  Filter, 
  MoreHorizontal, 
  ArrowLeft, 
  Loader2, 
  UserCheck, 
  UserX,
  Crown,
  Shield,
  Calendar,
  Mail,
  Phone,
  LogOut
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from 'next/link'
import { createSupabaseClient } from '@/lib/supabase'

interface UserProfile {
  id: string
  email: string
  name: string
  phone: string | null
  birth_date: string | null
  gender: string | null
  role: 'user' | 'admin' | 'manager'
  avatar_url: string | null
  marketing_agreed: boolean
  created_at: string
  updated_at: string
  orders_count?: number
  last_login?: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([])
  const [usersLoading, setUsersLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [updating, setUpdating] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    // 관리자 로그인 확인
    const isLoggedIn = localStorage.getItem("adminLoggedIn")
    if (!isLoggedIn) {
      router.push("/admin/login")
      return
    }

    fetchUsers()
  }, [router])

  const fetchUsers = async () => {
    try {
      setUsersLoading(true)
      setError('')
      
      const supabase = createSupabaseClient()

      // 사용자 프로필 조회
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (profilesError) {
        console.error('프로필 조회 오류:', profilesError)
        throw new Error('프로필을 불러오는데 실패했습니다.')
      }

      // 각 사용자의 주문 수 조회
      const usersWithStats = await Promise.all(
        (profilesData || []).map(async (profile: any) => {
          // 주문 수 조회
          const { count: ordersCount } = await supabase
            .from('orders')
            .select('id', { count: 'exact' })
            .eq('user_id', profile.id)

          // 마지막 로그인 조회 (user_activities에서)
          const { data: lastActivity } = await supabase
            .from('user_activities')
            .select('created_at')
            .eq('user_id', profile.id)
            .eq('activity_type', 'login')
            .order('created_at', { ascending: false })
            .limit(1)
            .single()

          return {
            ...profile,
            orders_count: ordersCount || 0,
            last_login: lastActivity?.created_at || null
          }
        })
      )

      setUsers(usersWithStats)
    } catch (error: any) {
      console.error('사용자 조회 실패:', error)
      setError(error.message || '사용자 정보를 불러오는데 실패했습니다.')
    } finally {
      setUsersLoading(false)
    }
  }

  const updateUserRole = async (userId: string, newRole: 'user' | 'admin' | 'manager') => {
    try {
      setUpdating(userId)
      
      const supabase = createSupabaseClient()
      
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole, updated_at: new Date().toISOString() })
        .eq('id', userId)

      if (error) {
        throw error
      }

      // 로컬 상태 업데이트
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ))

      // 활동 로그 기록
      await supabase
        .from('user_activities')
        .insert({
          user_id: userId,
          activity_type: 'role_change',
          description: `역할이 ${newRole}로 변경됨`,
          metadata: { new_role: newRole, changed_by: 'admin' }
        })

    } catch (error: any) {
      console.error('역할 업데이트 실패:', error)
      setError('역할 업데이트에 실패했습니다.')
    } finally {
      setUpdating(null)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn")
    router.push("/admin/login")
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-red-100 text-red-800"><Crown className="h-3 w-3 mr-1" />관리자</Badge>
      case 'manager':
        return <Badge className="bg-blue-100 text-blue-800"><Shield className="h-3 w-3 mr-1" />매니저</Badge>
      case 'user':
        return <Badge variant="secondary"><UserCheck className="h-3 w-3 mr-1" />일반회원</Badge>
      default:
        return <Badge variant="outline">알 수 없음</Badge>
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.phone && user.phone.includes(searchTerm))
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter

    return matchesSearch && matchesRole
  })

  if (usersLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Link href="/admin">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                관리자 대시보드
              </Button>
            </Link>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleLogout}
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              로그아웃
            </Button>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Users className="h-8 w-8 mr-3 text-blue-600" />
            사용자 관리
          </h1>
          <p className="text-gray-600 mt-2">등록된 사용자들의 정보를 확인하고 관리하세요.</p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchUsers}
              className="mt-2"
            >
              다시 시도
            </Button>
          </Alert>
        )}

        {/* 필터 및 검색 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">검색 및 필터</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="이름, 이메일, 전화번호로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger>
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="역할로 필터" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">모든 역할</SelectItem>
                  <SelectItem value="user">일반회원</SelectItem>
                  <SelectItem value="manager">매니저</SelectItem>
                  <SelectItem value="admin">관리자</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* 사용자 통계 */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">전체 사용자</p>
                  <p className="text-2xl font-bold text-gray-900">{users.length}명</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <UserCheck className="h-6 w-6 text-gray-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">일반회원</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {users.filter(u => u.role === 'user').length}명
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">매니저</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {users.filter(u => u.role === 'manager').length}명
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Crown className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">관리자</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {users.filter(u => u.role === 'admin').length}명
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 사용자 목록 테이블 */}
        <Card>
          <CardHeader>
            <CardTitle>사용자 목록 ({filteredUsers.length}명)</CardTitle>
            <CardDescription>
              등록된 모든 사용자의 상세 정보입니다.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>사용자</TableHead>
                    <TableHead>연락처</TableHead>
                    <TableHead>역할</TableHead>
                    <TableHead>주문 수</TableHead>
                    <TableHead>가입일</TableHead>
                    <TableHead>마지막 로그인</TableHead>
                    <TableHead>마케팅</TableHead>
                    <TableHead>작업</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                        {searchTerm || roleFilter !== 'all' 
                          ? '검색 조건에 맞는 사용자가 없습니다.' 
                          : '등록된 사용자가 없습니다.'
                        }
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={user.avatar_url || ''} />
                              <AvatarFallback>
                                {user.name.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-sm text-gray-500 flex items-center">
                                <Mail className="h-3 w-3 mr-1" />
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {user.phone ? (
                            <div className="flex items-center text-sm">
                              <Phone className="h-3 w-3 mr-1" />
                              {user.phone}
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {getRoleBadge(user.role)}
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">{user.orders_count}건</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-sm">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(user.created_at).toLocaleDateString('ko-KR')}
                          </div>
                        </TableCell>
                        <TableCell>
                          {user.last_login ? (
                            <div className="text-sm">
                              {new Date(user.last_login).toLocaleDateString('ko-KR')}
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {user.marketing_agreed ? (
                            <Badge variant="secondary" className="bg-green-100 text-green-800">동의</Badge>
                          ) : (
                            <Badge variant="secondary" className="bg-gray-100 text-gray-800">미동의</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" disabled={updating === user.id}>
                                {updating === user.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <MoreHorizontal className="h-4 w-4" />
                                )}
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem disabled>
                                상세 정보 보기
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {user.role !== 'user' && (
                                <DropdownMenuItem 
                                  onClick={() => updateUserRole(user.id, 'user')}
                                >
                                  일반회원으로 변경
                                </DropdownMenuItem>
                              )}
                              {user.role !== 'manager' && (
                                <DropdownMenuItem 
                                  onClick={() => updateUserRole(user.id, 'manager')}
                                >
                                  매니저로 변경
                                </DropdownMenuItem>
                              )}
                              {user.role !== 'admin' && (
                                <DropdownMenuItem 
                                  onClick={() => updateUserRole(user.id, 'admin')}
                                >
                                  관리자로 변경
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 