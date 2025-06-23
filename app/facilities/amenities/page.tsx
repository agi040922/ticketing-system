import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { NavigationHeader } from "@/components/navigation-header"
import { ArrowLeft, Coffee, ShoppingBag, Camera, Car, Baby, Accessibility, Utensils, MapPin } from "lucide-react"

export default function FacilitiesAmenitiesPage() {
  const amenities = [
    {
      id: 1,
      name: "레스토랑 & 카페",
      icon: Utensils,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      description: "목포의 특산물과 간단한 식사를 즐길 수 있는 공간",
      locations: ["메인 입구 근처", "자연 체험존 내부"],
      features: ["목포 특산 해산물 요리", "키즈 메뉴", "음료 & 디저트", "테라스 좌석"],
      hours: "09:00 - 18:00"
    },
    {
      id: 2,
      name: "포토존",
      icon: Camera,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      description: "목포 플레이파크만의 특별한 사진 촬영 공간",
      locations: ["각 테마존별 포토존", "메인 입구 대형 로고"],
      features: ["목포 배경 포토월", "놀이기구 배경", "자연 경관 촬영", "가족사진 촬영"],
      hours: "운영시간 내 24시간"
    },
    {
      id: 3,
      name: "기념품샵",
      icon: ShoppingBag,
      color: "text-green-600",
      bgColor: "bg-green-50",
      description: "플레이파크 전용 기념품과 목포 특산품을 구매할 수 있는 공간",
      locations: ["메인 입구", "출구 근처"],
      features: ["플레이파크 굿즈", "목포 특산품", "아이들 장난감", "의류 & 액세서리"],
      hours: "09:00 - 19:00"
    },
    {
      id: 4,
      name: "주차장",
      icon: Car,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      description: "넓고 안전한 무료 주차공간",
      locations: ["메인 입구 앞"],
      features: ["300대 수용 가능", "무료 이용", "장애인 전용구역", "대형버스 주차가능"],
      hours: "08:30 - 20:30"
    },
    {
      id: 5,
      name: "수유실 & 키즈존",
      icon: Baby,
      color: "text-pink-600",
      bgColor: "bg-pink-50",
      description: "영유아와 함께 방문한 가족을 위한 편의시설",
      locations: ["패밀리존 내부", "메인 휴게소"],
      features: ["수유실", "기저귀 교환대", "유아용 의자", "놀이매트"],
      hours: "운영시간 내 24시간"
    },
    {
      id: 6,
      name: "무장애 편의시설",
      icon: Accessibility,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      description: "모든 분들이 편리하게 이용할 수 있는 시설",
      locations: ["전 구역"],
      features: ["휠체어 대여", "경사로 설치", "전용 화장실", "우선 탑승 지원"],
      hours: "운영시간 내 상시"
    }
  ]

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
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">편의시설</h1>
              <p className="text-gray-600 mt-2">목포 플레이파크의 다양한 편의시설을 소개합니다</p>
            </div>
          </div>
        </div>
      </section>

      {/* Amenities Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">편리하고 안전한 시설</h2>
            <p className="text-xl text-gray-600">
              방문객 모두가 편안하게 이용할 수 있도록 다양한 편의시설을 준비했습니다
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {amenities.map((amenity) => (
              <Card key={amenity.id} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className={amenity.bgColor}>
                  <CardTitle className="flex items-center text-xl">
                    <amenity.icon className={`h-6 w-6 mr-3 ${amenity.color}`} />
                    {amenity.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-gray-600 mb-4">{amenity.description}</p>
                  
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">📍 위치</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {amenity.locations.map((location, index) => (
                          <li key={index}>• {location}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">✨ 주요 서비스</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {amenity.features.map((feature, index) => (
                          <li key={index}>• {feature}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className={`p-3 rounded-lg ${amenity.bgColor}`}>
                      <p className={`text-sm ${amenity.color} font-medium`}>
                        🕒 이용시간: {amenity.hours}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Facility Map */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">편의시설 위치 안내</h2>
            <p className="text-xl text-gray-600">각 편의시설의 위치를 확인하세요</p>
          </div>
          
          <div className="bg-white rounded-lg p-8 shadow-sm">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">🏢 메인 입구 주변</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <Car className="h-4 w-4 mr-2 text-blue-600" />
                    주차장 (300대 수용)
                  </li>
                  <li className="flex items-center">
                    <ShoppingBag className="h-4 w-4 mr-2 text-green-600" />
                    메인 기념품샵
                  </li>
                  <li className="flex items-center">
                    <Coffee className="h-4 w-4 mr-2 text-orange-600" />
                    웰컴 카페
                  </li>
                  <li className="flex items-center">
                    <Camera className="h-4 w-4 mr-2 text-purple-600" />
                    로고 포토존
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">🎢 파크 내부</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <Baby className="h-4 w-4 mr-2 text-pink-600" />
                    수유실 (패밀리존)
                  </li>
                  <li className="flex items-center">
                    <Utensils className="h-4 w-4 mr-2 text-orange-600" />
                    자연체험존 레스토랑
                  </li>
                  <li className="flex items-center">
                    <Camera className="h-4 w-4 mr-2 text-purple-600" />
                    테마별 포토존 (4곳)
                  </li>
                  <li className="flex items-center">
                    <Accessibility className="h-4 w-4 mr-2 text-indigo-600" />
                    무장애 편의시설 (전체)
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Info */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">부대 서비스</h2>
            <p className="text-xl text-gray-600">더욱 편리한 이용을 위한 추가 서비스</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Accessibility className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">휠체어 대여</h3>
                <p className="text-sm text-gray-600">무료 대여 (선착순)</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">가이드 서비스</h3>
                <p className="text-sm text-gray-600">예약 시 가능</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Camera className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">사진 서비스</h3>
                <p className="text-sm text-gray-600">전문 포토그래퍼</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Baby className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">유모차 대여</h3>
                <p className="text-sm text-gray-600">1일 3,000원</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16 bg-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">편의시설 문의</h2>
          <p className="text-xl text-green-100 mb-8">
            편의시설 이용에 관한 문의사항이 있으시면 언제든 연락주세요
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="flex items-center">
              <span className="text-xl font-semibold">📞 061-639-4842</span>
            </div>
            <div className="flex items-center">
              <span>운영시간: 09:00 - 18:00</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 