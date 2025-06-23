import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Clock, Phone, Ticket, Calendar, TreePine, Zap, Star } from "lucide-react"
import { NavigationHeader } from "@/components/navigation-header"
import { ImageCarousel } from "@/components/image-carousel"
import Image from "next/image"

export default function HomePage() {
  const carouselImages = [
    {
      src: "/배경.jpg",
      alt: "어드벤처 놀이시설",
      title: "스릴 넘치는 어드벤처",
      description: "다양한 놀이시설과 함께하는 특별한 경험",
    },
    {
      src: "/실내부.jpg",
      alt: "자연 체험존",
      title: "자연과 함께하는 시간",
      description: "목포의 아름다운 자연을 만끽하세요",
    },
    {
      src: "/실내부1.jpg",
      alt: "체험 프로그램",
      title: "체험 프로그램",
      description: "직접 참여하고 즐길 수 있는 특별한 시간",
    },
    {
      src: "/실내부2.jpg",
      alt: "가족 놀이존",
      title: "가족 놀이존",
      description: "온 가족이 함께 즐길 수 있는 공간",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Header */}
      <NavigationHeader />

      {/* Hero Section with Carousel */}
      <section className="py-8 bg-gradient-to-b from-green-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <p className="text-lg mb-4 text-green-600">목포에서 만나는 특별한 즐거움</p>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900">목포 플레이파크</h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              다양한 놀이시설과 체험활동으로 온 가족이 함께 즐길 수 있는 특별한 공간입니다. 목포의 아름다운 자연과 함께 즐거운 시간을 보내세요.
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
                  <div className="h-32 bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                    <TreePine className="h-12 w-12 text-white" />
                  </div>
                  <CardContent className="p-3">
                    <h3 className="font-semibold">자연 체험존</h3>
                    <p className="text-sm text-gray-600">목포의 자연을 만끽</p>
                  </CardContent>
                </Card>
                <Card className="overflow-hidden">
                  <div className="h-32 bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                    <Zap className="h-12 w-12 text-white" />
                  </div>
                  <CardContent className="p-3">
                    <h3 className="font-semibold">어드벤처존</h3>
                    <p className="text-sm text-gray-600">스릴 넘치는 놀이시설</p>
                  </CardContent>
                </Card>
              </div>

              {/* Notice */}
              <Card className="bg-green-600 text-white">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <p className="text-green-100 mb-2">2025. 06. 15 새단장 완료!</p>
                      <p className="text-sm">새로운 모습으로 여러분을 맞이합니다. 많은 관심 부탁드립니다.</p>
                    </div>
                    <Link href="/purchase">
                      <Button
                        variant="secondary"
                        className="bg-white text-green-600 hover:bg-gray-100 whitespace-nowrap"
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
                <CardTitle>어드벤처 놀이</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  스릴 넘치는 놀이시설과
                  <br />
                  안전한 모험 체험
                  <br />
                  온 가족이 즐길 수 있는 시간
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <TreePine className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <CardTitle>자연 체험</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  목포의 아름다운 자연과
                  <br />
                  함께하는 힐링 시간
                  <br />
                  교육적이고 재미있는 체험
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <Zap className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                <CardTitle>액티비티 존</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  다양한 액티비티와
                  <br />
                  인터랙티브 체험
                  <br />
                  특별한 추억 만들기
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
              <div className="flex justify-center p-8">
                <Image
                  src="/이용요금표.jpg"
                  alt="목포 플레이파크 이용요금표"
                  width={600}
                  height={400}
                  className="max-w-full h-auto rounded-lg"
                />
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
                <MapPin className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle>위치 안내</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  전라남도 목포시 삼학로 123
                  <br />
                  목포역에서 차량 15분 거리
                  <br />
                  주차장 완비 (무료)
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Clock className="h-12 w-12 text-green-600 mx-auto mb-4" />
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
                <Phone className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle>문의 전화</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  대표번호: 061-1234-5678
                  <br />
                  예약문의: 061-1234-5679
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
                    <span className="text-sm">어드벤처 프로그램 시간 변경 안내</span>
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
                  <p className="text-3xl font-bold">061-639-4842</p>
                  <p className="text-sm text-gray-300 mt-2">현장 상황 및 긴급 문의</p>
                </CardContent>
              </Card>
              <Card className="bg-orange-600 text-white">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">고객센터</h3>
                  <p className="text-3xl font-bold">061-639-4842</p>
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
              <h3 className="text-3xl font-bold mb-4">목포 플레이파크 SNS</h3>
              <p className="text-gray-300 mb-6">
                목포 플레이파크의 최신 소식을
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
                <TreePine className="h-8 w-8 text-green-400 mr-3" />
                <h3 className="text-xl font-bold">목포 플레이파크</h3>
              </div>
              <p className="text-gray-400 text-sm">
                주소: 전라남도 목포시 삼학로 123
                <br />
                전화: 061-639-4842
                <br />
                이메일: support@mokpoplaypark.kr
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
            <p>© 2024 목포 플레이파크. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
