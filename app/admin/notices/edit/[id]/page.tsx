"use client"

import { useEffect, useState, use } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ImageUpload } from "@/components/image-upload"
import { ArrowLeft, Save, Eye, Loader2 } from "lucide-react"

interface NoticeData {
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
  images?: any[]
}

export default function EditNoticePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "일반공지",
    isImportant: false,
    author: "관리자",
    status: "active"
  })
  const [images, setImages] = useState<any[]>([])
  const [preview, setPreview] = useState(false)

  const categories = [
    { value: "일반공지", label: "일반공지" },
    { value: "운영안내", label: "운영안내" },
    { value: "이벤트", label: "이벤트" },
    { value: "긴급공지", label: "긴급공지" },
    { value: "프로그램", label: "프로그램" }
  ]

  useEffect(() => {
    // 관리자 로그인 확인
    const isLoggedIn = localStorage.getItem("adminLoggedIn")
    if (!isLoggedIn) {
      router.push("/admin")
      return
    }

    loadNotice()
  }, [resolvedParams.id, router])

  const loadNotice = async () => {
    try {
      setInitialLoading(true)
      const response = await fetch(`/api/admin/notices/${resolvedParams.id}`)
      const result = await response.json()

      if (result.success) {
        const notice = result.data
        setFormData({
          title: notice.title,
          content: notice.content,
          category: notice.category,
          isImportant: notice.is_important,
          author: notice.author,
          status: notice.status
        })
        setImages(notice.images || [])
      } else {
        alert('공지사항을 찾을 수 없습니다.')
        router.push('/admin/notices')
      }
    } catch (error) {
      console.error('공지사항 로드 중 오류:', error)
      alert('공지사항을 불러오는데 실패했습니다.')
      router.push('/admin/notices')
    } finally {
      setInitialLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('제목과 내용을 모두 입력해주세요.')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`/api/admin/notices/${resolvedParams.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          images
        })
      })

      const result = await response.json()

      if (result.success) {
        alert('공지사항이 성공적으로 수정되었습니다.')
        router.push('/admin/notices')
      } else {
        alert('수정에 실패했습니다: ' + result.message)
      }
    } catch (error) {
      console.error('공지사항 수정 중 오류:', error)
      alert('수정 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center space-y-4 p-6">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
            <p className="text-lg font-medium">공지사항을 불러오는 중...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <Link href="/admin/notices">
              <Button variant="ghost" size="sm" className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                목록으로
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">공지사항 수정</h1>
              <p className="text-gray-600">공지사항을 수정하여 최신 정보로 업데이트하세요</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setPreview(!preview)}
            >
              <Eye className="h-4 w-4 mr-2" />
              {preview ? '편집' : '미리보기'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 수정 폼 */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>공지사항 정보</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* 제목 */}
                  <div>
                    <Label htmlFor="title">제목 *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="공지사항 제목을 입력하세요"
                      required
                      maxLength={200}
                    />
                    <div className="text-sm text-gray-500 mt-1">
                      {formData.title.length}/200자
                    </div>
                  </div>

                  {/* 내용 */}
                  <div>
                    <Label htmlFor="content">내용 *</Label>
                    <Textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) => handleInputChange('content', e.target.value)}
                      placeholder="공지사항 내용을 상세히 작성하세요"
                      rows={15}
                      required
                      className="resize-none"
                    />
                    <div className="text-sm text-gray-500 mt-1">
                      {formData.content.length}자
                    </div>
                  </div>

                  {/* 카테고리 */}
                  <div>
                    <Label htmlFor="category">카테고리</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => handleInputChange('category', value)}
                    >
                      <SelectTrigger>
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
                  </div>

                  {/* 작성자 */}
                  <div>
                    <Label htmlFor="author">작성자</Label>
                    <Input
                      id="author"
                      value={formData.author}
                      onChange={(e) => handleInputChange('author', e.target.value)}
                      placeholder="작성자명"
                    />
                  </div>

                  {/* 중요 공지 */}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="important"
                      checked={formData.isImportant}
                      onCheckedChange={(checked) => handleInputChange('isImportant', checked)}
                    />
                    <Label htmlFor="important" className="text-sm font-medium">
                      중요 공지로 설정 (상단에 표시됩니다)
                    </Label>
                  </div>

                  {/* 상태 */}
                  <div>
                    <Label htmlFor="status">상태</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => handleInputChange('status', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">활성</SelectItem>
                        <SelectItem value="inactive">비활성</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* 이미지 업로드 */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block">이미지 첨부 (선택사항)</Label>
                    <ImageUpload
                      images={images}
                      onImagesChange={setImages}
                      maxImages={5}
                      maxSizeInMB={5}
                    />
                  </div>

                  {/* 버튼 */}
                  <div className="flex gap-3">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="flex-1"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {loading ? '수정 중...' : '공지사항 수정'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.push('/admin/notices')}
                      disabled={loading}
                    >
                      취소
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* 미리보기 */}
          <div className="space-y-6">
            {preview ? (
              <Card>
                <CardHeader>
                  <CardTitle>미리보기</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        {formData.isImportant && (
                          <span className="bg-red-600 text-white px-2 py-1 rounded text-xs font-semibold">
                            중요
                          </span>
                        )}
                        <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs font-semibold">
                          {formData.category}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          formData.status === 'active' 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {formData.status === 'active' ? '활성' : '비활성'}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {formData.title || '제목을 입력하세요'}
                      </h3>
                    </div>
                    <div className="border-t pt-4">
                      <div className="whitespace-pre-wrap text-gray-700">
                        {formData.content || '내용을 입력하세요'}
                      </div>
                      {images.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium text-gray-900 mb-2">첨부 이미지</h4>
                          <div className="grid grid-cols-2 gap-2">
                            {images.map((image) => (
                              <img
                                key={image.id}
                                src={image.url}
                                alt={image.alt || image.filename}
                                className="w-full h-20 object-cover rounded border"
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="text-sm text-gray-500 border-t pt-4">
                      작성자: {formData.author} | 수정일: {new Date().toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>수정 가이드</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">⚠️ 수정 시 주의사항</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• 공지사항 수정 시 고객들에게 혼동을 줄 수 있습니다</li>
                      <li>• 중요한 변경사항은 별도 공지를 검토하세요</li>
                      <li>• 상태를 '비활성'으로 변경하면 노출되지 않습니다</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">📝 수정 팁</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• 오타나 정보 수정 시에만 기존 공지를 수정하세요</li>
                      <li>• 새로운 내용은 새 공지사항으로 작성하세요</li>
                      <li>• 미리보기로 수정된 내용을 확인하세요</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">🔄 상태 관리</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• <strong>활성:</strong> 공지사항 페이지에 노출됩니다</li>
                      <li>• <strong>비활성:</strong> 임시로 숨길 때 사용하세요</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 