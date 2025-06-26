"use client"

import { useEffect, useState, useCallback } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ImageGallery } from "@/components/image-gallery"
import { X, ChevronLeft, ChevronRight, Bell } from "lucide-react"

interface Notice {
  id: string
  title: string
  content: string
  category: string
  is_important: boolean
  author: string
  created_at: string
  images?: any[]
}

interface NoticePopupProps {
  isOpen: boolean
  onClose: () => void
  notices: Notice[]
}

export function NoticePopup({ isOpen, onClose, notices }: NoticePopupProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [dontShowToday, setDontShowToday] = useState(false)

  const currentNotice = notices[currentIndex]

  const handleClose = useCallback(() => {
    if (dontShowToday) {
      // 오늘 하루 보지 않기 설정
      const today = new Date().toDateString()
      localStorage.setItem('hideNoticePopup', today)
    }
    onClose()
  }, [dontShowToday, onClose])

  const goToPrevious = () => {
    setCurrentIndex((prev) => prev === 0 ? notices.length - 1 : prev - 1)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => prev === notices.length - 1 ? 0 : prev + 1)
  }

  if (!notices || notices.length === 0) {
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0">
        <div className="relative">
          {/* 헤더 */}
          <DialogHeader className="p-6 pb-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-red-500" />
                <DialogTitle className="text-lg font-bold">중요 공지사항</DialogTitle>
                {notices.length > 1 && (
                  <span className="text-sm text-gray-500">
                    ({currentIndex + 1}/{notices.length})
                  </span>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          {/* 네비게이션 버튼 (여러 공지사항이 있을 때만) */}
          {notices.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={goToPrevious}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md hover:bg-gray-50"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={goToNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md hover:bg-gray-50"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}

          {/* 콘텐츠 */}
          <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
            {/* 공지사항 헤더 */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="destructive" className="text-xs">
                  중요
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {currentNotice.category}
                </Badge>
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                {currentNotice.title}
              </h3>
              <div className="text-sm text-gray-500">
                {currentNotice.author} • {new Date(currentNotice.created_at).toLocaleDateString()}
              </div>
            </div>

            {/* 공지사항 내용 */}
            <div className="prose max-w-none">
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                {currentNotice.content}
              </div>
            </div>

            {/* 이미지 갤러리 */}
            {currentNotice.images && currentNotice.images.length > 0 && (
              <div className="pt-4 border-t">
                <ImageGallery images={currentNotice.images} />
              </div>
            )}
          </div>

          {/* 하단 버튼 영역 */}
          <div className="p-6 pt-0 border-t bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="dontShowToday"
                  checked={dontShowToday}
                  onCheckedChange={(checked) => setDontShowToday(checked === true)}
                />
                <Label htmlFor="dontShowToday" className="text-sm text-gray-600">
                  오늘 하루 보지 않기
                </Label>
              </div>
              
              <div className="flex items-center gap-2">
                {notices.length > 1 && (
                  <div className="flex space-x-1">
                    {notices.map((_, index) => (
                      <button
                        key={index}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === currentIndex 
                            ? 'bg-blue-600' 
                            : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                        onClick={() => setCurrentIndex(index)}
                      />
                    ))}
                  </div>
                )}
                <Button onClick={handleClose} className="px-6">
                  확인
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// 팝업 표시 여부를 확인하는 유틸리티 함수
export function shouldShowNoticePopup(): boolean {
  if (typeof window === 'undefined') return false
  
  const hideUntil = localStorage.getItem('hideNoticePopup')
  if (!hideUntil) return true
  
  const today = new Date().toDateString()
  return hideUntil !== today
} 