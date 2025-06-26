"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { ArrowLeft, Plus, Eye, Edit, Trash2, Search, Image as ImageIcon } from "lucide-react"

interface Notice {
  id: number
  title: string
  content: string
  category: string
  is_important: boolean
  author: string
  status: string
  view_count: number
  created_at: string
  updated_at: string
  images?: any[]
}

export default function AdminNoticesPage() {
  const router = useRouter()
  const [notices, setNotices] = useState<Notice[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("active")

  useEffect(() => {
    // 관리자 로그인 확인
    const isLoggedIn = localStorage.getItem("adminLoggedIn")
    if (!isLoggedIn) {
      router.push("/admin")
      return
    }

    loadNotices()
  }, [router, categoryFilter, statusFilter])

  const loadNotices = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        status: statusFilter,
        limit: '50'
      })
      
      if (categoryFilter !== 'all') {
        params.append('category', categoryFilter)
      }

      const response = await fetch(`/api/admin/notices?${params}`)
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

  const deleteNotice = async (id: number) => {
    try {
      const response = await fetch(`/api/admin/notices/${id}`, {
        method: 'DELETE'
      })

      const result = await response.json()
      
      if (result.success) {
        // 목록 새로고침
        loadNotices()
      } else {
        alert('삭제에 실패했습니다: ' + result.message)
      }
    } catch (error) {
      console.error('공지사항 삭제 중 오류:', error)
      alert('삭제 중 오류가 발생했습니다.')
    }
  }

  const filteredNotices = notices.filter(notice =>
    notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    notice.content.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const categories = [
    { value: "all", label: "전체" },
    { value: "운영안내", label: "운영안내" },
    { value: "이벤트", label: "이벤트" },
    { value: "긴급공지", label: "긴급공지" },
    { value: "프로그램", label: "프로그램" },
    { value: "일반공지", label: "일반공지" }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <Link href="/admin/dashboard">
              <Button variant="ghost" size="sm" className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                대시보드
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">공지사항 관리</h1>
              <p className="text-gray-600">공지사항을 작성하고 관리할 수 있습니다</p>
            </div>
          </div>
          <Link href="/admin/notices/create">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              새 공지사항 작성
            </Button>
          </Link>
        </div>

        {/* 필터 및 검색 */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="제목이나 내용으로 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="카테고리 선택" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-32">
                  <SelectValue placeholder="상태" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">활성</SelectItem>
                  <SelectItem value="inactive">비활성</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* 공지사항 목록 */}
        <Card>
          <CardHeader>
            <CardTitle>공지사항 목록</CardTitle>
            <CardDescription>
              총 {filteredNotices.length}개의 공지사항
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-gray-500">로딩 중...</div>
            ) : filteredNotices.length === 0 ? (
              <div className="text-center py-8 text-gray-500">공지사항이 없습니다.</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>제목</TableHead>
                    <TableHead>카테고리</TableHead>
                    <TableHead>작성자</TableHead>
                    <TableHead>조회수</TableHead>
                    <TableHead>작성일</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>관리</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredNotices.map((notice) => (
                    <TableRow key={notice.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {notice.is_important && (
                            <Badge variant="destructive" className="text-xs">
                              중요
                            </Badge>
                          )}
                          {notice.images && notice.images.length > 0 && (
                            <div className="flex items-center text-xs text-gray-500">
                              <ImageIcon className="h-3 w-3 mr-1" />
                              {notice.images.length}
                            </div>
                          )}
                          <span className="font-medium">{notice.title}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{notice.category}</Badge>
                      </TableCell>
                      <TableCell>{notice.author}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4 text-gray-400" />
                          {notice.view_count}
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(notice.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant={notice.status === 'active' ? 'default' : 'secondary'}>
                          {notice.status === 'active' ? '활성' : '비활성'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Link href={`/admin/notices/edit/${notice.id}`}>
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>공지사항 삭제</AlertDialogTitle>
                                <AlertDialogDescription>
                                  정말로 이 공지사항을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>취소</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteNotice(notice.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  삭제
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 