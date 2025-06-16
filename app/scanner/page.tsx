"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Camera, CheckCircle, XCircle, AlertCircle, StopCircle, Smartphone, Monitor } from "lucide-react"
import { useRouter } from "next/navigation"

interface ScanResult {
  type: "success" | "error" | "warning"
  message: string
  ticketInfo?: any
}

// QrScanner 동적 import
let QrScanner: any

export default function ScannerPage() {
  const [scanResult, setScanResult] = useState<ScanResult | null>(null)
  const [manualInput, setManualInput] = useState("")
  const [isScanning, setIsScanning] = useState(false)
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null)
  const [availableCameras, setAvailableCameras] = useState<any[]>([])
  const [libraryLoaded, setLibraryLoaded] = useState(false)
  const [loadingError, setLoadingError] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [scanMode, setScanMode] = useState<"native" | "web">("native")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const scannerRef = useRef<any>(null)
  const router = useRouter()

  useEffect(() => {
    // 현장 스캐너 로그인 확인
    const isLoggedIn = localStorage.getItem("scannerLoggedIn")
    if (!isLoggedIn) {
      router.push("/scanner/login")
      return
    }

    // 모바일 기기 감지
    const checkMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase()
      const mobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test(userAgent)
      setIsMobile(mobile)
      setScanMode(mobile ? "native" : "web")
    }
    
    checkMobile()

    // QrScanner 라이브러리 동적 로드 (웹 카메라용)
    loadQrCodeLibrary()
    
    return () => {
      // 컴포넌트 언마운트 시 스캐너 정리
      cleanupScanner()
    }
  }, [router])

  const cleanupScanner = () => {
    try {
      if (scannerRef.current) {
        scannerRef.current.destroy()
        scannerRef.current = null
      }
    } catch (error) {
      console.log('스캐너 정리 중 오류 (무시 가능):', error)
    }
  }

  const loadQrCodeLibrary = async () => {
    try {
      setLoadingError(null)
      const module = await import('qr-scanner')
      QrScanner = module.default
      
      setLibraryLoaded(true)
      
      // 카메라 권한 확인 (웹 카메라 모드일 때만)
      if (!isMobile) {
        await checkCameraPermission()
      }
    } catch (error) {
      console.error('QR코드 라이브러리 로드 실패:', error)
      setLoadingError('QR코드 스캐너를 로드할 수 없습니다. 페이지를 새로고침해주세요.')
    }
  }

  const checkCameraPermission = async () => {
    try {
      // 먼저 카메라 장치가 있는지 확인
      const devices = await navigator.mediaDevices.enumerateDevices()
      const videoDevices = devices.filter(device => device.kind === 'videoinput')
      
      console.log('사용 가능한 비디오 장치:', videoDevices)
      
      if (videoDevices.length === 0) {
        console.log('카메라 장치를 찾을 수 없습니다')
        setCameraPermission(false)
        return
      }

      const hasCamera = await QrScanner.hasCamera()
      if (!hasCamera) {
        console.log('QrScanner에서 카메라를 감지하지 못했습니다')
        setCameraPermission(false)
        return
      }

      // 카메라 권한 요청
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      })
      
      console.log('카메라 스트림 획득 성공:', stream)
      setCameraPermission(true)
      stream.getTracks().forEach(track => track.stop()) // 권한 확인 후 스트림 종료
      
      // 사용 가능한 카메라 목록 가져오기
      const cameras = await QrScanner.listCameras(true)
      console.log('사용 가능한 카메라:', cameras)
      setAvailableCameras(cameras)
    } catch (error) {
      console.error('카메라 권한 확인 실패:', error)
      if (error instanceof Error) {
        console.error('에러 이름:', error.name)
        console.error('에러 메시지:', error.message)
      }
      setCameraPermission(false)
    }
  }

  const processTicketCode = async (code: string) => {
    try {
      // 실제 API 호출
      const response = await fetch('/api/tickets/scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uniqueCode: code,
          scannerId: 'scanner_main_gate',
          location: '메인 게이트'
        })
      })

      const result = await response.json()

      if (result.success) {
        return {
          type: "success" as const,
          message: result.message || "입장이 허용되었습니다.",
          ticketInfo: result.ticketInfo,
        }
      } else {
        // 409는 이미 사용된 티켓
        if (response.status === 409) {
          return {
            type: "warning" as const,
            message: result.message || "이미 사용된 티켓입니다.",
            ticketInfo: result.ticketInfo,
          }
        } else {
          return {
            type: "error" as const,
            message: result.message || "유효하지 않은 티켓입니다.",
          }
        }
      }
    } catch (error) {
      console.error('티켓 처리 오류:', error)
      return {
        type: "error" as const,
        message: "스캔 처리 중 오류가 발생했습니다.",
      }
    }
  }

  const handleManualScan = async () => {
    if (!manualInput.trim()) {
      setScanResult({
        type: "error",
        message: "코드를 입력해주세요.",
      })
      return
    }

    const result = await processTicketCode(manualInput.trim())
    setScanResult(result)
    setManualInput("")
  }

  // 네이티브 카메라 앱 열기
  const openNativeCamera = () => {
    // 파일 입력을 카메라 모드로 설정
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute('capture', 'environment')
      fileInputRef.current.click()
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!QrScanner) {
      setScanResult({
        type: "error",
        message: "QR코드 라이브러리가 로드되지 않았습니다.",
      })
      return
    }

    try {
      // QrScanner를 사용하여 이미지에서 QR코드 스캔
      const qrCodeMessage = await QrScanner.scanImage(file, { returnDetailedScanResult: false })
      const result = await processTicketCode(qrCodeMessage)
      setScanResult(result)
    } catch (error) {
      console.error('파일 스캔 오류:', error)
      setScanResult({
        type: "error",
        message: "QR 코드를 인식할 수 없습니다. 다시 촬영해주세요.",
      })
    }

    // 파일 입력 초기화
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const startWebCameraScanning = async () => {
    if (!QrScanner || !libraryLoaded) {
      setScanResult({
        type: "error",
        message: "QR코드 스캐너가 준비되지 않았습니다.",
      })
      return
    }

    if (cameraPermission === false) {
      setScanResult({
        type: "error",
        message: "카메라 권한이 필요합니다.",
      })
      return
    }

    if (!videoRef.current) {
      setScanResult({
        type: "error",
        message: "비디오 요소를 찾을 수 없습니다.",
      })
      return
    }

    try {
      setIsScanning(true)
      setScanResult(null)

      scannerRef.current = new QrScanner(
        videoRef.current,
        async (result: any) => {
          // 스캔 성공
          try {
            const qrCode = typeof result === 'string' ? result : result.data
            const scanResult = await processTicketCode(qrCode)
            setScanResult(scanResult)
            stopWebCameraScanning()
          } catch (error) {
            console.error('스캔 처리 오류:', error)
            setScanResult({
              type: "error",
              message: "스캔 처리 중 오류가 발생했습니다.",
            })
            stopWebCameraScanning()
          }
        },
        {
          returnDetailedScanResult: false,
          highlightScanRegion: true,
          highlightCodeOutline: true,
        }
      )

      await scannerRef.current.start()
    } catch (error) {
      console.error('카메라 스캔 시작 오류:', error)
      setScanResult({
        type: "error",
        message: "카메라 스캔을 시작할 수 없습니다. 네이티브 카메라를 사용해보세요.",
      })
      setIsScanning(false)
    }
  }

  const stopWebCameraScanning = () => {
    try {
      if (scannerRef.current) {
        scannerRef.current.stop()
        scannerRef.current.destroy()
        scannerRef.current = null
      }
    } catch (error) {
      console.log('스캐너 정지 중 오류 (무시 가능):', error)
    } finally {
      setIsScanning(false)
    }
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

  const handleLogout = () => {
    cleanupScanner()
    localStorage.removeItem("scannerLoggedIn")
    router.push("/scanner/login")
  }

  // 라이브러리 로딩 중이거나 오류가 있는 경우
  if (loadingError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">로딩 오류</h3>
            <p className="text-gray-600 mb-4">{loadingError}</p>
            <Button onClick={() => window.location.reload()}>
              페이지 새로고침
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!libraryLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold mb-2">스캐너 준비 중</h3>
            <p className="text-gray-600">QR코드 스캐너를 로딩하고 있습니다...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeft className="h-4 w-4 mr-2" />
            메인으로 돌아가기
          </Link>
          <Button variant="outline" onClick={handleLogout}>
            로그아웃
          </Button>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">현장 QR 스캐너</CardTitle>
            <CardDescription>티켓의 QR 코드를 스캔하여 입장을 처리하세요</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 스캔 모드 선택 */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
                {isMobile ? <Smartphone className="h-5 w-5 mr-2" /> : <Monitor className="h-5 w-5 mr-2" />}
                {isMobile ? "모바일" : "데스크톱"} 스캔 방식 선택
              </h4>
              <div className="flex gap-2">
                <Button
                  variant={scanMode === "native" ? "default" : "outline"}
                  onClick={() => setScanMode("native")}
                  className="flex-1"
                  size="sm"
                >
                  📱 네이티브 카메라
                  {isMobile && <span className="ml-1 text-xs">(권장)</span>}
                </Button>
                <Button
                  variant={scanMode === "web" ? "default" : "outline"}
                  onClick={() => setScanMode("web")}
                  className="flex-1"
                  size="sm"
                  disabled={!libraryLoaded}
                >
                  🌐 웹 카메라
                  {!isMobile && <span className="ml-1 text-xs">(권장)</span>}
                </Button>
              </div>
            </div>

            {/* 네이티브 카메라 모드 */}
            {scanMode === "native" && (
              <div className="text-center">
                <div className="bg-white rounded-lg p-6 mb-4 border-2 border-blue-200">
                  <div className="flex flex-col items-center">
                    <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                      <Camera className="h-12 w-12 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {isMobile ? "핸드폰" : "컴퓨터"} 카메라로 촬영
                    </h3>
                    <p className="text-gray-600 mb-4 text-center">
                      아래 버튼을 누르면 {isMobile ? "카메라 앱이" : "카메라 또는 파일 선택창이"} 열립니다.<br/>
                      QR코드를 촬영하거나 선택하세요.
                    </p>
                    
                    {/* 숨겨진 파일 입력 */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    
                    <Button 
                      onClick={openNativeCamera}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6"
                      size="lg"
                    >
                      <Camera className="h-5 w-5 mr-2" />
                      {isMobile ? "📷 카메라로 촬영하기" : "📷 카메라/파일 선택하기"}
                    </Button>
                  </div>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-green-700 text-sm font-medium">
                    ✅ 가장 안정적인 방법입니다
                  </p>
                  <p className="text-green-600 text-xs mt-1">
                    {isMobile 
                      ? "카메라 앱에서 QR코드에 초점을 맞춰 촬영하세요" 
                      : "브라우저에서 카메라 사용 또는 QR코드 이미지 파일을 선택하세요"}
                  </p>
                  {!isMobile && (
                    <p className="text-green-600 text-xs mt-1">
                      💡 팁: 대부분의 브라우저에서 "카메라" 옵션이 나타납니다
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* 웹 카메라 모드 */}
            {scanMode === "web" && (
              <div className="text-center">
                {/* 카메라 권한 안내 */}
                {cameraPermission === false && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center mb-3">
                      <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
                      <div>
                        <p className="text-yellow-800 font-semibold">카메라에 접근할 수 없습니다</p>
                      </div>
                    </div>
                    
                    <div className="text-yellow-700 text-sm space-y-2">
                      <p className="font-medium">해결 방법:</p>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        <li>브라우저 주소창 옆의 🔒 아이콘을 클릭하여 카메라 권한 허용</li>
                        <li>다른 프로그램(Zoom, Teams 등)에서 카메라를 사용 중이면 종료</li>
                        <li>브라우저를 새로고침하고 다시 시도</li>
                        <li>Windows 설정 → 개인정보 → 카메라에서 브라우저 권한 확인</li>
                        <li>노트북 카메라가 물리적으로 차단되어 있는지 확인</li>
                      </ul>
                      
                      <div className="mt-3 p-2 bg-yellow-100 rounded">
                        <p className="font-medium text-yellow-800">💡 대안:</p>
                        <p className="text-yellow-700">네이티브 카메라 모드를 사용하거나 핸드폰으로 QR코드를 촬영해서 이미지를 업로드하세요.</p>
                      </div>
                      
                      <div className="mt-3 flex gap-2">
                        <Button 
                          onClick={checkCameraPermission}
                          variant="outline"
                          size="sm"
                          className="text-yellow-700 border-yellow-300"
                        >
                          🔄 카메라 다시 확인
                        </Button>
                        <Button 
                          onClick={() => setScanMode("native")}
                          variant="outline"
                          size="sm"
                          className="text-yellow-700 border-yellow-300"
                        >
                          📱 네이티브 카메라로 전환
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-white rounded-lg p-4 mb-4 border-2 border-gray-200">
                  {!isScanning ? (
                    <div className="bg-gray-100 rounded-lg p-8">
                      <div className="flex flex-col items-center">
                        <Camera className="h-16 w-16 text-gray-400 mb-4" />
                        <p className="text-gray-600 mb-2 font-semibold">웹 카메라로 실시간 스캔</p>
                        {availableCameras.length > 0 && (
                          <p className="text-sm text-gray-500">
                            {availableCameras.length}개의 카메라를 사용할 수 있습니다
                          </p>
                        )}
                        <p className="text-xs text-gray-400 mt-2">
                          아래 버튼을 눌러 웹 카메라를 시작하세요
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="relative">
                      {/* 카메라 상태 표시 */}
                      <div className="absolute top-2 left-2 z-10 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center">
                        <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></div>
                        웹 카메라 ON
                      </div>
                      
                      {/* QR코드 스캔 가이드 */}
                      <div className="absolute top-2 right-2 z-10 bg-blue-500 text-white px-2 py-1 rounded text-xs">
                        QR코드를 화면 중앙에 맞춰주세요
                      </div>
                      
                      {/* 비디오 화면 */}
                      <video
                        ref={videoRef}
                        className="w-full max-w-md mx-auto rounded-lg bg-black"
                        style={{ maxHeight: '400px', minHeight: '300px' }}
                        autoPlay
                        playsInline
                        muted
                      />
                      
                      {/* 스캔 영역 가이드 (중앙 사각형) */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="relative">
                          {/* 스캔 영역 테두리 */}
                          <div className="w-48 h-48 border-4 border-white rounded-lg shadow-lg opacity-80">
                            {/* 모서리 강조 */}
                            <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-yellow-400 rounded-tl-lg"></div>
                            <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-yellow-400 rounded-tr-lg"></div>
                            <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-yellow-400 rounded-bl-lg"></div>
                            <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-yellow-400 rounded-br-lg"></div>
                          </div>
                          
                          {/* 중앙 안내 텍스트 */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-black bg-opacity-50 text-white px-3 py-1 rounded text-sm">
                              QR코드를 여기에
                            </div>
                          </div>
                          
                          {/* 스캔 라인 애니메이션 */}
                          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent animate-pulse"></div>
                        </div>
                      </div>
                      
                      {/* 하단 안내 */}
                      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 z-10 bg-black bg-opacity-70 text-white px-3 py-1 rounded text-xs">
                        QR코드가 인식되면 자동으로 처리됩니다
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2">
                  {!isScanning ? (
                    <Button 
                      onClick={startWebCameraScanning} 
                      disabled={cameraPermission === false || !libraryLoaded}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3"
                    >
                      <Camera className="h-5 w-5 mr-2" />
                      🌐 웹 카메라 시작
                    </Button>
                  ) : (
                    <Button 
                      onClick={stopWebCameraScanning} 
                      variant="destructive"
                      className="flex-1 font-semibold py-3"
                    >
                      <StopCircle className="h-5 w-5 mr-2" />
                      ⏹️ 스캔 중지
                    </Button>
                  )}
                </div>
                
                {/* 카메라 상태 안내 */}
                {isScanning && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center justify-center text-green-700">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                      <span className="font-semibold">웹 카메라가 활성화되었습니다</span>
                    </div>
                    <p className="text-sm text-green-600 mt-1 text-center">
                      QR코드를 화면 중앙의 노란색 영역에 맞춰주세요
                    </p>
                  </div>
                )}

                {/* 웹 카메라 문제 시 대안 제시 */}
                {cameraPermission === false && (
                  <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <p className="text-orange-700 text-sm font-medium">
                      웹 카메라에 문제가 있나요?
                    </p>
                    <Button 
                      onClick={() => setScanMode("native")}
                      variant="outline"
                      size="sm"
                      className="mt-2"
                    >
                      📱 네이티브 카메라로 전환
                    </Button>
                  </div>
                )}
              </div>
            )}

            <div className="text-center text-gray-500">또는</div>

            {/* 수동 입력 */}
            <div className="space-y-2">
              <Label htmlFor="manual-input">수동 코드 입력</Label>
              <div className="flex space-x-2">
                <Input
                  id="manual-input"
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  placeholder="TICKET:주문ID:전화번호 또는 주문ID를 입력하세요"
                  onKeyPress={(e) => e.key === "Enter" && handleManualScan()}
                />
                <Button onClick={handleManualScan}>확인</Button>
              </div>
            </div>

            {/* 스캔 결과 */}
            {scanResult && (
              <div className={`border rounded-lg p-4 ${getResultColor(scanResult.type)}`}>
                <div className="flex items-center mb-3">
                  {getResultIcon(scanResult.type)}
                  <h3 className="ml-3 text-lg font-semibold">
                    {scanResult.type === "success" && "✅ 입장 허용"}
                    {scanResult.type === "error" && "❌ 입장 거부"}
                    {scanResult.type === "warning" && "⚠️ 주의"}
                  </h3>
                </div>
                <p className="text-sm mb-3">{scanResult.message}</p>

                {scanResult.ticketInfo && (
                  <div className="bg-white bg-opacity-50 rounded p-3 text-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="font-semibold">예약자:</span> {scanResult.ticketInfo.customerName}
                      </div>
                      <div>
                        <span className="font-semibold">연락처:</span> {scanResult.ticketInfo.customerPhone || 'N/A'}
                      </div>
                      <div>
                        <span className="font-semibold">티켓:</span> {scanResult.ticketInfo.ticketType}
                      </div>
                      <div>
                        <span className="font-semibold">번호:</span> #{scanResult.ticketInfo.ticketNumber}
                      </div>
                      {scanResult.ticketInfo.usedAt && (
                        <div className="col-span-2">
                          <span className="font-semibold">사용시간:</span> {new Date(scanResult.ticketInfo.usedAt).toLocaleString()}
                        </div>
                      )}
                      {scanResult.ticketInfo.scanLocation && (
                        <div className="col-span-2">
                          <span className="font-semibold">입장위치:</span> {scanResult.ticketInfo.scanLocation}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 새로운 스캔 버튼 */}
                <div className="mt-4">
                  <Button 
                    onClick={() => setScanResult(null)} 
                    variant="outline" 
                    size="sm"
                    className="w-full"
                  >
                    다음 스캔 준비
                  </Button>
                </div>
              </div>
            )}

            {/* 안내 사항 */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">사용 안내</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• 🟢 초록색 - 입장 허용 (유효한 티켓)</li>
                <li>• 🔴 빨간색 - 입장 거부 (무효한 티켓)</li>
                <li>• 🟡 노란색 - 이미 사용됨 (중복 사용)</li>
                <li>• 📱 네이티브 카메라: 가장 안정적 (권장)</li>
                <li>• 🌐 웹 카메라: 실시간 스캔 (실험적)</li>
                <li>• QR코드 형식: TICKET:주문ID:전화번호</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
