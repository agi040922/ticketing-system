"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Minus, Plus, ArrowLeft } from "lucide-react"
import { v4 as uuidv4 } from 'uuid'

// 빌게이트 GX_pay 함수 타입 선언
declare global {
  interface Window {
    GX_pay: (formId: string, windowType: string, protocol?: string) => void;
  }
}

export default function PurchasePage() {
  const router = useRouter()
  const [adultCount, setAdultCount] = useState(0)
  const [childCount, setChildCount] = useState(0)
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    email: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isScriptLoaded, setIsScriptLoaded] = useState(false)

  const adultPrice = 25000
  const childPrice = 18000
  const totalPrice = adultCount * adultPrice + childCount * childPrice

  // 빌게이트 JavaScript SDK 로드
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://pay.billgate.net/paygate/plugin/gx_web_client.js'
    script.async = true
    script.onload = () => {
      console.log('빌게이트 SDK 로드 완료')
      setIsScriptLoaded(true)
    }
    script.onerror = () => {
      console.error('빌게이트 SDK 로드 실패')
    }
    
    document.head.appendChild(script)

    return () => {
      // 컴포넌트 언마운트 시 스크립트 제거
      const existingScript = document.querySelector('script[src="https://pay.billgate.net/paygate/plugin/gx_web_client.js"]')
      if (existingScript) {
        document.head.removeChild(existingScript)
      }
    }
  }, [])

  const handlePurchase = async () => {
    if (totalPrice === 0) {
      alert("최소 1매 이상 선택해주세요.")
      return
    }

    if (!customerInfo.name || !customerInfo.phone) {
      alert("이름과 휴대폰 번호를 입력해주세요.")
      return
    }

    if (!isScriptLoaded) {
      alert("결제 시스템을 준비 중입니다. 잠시 후 다시 시도해주세요.")
      return
    }

    setIsLoading(true)

    try {
      // 환경변수 디버깅
      console.log('BILLGATE_SERVICE_ID:', process.env.NEXT_PUBLIC_BILLGATE_SERVICE_ID)
      
      // 주문 ID 생성 (빌게이트 형식에 맞게)
      const orderId = `ORDER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      // 빌게이트 결제 준비 API 호출
      const prepareResponse = await fetch('/api/payment/prepare', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serviceId: process.env.NEXT_PUBLIC_BILLGATE_SERVICE_ID || 'M2103135',
          orderId: orderId,
          amount: totalPrice
        })
      })

      const prepareResult = await prepareResponse.json()

      if (!prepareResult.success) {
        throw new Error(prepareResult.error || "결제 준비 중 오류가 발생했습니다.")
      }

      // 주문 정보를 localStorage에 임시 저장 (결제 완료 후 사용)
      localStorage.setItem('pendingOrder', JSON.stringify({
          orderId: orderId,
          customerId: customerInfo.email || customerInfo.phone,
          ticketType: `대인 ${adultCount}매, 소인 ${childCount}매`,
          quantity: adultCount + childCount,
          totalAmount: totalPrice,
          customerPhone: customerInfo.phone,
          customerName: customerInfo.name,
          customerEmail: customerInfo.email,
          adultCount: adultCount,
          childCount: childCount
      }))

      // 빌게이트 결제창 호출
      openBillgatePayment(prepareResult.data)

    } catch (error) {
      console.error('결제 준비 오류:', error)
      alert(error instanceof Error ? error.message : '결제 준비 중 오류가 발생했습니다.')
      setIsLoading(false)
    }
  }

  // 빌게이트 결제창 호출 함수 (올바른 방법)
  const openBillgatePayment = (paymentData: any) => {
    try {
      // 기존 결제 폼이 있다면 제거
      const existingForm = document.getElementById('billgate-payment-form')
      if (existingForm) {
        existingForm.remove()
      }

      // 결제 폼 생성
      const form = document.createElement('form')
      form.id = 'billgate-payment-form'
      form.name = 'billgate-payment-form'
      form.method = 'POST'
      form.action = paymentData.PAYMENT_URL
      form.style.display = 'none'
      
      // 결제 파라미터들을 Hidden Input으로 추가
      const params = {
        SERVICE_ID: paymentData.SERVICE_ID,
        SERVICE_TYPE: paymentData.SERVICE_TYPE,
        SERVICE_CODE: paymentData.SERVICE_CODE,
        ORDER_ID: paymentData.ORDER_ID,
        ORDER_DATE: paymentData.ORDER_DATE,
        AMOUNT: paymentData.AMOUNT,
        CHECK_SUM: paymentData.CHECK_SUM,
        RETURN_URL: paymentData.RETURN_URL,
        CANCEL_FLAG: paymentData.CANCEL_FLAG,
        ITEM_NAME: `어드벤처 입장권 ${adultCount + childCount}매`,
        ITEM_CODE: 'ADVENTURE_TICKET',
        USER_NAME: customerInfo.name,
        USER_EMAIL: customerInfo.email || '',
        USER_PHONE: customerInfo.phone,
        RESERVED1: '',
        RESERVED2: '',
        RESERVED3: ''
      }

      Object.entries(params).forEach(([key, value]) => {
        const input = document.createElement('input')
        input.type = 'hidden'
        input.name = key
        input.value = (value || '').toString()
        form.appendChild(input)
      })

      // 폼을 DOM에 추가
      document.body.appendChild(form)

      // 빌게이트 GX_pay 함수 호출 (팝업으로 결제창 열기)
      if (window.GX_pay) {
        console.log('빌게이트 결제창 호출 중...')
        window.GX_pay('billgate-payment-form', 'popup', 'https_pay')
      } else {
        throw new Error('빌게이트 결제 시스템이 로드되지 않았습니다.')
      }

      // 결제창이 열린 후 로딩 상태 해제
      setTimeout(() => {
        setIsLoading(false)
      }, 2000)

    } catch (error) {
      console.error('결제창 열기 오류:', error)
      alert('결제창을 열 수 없습니다. 다시 시도해주세요.')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeft className="h-4 w-4 mr-2" />
            메인으로 돌아가기
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* 티켓 선택 */}
          <Card>
            <CardHeader>
              <CardTitle>입장권 선택</CardTitle>
              <CardDescription>원하시는 입장권 수량을 선택해주세요</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 대인 티켓 */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-semibold">대인</h3>
                  <p className="text-sm text-gray-600">만 19세 이상</p>
                  <p className="text-lg font-bold text-blue-600">{adultPrice.toLocaleString()}원</p>
                </div>
                <div className="flex items-center space-x-3">
                  <Button variant="outline" size="icon" onClick={() => setAdultCount(Math.max(0, adultCount - 1))}>
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center font-semibold">{adultCount}</span>
                  <Button variant="outline" size="icon" onClick={() => setAdultCount(adultCount + 1)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* 소인 티켓 */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-semibold">소인</h3>
                  <p className="text-sm text-gray-600">만 4세 ~ 18세</p>
                  <p className="text-lg font-bold text-blue-600">{childPrice.toLocaleString()}원</p>
                </div>
                <div className="flex items-center space-x-3">
                  <Button variant="outline" size="icon" onClick={() => setChildCount(Math.max(0, childCount - 1))}>
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center font-semibold">{childCount}</span>
                  <Button variant="outline" size="icon" onClick={() => setChildCount(childCount + 1)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 고객 정보 및 결제 */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>고객 정보</CardTitle>
                <CardDescription>예약자 정보를 입력해주세요</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">이름 *</Label>
                  <Input
                    id="name"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                    placeholder="이름을 입력하세요"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">휴대폰 번호 *</Label>
                  <Input
                    id="phone"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                    placeholder="010-1234-5678"
                  />
                </div>
                <div>
                  <Label htmlFor="email">이메일</Label>
                  <Input
                    id="email"
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                    placeholder="example@email.com"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>주문 요약</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {adultCount > 0 && (
                  <div className="flex justify-between">
                    <span>대인 × {adultCount}</span>
                    <span>{(adultCount * adultPrice).toLocaleString()}원</span>
                  </div>
                )}
                {childCount > 0 && (
                  <div className="flex justify-between">
                    <span>소인 × {childCount}</span>
                    <span>{(childCount * childPrice).toLocaleString()}원</span>
                  </div>
                )}
                <hr />
                <div className="flex justify-between text-lg font-bold">
                  <span>총 결제금액</span>
                  <span className="text-blue-600">{totalPrice.toLocaleString()}원</span>
                </div>
                
                {/* 빌게이트 SDK 로딩 상태 표시 */}
                {!isScriptLoaded && (
                  <div className="text-sm text-yellow-600 bg-yellow-50 p-2 rounded">
                    ⏳ 결제 시스템을 준비 중입니다...
                  </div>
                )}
                
                <Button 
                  className="w-full" 
                  size="lg" 
                  onClick={handlePurchase} 
                  disabled={totalPrice === 0 || isLoading || !isScriptLoaded}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      처리 중...
                    </div>
                  ) : !isScriptLoaded ? (
                    '결제 시스템 준비 중...'
                  ) : (
                    '결제하기'
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
