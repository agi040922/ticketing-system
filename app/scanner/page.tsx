"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, CheckCircle, XCircle, AlertCircle, User, Settings, Ticket } from "lucide-react"
import { useRouter } from "next/navigation"

interface ScanResult {
  type: "success" | "error" | "warning"
  message: string
  ticketInfo?: any
}

interface TicketInfo {
  orderNumber: string
  customerName: string
  customerPhone: string
  customerEmail?: string
  orderDate: string
  status: 'active' | 'used'
  usedAt?: string
  usedLocation?: string
  ticketItems: {
    type: string
    quantity: number
    price: number
    totalPrice: number
  }[]
  totalAmount: number
  orderStatus: string
  adminInfo?: {
    customerId: string
    paymentMethod: string
    refundStatus: string
    specialNotes: string
    createdAt: string
    updatedAt: string
    scanHistory: {
      scannedAt: string
      scannerId: string
      location: string
      ipAddress?: string
    }[]
  }
}

export default function ScannerPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  // URL 파라미터에서 code 읽기
  const codeFromUrl = searchParams.get('code')
  
  const [scanResult, setScanResult] = useState<ScanResult | null>(null)
  const [ticketInfo, setTicketInfo] = useState<TicketInfo | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    // 로그인 상태 확인
    const loggedIn = localStorage.getItem("scannerLoggedIn") === "true"
    setIsLoggedIn(loggedIn)

    // URL에서 코드가 있는 경우 티켓 정보 조회
    if (codeFromUrl) {
      loadTicketInfo(codeFromUrl)
    } else {
      // 코드가 없으면 홈으로 리다이렉트
      router.push('/reservation-check')
    }
  }, [codeFromUrl, router])

  const loadTicketInfo = async (code: string) => {
    try {
      setIsProcessing(true)
      
      // 관리자 헤더 추가
      const headers: HeadersInit = {
        'Content-Type': 'application/json'
      }
      
      if (isLoggedIn) {
        headers['x-admin'] = 'true'
      }

      const response = await fetch(`/api/tickets/info?code=${encodeURIComponent(code)}`, {
        headers
      })
      const result = await response.json()

      if (result.success) {
        setTicketInfo(result.ticketInfo)
      } else {
        setScanResult({
          type: "error",
          message: result.message || "티켓 정보를 조회할 수 없습니다."
        })
      }
    } catch (error) {
      console.error('티켓 정보 조회 오류:', error)
      setScanResult({
        type: "error",
        message: "티켓 정보를 조회하는 중 오류가 발생했습니다."
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleStatusChange = async (action: 'use' | 'unuse') => {
    if (!codeFromUrl || !isLoggedIn) return

    try {
      setIsProcessing(true)
      const response = await fetch('/api/tickets/status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer scanner_admin'
        },
        body: JSON.stringify({
          uniqueCode: codeFromUrl,
          action: action,
          scannerId: 'web_admin',
          location: '웹 관리자'
        })
      })

      const result = await response.json()

      if (result.success) {
        // 티켓 정보 다시 로드
        await loadTicketInfo(codeFromUrl)
        setScanResult({
          type: "success",
          message: result.message
        })
      } else {
        setScanResult({
          type: "error",
          message: result.message
        })
      }
    } catch (error) {
      console.error('상태 변경 오류:', error)
      setScanResult({
        type: "error",
        message: "상태 변경 중 오류가 발생했습니다."
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("scannerLoggedIn")
    setIsLoggedIn(false)
    // 로그아웃 후 현재 페이지 새로고침
    window.location.reload()
  }

  const handleLogin = () => {
    router.push("/scanner/login")
  }

  const getResultIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-8 w-8 text-green-500" />
      case "error":
        return <XCircle className="h-8 w-8 text-red-500" />
      case "warning":
        return <AlertCircle className="h-8 w-8 text-yellow-500" />
      default:
        return null
    }
  }

  const getResultColor = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200"
      case "error":
        return "bg-red-50 border-red-200"
      case "warning":
        return "bg-yellow-50 border-yellow-200"
      default:
        return "bg-gray-50 border-gray-200"
    }
  }

  // 티켓 정보 표시 화면
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeft className="h-4 w-4 mr-2" />
            메인으로 돌아가기
          </Link>
          <div className="flex gap-2">
            {!isLoggedIn ? (
              <Button variant="outline" onClick={handleLogin}>
                <User className="h-4 w-4 mr-2" />
                운영자 로그인
              </Button>
            ) : (
              <Button variant="outline" onClick={handleLogout}>
                로그아웃
              </Button>
            )}
          </div>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl flex items-center justify-center">
              <Ticket className="h-6 w-6 mr-2 text-blue-600" />
              🎫 예약 확인
            </CardTitle>
            <CardDescription>
              {isLoggedIn ? 
                "QR코드로 접근한 예약의 상세 정보 및 관리 기능" : 
                "QR코드로 접근한 예약의 상세 정보입니다"
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {isProcessing ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">티켓 정보를 조회하고 있습니다...</p>
              </div>
            ) : ticketInfo ? (
              <div className="space-y-4">
                {/* 티켓 상태 표시 */}
                <div className={`p-4 rounded-lg border-2 ${ticketInfo.status === 'used' ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
                  <div className="flex items-center justify-center mb-2">
                    {ticketInfo.status === 'used' ? (
                      <XCircle className="h-8 w-8 text-red-500 mr-2" />
                    ) : (
                      <CheckCircle className="h-8 w-8 text-green-500 mr-2" />
                    )}
                    <h3 className="text-xl font-bold">
                      {ticketInfo.status === 'used' ? '🔴 사용 완료' : '🟢 사용 가능'}
                    </h3>
                  </div>
                  <p className="text-center text-sm">
                    {ticketInfo.status === 'used' 
                      ? '이 티켓은 이미 사용되었습니다' 
                      : '이 티켓은 사용 가능한 상태입니다'
                    }
                  </p>
                </div>

                {/* 주문 정보 */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3 flex items-center">
                    📋 주문 정보
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>주문번호</span>
                      <span className="font-mono">{ticketInfo.orderNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>예약자명</span>
                      <span>{ticketInfo.customerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>연락처</span>
                      <span>{ticketInfo.customerPhone}</span>
                    </div>
                    {ticketInfo.customerEmail && (
                      <div className="flex justify-between">
                        <span>이메일</span>
                        <span className="text-xs">{ticketInfo.customerEmail}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>주문일시</span>
                      <span>{new Date(ticketInfo.orderDate).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>주문상태</span>
                      <span className={`font-semibold ${
                        ticketInfo.orderStatus === "completed" ? "text-green-600" : 
                        ticketInfo.orderStatus === "cancelled" ? "text-red-600" : "text-yellow-600"
                      }`}>
                        {ticketInfo.orderStatus === "completed" ? "결제완료" : 
                         ticketInfo.orderStatus === "cancelled" ? "취소됨" : ticketInfo.orderStatus}
                      </span>
                    </div>
                    {ticketInfo.usedAt && (
                      <div className="flex justify-between">
                        <span>사용시간</span>
                        <span>{new Date(ticketInfo.usedAt).toLocaleString()}</span>
                      </div>
                    )}
                    {ticketInfo.usedLocation && (
                      <div className="flex justify-between">
                        <span>사용위치</span>
                        <span>{ticketInfo.usedLocation}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* 티켓 상세 정보 */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3 flex items-center">
                    🎫 티켓 정보
                  </h4>
                  <div className="space-y-2 text-sm">
                    {ticketInfo.ticketItems.map((item, index) => (
                      <div key={index} className="flex justify-between">
                        <span>{item.type} × {item.quantity}</span>
                        <span>{item.totalPrice.toLocaleString()}원</span>
                      </div>
                    ))}
                    <hr />
                    <div className="flex justify-between font-semibold">
                      <span>총 결제금액</span>
                      <span className="text-blue-600">{ticketInfo.totalAmount.toLocaleString()}원</span>
                    </div>
                  </div>
                </div>

                {/* 관리자 전용 상세 정보 */}
                {isLoggedIn && ticketInfo.adminInfo && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div className="flex items-center mb-3">
                      <Settings className="h-5 w-5 text-orange-600 mr-2" />
                      <h4 className="font-semibold text-orange-800">🔧 관리자 상세 정보</h4>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div className="flex justify-between">
                          <span className="font-medium">고객ID:</span>
                          <span className="font-mono text-xs">{ticketInfo.adminInfo.customerId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">결제방법:</span>
                          <span>{ticketInfo.adminInfo.paymentMethod}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">환불상태:</span>
                          <span className={`font-semibold ${
                            ticketInfo.adminInfo.refundStatus === 'none' ? 'text-green-600' :
                            ticketInfo.adminInfo.refundStatus === 'requested' ? 'text-yellow-600' :
                            ticketInfo.adminInfo.refundStatus === 'completed' ? 'text-blue-600' : 'text-red-600'
                          }`}>
                            {ticketInfo.adminInfo.refundStatus === 'none' ? '환불없음' :
                             ticketInfo.adminInfo.refundStatus === 'requested' ? '환불요청' :
                             ticketInfo.adminInfo.refundStatus === 'completed' ? '환불완료' : ticketInfo.adminInfo.refundStatus}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">최종수정:</span>
                          <span className="text-xs">{new Date(ticketInfo.adminInfo.updatedAt).toLocaleString()}</span>
                        </div>
                      </div>
                      
                      {ticketInfo.adminInfo.specialNotes && (
                        <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded">
                          <span className="font-medium text-yellow-800">특이사항:</span>
                          <p className="text-yellow-700 text-xs mt-1">{ticketInfo.adminInfo.specialNotes}</p>
                        </div>
                      )}

                      {/* 스캔 히스토리 */}
                      {ticketInfo.adminInfo.scanHistory.length > 0 && (
                        <div className="mt-3">
                          <h5 className="font-medium text-orange-800 mb-2">📊 사용 기록</h5>
                          <div className="space-y-1">
                            {ticketInfo.adminInfo.scanHistory.map((scan, index) => (
                              <div key={index} className="p-2 bg-white rounded border text-xs">
                                <div className="flex justify-between">
                                  <span className="font-medium">🕒 {new Date(scan.scannedAt).toLocaleString()}</span>
                                  <span className="text-orange-600">{scan.location}</span>
                                </div>
                                <div className="text-gray-600 mt-1">
                                  스캐너: {scan.scannerId}
                                  {scan.ipAddress && ` (${scan.ipAddress})`}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 운영자 전용 기능 - 큰 버튼으로 터치하기 쉽게 */}
                {isLoggedIn && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <div className="flex items-center mb-4">
                      <Settings className="h-6 w-6 text-blue-600 mr-2" />
                      <h4 className="font-semibold text-blue-800 text-lg">🔧 운영자 기능</h4>
                    </div>
                    
                    <div className="space-y-4">
                      {ticketInfo.status === 'active' ? (
                        <div className="text-center">
                          <Button 
                            onClick={() => handleStatusChange('use')}
                            disabled={isProcessing}
                            className="w-full h-16 text-lg font-bold bg-red-600 hover:bg-red-700 text-white"
                            size="lg"
                          >
                            {isProcessing ? (
                              <div className="flex items-center">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                                처리 중...
                              </div>
                            ) : (
                              <div className="flex flex-col items-center">
                                <span className="text-2xl">🔴</span>
                                <span>사용 처리</span>
                              </div>
                            )}
                          </Button>
                          <p className="text-sm text-blue-600 mt-2">
                            💡 터치하여 티켓을 사용 완료 상태로 변경
                          </p>
                        </div>
                      ) : (
                        <div className="text-center">
                          <Button 
                            onClick={() => handleStatusChange('unuse')}
                            disabled={isProcessing}
                            className="w-full h-16 text-lg font-bold bg-green-600 hover:bg-green-700 text-white"
                            size="lg"
                          >
                            {isProcessing ? (
                              <div className="flex items-center">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                                처리 중...
                              </div>
                            ) : (
                              <div className="flex flex-col items-center">
                                <span className="text-2xl">🟢</span>
                                <span>사용 취소</span>
                              </div>
                            )}
                          </Button>
                          <p className="text-sm text-blue-600 mt-2">
                            💡 터치하여 티켓을 사용 가능 상태로 복원
                          </p>
                        </div>
                      )}
                      
                      <div className="bg-blue-100 p-3 rounded text-center">
                        <p className="text-blue-800 font-medium">📱 터치 한 번으로 상태 변경</p>
                        <p className="text-blue-600 text-sm mt-1">
                          {ticketInfo.status === 'active' 
                            ? '고객이 입장할 때 "사용 처리" 버튼을 터치하세요' 
                            : '잘못 처리된 경우 "사용 취소" 버튼으로 복원하세요'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 일반 사용자 안내 */}
                {!isLoggedIn && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <AlertCircle className="h-5 w-5 text-blue-600 mr-2" />
                      <h4 className="font-semibold text-blue-800">📋 이용 안내</h4>
                    </div>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• 현장 입장 시 이 QR코드를 제시해주세요</li>
                      <li>• 티켓은 1회만 사용 가능하며, 사용 후 재입장 불가</li>
                      <li>• 예약 변경이나 취소는 고객센터로 문의해주세요</li>
                      <li>• 분실 시 예약자 본인 확인 후 재발급 가능</li>
                      <li>• 문의: 고객센터 1588-0000</li>
                    </ul>
                  </div>
                )}

                {/* QR코드 다운로드 */}
                {!isLoggedIn && ticketInfo.orderStatus === "completed" && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                    <h4 className="font-semibold text-green-800 mb-2">📱 QR코드 저장</h4>
                    <p className="text-sm text-green-700 mb-3">
                      이 화면을 스크린샷으로 저장하거나 북마크해두세요
                    </p>
                    <div className="flex justify-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          if (navigator.share) {
                            navigator.share({
                              title: '입장권 QR코드',
                              text: `${ticketInfo.customerName}님의 입장권`,
                              url: window.location.href
                            });
                          } else {
                            navigator.clipboard.writeText(window.location.href);
                            alert('링크가 복사되었습니다.');
                          }
                        }}
                        className="text-green-700 border-green-300"
                      >
                        🔗 링크 공유
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.print()}
                        className="text-green-700 border-green-300"
                      >
                        🖨️ 프린트
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">예약 정보를 찾을 수 없습니다</h3>
                <p className="text-gray-600 mb-4">
                  유효하지 않은 QR코드이거나 취소된 예약일 수 있습니다.
                </p>
                <div className="space-y-2">
                  <div className="text-sm text-gray-500">
                    <Link href="/reservation-check" className="text-blue-600 hover:underline">
                      휴대폰 번호로 예약 확인하기
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* 결과 메시지 */}
            {scanResult && (
              <div className={`border rounded-lg p-4 ${getResultColor(scanResult.type)}`}>
                <div className="flex items-center mb-2">
                  {getResultIcon(scanResult.type)}
                  <p className="ml-3 font-semibold">{scanResult.message}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
