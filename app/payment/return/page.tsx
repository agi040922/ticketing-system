"use client"

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'

/**
 * 빌게이트 결제 완료 후 리턴 페이지 내부 컴포넌트
 */
function PaymentReturnContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'processing' | 'success' | 'failed'>('processing')
  const [message, setMessage] = useState('')
  const [orderInfo, setOrderInfo] = useState<any>(null)

  useEffect(() => {
    const processPaymentResult = async () => {
      try {
        // URL 파라미터에서 빌게이트 응답 데이터 추출
        const messageParam = searchParams.get('MESSAGE')
        const responseCode = searchParams.get('RESPONSE_CODE')
        const orderId = searchParams.get('ORDER_ID')

        console.log('Payment return params:', {
          messageParam,
          responseCode,
          orderId
        })

        // localStorage에서 주문 정보 가져오기
        const pendingOrderStr = localStorage.getItem('pendingOrder')
        if (pendingOrderStr) {
          const pendingOrder = JSON.parse(pendingOrderStr)
          setOrderInfo(pendingOrder)
        }

        // 결제 실패 또는 취소인 경우
        if (responseCode && responseCode !== '0000') {
          setStatus('failed')
          setMessage('결제가 취소되었거나 실패했습니다.')
          return
        }

        // MESSAGE 파라미터가 있는 경우 (정상 결제 완료)
        if (messageParam) {
          // 빌게이트 승인 API 호출
          const approvalResponse = await fetch('/api/payment/approve', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              message: messageParam,
              orderId: orderId
            })
          })

          const approvalResult = await approvalResponse.json()

          if (approvalResult.success) {
            // 성공 시 실제 주문 생성
            if (pendingOrderStr) {
              const pendingOrder = JSON.parse(pendingOrderStr)
              
              const orderResponse = await fetch('/api/payment/complete', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  ...pendingOrder,
                  paymentResult: approvalResult.data
                })
              })

              const orderResult = await orderResponse.json()

              if (orderResult.success) {
                setStatus('success')
                setMessage('결제가 성공적으로 완료되었습니다.')
                
                // localStorage 정리
                localStorage.removeItem('pendingOrder')
                
                // 3초 후 완료 페이지로 이동
                setTimeout(() => {
                  router.push(`/purchase/complete?orderId=${orderId}&success=true`)
                }, 3000)
              } else {
                setStatus('failed')
                setMessage('주문 생성 중 오류가 발생했습니다.')
              }
            }
          } else {
            setStatus('failed')
            setMessage(approvalResult.error || '결제 승인 중 오류가 발생했습니다.')
          }
        } else {
          // MESSAGE 파라미터가 없는 경우
          setStatus('failed')
          setMessage('결제 정보가 올바르지 않습니다.')
        }

      } catch (error) {
        console.error('Payment processing error:', error)
        setStatus('failed')
        setMessage('결제 처리 중 오류가 발생했습니다.')
      }
    }

    processPaymentResult()
  }, [searchParams, router])

  const handleRetry = () => {
    router.push('/purchase')
  }

  const handleHome = () => {
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {status === 'processing' && (
              <Loader2 className="h-16 w-16 text-blue-500 animate-spin" />
            )}
            {status === 'success' && (
              <CheckCircle className="h-16 w-16 text-green-500" />
            )}
            {status === 'failed' && (
              <XCircle className="h-16 w-16 text-red-500" />
            )}
          </div>
          <CardTitle className="text-xl">
            {status === 'processing' && '결제 처리 중...'}
            {status === 'success' && '결제 완료'}
            {status === 'failed' && '결제 실패'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-gray-600">
            {status === 'processing' && '결제 결과를 확인하고 있습니다. 잠시만 기다려주세요.'}
            {message}
          </p>

          {orderInfo && (
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <h3 className="font-semibold">주문 정보</h3>
              <p className="text-sm">주문번호: {orderInfo.orderId}</p>
              <p className="text-sm">상품: {orderInfo.ticketType}</p>
              <p className="text-sm">금액: {orderInfo.totalAmount?.toLocaleString()}원</p>
              <p className="text-sm">주문자: {orderInfo.customerName}</p>
            </div>
          )}

          {status === 'success' && (
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-4">
                3초 후 자동으로 완료 페이지로 이동합니다.
              </p>
              <Button onClick={() => router.push(`/purchase/complete?orderId=${orderInfo?.orderId}&success=true`)}>
                완료 페이지로 이동
              </Button>
            </div>
          )}

          {status === 'failed' && (
            <div className="flex space-x-2">
              <Button variant="outline" onClick={handleHome} className="flex-1">
                메인으로
              </Button>
              <Button onClick={handleRetry} className="flex-1">
                다시 시도
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

/**
 * 빌게이트 결제 완료 후 리턴 페이지
 * 결제창에서 결제 완료 후 사용자가 리디렉션되는 페이지
 */
export default function PaymentReturnPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Loader2 className="h-16 w-16 text-blue-500 animate-spin" />
            </div>
            <CardTitle className="text-xl">결제 처리 중...</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-600">
              결제 결과를 확인하고 있습니다. 잠시만 기다려주세요.
            </p>
          </CardContent>
        </Card>
      </div>
    }>
      <PaymentReturnContent />
    </Suspense>
  )
} 