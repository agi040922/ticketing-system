"use client"

import { useState } from "react"
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
import { ArrowLeft, Save, Eye } from "lucide-react"

export default function CreateNoticePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "일반공지",
    isImportant: false,
    author: "관리자"
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('제목과 내용을 모두 입력해주세요.')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/admin/notices', {
        method: 'POST',
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
        alert('공지사항이 성공적으로 작성되었습니다.')
        router.push('/admin/notices')
      } else {
        alert('작성에 실패했습니다: ' + result.message)
      }
    } catch (error) {
      console.error('공지사항 작성 중 오류:', error)
      alert('작성 중 오류가 발생했습니다.')
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
              <h1 className="text-3xl font-bold text-gray-900">새 공지사항 작성</h1>
              <p className="text-gray-600">공지사항을 작성하여 고객들에게 정보를 전달하세요</p>
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
          {/* 작성 폼 */}
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
                      {loading ? '작성 중...' : '공지사항 작성'}
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

          {/* 미리보기 및 가이드 */}
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
                      작성자: {formData.author} | 작성일: {new Date().toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>작성 가이드</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">📝 제목 작성 팁</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• 간결하고 명확하게 작성하세요</li>
                      <li>• 200자 이내로 제한됩니다</li>
                      <li>• 중요한 키워드를 앞쪽에 배치하세요</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">📄 내용 작성 팁</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• 5W1H를 고려하여 작성하세요</li>
                      <li>• 중요한 정보는 상단에 배치하세요</li>
                      <li>• 문의처나 연락처를 포함하세요</li>
                      <li>• 줄바꿈을 활용하여 가독성을 높이세요</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">🏷️ 카테고리 설명</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• <strong>긴급공지:</strong> 즉시 알려야 할 중요한 정보</li>
                      <li>• <strong>운영안내:</strong> 운영시간, 휴무일 등</li>
                      <li>• <strong>이벤트:</strong> 특별 이벤트, 할인 정보</li>
                      <li>• <strong>프로그램:</strong> 체험 프로그램 안내</li>
                      <li>• <strong>일반공지:</strong> 기타 일반적인 공지사항</li>
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