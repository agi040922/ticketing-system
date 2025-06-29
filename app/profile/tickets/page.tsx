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
import { Ticket, Calendar, Clock, CheckCircle, XCircle, ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'

interface TicketData {
  id: number
  order_id: string
  ticket_type: string
  quantity: number
  price: number
  status: 'active' | 'used'
  used_at: string | null
  created_at: string
  unique_code: string | null
  qr_image_url: string | null
  order: {
    customer_name: string
    customer_phone: string
    total_amount: number
    status: string
    created_at: string
  }
}

export default function MyTicketsPage() {
  const { user, profile, loading } = useAuth()
  const [tickets, setTickets] = useState<TicketData[]>([])
  const [ticketsLoading, setTicketsLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createSupabaseClient()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
      return
    }

    if (user && profile) {
      fetchUserTickets()
    }
  }, [user, profile, loading, router])

  const fetchUserTickets = async () => {
    try {
      setTicketsLoading(true)
      setError('')

      const { data, error } = await supabase
        .from('order_items')
        .select(`
          id,
          order_id,
          ticket_type,
          quantity,
          price,
          status,
          used_at,
          created_at,
          unique_code,
          qr_image_url,
          orders!inner (
            customer_name,
            customer_phone,
            total_amount,
            status,
            created_at,
            user_id
          )
        `)
        .eq('orders.user_id', user?.id)
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      setTickets(data as TicketData[])
    } catch (error: any) {
      console.error('티켓 조회 실패:', error)
      setError('티켓 정보를 불러오는데 실패했습니다.')
    } finally {
      setTicketsLoading(false)
    }
  }

  const getStatusBadge = (status: 'active' | 'used') => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">사용 가능</Badge>
      case 'used':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800">사용 완료</Badge>
      default:
        return <Badge variant="outline">알 수 없음</Badge>
    }
  }

  const getTicketTypeDisplay = (type: string) => {
    switch (type) {
      case '대인':
        return '대인 (성인)'
      case '소인':
        return '소인 (어린이)'
      default:
        return type
    }
  }

  if (loading || ticketsLoading) {
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
            <Ticket className="h-8 w-8 mr-3 text-blue-600" />
            내 티켓
          </h1>
          <p className="text-gray-600 mt-2">구매한 티켓 내역을 확인하고 관리하세요.</p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {tickets.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Ticket className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                구매한 티켓이 없습니다
              </h3>
              <p className="text-gray-600 mb-6">
                아직 구매한 티켓이 없습니다. 지금 바로 티켓을 구매해보세요!
              </p>
              <Button asChild>
                <Link href="/purchase">티켓 구매하기</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* 티켓 통계 */}
            <div className="grid md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Ticket className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">전체 티켓</p>
                      <p className="text-2xl font-bold text-gray-900">{tickets.length}개</p>
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
                        {tickets.filter(t => t.status === 'active').length}개
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
                      <p className="text-sm text-gray-600">사용 완료</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {tickets.filter(t => t.status === 'used').length}개
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 티켓 목록 */}
            <div className="space-y-4">
              {tickets.map((ticket) => (
                <Card key={ticket.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">
                          {getTicketTypeDisplay(ticket.ticket_type)} × {ticket.quantity}
                        </CardTitle>
                        <CardDescription>
                          주문번호: {ticket.order_id}
                        </CardDescription>
                      </div>
                      {getStatusBadge(ticket.status)}
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2 text-sm">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-600">구매일:</span>
                          <span className="font-medium">
                            {new Date(ticket.created_at).toLocaleDateString('ko-KR')}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-2 text-sm">
                          <span className="text-gray-600">금액:</span>
                          <span className="font-medium">
                            {ticket.price.toLocaleString()}원
                          </span>
                        </div>

                        {ticket.status === 'used' && ticket.used_at && (
                          <div className="flex items-center space-x-2 text-sm">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span className="text-gray-600">사용일:</span>
                            <span className="font-medium">
                              {new Date(ticket.used_at).toLocaleString('ko-KR')}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-3">
                        <div className="text-sm">
                          <span className="text-gray-600">주문 상태:</span>
                          <Badge 
                            variant={ticket.order.status === 'completed' ? 'default' : 'secondary'}
                            className="ml-2"
                          >
                            {ticket.order.status === 'completed' ? '결제완료' : 
                             ticket.order.status === 'pending' ? '결제대기' : '취소됨'}
                          </Badge>
                        </div>

                        {ticket.unique_code && (
                          <div className="text-sm">
                            <span className="text-gray-600">티켓 코드:</span>
                            <code className="ml-2 px-2 py-1 bg-gray-100 rounded text-xs">
                              {ticket.unique_code}
                            </code>
                          </div>
                        )}

                        {ticket.qr_image_url && ticket.status === 'active' && (
                          <Button variant="outline" size="sm">
                            QR 코드 보기
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 