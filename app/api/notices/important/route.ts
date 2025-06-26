import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase'

/**
 * GET: 중요 공지사항 조회 (팝업용)
 */
export async function GET() {
  try {
    const supabase = createSupabaseServerClient()
    
    const { data: notices, error } = await supabase
      .from('notices')
      .select('*')
      .eq('status', 'active')
      .eq('is_important', true)
      .order('created_at', { ascending: false })
      .limit(3) // 최대 3개까지만
    
    if (error) {
      console.error('중요 공지사항 조회 오류:', error)
      return NextResponse.json({ error: 'Failed to fetch important notices' }, { status: 500 })
    }

    return NextResponse.json({
      notices: notices || []
    })
  } catch (error) {
    console.error('중요 공지사항 API 오류:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 