"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Users, 
  FileText, 
  BarChart3, 
  ArrowRight,
  LogOut,
  Shield
} from "lucide-react"

export default function AdminMainPage() {
  const router = useRouter()

  useEffect(() => {
    // 관리자 로그인 확인
    const isLoggedIn = localStorage.getItem("adminLoggedIn")
    if (!isLoggedIn) {
      router.push("/admin/login")
      return
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn")
    router.push("/admin/login")
  }

  const menuItems = [
    {
      title: "대시보드",
      description: "주문 및 티켓 관리",
      icon: BarChart3,
      href: "/admin/dashboard",
      color: "bg-blue-500"
    },
    {
      title: "공지사항 관리",
      description: "공지사항 작성 및 관리",
      icon: FileText,
      href: "/admin/notices",
      color: "bg-green-500"
    },
    {
      title: "사용자 관리",
      description: "회원 정보 및 권한 관리",
      icon: Users,
      href: "/admin/users",
      color: "bg-purple-500"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Shield className="h-8 w-8 mr-3 text-blue-600" />
              관리자 페이지
            </h1>
            <p className="text-gray-600 mt-2">아쿠아리움 파크 관리 시스템</p>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="outline">메인으로</Button>
            </Link>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              로그아웃
            </Button>
          </div>
        </div>

        {/* 메뉴 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => {
            const IconComponent = item.icon
            return (
              <Link key={item.href} href={item.href}>
                <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer group h-full">
                  <CardHeader className="text-center pb-4">
                    <div className="flex justify-center mb-4">
                      <div className={`p-4 rounded-lg ${item.color}`}>
                        <IconComponent className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    <CardTitle className="text-xl mb-2">{item.title}</CardTitle>
                    <CardDescription className="text-gray-600">
                      {item.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center pt-0">
                    <div className="flex items-center justify-center text-blue-600 font-medium">
                      관리하기
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>

        {/* 하단 설명 */}
        <div className="mt-12 text-center">
          <p className="text-gray-500">
            위 메뉴를 클릭하여 각 관리 기능에 접근할 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  )
} 