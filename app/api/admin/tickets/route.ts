import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase'

// GET: 티켓 목록 조회
export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient()
    
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status')
    const ticket_type = searchParams.get('ticket_type')
    const search = searchParams.get('search')
    
    let query = supabase
      .from('order_items')
      .select(`
        *,
        orders (
          id,
          customer_name,
          customer_phone,
          customer_email,
          created_at,
          status
        )
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
    
    if (status && status !== 'all') {
      query = query.eq('status', status)
    }
    
    if (ticket_type && ticket_type !== 'all') {
      query = query.eq('ticket_type', ticket_type)
    }
    
    // 검색 기능 - 주문ID 또는 고객 정보로 검색
    if (search && search.trim()) {
      query = query.or(`order_id.ilike.%${search}%,orders.customer_name.ilike.%${search}%,orders.customer_phone.ilike.%${search}%`)
    }
    
    const { data, error, count } = await query
      .range((page - 1) * limit, page * limit - 1)
    
    if (error) {
      console.error('Tickets fetch error:', error)
      return NextResponse.json({ error: 'Failed to fetch tickets' }, { status: 500 })
    }

    return NextResponse.json({
      tickets: data || [],
      total: count || 0,
      page,
      limit
    })
  } catch (error) {
    console.error('Tickets API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT: 티켓 상태 업데이트
export async function PUT(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient()
    const body = await request.json()
    const { ticketId, updates } = body
    
    if (!ticketId) {
      return NextResponse.json({ error: 'Ticket ID is required' }, { status: 400 })
    }
    
    // used_at을 현재 시간으로 설정하는 경우
    if (updates.status === 'used' && !updates.used_at) {
      updates.used_at = new Date().toISOString()
    }
    
    const { data, error } = await supabase
      .from('order_items')
      .update(updates)
      .eq('id', ticketId)
      .select(`
        *,
        orders (
          id,
          customer_name,
          customer_phone,
          customer_email
        )
      `)
    
    if (error) {
      console.error('Ticket update error:', error)
      return NextResponse.json({ error: 'Failed to update ticket' }, { status: 500 })
    }
    
    return NextResponse.json({ ticket: data?.[0] })
  } catch (error) {
    console.error('Ticket update API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 