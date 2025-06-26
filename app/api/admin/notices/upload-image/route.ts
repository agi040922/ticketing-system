import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Supabase 클라이언트 초기화
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/**
 * POST: 공지사항 이미지 업로드
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json(
        { success: false, message: '파일이 업로드되지 않았습니다.' },
        { status: 400 }
      )
    }

    // 파일 크기 제한 (5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, message: '파일 크기는 5MB 이하여야 합니다.' },
        { status: 400 }
      )
    }

    // 지원하는 이미지 포맷 확인
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: '지원하지 않는 파일 형식입니다. (JPEG, PNG, WebP, GIF만 가능)' },
        { status: 400 }
      )
    }

    // 파일명 생성 (중복 방지)
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(7)
    const fileExtension = file.name.split('.').pop()
    const fileName = `notices/${timestamp}-${randomString}.${fileExtension}`

    // Supabase Storage에 업로드
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error('이미지 업로드 오류:', uploadError)
      return NextResponse.json(
        { success: false, message: '이미지 업로드에 실패했습니다.' },
        { status: 500 }
      )
    }

    // 업로드된 파일의 공개 URL 가져오기
    const { data: urlData } = supabase.storage
      .from('images')
      .getPublicUrl(fileName)

    const imageData = {
      id: `img_${timestamp}_${randomString}`,
      url: urlData.publicUrl,
      filename: file.name,
      size: file.size,
      alt: '',
      uploaded_at: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      message: '이미지가 성공적으로 업로드되었습니다.',
      data: imageData
    })

  } catch (error) {
    console.error('이미지 업로드 중 예외 발생:', error)
    return NextResponse.json(
      { success: false, message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

/**
 * DELETE: 이미지 삭제
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const imageUrl = searchParams.get('url')
    
    if (!imageUrl) {
      return NextResponse.json(
        { success: false, message: '삭제할 이미지 URL이 필요합니다.' },
        { status: 400 }
      )
    }

    // URL에서 파일 경로 추출
    const urlParts = imageUrl.split('/')
    const fileName = urlParts.slice(-2).join('/') // notices/filename.ext

    // Supabase Storage에서 삭제
    const { error: deleteError } = await supabase.storage
      .from('images')
      .remove([fileName])

    if (deleteError) {
      console.error('이미지 삭제 오류:', deleteError)
      return NextResponse.json(
        { success: false, message: '이미지 삭제에 실패했습니다.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: '이미지가 성공적으로 삭제되었습니다.'
    })

  } catch (error) {
    console.error('이미지 삭제 중 예외 발생:', error)
    return NextResponse.json(
      { success: false, message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
} 