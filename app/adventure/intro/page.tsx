import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { NavigationHeader } from "@/components/navigation-header"
import { ArrowLeft, TreePine, Star, Shield, MapPin, Clock, Users, Zap } from "lucide-react"

export default function AdventureIntroPage() {
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
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">소개</h1>
              <p className="text-gray-600 mt-2">목포의 자연과 함께하는 특별한 어드벤처 체험</p>
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
                자연과 모험이<br />
                <span className="text-green-600">하나되는 곳</span>
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                목포 플레이파크는 단순한 놀이시설을 넘어서 진정한 자연 어드벤처를 제공합니다. 
                스릴 넘치는 놀이기구부터 자연과 함께하는 체험활동까지, 
                모든 연령대가 즐길 수 있는 특별한 공간입니다.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/purchase">
                  <Button size="lg" className="px-8 bg-green-600 hover:bg-green-700">
                    지금 예약하기
                  </Button>
                </Link>
                <Link href="/adventure/guide">
                  <Button size="lg" variant="outline" className="px-8 border-green-600 text-green-600 hover:bg-green-50">
                    이용방법 보기
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://www.hanwha.co.kr/images/newsMedia/photo/20210118_news04.jpg"
                alt="플레이파크 어드벤처"
                className="w-full h-96 object-cover rounded-2xl shadow-xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-2xl"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="text-xl font-bold">어드벤처 체험</h3>
                <p className="text-sm">스릴과 자연이 만나는 곳</p>
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
                <TreePine className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">자연 체험</h3>
                <p className="text-gray-600 text-sm">
                  목포의 아름다운 자연 속에서 다양한 생태 체험과 숲속 어드벤처를 즐기세요
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-none shadow-lg">
              <CardContent className="p-6">
                <Zap className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">스릴 놀이기구</h3>
                <p className="text-gray-600 text-sm">
                  짜릿한 스릴을 선사하는 다양한 놀이기구로 잊을 수 없는 추억을 만들어보세요
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-none shadow-lg">
              <CardContent className="p-6">
                <Star className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">특별 프로그램</h3>
                <p className="text-gray-600 text-sm">
                  계절별 특별 이벤트와 체험 프로그램으로 더욱 풍성한 즐거움을 선사합니다
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-none shadow-lg">
              <CardContent className="p-6">
                <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
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
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">목포 플레이파크 현황</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">15+</div>
              <div className="text-gray-600">다양한 놀이기구</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">50,000㎡</div>
              <div className="text-gray-600">넓은 자연 부지</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">10+</div>
              <div className="text-gray-600">체험 프로그램</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">100,000+</div>
              <div className="text-gray-600">연간 방문객</div>
            </div>
          </div>
        </div>
      </section>

      {/* Activity Highlights */}
      <section className="py-16 bg-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">즐길 수 있는 활동들</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="overflow-hidden">
              <div className="relative">
                <img 
                  src="https://www.hanwha.co.kr/images/newsMedia/photo/20210118_news04.jpg"
                  alt="어드벤처 놀이기구"
                  className="w-full h-48 object-cover"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">스릴 놀이기구</h3>
                <p className="text-gray-600">
                  롤러코스터, 바이킹, 자이로드롭 등 다양한 스릴 넘치는 놀이기구들이 짜릿한 재미를 선사합니다.
                </p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <div className="relative">
                <img 
                  src="https://static.hanatour.com/product/2021/09/10/0649jis4fa/default.jpg"
                  alt="자연 체험"
                  className="w-full h-48 object-cover"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">자연 체험 프로그램</h3>
                <p className="text-gray-600">
                  목포의 아름다운 자연 속에서 생태 관찰, 숲속 산책, 자연 학습 체험을 즐겨보세요.
                </p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <div className="relative">
                <img 
                  src="https://www.coexaqua.com/media/xnrgpngi/7.jpg"
                  alt="가족 놀이"
                  className="w-full h-48 object-cover"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">가족 놀이 시설</h3>
                <p className="text-gray-600">
                  어린이부터 어른까지 온 가족이 함께 즐길 수 있는 안전하고 재미있는 놀이 시설들입니다.
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
                <CardTitle className="flex items-center text-green-600">
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
                    <p className="font-semibold text-red-600">휴장일</p>
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
                  <p className="font-semibold">목포 플레이파크</p>
                  <p className="text-gray-600">전라남도 목포시<br />플레이파크로 123</p>
                  <p className="text-gray-600">목포역에서 차량 15분<br />무료 주차장 완비</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-green-600">
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
                    <Button variant="outline" size="sm" className="w-full mt-3 border-green-600 text-green-600 hover:bg-green-50">
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
      <section className="py-16 bg-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">자연과 모험이 기다립니다!</h2>
          <p className="text-xl text-green-100 mb-8">
            잊을 수 없는 목포 플레이파크 체험을 위해 지금 예약하세요
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/purchase">
              <Button size="lg" variant="secondary" className="px-8 py-3">
                온라인 예약하기
              </Button>
            </Link>
            <Link href="/adventure/gallery">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600 px-8 py-3">
                갤러리 보기
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
} 