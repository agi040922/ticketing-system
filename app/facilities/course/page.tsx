import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { NavigationHeader } from "@/components/navigation-header"
import { ArrowLeft, TreePine, Zap, Star, Users, Clock, Shield, MapPin } from "lucide-react"

export default function FacilitiesCoursePage() {
  const courses = [
    {
      id: 1,
      name: "스릴 존",
      icon: Zap,
      color: "text-red-600",
      bgColor: "bg-red-50",
      description: "심장이 뛰는 짜릿한 스릴을 경험할 수 있는 고강도 놀이기구 구역",
      facilities: [
        { name: "롤러코스터", height: "140cm 이상", time: "3분", capacity: "24명" },
        { name: "바이킹", height: "120cm 이상", time: "4분", capacity: "40명" },
        { name: "자이로드롭", height: "130cm 이상", time: "2분", capacity: "16명" },
        { name: "범퍼카", height: "제한없음", time: "5분", capacity: "20대" }
      ],
      tips: "평일 오전 10-11시가 가장 한적합니다. 키 제한을 사전에 확인하세요."
    },
    {
      id: 2,
      name: "패밀리 존",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      description: "온 가족이 함께 안전하게 즐길 수 있는 놀이시설 구역",
      facilities: [
        { name: "회전목마", height: "제한없음", time: "4분", capacity: "32명" },
        { name: "미니 기차", height: "제한없음", time: "10분", capacity: "48명" },
        { name: "키즈 놀이터", height: "12세 이하", time: "자유", capacity: "50명" },
        { name: "물놀이장", height: "제한없음", time: "자유", capacity: "100명" }
      ],
      tips: "어린이 동반 시 가장 안전한 구역입니다. 여름철 물놀이장이 인기가 높습니다."
    },
    {
      id: 3,
      name: "자연 체험존",
      icon: TreePine,
      color: "text-green-600",
      bgColor: "bg-green-50",
      description: "목포의 아름다운 자연과 함께하는 생태 체험 및 학습 공간",
      facilities: [
        { name: "생태 관찰원", height: "제한없음", time: "30분", capacity: "20명" },
        { name: "자연 학습관", height: "제한없음", time: "45분", capacity: "30명" },
        { name: "산책로", height: "제한없음", time: "자유", capacity: "무제한" },
        { name: "포토존", height: "제한없음", time: "자유", capacity: "무제한" }
      ],
      tips: "가이드 투어는 매일 10시, 14시에 진행됩니다. 사진 촬영에 최적화된 구역입니다."
    },
    {
      id: 4,
      name: "어드벤처 존",
      icon: Star,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      description: "모험과 도전을 즐기는 특별한 체험활동 구역",
      facilities: [
        { name: "어드벤처 타워", height: "125cm 이상", time: "15분", capacity: "8명" },
        { name: "집라인", height: "130cm 이상", time: "3분", capacity: "1명" },
        { name: "암벽등반", height: "120cm 이상", time: "10분", capacity: "4명" },
        { name: "서바이벌 게임", height: "140cm 이상", time: "20분", capacity: "16명" }
      ],
      tips: "별도 안전장비 착용이 필요합니다. 사전 예약을 권장합니다."
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
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">코스구성</h1>
              <p className="text-gray-600 mt-2">목포 플레이파크의 다양한 놀이시설과 체험존</p>
            </div>
          </div>
        </div>
      </section>

      {/* Course Overview */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">4개의 특별한 구역</h2>
            <p className="text-xl text-gray-600">
              각기 다른 매력을 가진 테마존에서 특별한 경험을 만나보세요
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {courses.map((course) => (
              <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <CardHeader className={course.bgColor}>
                  <CardTitle className="flex items-center text-2xl">
                    <course.icon className={`h-8 w-8 mr-3 ${course.color}`} />
                    {course.name}
                  </CardTitle>
                  <p className="text-gray-600 mt-2">{course.description}</p>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">주요 시설</h3>
                    <div className="grid gap-3">
                      {course.facilities.map((facility, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">{facility.name}</p>
                            <p className="text-sm text-gray-600">신장 제한: {facility.height}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-600">소요시간: {facility.time}</p>
                            <p className="text-sm text-gray-600">수용인원: {facility.capacity}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className={`p-4 rounded-lg ${course.bgColor}`}>
                      <p className={`text-sm ${course.color} font-medium`}>💡 이용 팁</p>
                      <p className="text-sm text-gray-700 mt-1">{course.tips}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Park Map */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">파크 맵</h2>
            <p className="text-xl text-gray-600">각 구역의 위치를 확인하고 효율적인 동선을 계획하세요</p>
          </div>
          
          <div className="bg-white rounded-lg p-8 shadow-sm">
            {/* Simplified Map Representation */}
            <div className="grid grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="space-y-4">
                <div className="bg-red-50 p-6 rounded-lg border-2 border-red-200">
                  <div className="flex items-center mb-2">
                    <Zap className="h-6 w-6 text-red-600 mr-2" />
                    <h3 className="font-bold text-red-600">스릴 존</h3>
                  </div>
                  <p className="text-sm text-gray-600">입구 좌측</p>
                </div>
                <div className="bg-green-50 p-6 rounded-lg border-2 border-green-200">
                  <div className="flex items-center mb-2">
                    <TreePine className="h-6 w-6 text-green-600 mr-2" />
                    <h3 className="font-bold text-green-600">자연 체험존</h3>
                  </div>
                  <p className="text-sm text-gray-600">파크 중앙</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200">
                  <div className="flex items-center mb-2">
                    <Users className="h-6 w-6 text-blue-600 mr-2" />
                    <h3 className="font-bold text-blue-600">패밀리 존</h3>
                  </div>
                  <p className="text-sm text-gray-600">입구 우측</p>
                </div>
                <div className="bg-purple-50 p-6 rounded-lg border-2 border-purple-200">
                  <div className="flex items-center mb-2">
                    <Star className="h-6 w-6 text-purple-600 mr-2" />
                    <h3 className="font-bold text-purple-600">어드벤처 존</h3>
                  </div>
                  <p className="text-sm text-gray-600">파크 후면</p>
                </div>
              </div>
            </div>
            
            <div className="text-center mt-8">
              <div className="inline-flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  메인 입구
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  각 구역간 도보 5-10분
                </div>
                <div className="flex items-center">
                  <Shield className="h-4 w-4 mr-1" />
                  안전요원 상주
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Recommendations */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">추천 이용 순서</h2>
            <p className="text-xl text-gray-600">방문 목적에 따른 최적의 코스를 제안합니다</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="text-green-600">가족 나들이 코스</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <span className="bg-green-100 text-green-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">1</span>
                    패밀리 존에서 시작
                  </li>
                  <li className="flex items-start">
                    <span className="bg-green-100 text-green-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">2</span>
                    자연 체험존 산책
                  </li>
                  <li className="flex items-start">
                    <span className="bg-green-100 text-green-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">3</span>
                    점심 식사 및 휴식
                  </li>
                  <li className="flex items-start">
                    <span className="bg-green-100 text-green-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">4</span>
                    스릴 존 (적당한 기구)
                  </li>
                </ol>
                <p className="text-sm text-green-600 mt-4 font-medium">소요시간: 4-5시간</p>
              </CardContent>
            </Card>

            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-red-600">스릴 추구자 코스</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <span className="bg-red-100 text-red-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">1</span>
                    스릴 존 모든 기구
                  </li>
                  <li className="flex items-start">
                    <span className="bg-red-100 text-red-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">2</span>
                    어드벤처 존 도전
                  </li>
                  <li className="flex items-start">
                    <span className="bg-red-100 text-red-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">3</span>
                    휴식 및 재충전
                  </li>
                  <li className="flex items-start">
                    <span className="bg-red-100 text-red-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">4</span>
                    재도전 및 기록 경신
                  </li>
                </ol>
                <p className="text-sm text-red-600 mt-4 font-medium">소요시간: 5-6시간</p>
              </CardContent>
            </Card>

            <Card className="border-purple-200">
              <CardHeader>
                <CardTitle className="text-purple-600">체험 학습 코스</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <span className="bg-purple-100 text-purple-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">1</span>
                    자연 체험존 가이드 투어
                  </li>
                  <li className="flex items-start">
                    <span className="bg-purple-100 text-purple-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">2</span>
                    어드벤처 존 체험
                  </li>
                  <li className="flex items-start">
                    <span className="bg-purple-100 text-purple-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">3</span>
                    패밀리 존 놀이
                  </li>
                  <li className="flex items-start">
                    <span className="bg-purple-100 text-purple-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">4</span>
                    기념품 만들기 체험
                  </li>
                </ol>
                <p className="text-sm text-purple-600 mt-4 font-medium">소요시간: 3-4시간</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">모든 구역을 경험해보세요!</h2>
          <p className="text-xl text-green-100 mb-8">
            4개의 특별한 테마존에서 잊지 못할 추억을 만들어보세요
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/purchase">
              <Button size="lg" variant="secondary" className="px-8 py-3">
                지금 예약하기
              </Button>
            </Link>
            <Link href="/guide/pricing">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600 px-8 py-3">
                요금 확인하기
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
} 