"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react"

interface ImageData {
  id: string
  url: string
  filename: string
  size: number
  alt: string
  uploaded_at: string
}

interface ImageGalleryProps {
  images: ImageData[]
  className?: string
}

export function ImageGallery({ images, className = "" }: ImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isOpen, setIsOpen] = useState(false)

  if (!images || images.length === 0) {
    return null
  }

  const openLightbox = (index: number) => {
    setSelectedImageIndex(index)
    setIsOpen(true)
  }

  const goToPrevious = () => {
    setSelectedImageIndex((prev) => 
      prev === 0 ? images.length - 1 : prev - 1
    )
  }

  const goToNext = () => {
    setSelectedImageIndex((prev) => 
      prev === images.length - 1 ? 0 : prev + 1
    )
  }

  const currentImage = images[selectedImageIndex]

  return (
    <div className={`space-y-4 ${className}`}>
      <h4 className="font-medium text-gray-900">첨부 이미지 ({images.length}개)</h4>
      
      {/* 이미지 그리드 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {images.map((image, index) => (
          <div
            key={image.id}
            className="relative group cursor-pointer overflow-hidden rounded-lg border"
            onClick={() => openLightbox(index)}
          >
            <img
              src={image.url}
              alt={image.alt || image.filename}
              className="w-full h-24 md:h-32 object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
              <ZoomIn className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            {image.alt && (
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 truncate">
                {image.alt}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 라이트박스 모달 */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0 bg-transparent border-none">
          <DialogTitle className="sr-only">
            이미지 갤러리 - {currentImage?.alt || currentImage?.filename}
          </DialogTitle>
          <div className="relative">
            {/* 닫기 버튼 */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white hover:bg-opacity-70"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>

            {/* 이전/다음 버튼 */}
            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black bg-opacity-50 text-white hover:bg-opacity-70"
                  onClick={goToPrevious}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black bg-opacity-50 text-white hover:bg-opacity-70"
                  onClick={goToNext}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </>
            )}

            {/* 메인 이미지 */}
            <div className="relative">
              <img
                src={currentImage?.url}
                alt={currentImage?.alt || currentImage?.filename}
                className="w-full max-h-[80vh] object-contain"
              />
              
              {/* 이미지 정보 */}
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4">
                <div className="flex items-center justify-between">
                  <div>
                    {currentImage?.alt && (
                      <p className="font-medium">{currentImage.alt}</p>
                    )}
                    <p className="text-sm text-gray-300">{currentImage?.filename}</p>
                  </div>
                  {images.length > 1 && (
                    <div className="text-sm">
                      {selectedImageIndex + 1} / {images.length}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 썸네일 네비게이션 */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 bg-black bg-opacity-50 rounded-lg p-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === selectedImageIndex 
                        ? 'bg-white' 
                        : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                    }`}
                    onClick={() => setSelectedImageIndex(index)}
                  />
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 