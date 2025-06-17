import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { NavigationHeader } from "@/components/navigation-header"
import { ArrowLeft, Shield, AlertTriangle, Users, Eye, Heart } from "lucide-react"

export default function GuideSafetyPage() {
  return (
    <div className="min-h-screen bg-white">
      <NavigationHeader />
      
      {/* Header Section */}
      <section className="py-8 bg-gradient-to-b from-green-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-6">
            <Link href="/">
              <Button variant="ghost" size="sm" className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                홈으로
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">이용 안전수칙</h1>
              <p className="text-gray-600 mt-2">모든 관람객의 안전을 위한 필수 안전 규칙</p>
            </div>
          </div>
        </div>
      </section>

      {/* General Safety Rules */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">기본 안전수칙</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center text-green-600">
                  <Shield className="h-5 w-5 mr-2" />
                  필수 준수사항
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-3 mt-2"></span>
                    <span className="text-gray-600">보호자 없는 만 4세 미만 어린이 입장 금지</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-3 mt-2"></span>
                    <span className="text-gray-600">지정된 관람로 이외 출입 금지</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-3 mt-2"></span>
                    <span className="text-gray-600">안전 펜스 및 난간 넘기 금지</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-3 mt-2"></span>
                    <span className="text-gray-600">직원의 안전 지시에 따라 행동</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center text-red-600">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  위험 행동 금지
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-red-400 rounded-full mr-3 mt-2"></span>
                    <span className="text-gray-600">수족관 내부로 손 집어넣기</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-red-400 rounded-full mr-3 mt-2"></span>
                    <span className="text-gray-600">뛰어다니기 및 장난치기</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-red-400 rounded-full mr-3 mt-2"></span>
                    <span className="text-gray-600">물속에 이물질 투입</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-red-400 rounded-full mr-3 mt-2"></span>
                    <span className="text-gray-600">음주 후 시설 이용</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Emergency Procedures */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">응급상황 대응방법</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-red-600">
                  <Heart className="h-5 w-5 mr-2" />
                  의료 응급상황
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900">즉시 조치사항</h4>
                    <ul className="text-sm text-gray-600 mt-2 space-y-1">
                      <li>1. 가까운 직원에게 즉시 신고</li>
                      <li>2. 환자를 안전한 곳으로 이동</li>
                      <li>3. 응급처치 요청</li>
                      <li>4. 119 신고 (필요시)</li>
                    </ul>
                  </div>
                  <div className="bg-red-50 p-3 rounded">
                    <p className="text-red-600 text-sm font-semibold">응급실: 054-639-119</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-orange-600">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  화재 발생시
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900">대피 요령</h4>
                    <ul className="text-sm text-gray-600 mt-2 space-y-1">
                      <li>1. 화재경보 발령 시 즉시 대피</li>
                      <li>2. 가까운 비상구 이용</li>
                      <li>3. 엘리베이터 사용 금지</li>
                      <li>4. 지정된 대피장소 집결</li>
                    </ul>
                  </div>
                  <div className="bg-orange-50 p-3 rounded">
                    <p className="text-orange-600 text-sm font-semibold">소방서: 119</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-blue-600">
                  <Users className="h-5 w-5 mr-2" />
                  실종 및 미아
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900">신고 절차</h4>
                    <ul className="text-sm text-gray-600 mt-2 space-y-1">
                      <li>1. 안내데스크 즉시 신고</li>
                      <li>2. 실종자 인적사항 제공</li>
                      <li>3. 최종 목격 장소 알림</li>
                      <li>4. 방송 안내 협조</li>
                    </ul>
                  </div>
                  <div className="bg-blue-50 p-3 rounded">
                    <p className="text-blue-600 text-sm font-semibold">안내데스크: 054-639-4842</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Safety Equipment */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">안전시설 위치</h2>
          <Card>
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-red-600 font-bold">AED</span>
                  </div>
                  <h3 className="font-semibold mb-2">자동심장충격기</h3>
                  <p className="text-sm text-gray-600">메인 입구, 카페테리아</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-600 font-bold">응급</span>
                  </div>
                  <h3 className="font-semibold mb-2">응급의료함</h3>
                  <p className="text-sm text-gray-600">각 층 안내데스크</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-green-600 font-bold">EXIT</span>
                  </div>
                  <h3 className="font-semibold mb-2">비상구</h3>
                  <p className="text-sm text-gray-600">동서남북 4개소</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Eye className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="font-semibold mb-2">CCTV</h3>
                  <p className="text-sm text-gray-600">전 구역 24시간 모니터링</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Special Care */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">특별 보호 대상</h2>
          <Card className="border-blue-200">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-blue-600 mb-4">👶 어린이 안전수칙</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• 만 4세 미만: 반드시 보호자 동반</li>
                    <li>• 만 12세 미만: 보호자 시야 내 관람</li>
                    <li>• 터치존 이용 시 손 소독 필수</li>
                    <li>• 안전 펜스 근처에서 뛰지 말 것</li>
                    <li>• 미끄럼 방지를 위한 안전한 신발 착용</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-600 mb-4">🤰 임산부 및 노약자</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• 휠체어 및 유모차 무료 대여</li>
                    <li>• 우선 입장 및 휴식 공간 제공</li>
                    <li>• 장시간 서 있기 피하고 충분한 휴식</li>
                    <li>• 응급상황 시 즉시 직원에게 알림</li>
                    <li>• 의료진 상주 (평일 10:00-17:00)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">안전이 최우선입니다</h2>
          <p className="text-xl text-green-100 mb-8">
            안전수칙을 준수하여 모든 분들이 안전하고 즐거운 시간을 보낼 수 있도록 협조해주세요
          </p>
          <Link href="/purchase">
            <Button size="lg" variant="secondary" className="px-8 py-3">
              안전수칙 확인 후 예약하기
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
} 