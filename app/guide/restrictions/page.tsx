import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { NavigationHeader } from "@/components/navigation-header"
import { ArrowLeft, AlertTriangle, Users, Baby, Heart, Shield } from "lucide-react"

export default function GuideRestrictionsPage() {
  return (
    <div className="min-h-screen bg-white">
      <NavigationHeader />
      
      {/* Header Section */}
      <section className="py-8 bg-gradient-to-b from-red-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-6">
            <Link href="/">
              <Button variant="ghost" size="sm" className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                홈으로
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">이용제한 및 유의사항</h1>
              <p className="text-gray-600 mt-2">모든 관람객의 안전을 위한 중요한 안내사항</p>
            </div>
          </div>
        </div>
      </section>

      {/* Age Restrictions */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">연령별 이용제한</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-orange-200">
              <CardHeader>
                <CardTitle className="flex items-center text-orange-600">
                  <Baby className="h-5 w-5 mr-2" />
                  영유아 (0-4세)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li>• 보호자 동반 필수</li>
                  <li>• 유모차 이용 가능</li>
                  <li>• 터치 존 이용 시 각별 주의</li>
                  <li>• 수유실 및 기저귀 교환대 제공</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center text-blue-600">
                  <Users className="h-5 w-5 mr-2" />
                  어린이 (5-12세)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li>• 보호자 동반 권장</li>
                  <li>• 단체 관람 시 인솔자 필요</li>
                  <li>• 교육 프로그램 참여 가능</li>
                  <li>• 어린이 할인 적용</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center text-purple-600">
                  <Heart className="h-5 w-5 mr-2" />
                  임산부 및 노약자
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li>• 휠체어 및 유모차 대여 가능</li>
                  <li>• 우선 입장 서비스 제공</li>
                  <li>• 휴식 공간 이용 권장</li>
                  <li>• 응급상황 시 즉시 지원</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Health Restrictions */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">건강상 제한사항</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center text-red-600">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  입장 제한 대상
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-gray-600">
                  <li className="border-l-4 border-red-400 pl-4">
                    <strong>심장질환자:</strong> 돌고래 쇼의 큰 소리로 인한 스트레스 주의
                  </li>
                  <li className="border-l-4 border-red-400 pl-4">
                    <strong>간질 환자:</strong> 조명 효과 및 플래시로 인한 발작 위험
                  </li>
                  <li className="border-l-4 border-red-400 pl-4">
                    <strong>음주자:</strong> 안전상의 이유로 입장 불가
                  </li>
                  <li className="border-l-4 border-red-400 pl-4">
                    <strong>전염성 질환자:</strong> 다른 관람객 보호를 위해 입장 제한
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-yellow-200">
              <CardHeader>
                <CardTitle className="flex items-center text-yellow-600">
                  <Shield className="h-5 w-5 mr-2" />
                  주의 권장 대상
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-gray-600">
                  <li className="border-l-4 border-yellow-400 pl-4">
                    <strong>임산부:</strong> 장시간 서 있기 피하고 충분한 휴식 취하기
                  </li>
                  <li className="border-l-4 border-yellow-400 pl-4">
                    <strong>고혈압 환자:</strong> 스트레스 상황 피하고 여유롭게 관람
                  </li>
                  <li className="border-l-4 border-yellow-400 pl-4">
                    <strong>호흡기 질환자:</strong> 습도가 높은 구역에서 주의
                  </li>
                  <li className="border-l-4 border-yellow-400 pl-4">
                    <strong>알레르기 환자:</strong> 해양생물 알레르기 확인 필요
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Behavioral Guidelines */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">행동 수칙</h2>
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">⚠️ 절대 금지 행위</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li>• 수족관 유리면 두드리기 또는 접촉</li>
                      <li>• 물속에 이물질 투입</li>
                      <li>• 플래시 촬영</li>
                      <li>• 큰 소리 지르기</li>
                      <li>• 뛰어다니기</li>
                      <li>• 음식물 섭취 (지정구역 외)</li>
                      <li>• 흡연 (전면 금연)</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">✅ 권장 행동</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li>• 조용한 목소리로 대화하기</li>
                      <li>• 다른 관람객 배려하기</li>
                      <li>• 순서 지키며 관람하기</li>
                      <li>• 쓰레기 지정장소에 버리기</li>
                      <li>• 안내사항 준수하기</li>
                      <li>• 응급상황 시 직원에게 신고</li>
                      <li>• 개인 소지품 관리하기</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Emergency Information */}
      <section className="py-16 bg-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">응급상황 대응</h2>
          <div className="max-w-4xl mx-auto">
            <Card className="border-red-200">
              <CardContent className="p-8">
                <div className="grid md:grid-cols-3 gap-6 text-center">
                  <div>
                    <h3 className="text-lg font-semibold text-red-600 mb-3">의료 응급상황</h3>
                    <p className="text-gray-600">즉시 가까운 직원에게 신고</p>
                    <p className="text-red-600 font-semibold">응급실: 054-639-119</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-red-600 mb-3">화재 시</h3>
                    <p className="text-gray-600">가까운 비상구로 신속히 대피</p>
                    <p className="text-red-600 font-semibold">소방서: 119</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-red-600 mb-3">분실물 신고</h3>
                    <p className="text-gray-600">안내데스크 방문 또는 전화</p>
                    <p className="text-red-600 font-semibold">안내: 054-639-4842</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">안전한 관람을 위한 여러분의 협조가 필요합니다</h2>
          <p className="text-xl text-blue-100 mb-8">
            모든 관람객이 안전하고 즐거운 시간을 보낼 수 있도록 안내사항을 꼭 지켜주세요
          </p>
          <Link href="/purchase">
            <Button size="lg" variant="secondary" className="px-8 py-3">
              안내사항 확인 후 예약하기
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
} 