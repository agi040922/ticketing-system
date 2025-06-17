import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { NavigationHeader } from "@/components/navigation-header"
import { ArrowLeft, Users, Baby, GraduationCap, Star, Gift } from "lucide-react"

export default function GuidePricingPage() {
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
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">요금안내</h1>
              <p className="text-gray-600 mt-2">아쿠아리움 파크 입장료 및 할인 혜택 안내</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Pricing */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">기본 입장료</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="relative overflow-hidden border-2 border-orange-200">
              <div className="absolute top-0 left-0 right-0 h-2 bg-orange-500"></div>
              <CardHeader className="text-center">
                <Baby className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                <CardTitle className="text-xl">소인</CardTitle>
                <p className="text-gray-600 text-sm">만 4세 이상</p>
              </CardHeader>
              <CardContent className="text-center">
                <div className="mb-4">
                  <span className="text-4xl font-bold text-orange-600">18,000</span>
                  <span className="text-gray-600">원</span>
                </div>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 만 4세 ~ 12세</li>
                  <li>• 신분증 확인 필요</li>
                  <li>• 보호자 동반 권장</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-2 border-blue-200">
              <div className="absolute top-0 left-0 right-0 h-2 bg-blue-500"></div>
              <CardHeader className="text-center">
                <GraduationCap className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <CardTitle className="text-xl">청소년</CardTitle>
                <p className="text-gray-600 text-sm">13세 ~ 18세</p>
              </CardHeader>
              <CardContent className="text-center">
                <div className="mb-4">
                  <span className="text-4xl font-bold text-blue-600">20,000</span>
                  <span className="text-gray-600">원</span>
                </div>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 중학생 ~ 고등학생</li>
                  <li>• 학생증 지참 필수</li>
                  <li>• 단체 할인 가능</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-2 border-purple-200">
              <div className="absolute top-0 left-0 right-0 h-2 bg-purple-500"></div>
              <CardHeader className="text-center">
                <Users className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                <CardTitle className="text-xl">대인</CardTitle>
                <p className="text-gray-600 text-sm">19세 이상</p>
              </CardHeader>
              <CardContent className="text-center">
                <div className="mb-4">
                  <span className="text-4xl font-bold text-purple-600">25,000</span>
                  <span className="text-gray-600">원</span>
                </div>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 일반 성인</li>
                  <li>• 65세 이상 할인</li>
                  <li>• 장애인 할인 제공</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Discounts */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">할인 혜택</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-green-600">
                  <Gift className="h-5 w-5 mr-2" />
                  단체 할인
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                    <span>20명 이상</span>
                    <span className="font-semibold text-green-600">10% 할인</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                    <span>50명 이상</span>
                    <span className="font-semibold text-green-600">15% 할인</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                    <span>100명 이상</span>
                    <span className="font-semibold text-green-600">20% 할인</span>
                  </div>
                  <p className="text-sm text-gray-600">※ 사전 예약 필수, 현장 결제 불가</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-blue-600">
                  <Star className="h-5 w-5 mr-2" />
                  특별 할인
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                    <span>65세 이상 경로우대</span>
                    <span className="font-semibold text-blue-600">30% 할인</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                    <span>장애인 (동반 1인)</span>
                    <span className="font-semibold text-blue-600">50% 할인</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                    <span>국가유공자</span>
                    <span className="font-semibold text-blue-600">50% 할인</span>
                  </div>
                  <p className="text-sm text-gray-600">※ 관련 증빙서류 제시 필수</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">부가 서비스 요금</h2>
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">🎯 체험 프로그램</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">가이드 투어</span>
                          <span className="font-semibold">5,000원</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">포토 서비스</span>
                          <span className="font-semibold">10,000원</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">기념품 패키지</span>
                          <span className="font-semibold">15,000원</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">🍽️ 식음료</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">카페테리아 이용</span>
                          <span className="font-semibold">별도 요금</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">레스토랑 이용</span>
                          <span className="font-semibold">별도 요금</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">도시락 보관함</span>
                          <span className="font-semibold">무료</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Payment Information */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">결제 및 환불 안내</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-blue-600">결제 방법</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li>• 현금, 신용카드, 체크카드</li>
                  <li>• 모바일 페이 (삼성페이, 애플페이 등)</li>
                  <li>• 계좌이체</li>
                  <li>• 온라인 사전 결제 (할인 혜택)</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-blue-600">환불 정책</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li>• 사용 전: 100% 환불 (수수료 제외)</li>
                  <li>• 당일 취소: 90% 환불</li>
                  <li>• 날씨 사유: 100% 환불 또는 일정 변경</li>
                  <li>• 시설 점검: 전액 환불</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">지금 바로 예약하고 할인 혜택을 받으세요!</h2>
          <p className="text-xl text-blue-100 mb-8">
            온라인 사전 예약 시 추가 할인 혜택 제공
          </p>
          <Link href="/purchase">
            <Button size="lg" variant="secondary" className="px-8 py-3">
              할인가로 예약하기
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
} 