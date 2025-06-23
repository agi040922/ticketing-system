import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { NavigationHeader } from "@/components/navigation-header"
import { ArrowLeft, Clock, Users, Ticket, AlertCircle, CheckCircle, MapPin, Camera } from "lucide-react"

export default function AdventureGuidePage() {
  return (
    <div className="min-h-screen bg-white">
      <NavigationHeader />
      
      {/* Header Section */}
      <section className="py-8 bg-gradient-to-b from-green-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-6">
            <Link href="/adventure/intro">
              <Button variant="ghost" size="sm" className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                소개로
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">이용방법</h1>
              <p className="text-gray-600 mt-2">처음부터 끝까지, 완벽한 플레이파크 이용 가이드</p>
            </div>
          </div>
        </div>
      </section>

      {/* Step by Step Guide */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">이용 순서</h2>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-green-200 hidden md:block"></div>
            
            <div className="space-y-12">
              {/* Step 1 */}
              <div className="relative flex items-start">
                <div className="flex-shrink-0 w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-xl relative z-10">
                  1
                </div>
                <div className="ml-8 flex-1">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-green-600">
                        <Ticket className="h-5 w-5 mr-2" />
                        예약 및 입장권 구매
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">
                        온라인 사전 예약 시 할인 혜택을 받을 수 있습니다. 현장 구매도 가능하지만 성수기에는 대기시간이 발생할 수 있습니다.
                      </p>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <p className="text-green-800 font-semibold">💡 팁: 온라인 예약 시 최대 20% 할인!</p>
                        <p className="text-green-700 text-sm">모바일 QR코드로 간편 입장 가능</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative flex items-start">
                <div className="flex-shrink-0 w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-xl relative z-10">
                  2
                </div>
                <div className="ml-8 flex-1">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-orange-600">
                        <MapPin className="h-5 w-5 mr-2" />
                        도착 및 입장
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">
                        무료 주차장 이용 후 메인 입구로 향하세요. QR코드나 예약확인서를 준비해주세요.
                      </p>
                      <ul className="text-gray-600 space-y-1">
                        <li>• 주차장: 300대 규모, 무료 이용</li>
                        <li>• 입장 시간: 개장 1시간 전부터 대기 가능</li>
                        <li>• 재입장: 당일 1회 가능 (손등 스탬프)</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative flex items-start">
                <div className="flex-shrink-0 w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-xl relative z-10">
                  3
                </div>
                <div className="ml-8 flex-1">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-purple-600">
                        <Users className="h-5 w-5 mr-2" />
                        스릴 놀이기구 체험
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">
                        입장 후 가장 인기 있는 롤러코스터와 바이킹 등 스릴 넘치는 놀이기구를 먼저 체험해보세요.
                      </p>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <p className="font-semibold text-gray-900">인기 놀이기구</p>
                          <ul className="text-sm text-gray-600 space-y-1">
                            <li>• 롤러코스터: 신장 140cm 이상</li>
                            <li>• 바이킹: 신장 120cm 이상</li>
                            <li>• 자이로드롭: 신장 130cm 이상</li>
                          </ul>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">이용 팁</p>
                          <ul className="text-sm text-gray-600 space-y-1">
                            <li>• 평일 오전이 가장 한적</li>
                            <li>• 키 제한 사전 확인 필수</li>
                            <li>• 안전벨트 착용 확인</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Step 4 */}
              <div className="relative flex items-start">
                <div className="flex-shrink-0 w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-xl relative z-10">
                  4
                </div>
                <div className="ml-8 flex-1">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-blue-600">
                        <Camera className="h-5 w-5 mr-2" />
                        자연 체험존 방문
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">
                        목포의 아름다운 자연을 배경으로 한 생태 체험과 교육 프로그램에 참여해보세요.
                      </p>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-blue-800 font-semibold">🌿 자연 체험 프로그램</p>
                        <ul className="text-blue-700 text-sm space-y-1">
                          <li>• 생태 관찰: 매일 10:00, 14:00</li>
                          <li>• 숲속 산책: 가이드 동행</li>
                          <li>• 자연 학습: 어린이 대상</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Step 5 */}
              <div className="relative flex items-start">
                <div className="flex-shrink-0 w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-xl relative z-10">
                  5
                </div>
                <div className="ml-8 flex-1">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-teal-600">
                        <CheckCircle className="h-5 w-5 mr-2" />
                        가족 놀이 시설
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">
                        온 가족이 함께 즐길 수 있는 안전하고 재미있는 놀이 시설들을 체험해보세요.
                      </p>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <p className="font-semibold text-gray-900">가족 시설</p>
                          <ul className="text-sm text-gray-600 space-y-1">
                            <li>• 회전목마</li>
                            <li>• 범퍼카</li>
                            <li>• 미니 기차</li>
                            <li>• 키즈 플레이그라운드</li>
                          </ul>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">이용 안내</p>
                          <ul className="text-sm text-gray-600 space-y-1">
                            <li>• 연령 제한 없음</li>
                            <li>• 보호자 동반 필수 (5세 미만)</li>
                            <li>• 안전 수칙 준수</li>
                            <li>• 대기 줄 서기</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Step 6 */}
              <div className="relative flex items-start">
                <div className="flex-shrink-0 w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-xl relative z-10">
                  6
                </div>
                <div className="ml-8 flex-1">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-purple-600">
                        <Clock className="h-5 w-5 mr-2" />
                        특별 프로그램 참여
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">
                        계절별로 진행되는 특별 이벤트와 체험 프로그램에 참여하여 더욱 특별한 추억을 만드세요.
                      </p>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <p className="font-semibold text-purple-800">정기 프로그램</p>
                            <ul className="text-purple-700 text-sm">
                              <li>• 계절 축제: 분기별</li>
                              <li>• 체험 워크숍: 주말</li>
                              <li>• 가족 이벤트: 매월</li>
                            </ul>
                          </div>
                          <div>
                            <p className="font-semibold text-purple-800">예약 안내</p>
                            <ul className="text-purple-700 text-sm">
                              <li>• 사전 예약 권장</li>
                              <li>• 현장 접수 가능</li>
                              <li>• 별도 요금 발생</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Important Information */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-green-600">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  준비사항
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li>• 편안한 복장 착용 (운동화 필수)</li>
                  <li>• 날씨에 맞는 옷차림</li>
                  <li>• 예약 확인서 또는 QR 코드</li>
                  <li>• 신분증 (할인 대상자의 경우)</li>
                  <li>• 개인 물품 보관용 가방</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-red-600">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  주의사항
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li>• 놀이기구 키 제한 확인</li>
                  <li>• 안전 수칙 준수</li>
                  <li>• 줄서기 질서 지키기</li>
                  <li>• 음식물 반입 제한</li>
                  <li>• 애완동물 동반 불가</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Recommended Route */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">추천 이용 코스</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="text-green-600">가족 코스 (3-4시간)</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-2 text-gray-600">
                  <li>1. 가족 놀이시설 (1시간)</li>
                  <li>2. 자연 체험존 (1시간)</li>
                  <li>3. 카페 휴식 (30분)</li>
                  <li>4. 중급 놀이기구 (1시간)</li>
                  <li>5. 특별 프로그램 (30분)</li>
                </ol>
              </CardContent>
            </Card>

            <Card className="border-purple-200">
              <CardHeader>
                <CardTitle className="text-purple-600">스릴 추구자 코스 (4-5시간)</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-2 text-gray-600">
                  <li>1. 롤러코스터 (30분)</li>
                  <li>2. 바이킹 (30분)</li>
                  <li>3. 자이로드롭 (30분)</li>
                  <li>4. 레스토랑 식사 (1시간)</li>
                  <li>5. 기타 스릴 기구 (2시간)</li>
                </ol>
              </CardContent>
            </Card>

            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-600">여유 코스 (2-3시간)</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-2 text-gray-600">
                  <li>1. 자연 체험 프로그램 (1시간)</li>
                  <li>2. 가족 놀이시설 (1시간)</li>
                  <li>3. 카페 휴식 (30분)</li>
                  <li>4. 산책 및 사진 촬영 (30분)</li>
                </ol>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">완벽한 준비가 되셨나요?</h2>
          <p className="text-xl text-green-100 mb-8">
            이용방법을 숙지하셨다면 이제 예약하고 특별한 여행을 시작하세요!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/purchase">
              <Button size="lg" variant="secondary" className="px-8 py-3">
                지금 예약하기
              </Button>
            </Link>
            <Link href="/guide/pricing">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600 px-8 py-3">
                요금 확인하기
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
} 