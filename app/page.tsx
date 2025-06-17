import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Clock, Phone, Ticket, Calendar, Waves, Fish, Star } from "lucide-react"
import { NavigationHeader } from "@/components/navigation-header"
import { ImageCarousel } from "@/components/image-carousel"

export default function HomePage() {
  const carouselImages = [
    {
      src: "https://www.hanwha.co.kr/images/newsMedia/photo/20210118_news04.jpg",
      alt: "메인 수족관",
      title: "신비로운 바다 세계",
      description: "다양한 해양 생물들과 함께하는 특별한 경험",
    },
    {
      src: "https://www.coexaqua.com/media/xnrgpngi/7.jpg",
      alt: "터널 수족관",
      title: "언더워터 터널",
      description: "바다 속을 걷는 듯한 환상적인 체험",
    },
    {
      src: "https://lh4.googleusercontent.com/proxy/GSRV5R67OdQJ2UuS7rlXZZOgT6uITvqdKvj6-SXvx2xkCpgM2NKqkSi2C8_tDMStMtIgi_ULz3-nrmHSFxad8vglcBm5fXwGlOc-2zM",
      alt: "체험 프로그램",
      title: "체험 프로그램",
      description: "직접 만지고 느낄 수 있는 특별한 시간",
    },
    {
      src: "https://static.hanatour.com/product/2021/09/10/0649jis4fa/default.jpg",
      alt: "돌고래 쇼",
      title: "돌고래 퍼포먼스",
      description: "매일 진행되는 환상적인 돌고래 쇼",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Header */}
      <NavigationHeader />

      {/* Hero Section with Carousel */}
      <section className="py-8 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <p className="text-lg mb-4 text-blue-600">영주에서 만나는 신비로운 세상</p>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900">아쿠아리움 파크</h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              다양한 해양 생물들과 함께하는 특별한 경험을 선사합니다. 가족과 함께 즐거운 시간을 보내세요.
            </p>
          </div>

          {/* Image Carousel */}
          <ImageCarousel images={carouselImages} />

          <div className="text-center mt-8">
            <Link href="/purchase">
              <Button size="lg" className="text-lg px-8 py-4">
                입장권 구매하기
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Schedule & Info Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Calendar */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center text-orange-600">
                  <Calendar className="h-5 w-5 mr-2" />
                  이번달 휴관일
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">06월</div>
                  <div className="grid grid-cols-7 gap-1 text-sm">
                    {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
                      <div key={day} className="p-2 font-semibold text-gray-600">
                        {day}
                      </div>
                    ))}
                    {Array.from({ length: 30 }, (_, i) => (
                      <div
                        key={i}
                        className={`p-2 ${[0, 6, 13, 20, 27].includes(i) ? "text-red-500 font-bold" : "text-gray-700"}`}
                      >
                        {i + 1}
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 mt-4">매주 월요일 휴관</p>
                </div>
              </CardContent>
            </Card>

            {/* Facility Images */}
            <div className="lg:col-span-2 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card className="overflow-hidden">
                  <div className="h-32 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                    <Fish className="h-12 w-12 text-white" />
                  </div>
                  <CardContent className="p-3">
                    <h3 className="font-semibold">메인 수족관</h3>
                    <p className="text-sm text-gray-600">대형 해양 생물 전시</p>
                  </CardContent>
                </Card>
                <Card className="overflow-hidden">
                  <div className="h-32 bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
                    <Waves className="h-12 w-12 text-white" />
                  </div>
                  <CardContent className="p-3">
                    <h3 className="font-semibold">터널 수족관</h3>
                    <p className="text-sm text-gray-600">360도 바다 체험</p>
                  </CardContent>
                </Card>
              </div>

              {/* Notice */}
              <Card className="bg-blue-600 text-white">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <p className="text-blue-100 mb-2">2025. 06. 15 새단장 완료!</p>
                      <p className="text-sm">새로운 모습으로 여러분을 맞이합니다. 많은 관심 부탁드립니다.</p>
                    </div>
                    <Link href="/purchase">
                      <Button
                        variant="secondary"
                        className="bg-white text-blue-600 hover:bg-gray-100 whitespace-nowrap"
                      >
                        이용권 구매 →
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">특별한 체험</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <Star className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                <CardTitle>돌고래 쇼</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  매일 오후 2시, 4시
                  <br />
                  환상적인 돌고래 퍼포먼스
                  <br />
                  가족 모두가 즐길 수 있는 시간
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <Fish className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <CardTitle>터치 체험</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  직접 만져볼 수 있는
                  <br />
                  안전한 해양 생물들
                  <br />
                  교육적이고 재미있는 체험
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <Waves className="h-12 w-12 text-teal-500 mx-auto mb-4" />
                <CardTitle>언더워터 터널</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  바다 속을 걷는 듯한
                  <br />
                  360도 파노라마 뷰
                  <br />
                  인생샷 명소
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">요금안내</h3>
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg overflow-hidden shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-left font-semibold">구분</th>
                      <th className="px-6 py-4 text-center font-semibold">관람료</th>
                      <th className="px-6 py-4 text-center font-semibold">비고</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="px-6 py-4 font-medium">소인</td>
                      <td className="px-6 py-4 text-center font-bold text-blue-600 text-lg">18,000원</td>
                      <td className="px-6 py-4 text-center text-sm text-gray-600">만4세 이상</td>
                    </tr>
                    <tr className="border-b">
                      <td className="px-6 py-4 font-medium">청소년</td>
                      <td className="px-6 py-4 text-center font-bold text-blue-600 text-lg">20,000원</td>
                      <td className="px-6 py-4 text-center text-sm text-gray-600">13세 ~ 18세 이하</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-medium">대인</td>
                      <td className="px-6 py-4 text-center font-bold text-blue-600 text-lg">25,000원</td>
                      <td className="px-6 py-4 text-center text-sm text-gray-600">19세 이상</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="text-center mt-8">
              <Link href="/purchase">
                <Button size="lg" className="px-8 py-3">
                  지금 구매하기
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <MapPin className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>위치 안내</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  서울시 강남구 테헤란로 123
                  <br />
                  지하철 2호선 강남역 3번 출구
                  <br />
                  주차장 완비 (무료)
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Clock className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>운영 시간</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  평일: 09:00 - 18:00
                  <br />
                  주말: 09:00 - 20:00
                  <br />
                  <span className="text-red-500 font-semibold">매주 월요일 휴관</span>
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Phone className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>문의 전화</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  대표번호: 02-1234-5678
                  <br />
                  예약문의: 02-1234-5679
                  <br />
                  운영시간 내 상담 가능
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Notice & Contact Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Notice */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-orange-600">
                  <Calendar className="h-5 w-5 mr-2" />
                  공지사항
                  <span className="ml-2 bg-orange-600 text-white text-xs px-2 py-1 rounded-full">09</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b hover:bg-gray-50 transition-colors">
                    <span className="text-sm">새단장 완료 및 재개장 안내</span>
                    <span className="text-xs text-gray-500">2025-04-09</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b hover:bg-gray-50 transition-colors">
                    <span className="text-sm">여름 특별 이벤트 진행</span>
                    <span className="text-xs text-gray-500">2025-04-06</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b hover:bg-gray-50 transition-colors">
                    <span className="text-sm">돌고래 쇼 시간 변경 안내</span>
                    <span className="text-xs text-gray-500">2025-04-05</span>
                  </div>
                  <div className="flex justify-between items-center py-2 hover:bg-gray-50 transition-colors">
                    <span className="text-sm">단체 할인 프로그램 출시</span>
                    <span className="text-xs text-gray-500">2025-04-04</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact */}
            <div className="space-y-4">
              <Card className="bg-gray-900 text-white">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">현장문의</h3>
                  <p className="text-3xl font-bold">054-639-4842</p>
                  <p className="text-sm text-gray-300 mt-2">현장 상황 및 긴급 문의</p>
                </CardContent>
              </Card>
              <Card className="bg-orange-600 text-white">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">고객센터</h3>
                  <p className="text-3xl font-bold">054-639-4842</p>
                  <p className="text-sm text-orange-100 mt-2">예약 및 일반 문의</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* SNS Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-4">아쿠아리움 파크 SNS</h3>
              <p className="text-gray-300 mb-6">
                아쿠아리움 파크의 최신 소식을
                <br />
                SNS로 만나보세요.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg hover:shadow-lg transition-shadow">
                <div className="h-24 bg-blue-100 rounded mb-2 flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">Facebook</span>
                </div>
                <p className="text-gray-600 text-sm">페이스북에서 만나요</p>
              </div>
              <div className="bg-white p-4 rounded-lg hover:shadow-lg transition-shadow">
                <div className="h-24 bg-pink-100 rounded mb-2 flex items-center justify-center">
                  <span className="text-pink-600 font-semibold">Instagram</span>
                </div>
                <p className="text-gray-600 text-sm">인스타그램 팔로우</p>
              </div>
              <div className="bg-white p-4 rounded-lg hover:shadow-lg transition-shadow">
                <div className="h-24 bg-red-100 rounded mb-2 flex items-center justify-center">
                  <span className="text-red-600 font-semibold">YouTube</span>
                </div>
                <p className="text-gray-600 text-sm">유튜브 구독하기</p>
              </div>
              <div className="bg-white p-4 rounded-lg hover:shadow-lg transition-shadow">
                <div className="h-24 bg-green-100 rounded mb-2 flex items-center justify-center">
                  <span className="text-green-600 font-semibold">Blog</span>
                </div>
                <p className="text-gray-600 text-sm">블로그 방문하기</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Ticket className="h-8 w-8 text-blue-400 mr-3" />
                <h3 className="text-xl font-bold">아쿠아리움 파크</h3>
              </div>
              <p className="text-gray-400 text-sm">
                주소: 경상북도 영주시 가흥동 123-45
                <br />
                전화: 054-639-4842
                <br />
                이메일: support@aquarium.kr
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">이용안내</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    운영시간 안내
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    이용요금 안내
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    시설 이용안내
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    주차장 안내
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">고객지원</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    자주하는 질문
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    공지사항
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    이벤트
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    고객센터
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">정책</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    개인정보처리방침
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    이용약관
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    환불정책
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    사이트맵
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <hr className="my-8 border-gray-700" />
          <div className="text-center text-gray-400 text-sm">
            <p>© 2024 아쿠아리움 파크. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
