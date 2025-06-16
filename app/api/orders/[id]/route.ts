import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = params.id
    const supabase = createSupabaseServerClient()

    // Supabase에서 주문 정보 조회
    const { data: order, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          ticket_type,
          quantity,
          price
        )
      `)
      .eq('id', orderId)
      .single()

    if (error) {
      console.error('주문 조회 오류:', error)
      return NextResponse.json({
        success: false,
        message: '주문 정보를 찾을 수 없습니다.'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      order
    })

  } catch (error) {
    console.error('주문 조회 API 오류:', error)
    return NextResponse.json({
      success: false,
      message: '서버 오류가 발생했습니다.'
    }, { status: 500 })
  }
} 