"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { NavigationHeader } from '@/components/navigation-header'
import { useAuth } from '@/contexts/auth-context'
import { User, Calendar, Phone, Mail, Settings, Shield } from 'lucide-react'

export default function ProfilePage() {
  const { user, profile, updateProfile, loading } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    birth_date: '',
    gender: '',
    marketing_agreed: false
  })
  const [updating, setUpdating] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
      return
    }

    if (profile) {
      setFormData({
        name: profile.name || '',
        phone: profile.phone || '',
        birth_date: profile.birth_date || '',
        gender: profile.gender || '',
        marketing_agreed: profile.marketing_agreed || false
      })
    }
  }, [user, profile, loading, router])

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setMessage('')
    setError('')
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setUpdating(true)
      setError('')
      
      await updateProfile(formData)
      setMessage('프로필이 성공적으로 업데이트되었습니다.')
    } catch (error: any) {
      setError(error.message || '프로필 업데이트에 실패했습니다.')
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavigationHeader />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!user || !profile) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationHeader />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">내 정보</h1>
          <p className="text-gray-600 mt-2">개인정보를 관리하고 업데이트하세요.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* 프로필 카드 */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <Avatar className="h-24 w-24 mx-auto mb-4">
                  <AvatarImage src={profile.avatar_url || ''} />
                  <AvatarFallback className="text-2xl">
                    {profile.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <CardTitle>{profile.name}</CardTitle>
                <CardDescription>{profile.email}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2 text-sm">
                  <Shield className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">역할:</span>
                  <span className="font-medium capitalize">
                    {profile.role === 'user' ? '일반회원' : 
                     profile.role === 'admin' ? '관리자' : '매니저'}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">가입일:</span>
                  <span className="font-medium">
                    {new Date(profile.created_at).toLocaleDateString('ko-KR')}
                  </span>
                </div>
                <div className="pt-4 space-y-2">
                  <Button variant="outline" className="w-full" asChild>
                    <a href="/profile/tickets">내 티켓 보기</a>
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <a href="/profile/coupons">내 쿠폰 보기</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 정보 수정 카드 */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  개인정보 수정
                </CardTitle>
                <CardDescription>
                  개인정보를 최신 상태로 유지해주세요.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {message && (
                  <Alert className="mb-6">
                    <AlertDescription>{message}</AlertDescription>
                  </Alert>
                )}
                
                {error && (
                  <Alert variant="destructive" className="mb-6">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">이름 *</Label>
                      <Input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="phone">전화번호</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="010-0000-0000"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="birth_date">생년월일</Label>
                      <Input
                        id="birth_date"
                        type="date"
                        value={formData.birth_date}
                        onChange={(e) => handleInputChange('birth_date', e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="gender">성별</Label>
                      <Select
                        value={formData.gender}
                        onValueChange={(value) => handleInputChange('gender', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="선택해주세요" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">남성</SelectItem>
                          <SelectItem value="female">여성</SelectItem>
                          <SelectItem value="other">기타</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label>이메일</Label>
                    <div className="flex items-center space-x-2 mt-1">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">{profile.email}</span>
                      <span className="text-xs text-gray-500">(변경 불가)</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="marketing"
                      checked={formData.marketing_agreed}
                      onCheckedChange={(checked) => handleInputChange('marketing_agreed', !!checked)}
                    />
                    <Label htmlFor="marketing" className="text-sm">
                      마케팅 정보 수신에 동의합니다
                    </Label>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      disabled={updating}
                      className="px-8"
                    >
                      {updating ? '업데이트 중...' : '정보 업데이트'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 