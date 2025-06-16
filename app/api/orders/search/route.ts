import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const phone = searchParams.get('phone')
    const orderId = searchParams.get('orderId')
    
    if (!phone && !orderId) {
      return NextResponse.json({
        success: false,
        message: '검색 조건이 필요합니다.'
      }, { status: 400 })
    }

    const supabase = createSupabaseServerClient()
    let query = supabase
      .from('orders')
      .select(`
        *,
        order_items (
          ticket_type,
          quantity,
          price
        )
      `)

    // 검색 조건에 따라 쿼리 분기
    if (phone) {
      query = query.eq('customer_phone', phone).order('created_at', { ascending: false })
    } else if (orderId) {
      query = query.eq('id', orderId)
    }

    const { data: orders, error } = await query

    if (error) {
      console.error('주문 검색 오류:', error)
      return NextResponse.json({
        success: false,
        message: '검색 중 오류가 발생했습니다.'
      }, { status: 500 })
    }

    if (!orders || orders.length === 0) {
      return NextResponse.json({
        success: false,
        message: '일치하는 주문을 찾을 수 없습니다.'
      }, { status: 404 })
    }

    // 주문 ID로 검색한 경우 단일 주문 반환
    if (orderId) {
      return NextResponse.json({
        success: true,
        order: orders[0]
      })
    }

    // 휴대폰 번호로 검색한 경우 모든 주문 반환
    return NextResponse.json({
      success: true,
      orders: orders, // 여러 주문 반환
      count: orders.length
    })

  } catch (error) {
    console.error('주문 검색 API 오류:', error)
    return NextResponse.json({
      success: false,
      message: '서버 오류가 발생했습니다.'
    }, { status: 500 })
  }
} 