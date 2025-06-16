"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { LogOut, Users, ShoppingCart, BarChart3, Ticket } from "lucide-react"

interface OrderData {
  id: string
  customerInfo: {
    name: string
    phone: string
    email: string
  }
  tickets: {
    adult: number
    child: number
  }
  totalPrice: number
  purchaseDate: string
  status: string
}

export default function AdminDashboardPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<OrderData[]>([])
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalTickets: 0,
    todayOrders: 0,
  })

  useEffect(() => {
    // 관리자 로그인 확인
    const isLoggedIn = localStorage.getItem("adminLoggedIn")
    if (!isLoggedIn) {
      router.push("/admin")
      return
    }

    // 주문 데이터 로드
    const orderData = JSON.parse(localStorage.getItem("orders") || "[]")
    setOrders(orderData)

    // 통계 계산
    const today = new Date().toDateString()
    const todayOrders = orderData.filter(
      (order: OrderData) => new Date(order.purchaseDate).toDateString() === today,
    ).length

    const totalRevenue = orderData.reduce((sum: number, order: OrderData) => sum + order.totalPrice, 0)
    const totalTickets = orderData.reduce(
      (sum: number, order: OrderData) => sum + order.tickets.adult + order.tickets.child,
      0,
    )

    setStats({
      totalOrders: orderData.length,
      totalRevenue,
      totalTickets,
      todayOrders,
    })
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn")
    router.push("/admin")
  }

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    const updatedOrders = orders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order))
    setOrders(updatedOrders)
    localStorage.setItem("orders", JSON.stringify(updatedOrders))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">관리자 대시보드</h1>
            <p className="text-gray-600">아쿠아리움 파크 관리 시스템</p>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="outline">메인으로</Button>
            </Link>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              로그아웃
            </Button>
          </div>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">총 주문 수</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">총 매출</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalRevenue.toLocaleString()}원</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">총 티켓 수</CardTitle>
              <Ticket className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalTickets}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">오늘 주문</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.todayOrders}</div>
            </CardContent>
          </Card>
        </div>

        {/* 주문 관리 */}
        <Card>
          <CardHeader>
            <CardTitle>주문 관리</CardTitle>
            <CardDescription>전체 주문 내역을 확인하고 관리할 수 있습니다</CardDescription>
          </CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <div className="text-center py-8 text-gray-500">주문 내역이 없습니다.</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>주문번호</TableHead>
                    <TableHead>고객명</TableHead>
                    <TableHead>연락처</TableHead>
                    <TableHead>티켓</TableHead>
                    <TableHead>금액</TableHead>
                    <TableHead>주문일시</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>관리</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-sm">{order.id}</TableCell>
                      <TableCell>{order.customerInfo.name}</TableCell>
                      <TableCell>{order.customerInfo.phone}</TableCell>
                      <TableCell>
                        {order.tickets.adult > 0 && `대인 ${order.tickets.adult}`}
                        {order.tickets.adult > 0 && order.tickets.child > 0 && ", "}
                        {order.tickets.child > 0 && `소인 ${order.tickets.child}`}
                      </TableCell>
                      <TableCell>{order.totalPrice.toLocaleString()}원</TableCell>
                      <TableCell>{new Date(order.purchaseDate).toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={order.status === "completed" ? "default" : "secondary"}>
                          {order.status === "completed" ? "결제완료" : order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          {order.status === "completed" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateOrderStatus(order.id, "cancelled")}
                            >
                              취소
                            </Button>
                          )}
                          {order.status === "cancelled" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateOrderStatus(order.id, "completed")}
                            >
                              복원
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
