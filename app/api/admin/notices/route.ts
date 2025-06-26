import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Supabase 클라이언트 초기화
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/**
 * GET: 공지사항 목록 조회
 * 쿼리 파라미터:
 * - limit: 페이지당 개수 (기본값: 20)
 * - offset: 시작 인덱스 (기본값: 0) 
 * - category: 카테고리 필터
 * - status: 상태 필터 (active/inactive)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')
    const category = searchParams.get('category')
    const status = searchParams.get('status') || 'active'

    let query = supabase
      .from('notices')
      .select('*')
      .eq('status', status)
      .order('is_important', { ascending: false })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // 카테고리 필터 적용
    if (category && category !== 'all') {
      query = query.eq('category', category)
    }

    const { data: notices, error } = await query

    if (error) {
      console.error('공지사항 조회 오류:', error)
      return NextResponse.json(
        { success: false, message: '공지사항을 불러오는데 실패했습니다.' },
        { status: 500 }
      )
    }

    // 총 개수 조회
    let countQuery = supabase
      .from('notices')
      .select('*', { count: 'exact', head: true })
      .eq('status', status)

    if (category && category !== 'all') {
      countQuery = countQuery.eq('category', category)
    }

    const { count } = await countQuery

    return NextResponse.json({
      success: true,
      data: notices,
      pagination: {
        total: count || 0,
        limit,
        offset,
        hasMore: (count || 0) > offset + limit
      }
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
 * POST: 새 공지사항 작성
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, content, category, isImportant, author, images } = body

    // 필수 필드 검증
    if (!title || !content) {
      return NextResponse.json(
        { success: false, message: '제목과 내용은 필수입니다.' },
        { status: 400 }
      )
    }

    const { data: notice, error } = await supabase
      .from('notices')
      .insert([
        {
          title: title.trim(),
          content: content.trim(),
          category: category || '일반공지',
          is_important: isImportant || false,
          author: author || '관리자',
          status: 'active',
          images: images || []
        }
      ])
      .select()
      .single()

    if (error) {
      console.error('공지사항 생성 오류:', error)
      return NextResponse.json(
        { success: false, message: '공지사항 작성에 실패했습니다.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: '공지사항이 성공적으로 작성되었습니다.',
      data: notice
    })

  } catch (error) {
    console.error('공지사항 작성 중 예외 발생:', error)
    return NextResponse.json(
      { success: false, message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
} 