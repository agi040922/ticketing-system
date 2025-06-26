"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react"

interface ImageData {
  id: string
  url: string
  filename: string
  size: number
  alt: string
  uploaded_at: string
}

interface ImageUploadProps {
  images: ImageData[]
  onImagesChange: (images: ImageData[]) => void
  maxImages?: number
  maxSizeInMB?: number
}

export function ImageUpload({ 
  images, 
  onImagesChange, 
  maxImages = 5,
  maxSizeInMB = 5 
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }, [])

  const handleFiles = async (files: File[]) => {
    if (images.length >= maxImages) {
      alert(`최대 ${maxImages}개의 이미지만 업로드할 수 있습니다.`)
      return
    }

    const remainingSlots = maxImages - images.length
    const filesToUpload = files.slice(0, remainingSlots)

    setUploading(true)

    try {
      const uploadPromises = filesToUpload.map(async (file) => {
        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch('/api/admin/notices/upload-image', {
          method: 'POST',
          body: formData
        })

        const result = await response.json()
        if (result.success) {
          return result.data
        } else {
          throw new Error(result.message)
        }
      })

      const uploadedImages = await Promise.all(uploadPromises)
      onImagesChange([...images, ...uploadedImages])
      
    } catch (error) {
      console.error('이미지 업로드 실패:', error)
      alert('이미지 업로드에 실패했습니다: ' + error)
    } finally {
      setUploading(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      handleFiles(files)
    }
  }

  const removeImage = async (imageToRemove: ImageData) => {
    try {
      // 서버에서 이미지 삭제
      await fetch(`/api/admin/notices/upload-image?url=${encodeURIComponent(imageToRemove.url)}`, {
        method: 'DELETE'
      })

      // 로컬 상태에서 제거
      onImagesChange(images.filter(img => img.id !== imageToRemove.id))
    } catch (error) {
      console.error('이미지 삭제 실패:', error)
      alert('이미지 삭제에 실패했습니다.')
    }
  }

  const updateImageAlt = (imageId: string, alt: string) => {
    onImagesChange(
      images.map(img => 
        img.id === imageId ? { ...img, alt } : img
      )
    )
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="space-y-4">
      {/* 업로드 영역 */}
      <Card>
        <CardContent className="p-6">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
              dragActive 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            {uploading ? (
              <div className="flex flex-col items-center space-y-2">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <p className="text-gray-600">이미지 업로드 중...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-4">
                <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full">
                  <Upload className="h-8 w-8 text-gray-400" />
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-900">
                    이미지를 드래그하여 업로드하거나
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    클릭하여 파일을 선택하세요
                  </p>
                </div>
                <div className="text-xs text-gray-400">
                  <p>지원 형식: JPEG, PNG, WebP, GIF</p>
                  <p>최대 크기: {maxSizeInMB}MB | 최대 개수: {maxImages}개</p>
                  <p>현재: {images.length}/{maxImages}개</p>
                </div>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                  disabled={uploading || images.length >= maxImages}
                />
                <Button 
                  type="button" 
                  variant="outline"
                  disabled={uploading || images.length >= maxImages}
                  onClick={(e) => {
                    e.stopPropagation()
                    document.getElementById('file-upload')?.click()
                  }}
                >
                  <ImageIcon className="h-4 w-4 mr-2" />
                  파일 선택
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 업로드된 이미지 목록 */}
      {images.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h3 className="font-medium mb-4">업로드된 이미지 ({images.length}개)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {images.map((image) => (
                <div key={image.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="relative group">
                        <img
                          src={image.url}
                          alt={image.alt || image.filename}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg" />
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeImage(image)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 ml-2"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm text-gray-600">
                      <p className="font-medium truncate">{image.filename}</p>
                      <p className="text-xs">{formatFileSize(image.size)}</p>
                    </div>
                    
                    <div>
                      <Label htmlFor={`alt-${image.id}`} className="text-xs text-gray-500">
                        이미지 설명 (선택사항)
                      </Label>
                      <Input
                        id={`alt-${image.id}`}
                        value={image.alt}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateImageAlt(image.id, e.target.value)}
                        placeholder="이미지에 대한 설명을 입력하세요"
                        className="mt-1 h-8 text-sm"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 