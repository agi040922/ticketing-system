import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { NavigationHeader } from "@/components/navigation-header"
import { ArrowLeft, Waves, Star, Shield, MapPin, Clock, Users, Fish } from "lucide-react"

export default function AdventureIntroPage() {
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
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">어드벤처 소개</h1>
              <p className="text-gray-600 mt-2">바다 속 신비로운 세계로의 특별한 여행</p>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                바다의 신비를<br />
                <span className="text-blue-600">직접 체험하세요</span>
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                아쿠아리움 파크는 단순한 관람을 넘어서 진정한 해양 어드벤처를 제공합니다. 
                80m 길이의 언더워터 터널에서 상어와 함께 수영하는 듯한 경험부터, 
                직접 만져볼 수 있는 터치존까지, 모든 연령대가 즐길 수 있는 특별한 공간입니다.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/purchase">
                  <Button size="lg" className="px-8">
                    지금 예약하기
                  </Button>
                </Link>
                <Link href="/adventure/guide">
                  <Button size="lg" variant="outline" className="px-8">
                    이용방법 보기
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://www.coexaqua.com/media/xnrgpngi/7.jpg"
                alt="언더워터 터널"
                className="w-full h-96 object-cover rounded-2xl shadow-xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-2xl"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="text-xl font-bold">언더워터 터널</h3>
                <p className="text-sm">360도 바다 속 세계</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">특별한 경험</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center border-none shadow-lg">
              <CardContent className="p-6">
                <Waves className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">언더워터 터널</h3>
                <p className="text-gray-600 text-sm">
                  80m 길이의 투명한 터널을 걸으며 상어와 가오리가 머리 위로 지나가는 장관을 경험하세요
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-none shadow-lg">
              <CardContent className="p-6">
                <Fish className="h-12 w-12 text-teal-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">터치존 체험</h3>
                <p className="text-gray-600 text-sm">
                  불가사리, 성게, 작은 상어들을 직접 만져보며 해양생물과 교감할 수 있는 특별한 공간
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-none shadow-lg">
              <CardContent className="p-6">
                <Star className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">돌고래 쇼</h3>
                <p className="text-gray-600 text-sm">
                  매일 2회 진행되는 돌고래 퍼포먼스로 지능적이고 아름다운 돌고래의 모습을 감상하세요
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-none shadow-lg">
              <CardContent className="p-6">
                <Shield className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">안전한 환경</h3>
                <p className="text-gray-600 text-sm">
                  최신 안전 시설과 전문 가이드가 함께하여 모든 연령대가 안심하고 즐길 수 있습니다
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">아쿠아리움 파크 현황</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">300+</div>
              <div className="text-gray-600">종의 해양생물</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">50,000+</div>
              <div className="text-gray-600">마리의 물고기</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">80m</div>
              <div className="text-gray-600">언더워터 터널</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">10,000㎡</div>
              <div className="text-gray-600">총 관람 면적</div>
            </div>
          </div>
        </div>
      </section>

      {/* Marine Life Highlights */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">만나볼 수 있는 해양생물들</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="overflow-hidden">
              <div className="relative">
                <img 
                  src="https://static.hanatour.com/product/2021/09/10/0649jis4fa/default.jpg"
                  alt="상어"
                  className="w-full h-48 object-cover"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">대형 상어</h3>
                <p className="text-gray-600">
                  화이트팁 상어, 블랙팁 상어 등 다양한 종류의 상어들이 웅장하게 헤엄치는 모습을 가까이서 관찰할 수 있습니다.
                </p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <div className="relative">
                <img 
                  src="https://www.hanwha.co.kr/images/newsMedia/photo/20210118_news04.jpg"
                  alt="가오리"
                  className="w-full h-48 object-cover"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">거대 가오리</h3>
                <p className="text-gray-600">
                  날개를 펼친 듯 우아하게 헤엄치는 대형 가오리의 신비로운 모습을 터널에서 감상하세요.
                </p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <div className="relative">
                <img 
                  src="https://www.coexaqua.com/media/xnrgpngi/7.jpg"
                  alt="열대어"
                  className="w-full h-48 object-cover"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">형형색색 열대어</h3>
                <p className="text-gray-600">
                  아름다운 색깔의 열대어들과 신비로운 산호 정원에서 마치 바다 속 파라다이스를 경험하세요.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Visitor Information */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">방문 정보</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-blue-600">
                  <Clock className="h-5 w-5 mr-2" />
                  운영시간
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <p className="font-semibold">평일</p>
                    <p className="text-gray-600">09:00 - 18:00</p>
                  </div>
                  <div>
                    <p className="font-semibold">주말/공휴일</p>
                    <p className="text-gray-600">09:00 - 20:00</p>
                  </div>
                  <div>
                    <p className="font-semibold text-red-600">휴관일</p>
                    <p className="text-red-600">매주 월요일</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-green-600">
                  <MapPin className="h-5 w-5 mr-2" />
                  위치
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="font-semibold">아쿠아리움 파크</p>
                  <p className="text-gray-600">서울특별시 강남구<br />테헤란로 123길 45</p>
                  <p className="text-gray-600">지하철 2호선 강남역<br />3번 출구에서 도보 10분</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-purple-600">
                  <Users className="h-5 w-5 mr-2" />
                  요금정보
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <p className="font-semibold">대인</p>
                    <p className="text-gray-600">25,000원</p>
                  </div>
                  <div>
                    <p className="font-semibold">청소년</p>
                    <p className="text-gray-600">20,000원</p>
                  </div>
                  <div>
                    <p className="font-semibold">소인</p>
                    <p className="text-gray-600">18,000원</p>
                  </div>
                  <Link href="/guide/pricing">
                    <Button variant="outline" size="sm" className="w-full mt-3">
                      상세 요금 보기
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">바다 속 어드벤처가 기다립니다!</h2>
          <p className="text-xl text-blue-100 mb-8">
            잊을 수 없는 해양 체험을 위해 지금 예약하세요
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/purchase">
              <Button size="lg" variant="secondary" className="px-8 py-3">
                온라인 예약하기
              </Button>
            </Link>
            <Link href="/adventure/gallery">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3">
                갤러리 보기
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
} 