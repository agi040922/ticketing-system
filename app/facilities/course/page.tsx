import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { NavigationHeader } from "@/components/navigation-header"
import { ArrowLeft, MapPin, Clock, Users, Fish, Waves, Star } from "lucide-react"

export default function FacilitiesCoursePage() {
  const courses = [
    {
      id: 1,
      name: "메인 수족관",
      duration: "15-20분",
      highlights: ["대형 상어", "가오리", "참치", "바다거북"],
      description: "가장 큰 규모의 수족관으로 다양한 대형 해양 생물들을 관람할 수 있습니다.",
      icon: Fish,
      color: "blue"
    },
    {
      id: 2,
      name: "언더워터 터널",
      duration: "10-15분",
      highlights: ["360도 뷰", "상어 터널", "인생샷 명소"],
      description: "80m 길이의 투명한 터널을 걸으며 바다 속을 경험할 수 있습니다.",
      icon: Waves,
      color: "teal"
    },
    {
      id: 3,
      name: "터치 체험존",
      duration: "10분",
      highlights: ["불가사리", "성게", "소라게", "해삼"],
      description: "안전한 해양 생물들을 직접 만져볼 수 있는 체험 공간입니다.",
      icon: Star,
      color: "purple"
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
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">코스구성</h1>
              <p className="text-gray-600 mt-2">아쿠아리움 파크의 관람 코스를 소개합니다</p>
            </div>
          </div>
        </div>
      </section>

      {/* Course Overview */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">전체 관람 코스</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              총 3개의 메인 코스로 구성되어 있으며, 권장 관람 시간은 약 1시간입니다.
              각 코스는 순서대로 관람하시는 것을 권장드립니다.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {courses.map((course, index) => {
              const IconComponent = course.icon
              return (
                <Card key={course.id} className="relative overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className={`absolute top-0 left-0 right-0 h-2 bg-${course.color}-500`}></div>
                  <CardHeader className="text-center">
                    <div className={`w-16 h-16 bg-${course.color}-100 rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <span className="text-2xl font-bold text-blue-600">{index + 1}</span>
                    </div>
                    <CardTitle className="text-xl">{course.name}</CardTitle>
                    <div className="flex items-center justify-center text-gray-600">
                      <Clock className="h-4 w-4 mr-1" />
                      <span className="text-sm">{course.duration}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{course.description}</p>
                    <div>
                      <h4 className="font-semibold mb-2">주요 볼거리:</h4>
                      <ul className="space-y-1">
                        {course.highlights.map((highlight, idx) => (
                          <li key={idx} className="text-sm text-gray-600">• {highlight}</li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Route Map */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">관람 경로</h2>
          <div className="bg-white rounded-lg p-8 shadow-sm">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex-1 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">입구</span>
                </div>
                <p className="font-semibold">메인 입구</p>
              </div>
              
              <div className="hidden md:block">
                <div className="w-8 h-1 bg-blue-300"></div>
              </div>
              
              <div className="flex-1 text-center">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <p className="font-semibold">메인 수족관</p>
              </div>
              
              <div className="hidden md:block">
                <div className="w-8 h-1 bg-blue-300"></div>
              </div>
              
              <div className="flex-1 text-center">
                <div className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <p className="font-semibold">언더워터 터널</p>
              </div>
              
              <div className="hidden md:block">
                <div className="w-8 h-1 bg-blue-300"></div>
              </div>
              
              <div className="flex-1 text-center">
                <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                <p className="font-semibold">터치 체험존</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Special Programs */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">특별 프로그램</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-orange-600">
                  <Clock className="h-5 w-5 mr-2" />
                  피딩쇼 (먹이주기)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-gray-600">전문 다이버가 수중에서 진행하는 상어와 물고기들의 먹이주기 쇼</p>
                  <div>
                    <p className="font-semibold">운영시간:</p>
                    <p className="text-gray-600">매일 오후 3시 (약 15분간)</p>
                  </div>
                  <div>
                    <p className="font-semibold">장소:</p>
                    <p className="text-gray-600">메인 수족관</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-green-600">
                  <Users className="h-5 w-5 mr-2" />
                  가이드 투어
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-gray-600">전문 해설사와 함께하는 심화 관람 프로그램</p>
                  <div>
                    <p className="font-semibold">운영시간:</p>
                    <p className="text-gray-600">평일 11시, 14시, 16시 (약 45분간)</p>
                  </div>
                  <div>
                    <p className="font-semibold">참가비:</p>
                    <p className="text-gray-600">1인당 5,000원 추가</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Tips */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">관람 팁</h2>
          <div className="bg-white rounded-lg p-8 shadow-sm">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">⏰ 최적 관람 시간</h3>
                <p className="text-gray-600 mb-4">
                  오전 10-11시나 오후 2-3시가 가장 한적합니다. 
                  피딩쇼 관람을 원한다면 오후 2시 30분 입장을 추천합니다.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">📸 촬영 포인트</h3>
                <p className="text-gray-600 mb-4">
                  언더워터 터널 중앙과 메인 수족관 정면이 
                  가장 아름다운 사진을 촬영할 수 있는 명소입니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">특별한 수중 여행을 시작하세요</h2>
          <p className="text-xl text-blue-100 mb-8">
            체계적으로 구성된 코스로 최고의 관람 경험을 제공합니다
          </p>
          <Link href="/purchase">
            <Button size="lg" variant="secondary" className="px-8 py-3">
              입장권 구매하기
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
} 