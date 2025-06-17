import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { NavigationHeader } from "@/components/navigation-header"
import { ArrowLeft, Bell, Calendar, User, ChevronRight } from "lucide-react"

export default function CommunityNoticesPage() {
  const notices = [
    {
      id: 1,
      title: "2024년 설 연휴 운영시간 변경 안내",
      date: "2024-02-05",
      author: "관리자",
      category: "운영안내",
      isImportant: true,
      preview: "설 연휴 기간 중 운영시간이 변경됩니다. 방문 전 확인 부탁드립니다."
    },
    {
      id: 2,
      title: "신규 해양생물 전시 시작",
      date: "2024-01-20",
      author: "전시팀",
      category: "이벤트",
      isImportant: false,
      preview: "희귀 산호와 열대어들을 새롭게 만나보실 수 있습니다."
    },
    {
      id: 3,
      title: "시설 점검으로 인한 일부 구역 출입 제한",
      date: "2024-01-15",
      author: "시설관리팀",
      category: "긴급공지",
      isImportant: true,
      preview: "안전점검으로 인해 일부 구역 출입이 제한됩니다."
    },
    {
      id: 4,
      title: "가이드 투어 프로그램 확대 운영",
      date: "2024-01-10",
      author: "교육팀",
      category: "프로그램",
      isImportant: false,
      preview: "더욱 다양한 시간대에 가이드 투어를 이용하실 수 있습니다."
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
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">공지사항</h1>
              <p className="text-gray-600 mt-2">아쿠아리움 파크의 새로운 소식과 공지사항</p>
            </div>
          </div>
        </div>
      </section>

      {/* Important Notices */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">중요 공지</h2>
          <div className="space-y-4">
            {notices.filter(notice => notice.isImportant).map((notice) => (
              <Card key={notice.id} className="border-red-200 bg-red-50">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Bell className="h-5 w-5 text-red-600" />
                        <span className="bg-red-600 text-white px-2 py-1 rounded text-xs font-semibold">
                          {notice.category}
                        </span>
                        <span className="text-sm text-gray-500">{notice.date}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{notice.title}</h3>
                      <p className="text-gray-600 mb-3">{notice.preview}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">작성자: {notice.author}</span>
                        <Button variant="outline" size="sm">
                          자세히 보기 <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* General Notices */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">일반 공지</h2>
          <div className="space-y-4">
            {notices.filter(notice => !notice.isImportant).map((notice) => (
              <Card key={notice.id} className="hover:shadow-md transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs font-semibold">
                          {notice.category}
                        </span>
                        <span className="text-sm text-gray-500 flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {notice.date}
                        </span>
                        <span className="text-sm text-gray-500 flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          {notice.author}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{notice.title}</h3>
                      <p className="text-gray-600 mb-3">{notice.preview}</p>
                      <Button variant="ghost" size="sm" className="text-blue-600">
                        자세히 보기 <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Notification Settings */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-600">
                <Bell className="h-5 w-5 mr-2" />
                알림 서비스
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">📧 이메일 알림</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    중요 공지사항과 이벤트 소식을 이메일로 받아보세요.
                  </p>
                  <Button variant="outline" size="sm">
                    이메일 구독하기
                  </Button>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">📱 SMS 알림</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    긴급 공지와 운영시간 변경사항을 SMS로 알려드립니다.
                  </p>
                  <Button variant="outline" size="sm">
                    SMS 구독하기
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">궁금한 점이 있으시나요?</h2>
          <p className="text-xl text-blue-100 mb-8">
            자주하는 질문을 확인하거나 직접 문의해주세요
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/community/faq">
              <Button size="lg" variant="secondary">
                자주하는 질문
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              문의하기
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
} 