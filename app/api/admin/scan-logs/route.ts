import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase'

// GET: 스캔 로그 조회
export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient()
    
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const scanner_id = searchParams.get('scanner_id')
    const date_from = searchParams.get('date_from')
    const date_to = searchParams.get('date_to')
    
    let query = supabase
      .from('scan_logs')
      .select('*', { count: 'exact' })
      .order('scanned_at', { ascending: false })
    
    if (scanner_id) {
      query = query.eq('scanner_id', scanner_id)
    }
    
    if (date_from) {
      query = query.gte('scanned_at', date_from)
    }
    
    if (date_to) {
      query = query.lte('scanned_at', date_to)
    }
    
    const { data, error, count } = await query
      .range((page - 1) * limit, page * limit - 1)
    
    if (error) {
      console.error('Scan logs fetch error:', error)
      return NextResponse.json({ error: 'Failed to fetch scan logs' }, { status: 500 })
    }

    return NextResponse.json({
      logs: data || [],
      total: count || 0,
      page,
      limit
    })
  } catch (error) {
    console.error('Scan logs API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 