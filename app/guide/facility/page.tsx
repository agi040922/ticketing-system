import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { NavigationHeader } from "@/components/navigation-header"
import { ArrowLeft, Clock, Users, AlertTriangle, CheckCircle, Info } from "lucide-react"

export default function GuideFacilityPage() {
  return (
    <div className="min-h-screen bg-white">
      <NavigationHeader />
      
      {/* Header Section */}
      <section className="py-8 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-6">
            <Link href="/">
              <Button variant="ghost" size="sm" className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                홈으로
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">시설 이용안내</h1>
              <p className="text-gray-600 mt-2">안전하고 즐거운 관람을 위한 시설 이용 가이드</p>
            </div>
          </div>
        </div>
      </section>

      {/* Operating Hours */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">운영시간</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-blue-600">
                  <Clock className="h-5 w-5 mr-2" />
                  정규 운영시간
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold">평일 (월~금)</p>
                    <p className="text-gray-600">09:00 - 18:00 (마지막 입장 17:30)</p>
                  </div>
                  <div>
                    <p className="font-semibold">주말 & 공휴일</p>
                    <p className="text-gray-600">09:00 - 20:00 (마지막 입장 19:30)</p>
                  </div>
                  <div className="bg-red-50 p-3 rounded-lg">
                    <p className="font-semibold text-red-700">휴관일</p>
                    <p className="text-red-600 text-sm">매주 월요일 (공휴일인 경우 다음날)</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-green-600">
                  <Users className="h-5 w-5 mr-2" />
                  입장 안내
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold">일반 입장</p>
                    <p className="text-gray-600">현장 구매 또는 온라인 예약</p>
                  </div>
                  <div>
                    <p className="font-semibold">단체 입장 (20명 이상)</p>
                    <p className="text-gray-600">사전 예약 필수, 할인 혜택 제공</p>
                  </div>
                  <div>
                    <p className="font-semibold">재입장</p>
                    <p className="text-gray-600">당일 입장권으로 1회 재입장 가능</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Facility Rules */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">시설 이용 규칙</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-green-600">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  허용 사항
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center text-gray-600">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                    사진 촬영 (플래시 없이)
                  </li>
                  <li className="flex items-center text-gray-600">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                    유모차 및 휠체어 이용
                  </li>
                  <li className="flex items-center text-gray-600">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                    터치 존에서의 체험
                  </li>
                  <li className="flex items-center text-gray-600">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                    휴대폰 사용 (매너모드)
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-red-600">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  금지 사항
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center text-gray-600">
                    <span className="w-2 h-2 bg-red-400 rounded-full mr-3"></span>
                    플래시 촬영
                  </li>
                  <li className="flex items-center text-gray-600">
                    <span className="w-2 h-2 bg-red-400 rounded-full mr-3"></span>
                    음식물 반입
                  </li>
                  <li className="flex items-center text-gray-600">
                    <span className="w-2 h-2 bg-red-400 rounded-full mr-3"></span>
                    큰 소리 및 소음
                  </li>
                  <li className="flex items-center text-gray-600">
                    <span className="w-2 h-2 bg-red-400 rounded-full mr-3"></span>
                    애완동물 동반
                  </li>
                  <li className="flex items-center text-gray-600">
                    <span className="w-2 h-2 bg-red-400 rounded-full mr-3"></span>
                    수족관 두드리기
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Special Programs */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">특별 프로그램 시간</h2>
          <Card>
            <CardContent className="p-8">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-blue-600 mb-2">돌고래 쇼</h3>
                  <p className="text-gray-600">매일 14:00, 16:00</p>
                  <p className="text-sm text-gray-500">(약 20분간)</p>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-blue-600 mb-2">피딩 쇼</h3>
                  <p className="text-gray-600">매일 15:00</p>
                  <p className="text-sm text-gray-500">(약 15분간)</p>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-blue-600 mb-2">가이드 투어</h3>
                  <p className="text-gray-600">평일 11:00, 14:00, 16:00</p>
                  <p className="text-sm text-gray-500">(약 45분간, 별도 요금)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Important Notice */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-600">
                <Info className="h-5 w-5 mr-2" />
                중요 공지사항
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-gray-600">
                <p>• 안전을 위해 만 4세 미만 어린이는 보호자 동반 필수입니다.</p>
                <p>• 음주 후 입장은 안전상의 이유로 제한됩니다.</p>
                <p>• 수족관 유리면을 두드리거나 접촉하는 것은 금지됩니다.</p>
                <p>• 응급상황 발생 시 즉시 가까운 직원에게 신고해주세요.</p>
                <p>• 분실물은 안내데스크에서 3개월간 보관됩니다.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">안전한 관람을 위해 협조해주세요</h2>
          <p className="text-xl text-blue-100 mb-8">
            모든 분들이 즐거운 시간을 보낼 수 있도록 규칙을 지켜주세요
          </p>
          <Link href="/purchase">
            <Button size="lg" variant="secondary" className="px-8 py-3">
              입장권 구매하기
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
} 