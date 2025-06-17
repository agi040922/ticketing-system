import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { NavigationHeader } from "@/components/navigation-header"
import { ArrowLeft, Car, Coffee, ShoppingBag, Baby, Utensils, Wifi, Accessibility, Camera } from "lucide-react"

export default function FacilitiesAmenitiesPage() {
  const amenities = [
    {
      name: "카페테리아",
      description: "다양한 음료와 간단한 식사를 즐길 수 있는 공간",
      features: ["커피, 음료", "샌드위치, 샐러드", "해양 테마 디저트", "150석 규모"],
      icon: Coffee,
      color: "brown"
    },
    {
      name: "기념품샵",
      description: "아쿠아리움 파크만의 특별한 기념품을 구매할 수 있습니다",
      features: ["해양생물 인형", "아쿠아리움 굿즈", "교육용 도서", "기념품 패키지"],
      icon: ShoppingBag,
      color: "purple"
    },
    {
      name: "수유실",
      description: "영유아를 동반한 가족을 위한 편의시설",
      features: ["기저귀 교환대", "수유 공간", "정수기", "유아용 의자"],
      icon: Baby,
      color: "pink"
    },
    {
      name: "주차장",
      description: "넓고 안전한 무료 주차 공간",
      features: ["200대 수용", "24시간 CCTV", "장애인 전용구역", "대형버스 주차"],
      icon: Car,
      color: "blue"
    }
  ]

  const services = [
    {
      name: "무료 WiFi",
      description: "전 구역에서 무료 인터넷 사용 가능",
      icon: Wifi
    },
    {
      name: "휠체어 대여",
      description: "거동 불편하신 분을 위한 무료 휠체어 대여",
      icon: Accessibility
    },
    {
      name: "사진 서비스",
      description: "전문 포토그래퍼의 기념사진 촬영 서비스",
      icon: Camera
    },
    {
      name: "식당",
      description: "본격적인 식사를 위한 레스토랑 운영",
      icon: Utensils
    }
  ]

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
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">편의시설</h1>
              <p className="text-gray-600 mt-2">편리하고 쾌적한 관람을 위한 다양한 편의시설</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Amenities */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">주요 편의시설</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {amenities.map((amenity, index) => {
              const IconComponent = amenity.icon
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                        <IconComponent className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{amenity.name}</CardTitle>
                        <p className="text-gray-600 text-sm">{amenity.description}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {amenity.features.map((feature, idx) => (
                        <li key={idx} className="text-gray-600 flex items-center">
                          <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">추가 서비스</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => {
              const IconComponent = service.icon
              return (
                <Card key={index} className="text-center hover:shadow-md transition-shadow duration-300">
                  <CardContent className="p-6">
                    <IconComponent className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                    <h3 className="font-semibold text-lg mb-2">{service.name}</h3>
                    <p className="text-gray-600 text-sm">{service.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Operating Hours */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">편의시설 운영시간</h2>
          <Card>
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">🍽️ 카페테리아 & 레스토랑</h3>
                    <ul className="space-y-1 text-gray-600">
                      <li>평일: 09:30 - 17:30</li>
                      <li>주말: 09:30 - 19:30</li>
                      <li>라스트오더: 마감 30분 전</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">🛍️ 기념품샵</h3>
                    <ul className="space-y-1 text-gray-600">
                      <li>평일: 09:00 - 18:00</li>
                      <li>주말: 09:00 - 20:00</li>
                      <li>아쿠아리움 운영시간과 동일</li>
                    </ul>
                  </div>
                </div>
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">🚗 주차장</h3>
                  <div className="grid md:grid-cols-3 gap-4 text-gray-600">
                    <div>
                      <p className="font-medium">운영시간</p>
                      <p>24시간 이용가능</p>
                    </div>
                    <div>
                      <p className="font-medium">주차요금</p>
                      <p>입장권 구매시 무료</p>
                    </div>
                    <div>
                      <p className="font-medium">수용대수</p>
                      <p>승용차 200대, 버스 10대</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Accessibility */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">접근성 서비스</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="p-6">
                <Accessibility className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">장애인 편의시설</h3>
                <p className="text-gray-600 text-sm">
                  휠체어 접근 가능한 관람로와 
                  전용 엘리베이터, 화장실 완비
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <Baby className="h-12 w-12 text-pink-600 mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">유아 동반 서비스</h3>
                <p className="text-gray-600 text-sm">
                  유모차 대여, 수유실, 
                  어린이 전용 관람 높이 조절
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <Wifi className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">디지털 서비스</h3>
                <p className="text-gray-600 text-sm">
                  무료 WiFi, QR코드 음성안내,
                  모바일 가이드 앱 제공
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">편안한 관람 환경을 제공합니다</h2>
          <p className="text-xl text-blue-100 mb-8">
            가족 모두가 안전하고 편리하게 즐길 수 있는 공간
          </p>
          <Link href="/purchase">
            <Button size="lg" variant="secondary" className="px-8 py-3">
              지금 예약하기
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
} 