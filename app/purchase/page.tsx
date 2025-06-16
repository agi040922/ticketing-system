"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Minus, Plus, ArrowLeft } from "lucide-react"
import { v4 as uuidv4 } from 'uuid'

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

  const adultPrice = 25000
  const childPrice = 18000
  const totalPrice = adultCount * adultPrice + childCount * childPrice

  const handlePurchase = async () => {
    if (totalPrice === 0) {
      alert("최소 1매 이상 선택해주세요.")
      return
    }

    if (!customerInfo.name || !customerInfo.phone) {
      alert("이름과 휴대폰 번호를 입력해주세요.")
      return
    }

    setIsLoading(true)

    try {
      // Supabase에 주문 저장
      const orderId = uuidv4()
      
      const response = await fetch('/api/payment/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
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
        })
      })

      const result = await response.json()

      if (result.success) {
        // 성공 시 완료 페이지로 이동
        router.push(`/purchase/complete?orderId=${orderId}&success=true`)
      } else {
        throw new Error(result.message || "주문 처리 중 오류가 발생했습니다.")
      }
    } catch (error) {
      console.error('주문 처리 오류:', error)
      alert(error instanceof Error ? error.message : '주문 처리 중 오류가 발생했습니다.')
    } finally {
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
                <Button 
                  className="w-full" 
                  size="lg" 
                  onClick={handlePurchase} 
                  disabled={totalPrice === 0 || isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      처리 중...
                    </div>
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
