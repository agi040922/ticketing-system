import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Supabase 클라이언트 초기화
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/**
 * GET: 특정 공지사항 조회
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const { data: notice, error } = await supabase
      .from('notices')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('공지사항 조회 오류:', error)
      return NextResponse.json(
        { success: false, message: '공지사항을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    // 조회수 증가
    await supabase
      .from('notices')
      .update({ view_count: (notice.view_count || 0) + 1 })
      .eq('id', id)

    return NextResponse.json({
      success: true,
      data: { ...notice, view_count: (notice.view_count || 0) + 1 }
    })

  } catch (error) {
    console.error('공지사항 조회 중 예외 발생:', error)
    return NextResponse.json(
      { success: false, message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

/**
 * PUT: 공지사항 수정
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { title, content, category, isImportant, author, status } = body

    // 필수 필드 검증
    if (!title || !content) {
      return NextResponse.json(
        { success: false, message: '제목과 내용은 필수입니다.' },
        { status: 400 }
      )
    }

    const { data: notice, error } = await supabase
      .from('notices')
      .update({
        title: title.trim(),
        content: content.trim(),
        category: category || '일반공지',
        is_important: isImportant || false,
        author: author || '관리자',
        status: status || 'active'
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('공지사항 수정 오류:', error)
      return NextResponse.json(
        { success: false, message: '공지사항 수정에 실패했습니다.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: '공지사항이 성공적으로 수정되었습니다.',
      data: notice
    })

  } catch (error) {
    console.error('공지사항 수정 중 예외 발생:', error)
    return NextResponse.json(
      { success: false, message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

/**
 * DELETE: 공지사항 삭제 (소프트 삭제)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // 소프트 삭제 (status를 'inactive'로 변경)
    const { data: notice, error } = await supabase
      .from('notices')
      .update({ status: 'inactive' })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('공지사항 삭제 오류:', error)
      return NextResponse.json(
        { success: false, message: '공지사항 삭제에 실패했습니다.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: '공지사항이 성공적으로 삭제되었습니다.',
      data: notice
    })

  } catch (error) {
    console.error('공지사항 삭제 중 예외 발생:', error)
    return NextResponse.json(
      { success: false, message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
} 