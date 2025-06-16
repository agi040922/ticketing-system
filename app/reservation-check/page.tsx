"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Search, Ticket, Download, AlertCircle, ChevronRight } from "lucide-react"

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

export default function ReservationCheckPage() {
  const [searchType, setSearchType] = useState<"phone" | "orderId">("phone")
  const [searchValue, setSearchValue] = useState("")
  const [foundOrders, setFoundOrders] = useState<OrderData[]>([])
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null)
  const [searchError, setSearchError] = useState("")
  const [qrCodeUrl, setQrCodeUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = async () => {
    setSearchError("")
    setFoundOrders([])
    setSelectedOrder(null)
    setQrCodeUrl("")
    setIsLoading(true)

    if (!searchValue.trim()) {
      setSearchError("검색어를 입력해주세요.")
      setIsLoading(false)
      return
    }

    try {
      // Supabase API를 통한 검색
      const response = await fetch(`/api/orders/search?${searchType}=${encodeURIComponent(searchValue)}`)
      const result = await response.json()

      if (result.success) {
        if (searchType === 'orderId' && result.order) {
          // 주문 ID 검색: 단일 주문
          setFoundOrders([result.order])
          setSelectedOrder(result.order)
          await generateQRCode(`TICKET:${result.order.id}:${result.order.customer_phone}`)
        } else if (searchType === 'phone' && result.orders) {
          // 휴대폰 번호 검색: 여러 주문 가능
          setFoundOrders(result.orders)
          if (result.orders.length === 1) {
            // 주문이 하나뿐이면 자동 선택
            setSelectedOrder(result.orders[0])
            await generateQRCode(`TICKET:${result.orders[0].id}:${result.orders[0].customer_phone}`)
          }
        } else {
          setSearchError("예약 정보를 찾을 수 없습니다.")
        }
      } else {
        setSearchError("예약 정보를 찾을 수 없습니다.")
      }
    } catch (error) {
      console.error('검색 중 오류:', error)
      setSearchError("검색 중 오류가 발생했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleOrderSelect = async (order: OrderData) => {
    setSelectedOrder(order)
    setQrCodeUrl("")
    await generateQRCode(`TICKET:${order.id}:${order.customer_phone}`)
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
      <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="200" fill="white"/>
        <rect x="20" y="20" width="160" height="160" fill="black"/>
        <rect x="40" y="40" width="120" height="120" fill="white"/>
        <text x="100" y="95" textAnchor="middle" fontSize="12" fill="black">입장권</text>
        <text x="100" y="110" textAnchor="middle" fontSize="10" fill="black">QR CODE</text>
        <text x="100" y="125" textAnchor="middle" fontSize="8" fill="black">${data.slice(0, 15)}</text>
      </svg>
    `)}`
  }

  const downloadQRCode = () => {
    if (qrCodeUrl && selectedOrder) {
      const link = document.createElement('a')
      link.download = `입장권_QR코드_${selectedOrder.id}.png`
      link.href = qrCodeUrl
      link.click()
    }
  }

  const resendQRCode = async () => {
    if (!selectedOrder) return

    try {
      const response = await fetch('/api/kakao/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: selectedOrder.customer_phone,
          templateCode: 'TICKET_ISSUED',
          templateParams: {
            customerName: selectedOrder.customer_name,
            ticketType: selectedOrder.order_items.map(item => `${item.ticket_type} ${item.quantity}매`).join(', '),
            quantity: selectedOrder.order_items.reduce((sum, item) => sum + item.quantity, 0),
            qrImageUrl: qrCodeUrl
          },
          attachments: qrCodeUrl ? [{
            type: 'image' as const,
            url: qrCodeUrl
          }] : [],
          fallbackMessage: `[입장권 재전송] ${selectedOrder.customer_name}님의 입장권입니다. 주문번호: ${selectedOrder.id}`
        })
      })

      const result = await response.json()
      if (result.success) {
        alert('카카오톡으로 QR코드가 재전송되었습니다.')
      } else {
        alert('메시지 전송에 실패했습니다. 다시 시도해주세요.')
      }
    } catch (error) {
      console.error('메시지 재전송 오류:', error)
      alert('메시지 전송 중 오류가 발생했습니다.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeft className="h-4 w-4 mr-2" />
            메인으로 돌아가기
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Ticket className="h-6 w-6 mr-2" />
              예약 확인
            </CardTitle>
            <CardDescription>휴대폰 번호 또는 주문번호로 예약 정보를 확인하세요</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 검색 옵션 */}
            <div className="flex space-x-4">
              <Button
                variant={searchType === "phone" ? "default" : "outline"}
                onClick={() => {
                  setSearchType("phone")
                  setSearchValue("")
                  setFoundOrders([])
                  setSelectedOrder(null)
                  setSearchError("")
                  setQrCodeUrl("")
                }}
                disabled={isLoading}
              >
                휴대폰 번호
              </Button>
              <Button
                variant={searchType === "orderId" ? "default" : "outline"}
                onClick={() => {
                  setSearchType("orderId")
                  setSearchValue("")
                  setFoundOrders([])
                  setSelectedOrder(null)
                  setSearchError("")
                  setQrCodeUrl("")
                }}
                disabled={isLoading}
              >
                주문번호
              </Button>
            </div>

            {/* 검색 입력 */}
            <div className="space-y-2">
              <Label htmlFor="search">{searchType === "phone" ? "휴대폰 번호" : "주문번호"}</Label>
              <div className="flex space-x-2">
                <Input
                  id="search"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder={searchType === "phone" ? "010-1234-5678" : "주문번호를 입력하세요"}
                  onKeyPress={(e) => e.key === "Enter" && !isLoading && handleSearch()}
                  disabled={isLoading}
                />
                <Button onClick={handleSearch} disabled={isLoading}>
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* 에러 메시지 */}
            {searchError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                <p className="text-red-600 text-sm">{searchError}</p>
              </div>
            )}

            {/* 여러 주문 목록 (휴대폰 번호 검색 시) */}
            {foundOrders.length > 1 && (
              <div className="space-y-4">
                <hr />
                <h3 className="font-semibold text-lg">검색된 주문 목록 ({foundOrders.length}건)</h3>
                <div className="space-y-2">
                  {foundOrders.map((order) => (
                    <div
                      key={order.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedOrder?.id === order.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleOrderSelect(order)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold">
                            {new Date(order.created_at).toLocaleDateString()} 주문
                          </div>
                          <div className="text-sm text-gray-600">
                            {order.order_items.map(item => `${item.ticket_type} ${item.quantity}매`).join(', ')}
                          </div>
                          <div className="text-sm font-medium text-blue-600">
                            {order.total_amount.toLocaleString()}원
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span className={`text-xs px-2 py-1 rounded ${
                            order.status === 'completed' ? 'bg-green-100 text-green-600' :
                            order.status === 'cancelled' ? 'bg-red-100 text-red-600' :
                            'bg-yellow-100 text-yellow-600'
                          }`}>
                            {order.status === 'completed' ? '결제완료' :
                             order.status === 'cancelled' ? '취소됨' : order.status}
                          </span>
                          <ChevronRight className="h-4 w-4 ml-2 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 선택된 주문 상세 정보 */}
            {selectedOrder && (
              <div className="space-y-4">
                <hr />
                <h3 className="font-semibold text-lg">주문 상세 정보</h3>

                {/* 주문 정보 */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3">주문 정보</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>주문번호</span>
                      <span className="font-mono">{selectedOrder.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>예약자명</span>
                      <span>{selectedOrder.customer_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>연락처</span>
                      <span>{selectedOrder.customer_phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>구매일시</span>
                      <span>{new Date(selectedOrder.created_at).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>상태</span>
                      <span className={`font-semibold ${
                        selectedOrder.status === "completed" ? "text-green-600" : 
                        selectedOrder.status === "cancelled" ? "text-red-600" : "text-yellow-600"
                      }`}>
                        {selectedOrder.status === "completed" ? "결제완료" : 
                         selectedOrder.status === "cancelled" ? "취소됨" : selectedOrder.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 티켓 정보 */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3">티켓 정보</h4>
                  <div className="space-y-2 text-sm">
                    {selectedOrder.order_items.map((item, index) => (
                      <div key={index} className="flex justify-between">
                        <span>{item.ticket_type} × {item.quantity}</span>
                        <span>{(item.quantity * item.price).toLocaleString()}원</span>
                      </div>
                    ))}
                    <hr />
                    <div className="flex justify-between font-semibold">
                      <span>총 결제금액</span>
                      <span className="text-blue-600">{selectedOrder.total_amount.toLocaleString()}원</span>
                    </div>
                  </div>
                </div>

                {/* QR 코드 */}
                {selectedOrder.status === "completed" && (
                  <div className="text-center">
                    <h4 className="font-semibold mb-3">입장용 QR 코드</h4>
                    <div className="bg-white p-4 rounded-lg border inline-block">
                      {qrCodeUrl ? (
                        <img
                          src={qrCodeUrl}
                          alt="QR Code"
                          className="w-36 h-36 mx-auto"
                        />
                      ) : (
                        <div className="w-36 h-36 mx-auto bg-gray-100 flex items-center justify-center">
                          <p className="text-gray-500 text-sm">QR코드 로딩 중...</p>
                        </div>
                      )}
                    </div>
                    <div className="mt-4 space-y-2">
                      <p className="text-sm text-gray-600">현장에서 이 QR 코드를 제시해주세요</p>
                      <div className="flex flex-col sm:flex-row gap-2 justify-center">
                        {qrCodeUrl && (
                          <Button variant="outline" size="sm" onClick={downloadQRCode}>
                            <Download className="h-4 w-4 mr-2" />
                            QR코드 다운로드
                          </Button>
                        )}
                        <Button variant="outline" size="sm" onClick={resendQRCode}>
                          📱 카카오톡 재전송
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 취소된 티켓 안내 */}
                {selectedOrder.status === "cancelled" && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                    <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                    <h4 className="font-semibold text-red-800 mb-2">취소된 예약</h4>
                    <p className="text-red-600 text-sm">이 예약은 취소되었습니다. 환불 처리는 영업일 기준 3-5일 소요됩니다.</p>
                  </div>
                )}
              </div>
            )}

            {/* 안내 사항 */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">검색 안내</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• 휴대폰 번호는 하이픈(-) 포함하여 입력해주세요</li>
                <li>• 주문번호는 결제 완료 시 발급된 번호입니다</li>
                <li>• 한 번에 여러 주문이 있는 경우 목록에서 선택하세요</li>
                <li>• QR코드 분실 시 카카오톡 재전송이 가능합니다</li>
                <li>• 예약 취소는 고객센터로 문의해주세요</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
