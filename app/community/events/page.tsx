import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { NavigationHeader } from "@/components/navigation-header"
import { ArrowLeft, Calendar, Clock, MapPin, Gift, Star, Users } from "lucide-react"

export default function CommunityEventsPage() {
  const events = [
    {
      id: 1,
      title: "해양생물 특별 전시",
      description: "희귀한 심해어와 형광 산호를 만나보세요",
      startDate: "2024-03-01",
      endDate: "2024-03-31",
      time: "전 운영시간",
      location: "특별전시관",
      status: "진행중",
      image: "https://www.coexaqua.com/media/xnrgpngi/7.jpg",
      isHighlight: true
    },
    {
      id: 2,
      title: "아이들을 위한 해양 교육 프로그램",
      description: "체험형 교육으로 바다 생물에 대해 배워보세요",
      startDate: "2024-02-15",
      endDate: "2024-04-15",
      time: "매주 토, 일 14:00~16:00",
      location: "교육센터",
      status: "예약가능",
      image: "https://static.hanatour.com/product/2021/09/10/0649jis4fa/default.jpg",
      isHighlight: false
    },
    {
      id: 3,
      title: "야간 수족관 투어",
      description: "밤에만 볼 수 있는 신비로운 해양생물들",
      startDate: "2024-03-15",
      endDate: "2024-05-15",
      time: "매주 금, 토 19:00~21:00",
      location: "메인 수족관",
      status: "사전예약필수",
      image: "https://www.hanwha.co.kr/images/newsMedia/photo/20210118_news04.jpg",
      isHighlight: true
    }
  ]

  const pastEvents = [
    {
      id: 4,
      title: "2024 신년 특별 이벤트",
      description: "신년을 맞아 특별한 할인과 이벤트를 진행했습니다",
      date: "2024-01-01 ~ 2024-01-31",
      status: "종료"
    },
    {
      id: 5,
      title: "겨울방학 패밀리 패키지",
      description: "가족 단위 관람객을 위한 특별 패키지 이벤트",
      date: "2023-12-20 ~ 2024-02-28",
      status: "종료"
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      <NavigationHeader />
      
      {/* Header Section */}
      <section className="py-8 bg-gradient-to-b from-purple-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-6">
            <Link href="/">
              <Button variant="ghost" size="sm" className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                홈으로
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">이벤트</h1>
              <p className="text-gray-600 mt-2">특별한 이벤트와 프로그램을 확인해보세요</p>
            </div>
          </div>
        </div>
      </section>

      {/* Highlight Events */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">🌟 주요 이벤트</h2>
          <div className="grid lg:grid-cols-2 gap-8">
            {events.filter(event => event.isHighlight).map((event) => (
              <Card key={event.id} className="overflow-hidden border-2 border-purple-200">
                <div className="relative">
                  <img 
                    src={event.image} 
                    alt={event.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      event.status === '진행중' 
                        ? 'bg-green-100 text-green-800' 
                        : event.status === '예약가능'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-orange-100 text-orange-800'
                    }`}>
                      {event.status}
                    </span>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-xl">{event.title}</CardTitle>
                  <p className="text-gray-600">{event.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{event.startDate} ~ {event.endDate}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4">
                    자세히 보기
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Regular Events */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">정기 이벤트</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.filter(event => !event.isHighlight).map((event) => (
              <Card key={event.id} className="hover:shadow-lg transition-shadow duration-300">
                <div className="relative">
                  <img 
                    src={event.image} 
                    alt={event.title}
                    className="w-full h-32 object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      event.status === '진행중' 
                        ? 'bg-green-100 text-green-800' 
                        : event.status === '예약가능'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-orange-100 text-orange-800'
                    }`}>
                      {event.status}
                    </span>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">{event.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{event.description}</p>
                  <div className="space-y-2 text-xs text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>{event.startDate} ~ {event.endDate}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{event.time}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-3">
                    예약하기
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Special Offers */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">🎁 특별 혜택</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-yellow-200 bg-yellow-50">
              <CardHeader>
                <CardTitle className="flex items-center text-yellow-600">
                  <Gift className="h-5 w-5 mr-2" />
                  생일 특별 할인
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  생일 당월에 방문하시면 50% 할인 혜택을 드립니다.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 신분증 지참 필수</li>
                  <li>• 당월 내 1회 이용 가능</li>
                  <li>• 다른 할인과 중복 불가</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center text-blue-600">
                  <Users className="h-5 w-5 mr-2" />
                  단체 방문 혜택
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  20명 이상 단체 방문 시 특별 프로그램을 제공합니다.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 전용 가이드 투어</li>
                  <li>• 단체 사진 촬영</li>
                  <li>• 기념품 증정</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-purple-200 bg-purple-50">
              <CardHeader>
                <CardTitle className="flex items-center text-purple-600">
                  <Star className="h-5 w-5 mr-2" />
                  멤버십 혜택
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  연간 멤버십 가입 시 다양한 혜택을 받으실 수 있습니다.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 무제한 입장</li>
                  <li>• 동반자 할인</li>
                  <li>• 특별 이벤트 우선 참여</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Past Events */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">지난 이벤트</h2>
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {pastEvents.map((event) => (
                    <div key={event.id} className="flex items-center justify-between py-4 border-b last:border-b-0">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{event.title}</h3>
                        <p className="text-gray-600 text-sm">{event.description}</p>
                        <p className="text-gray-500 text-xs mt-1">{event.date}</p>
                      </div>
                      <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded text-sm">
                        {event.status}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">이벤트 소식을 가장 먼저 받아보세요!</h2>
          <p className="text-xl text-purple-100 mb-8">
            새로운 이벤트와 특별 혜택 정보를 이메일로 받아보세요
          </p>
          <div className="max-w-md mx-auto flex gap-3">
            <input
              type="email"
              placeholder="이메일 주소를 입력하세요"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
            <Button size="lg" variant="secondary">
              구독하기
            </Button>
          </div>
          <p className="text-purple-200 text-sm mt-4">
            언제든지 구독 해지가 가능합니다.
          </p>
        </div>
      </section>
    </div>
  )
} 