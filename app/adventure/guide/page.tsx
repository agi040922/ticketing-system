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
      <section className="py-8 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-6">
            <Link href="/adventure/intro">
              <Button variant="ghost" size="sm" className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                어드벤처 소개로
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">이용방법</h1>
              <p className="text-gray-600 mt-2">처음부터 끝까지, 완벽한 아쿠아리움 관람 가이드</p>
            </div>
          </div>
        </div>
      </section>

      {/* Step by Step Guide */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">관람 순서</h2>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-blue-200 hidden md:block"></div>
            
            <div className="space-y-12">
              {/* Step 1 */}
              <div className="relative flex items-start">
                <div className="flex-shrink-0 w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl relative z-10">
                  1
                </div>
                <div className="ml-8 flex-1">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-blue-600">
                        <Ticket className="h-5 w-5 mr-2" />
                        예약 및 입장권 구매
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">
                        온라인 사전 예약 시 할인 혜택을 받을 수 있습니다. 현장 구매도 가능하지만 성수기에는 대기시간이 발생할 수 있습니다.
                      </p>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-blue-800 font-semibold">💡 팁: 온라인 예약 시 최대 20% 할인!</p>
                        <p className="text-blue-700 text-sm">모바일 QR코드로 간편 입장 가능</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative flex items-start">
                <div className="flex-shrink-0 w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl relative z-10">
                  2
                </div>
                <div className="ml-8 flex-1">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-green-600">
                        <MapPin className="h-5 w-5 mr-2" />
                        도착 및 입장
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">
                        무료 주차장 이용 후 메인 입구로 향하세요. QR코드나 예약확인서를 준비해주세요.
                      </p>
                      <ul className="text-gray-600 space-y-1">
                        <li>• 주차장: 200대 규모, 무료 이용</li>
                        <li>• 입장 시간: 개장 1시간 전부터 대기 가능</li>
                        <li>• 재입장: 당일 1회 가능 (손등 스탬프)</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative flex items-start">
                <div className="flex-shrink-0 w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl relative z-10">
                  3
                </div>
                <div className="ml-8 flex-1">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-purple-600">
                        <Users className="h-5 w-5 mr-2" />
                        메인 수족관 관람
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">
                        입장 후 가장 먼저 메인 수족관에서 대형 해양생물들을 만나보세요. 상어, 가오리, 바다거북이 등이 여러분을 기다립니다.
                      </p>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <p className="font-semibold text-gray-900">관람 포인트</p>
                          <ul className="text-sm text-gray-600 space-y-1">
                            <li>• 먹이주기 시간: 매일 15:00</li>
                            <li>• 최적 관람 위치: 중앙 벤치</li>
                            <li>• 사진 촬영: 플래시 금지</li>
                          </ul>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">소요시간</p>
                          <ul className="text-sm text-gray-600 space-y-1">
                            <li>• 일반 관람: 20-30분</li>
                            <li>• 상세 관람: 45분-1시간</li>
                            <li>• 먹이주기 포함: 1시간 30분</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Step 4 */}
              <div className="relative flex items-start">
                <div className="flex-shrink-0 w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl relative z-10">
                  4
                </div>
                <div className="ml-8 flex-1">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-orange-600">
                        <Camera className="h-5 w-5 mr-2" />
                        언더워터 터널 체험
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">
                        하이라이트인 80m 언더워터 터널을 천천히 걸으며 360도 바다 속 세계를 경험하세요.
                      </p>
                      <div className="bg-orange-50 p-4 rounded-lg">
                        <p className="text-orange-800 font-semibold">📸 인생샷 포인트</p>
                        <ul className="text-orange-700 text-sm space-y-1">
                          <li>• 터널 입구: 전체적인 터널 모습</li>
                          <li>• 터널 중앙: 머리 위로 지나가는 상어</li>
                          <li>• 터널 끝: 출구쪽 조명 효과</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Step 5 */}
              <div className="relative flex items-start">
                <div className="flex-shrink-0 w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl relative z-10">
                  5
                </div>
                <div className="ml-8 flex-1">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-teal-600">
                        <CheckCircle className="h-5 w-5 mr-2" />
                        터치존 및 체험 프로그램
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">
                        안전하게 해양생물을 직접 만져볼 수 있는 터치존에서 특별한 체험을 해보세요.
                      </p>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <p className="font-semibold text-gray-900">체험 가능 생물</p>
                          <ul className="text-sm text-gray-600 space-y-1">
                            <li>• 불가사리</li>
                            <li>• 성게</li>
                            <li>• 작은 상어</li>
                            <li>• 가오리</li>
                          </ul>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">주의사항</p>
                          <ul className="text-sm text-gray-600 space-y-1">
                            <li>• 손 소독 필수</li>
                            <li>• 부드럽게 터치</li>
                            <li>• 직원 지시 준수</li>
                            <li>• 만 4세 이상 이용 가능</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Step 6 */}
              <div className="relative flex items-start">
                <div className="flex-shrink-0 w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl relative z-10">
                  6
                </div>
                <div className="ml-8 flex-1">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-purple-600">
                        <Clock className="h-5 w-5 mr-2" />
                        돌고래 쇼 관람
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">
                        매일 2회 진행되는 돌고래 퍼포먼스를 놓치지 마세요. 사전에 좋은 자리를 확보하는 것이 중요합니다.
                      </p>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <p className="font-semibold text-purple-800">공연 시간</p>
                            <ul className="text-purple-700 text-sm">
                              <li>• 1회차: 14:00</li>
                              <li>• 2회차: 16:00</li>
                              <li>• 소요시간: 약 20분</li>
                            </ul>
                          </div>
                          <div>
                            <p className="font-semibold text-purple-800">좋은 자리 팁</p>
                            <ul className="text-purple-700 text-sm">
                              <li>• 15분 전 도착 권장</li>
                              <li>• 중앙 3-5열이 최적</li>
                              <li>• 앞자리는 물튀김 주의</li>
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
                  <li>• 편안한 복장 착용 (운동화 권장)</li>
                  <li>• 카메라 또는 휴대폰 (촬영 허용 구역)</li>
                  <li>• 예약 확인서 또는 QR 코드</li>
                  <li>• 신분증 (할인 대상자의 경우)</li>
                  <li>• 여벌 옷 (어린이의 경우)</li>
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
                  <li>• 플래시 촬영 금지</li>
                  <li>• 수족관 두드리기 금지</li>
                  <li>• 큰 소리 및 뛰어다니기 금지</li>
                  <li>• 음식물 반입 금지</li>
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
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">추천 관람 코스</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-600">가족 코스 (2-3시간)</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-2 text-gray-600">
                  <li>1. 메인 수족관 (30분)</li>
                  <li>2. 언더워터 터널 (30분)</li>
                  <li>3. 카페 휴식 (30분)</li>
                  <li>4. 터치존 체험 (30분)</li>
                  <li>5. 돌고래 쇼 (30분)</li>
                  <li>6. 기념품샵 (30분)</li>
                </ol>
              </CardContent>
            </Card>

            <Card className="border-purple-200">
              <CardHeader>
                <CardTitle className="text-purple-600">커플 코스 (3-4시간)</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-2 text-gray-600">
                  <li>1. 메인 수족관 (45분)</li>
                  <li>2. 언더워터 터널 (1시간)</li>
                  <li>3. 포토존 촬영 (30분)</li>
                  <li>4. 레스토랑 식사 (1시간)</li>
                  <li>5. 돌고래 쇼 (30분)</li>
                  <li>6. 야경 관람 (30분)</li>
                </ol>
              </CardContent>
            </Card>

            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="text-green-600">단체 코스 (2시간)</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-2 text-gray-600">
                  <li>1. 가이드 투어 시작 (15분)</li>
                  <li>2. 메인 수족관 (30분)</li>
                  <li>3. 언더워터 터널 (30분)</li>
                  <li>4. 단체 사진 촬영 (15분)</li>
                  <li>5. 터치존 체험 (20분)</li>
                  <li>6. 돌고래 쇼 (30분)</li>
                </ol>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">완벽한 준비가 되셨나요?</h2>
          <p className="text-xl text-blue-100 mb-8">
            이용방법을 숙지하셨다면 이제 예약하고 특별한 여행을 시작하세요!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/purchase">
              <Button size="lg" variant="secondary" className="px-8 py-3">
                지금 예약하기
              </Button>
            </Link>
            <Link href="/guide/pricing">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3">
                요금 확인하기
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
} 