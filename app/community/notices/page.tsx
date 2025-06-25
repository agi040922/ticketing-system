"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { NavigationHeader } from "@/components/navigation-header"
import { ArrowLeft, Bell, Calendar, User, ChevronRight, Loader2, Eye } from "lucide-react"

interface Notice {
  id: string
  title: string
  content: string
  category: string
  is_important: boolean
  author: string
  status: string
  view_count: number
  created_at: string
  updated_at: string
}

export default function CommunityNoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null)

  useEffect(() => {
    loadNotices()
  }, [])

  const loadNotices = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/notices?status=active&limit=20')
      const result = await response.json()

      if (result.success) {
        setNotices(result.data)
      } else {
        console.error('공지사항 로드 실패:', result.message)
      }
    } catch (error) {
      console.error('공지사항 로드 중 오류:', error)
    } finally {
      setLoading(false)
    }
  }

  const getPreview = (content: string) => {
    return content.length > 100 ? content.substring(0, 100) + '...' : content
  }

  const filteredNotices = selectedCategory === "all" 
    ? notices 
    : notices.filter(notice => notice.category === selectedCategory)

  const categories = [
    { value: "all", label: "전체", count: notices.length },
    { value: "운영안내", label: "운영안내", count: notices.filter(n => n.category === "운영안내").length },
    { value: "이벤트", label: "이벤트", count: notices.filter(n => n.category === "이벤트").length },
    { value: "긴급공지", label: "긴급공지", count: notices.filter(n => n.category === "긴급공지").length },
    { value: "프로그램", label: "프로그램", count: notices.filter(n => n.category === "프로그램").length },
    { value: "일반공지", label: "일반공지", count: notices.filter(n => n.category === "일반공지").length }
  ].filter(cat => cat.count > 0)

  const handleNoticeClick = async (notice: Notice) => {
    setSelectedNotice(notice)
    
    // 조회수 증가 API 호출 (백그라운드에서)
    try {
      await fetch(`/api/admin/notices/${notice.id}`)
    } catch (error) {
      console.error('조회수 증가 실패:', error)
    }
  }

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

      {/* Notice Content */}
      {loading ? (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">공지사항을 불러오는 중...</p>
          </div>
        </section>
      ) : (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Category Tabs */}
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
              <div className="flex justify-center mb-8">
                <TabsList className="h-auto p-1">
                  {categories.map((category) => (
                    <TabsTrigger 
                      key={category.value} 
                      value={category.value} 
                      className="flex items-center gap-2 px-4 py-2"
                    >
                      {category.label}
                      <Badge variant="secondary" className="text-xs ml-1">
                        {category.count}
                      </Badge>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              {categories.map((category) => (
                <TabsContent key={category.value} value={category.value}>
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        {category.label === "전체" ? "전체 공지사항" : `${category.label} 공지사항`}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {filteredNotices.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                          {category.label === "전체" ? "공지사항이 없습니다." : `${category.label} 공지사항이 없습니다.`}
                        </div>
                      ) : (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[100px]">분류</TableHead>
                              <TableHead>제목</TableHead>
                              <TableHead className="w-[120px]">작성자</TableHead>
                              <TableHead className="w-[120px]">작성일</TableHead>
                              <TableHead className="w-[80px]">조회</TableHead>
                              <TableHead className="w-[100px]">상세</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredNotices.map((notice) => (
                              <TableRow key={notice.id} className="hover:bg-gray-50">
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    {notice.is_important && (
                                      <Bell className="h-4 w-4 text-red-500" />
                                    )}
                                    <Badge 
                                      variant={notice.is_important ? "destructive" : "secondary"}
                                      className="text-xs"
                                    >
                                      {notice.category}
                                    </Badge>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <div 
                                        className="font-medium text-gray-900 hover:text-blue-600 cursor-pointer"
                                        onClick={() => handleNoticeClick(notice)}
                                      >
                                        {notice.title}
                                        {notice.is_important && (
                                          <span className="ml-2 text-red-500 font-bold text-xs">중요</span>
                                        )}
                                      </div>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                                      <DialogHeader>
                                        <div className="flex items-center gap-3 mb-3">
                                          {notice.is_important && (
                                            <Bell className="h-5 w-5 text-red-500" />
                                          )}
                                          <Badge 
                                            variant={notice.is_important ? "destructive" : "secondary"}
                                          >
                                            {notice.category}
                                          </Badge>
                                          {notice.is_important && (
                                            <Badge variant="destructive">중요공지</Badge>
                                          )}
                                        </div>
                                        <DialogTitle className="text-xl font-bold text-left">
                                          {notice.title}
                                        </DialogTitle>
                                        <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
                                          <span>작성자: {notice.author}</span>
                                          <span>작성일: {new Date(notice.created_at).toLocaleDateString()}</span>
                                          <span>조회수: {notice.view_count}</span>
                                        </div>
                                      </DialogHeader>
                                      <div className="mt-6">
                                        <div className="prose max-w-none">
                                          <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                                            {notice.content}
                                          </div>
                                        </div>
                                      </div>
                                    </DialogContent>
                                  </Dialog>
                                </TableCell>
                                <TableCell className="text-gray-600">
                                  {notice.author}
                                </TableCell>
                                <TableCell className="text-gray-600">
                                  {new Date(notice.created_at).toLocaleDateString()}
                                </TableCell>
                                <TableCell className="text-gray-600">
                                  {notice.view_count}
                                </TableCell>
                                <TableCell>
                                  <span className="text-sm text-gray-500">↑ 제목 클릭</span>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </section>
      )}

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