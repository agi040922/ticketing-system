"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Home, Download, AlertCircle } from "lucide-react"

interface OrderData {
  id: string
  customer_name: string
  customer_phone: string
  customer_email?: string
  total_amount: number
  created_at: string
  status: string
  order_items: {
    ticket_type: string
    quantity: number
    price: number
  }[]
}

export default function PurchaseCompletePage() {
  const [orderData, setOrderData] = useState<OrderData | null>(null)
  const [qrCodeUrl, setQrCodeUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const searchParams = useSearchParams()

  useEffect(() => {
    const orderId = searchParams.get('orderId')
    const paymentSuccess = searchParams.get('success')
    
    if (paymentSuccess === 'true' && orderId) {
      loadOrderFromSupabase(orderId)
    } else {
      setError("주문 정보를 찾을 수 없습니다.")
    }
  }, [searchParams])

  const loadOrderFromSupabase = async (orderId: string) => {
    setIsLoading(true)
    setError("")

    try {
      // Supabase에서 주문 정보 조회
      const response = await fetch(`/api/orders/${orderId}`)
      const result = await response.json()

      if (result.success) {
        setOrderData(result.order)
        
        // QR코드 생성
        if (result.order.order_items.length > 0) {
          await generateQRCode(`TICKET:${orderId}:${result.order.customer_phone}`)
        }
      } else {
        throw new Error(result.message || "주문 정보를 불러올 수 없습니다.")
      }
    } catch (error) {
      console.error('주문 조회 오류:', error)
      setError(error instanceof Error ? error.message : '주문 정보를 불러오는 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  const generateQRCode = async (data: string) => {
    try {
      const response = await fetch(`/api/qr/generate?code=${encodeURIComponent(data)}&type=qr&width=300&format=base64`)
      const result = await response.json()
      
      if (result.success) {
        setQrCodeUrl(result.data)
      } else {
        setQrCodeUrl(generateFallbackQRCodeSVG(data))
      }
    } catch (error) {
      console.error('QR코드 생성 오류:', error)
      setQrCodeUrl(generateFallbackQRCodeSVG(data))
    }
  }

  const generateFallbackQRCodeSVG = (data: string) => {
    return `data:image/svg+xml,${encodeURIComponent(`
      <svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
        <rect width="300" height="300" fill="white"/>
        <rect x="30" y="30" width="240" height="240" fill="black"/>
        <rect x="60" y="60" width="180" height="180" fill="white"/>
        <text x="150" y="140" textAnchor="middle" fontSize="16" fill="black">입장권</text>
        <text x="150" y="160" textAnchor="middle" fontSize="12" fill="black">QR CODE</text>
        <text x="150" y="180" textAnchor="middle" fontSize="10" fill="black">${data.slice(0, 20)}</text>
      </svg>
    `)}`
  }

  const downloadQRCode = () => {
    if (qrCodeUrl && orderData) {
      const link = document.createElement('a')
      link.download = `입장권_QR코드_${orderData.id}.png`
      link.href = qrCodeUrl
      link.click()
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-lg font-semibold mb-2">주문 정보 로딩 중...</p>
            <p className="text-gray-600">잠시만 기다려주세요.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card>
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <p className="text-lg font-semibold mb-2 text-red-600">오류가 발생했습니다</p>
            <p className="text-gray-600 mb-4">{error}</p>
            <Link href="/">
              <Button>메인으로 돌아가기</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!orderData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card>
          <CardContent className="p-6">
            <p>주문 정보를 불러오는 중...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Card>
          <CardHeader className="text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <CardTitle className="text-2xl">결제가 완료되었습니다!</CardTitle>
            <CardDescription>
              입장권 구매가 성공적으로 완료되었습니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 주문 정보 */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-3">주문 정보</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>주문번호</span>
                  <span className="font-mono">{orderData.id}</span>
                </div>
                <div className="flex justify-between">
                  <span>예약자명</span>
                  <span>{orderData.customer_name}</span>
                </div>
                <div className="flex justify-between">
                  <span>연락처</span>
                  <span>{orderData.customer_phone}</span>
                </div>
                <div className="flex justify-between">
                  <span>구매일시</span>
                  <span>{new Date(orderData.created_at).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>상태</span>
                  <span className="text-green-600 font-semibold">결제완료</span>
                </div>
              </div>
            </div>

            {/* 티켓 정보 */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-3">티켓 정보</h3>
              <div className="space-y-2 text-sm">
                {orderData.order_items.map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <span>{item.ticket_type} × {item.quantity}</span>
                    <span>{(item.quantity * item.price).toLocaleString()}원</span>
                  </div>
                ))}
                <hr />
                <div className="flex justify-between font-semibold">
                  <span>총 결제금액</span>
                  <span className="text-blue-600">{orderData.total_amount.toLocaleString()}원</span>
                </div>
              </div>
            </div>

            {/* QR 코드 */}
            <div className="text-center">
              <h3 className="font-semibold mb-3">입장용 QR 코드</h3>
              <div className="bg-white p-4 rounded-lg border inline-block">
                {qrCodeUrl ? (
                  <img
                    src={qrCodeUrl}
                    alt="QR Code"
                    className="w-48 h-48 mx-auto"
                  />
                ) : (
                  <div className="w-48 h-48 mx-auto bg-gray-100 flex items-center justify-center">
                    <p className="text-gray-500">QR코드 로딩 중...</p>
                  </div>
                )}
              </div>
              <div className="mt-4 space-y-2">
                <p className="text-sm text-gray-600">현장에서 이 QR 코드를 제시해주세요</p>
                {qrCodeUrl && (
                  <Button variant="outline" size="sm" onClick={downloadQRCode}>
                    <Download className="h-4 w-4 mr-2" />
                    QR코드 다운로드
                  </Button>
                )}
              </div>
            </div>

            {/* 안내 사항 */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">이용 안내</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• 입장 시 QR 코드를 제시해주세요</li>
                <li>• 예약 확인은 휴대폰 번호로 가능합니다</li>
                <li>• 운영시간: 평일 09:00-18:00, 주말 09:00-20:00</li>
                <li>• QR코드는 1회 사용 후 무효화됩니다</li>
                <li>• 문의사항: 02-1234-5678</li>
              </ul>
            </div>

            {/* 버튼들 */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/" className="flex-1">
                <Button variant="outline" className="w-full">
                  <Home className="h-4 w-4 mr-2" />
                  메인으로
                </Button>
              </Link>
              <Link href="/reservation-check" className="flex-1">
                <Button className="w-full">예약 확인하기</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
