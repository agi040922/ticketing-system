"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { NavigationHeader } from '@/components/navigation-header'
import { useAuth } from '@/contexts/auth-context'
import { createSupabaseClient } from '@/lib/supabase'
import { Gift, Calendar, Clock, CheckCircle, XCircle, ArrowLeft, Loader2, Percent } from 'lucide-react'
import Link from 'next/link'

interface CouponData {
  id: string
  coupon_id: string
  status: 'available' | 'used' | 'expired'
  used_at: string | null
  received_at: string
  expires_at: string | null
  coupon: {
    id: string
    name: string
    code: string
    type: 'discount' | 'free_ticket' | 'extra_time'
    discount_type: 'percentage' | 'fixed' | null
    discount_value: number | null
    min_purchase_amount: number
    max_discount_amount: number | null
    description: string | null
    valid_from: string
    valid_until: string
  }
}

export default function MyCouponsPage() {
  const { user, profile, loading } = useAuth()
  const [coupons, setCoupons] = useState<CouponData[]>([])
  const [couponsLoading, setCouponsLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createSupabaseClient()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
      return
    }

    if (user && profile) {
      fetchUserCoupons()
    }
  }, [user, profile, loading, router])

  const fetchUserCoupons = async () => {
    try {
      setCouponsLoading(true)
      setError('')

      const { data, error } = await supabase
        .from('user_coupons')
        .select(`
          id,
          coupon_id,
          status,
          used_at,
          received_at,
          expires_at,
          coupons!inner (
            id,
            name,
            code,
            type,
            discount_type,
            discount_value,
            min_purchase_amount,
            max_discount_amount,
            description,
            valid_from,
            valid_until
          )
        `)
        .eq('user_id', user?.id)
        .order('received_at', { ascending: false })

      if (error) {
        throw error
      }

      setCoupons(data as CouponData[])
    } catch (error: any) {
      console.error('쿠폰 조회 실패:', error)
      setError('쿠폰 정보를 불러오는데 실패했습니다.')
    } finally {
      setCouponsLoading(false)
    }
  }

  const getStatusBadge = (status: 'available' | 'used' | 'expired') => {
    switch (status) {
      case 'available':
        return <Badge className="bg-green-100 text-green-800">사용 가능</Badge>
      case 'used':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800">사용 완료</Badge>
      case 'expired':
        return <Badge variant="destructive" className="bg-red-100 text-red-800">만료됨</Badge>
      default:
        return <Badge variant="outline">알 수 없음</Badge>
    }
  }

  const getCouponTypeDisplay = (type: string) => {
    switch (type) {
      case 'discount':
        return '할인 쿠폰'
      case 'free_ticket':
        return '무료 이용권'
      case 'extra_time':
        return '시간 연장'
      default:
        return type
    }
  }

  const getCouponValue = (coupon: CouponData['coupon']) => {
    if (coupon.type === 'discount') {
      if (coupon.discount_type === 'percentage') {
        return `${coupon.discount_value}% 할인`
      } else if (coupon.discount_type === 'fixed') {
        return `${coupon.discount_value?.toLocaleString()}원 할인`
      }
    } else if (coupon.type === 'free_ticket') {
      return '무료 이용권'
    } else if (coupon.type === 'extra_time') {
      return '시간 연장'
    }
    return '특별 혜택'
  }

  const isExpired = (coupon: CouponData) => {
    const now = new Date()
    const validUntil = new Date(coupon.coupon.valid_until)
    const expiresAt = coupon.expires_at ? new Date(coupon.expires_at) : null
    
    return now > validUntil || (expiresAt && now > expiresAt)
  }

  if (loading || couponsLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavigationHeader />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
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
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link href="/profile">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                내 정보로 돌아가기
              </Button>
            </Link>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Gift className="h-8 w-8 mr-3 text-purple-600" />
            내 쿠폰
          </h1>
          <p className="text-gray-600 mt-2">보유한 쿠폰을 확인하고 사용하세요.</p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {coupons.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Gift className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                보유한 쿠폰이 없습니다
              </h3>
              <p className="text-gray-600 mb-6">
                아직 보유한 쿠폰이 없습니다. 이벤트나 특별 혜택을 확인해보세요!
              </p>
              <Button asChild>
                <Link href="/community/events">이벤트 확인하기</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* 쿠폰 통계 */}
            <div className="grid md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Gift className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">전체 쿠폰</p>
                      <p className="text-2xl font-bold text-gray-900">{coupons.length}개</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">사용 가능</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {coupons.filter(c => c.status === 'available' && !isExpired(c)).length}개
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <XCircle className="h-6 w-6 text-gray-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">사용 완료/만료</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {coupons.filter(c => c.status === 'used' || c.status === 'expired' || isExpired(c)).length}개
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 쿠폰 목록 */}
            <div className="space-y-4">
              {coupons.map((userCoupon) => {
                const coupon = userCoupon.coupon
                const expired = isExpired(userCoupon)
                const status = expired ? 'expired' : userCoupon.status
                
                return (
                  <Card key={userCoupon.id} className={expired ? 'opacity-60' : ''}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg flex items-center">
                            <Percent className="h-5 w-5 mr-2 text-purple-600" />
                            {coupon.name}
                          </CardTitle>
                          <CardDescription>
                            코드: {coupon.code} | {getCouponTypeDisplay(coupon.type)}
                          </CardDescription>
                        </div>
                        {getStatusBadge(status)}
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg">
                            <p className="text-lg font-bold text-purple-900">
                              {getCouponValue(coupon)}
                            </p>
                            {coupon.min_purchase_amount > 0 && (
                              <p className="text-sm text-purple-700">
                                {coupon.min_purchase_amount.toLocaleString()}원 이상 구매 시
                              </p>
                            )}
                            {coupon.max_discount_amount && (
                              <p className="text-xs text-purple-600">
                                최대 {coupon.max_discount_amount.toLocaleString()}원 할인
                              </p>
                            )}
                          </div>

                          {coupon.description && (
                            <div className="text-sm text-gray-600">
                              <p>{coupon.description}</p>
                            </div>
                          )}
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center space-x-2 text-sm">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <span className="text-gray-600">받은 날짜:</span>
                            <span className="font-medium">
                              {new Date(userCoupon.received_at).toLocaleDateString('ko-KR')}
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-2 text-sm">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span className="text-gray-600">유효 기간:</span>
                            <span className="font-medium">
                              {new Date(coupon.valid_until).toLocaleDateString('ko-KR')}까지
                            </span>
                          </div>

                          {userCoupon.status === 'used' && userCoupon.used_at && (
                            <div className="flex items-center space-x-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span className="text-gray-600">사용일:</span>
                              <span className="font-medium">
                                {new Date(userCoupon.used_at).toLocaleDateString('ko-KR')}
                              </span>
                            </div>
                          )}

                          {status === 'available' && (
                            <Button className="w-full mt-4" asChild>
                              <Link href="/purchase">쿠폰 사용하기</Link>
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 