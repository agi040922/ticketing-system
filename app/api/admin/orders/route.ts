import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase'

// GET: 주문 목록 조회
export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient()
    
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    
    let query = supabase
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          ticket_type,
          quantity,
          price,
          status,
          used_at
        )
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
    
    if (status && status !== 'all') {
      query = query.eq('status', status)
    }
    
    // 검색 기능 - 고객명 또는 연락처로 검색
    if (search && search.trim()) {
      query = query.or(`customer_name.ilike.%${search}%,customer_phone.ilike.%${search}%`)
    }
    
    const { data, error, count } = await query
      .range((page - 1) * limit, page * limit - 1)
    
    if (error) {
      console.error('Orders fetch error:', error)
      return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
    }

    return NextResponse.json({
      orders: data || [],
      total: count || 0,
      page,
      limit
    })
  } catch (error) {
    console.error('Orders API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT: 주문 상태 업데이트
export async function PUT(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient()
    const body = await request.json()
    const { orderId, updates } = body
    
    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 })
    }
    
    const { data, error } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', orderId)
      .select()
    
    if (error) {
      console.error('Order update error:', error)
      return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
    }
    
    return NextResponse.json({ order: data?.[0] })
  } catch (error) {
    console.error('Order update API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 