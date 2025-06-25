"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { LogOut, Users, ShoppingCart, BarChart3, Ticket, RefreshCw, Edit2, Check, X, Search, ChevronLeft, ChevronRight } from "lucide-react"

interface Order {
  id: string
  customer_name: string
  customer_phone: string
  customer_email?: string
  total_amount: number
  status: string
  created_at: string
  order_items: OrderItem[]
}

interface OrderItem {
  id: number
  order_id: string
  ticket_type: string
  quantity: number
  price: number
  status: string
  used_at?: string
  orders?: {
    customer_name: string
    customer_phone: string
  }
}

interface ScanLog {
  id: number
  ticket_id?: number
  unique_code: string
  scanner_id: string
  scan_location?: string
  scanned_at: string
}

export default function AdminDashboardPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [tickets, setTickets] = useState<OrderItem[]>([])
  const [scanLogs, setScanLogs] = useState<ScanLog[]>([])
  const [loading, setLoading] = useState(false)
  const [editingItem, setEditingItem] = useState<string | null>(null)
  const [editValue, setEditValue] = useState<string>("")
  
  const [filters, setFilters] = useState({
    orderStatus: 'all',
    ticketStatus: 'all',
    ticketType: 'all'
  })

  const [pagination, setPagination] = useState({
    orders: { page: 1, total: 0, totalPages: 0 },
    tickets: { page: 1, total: 0, totalPages: 0 }
  })

  const [searchTerms, setSearchTerms] = useState({
    orders: '',
    tickets: ''
  })

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

    loadData()
  }, [router])

  const loadData = async () => {
    setLoading(true)
    try {
      await Promise.all([
        loadOrders(),
        loadTickets(),
        loadScanLogs()
      ])
      calculateStats()
    } catch (error) {
      console.error('데이터 로드 오류:', error)
    }
    setLoading(false)
  }

  const loadOrders = async (page = pagination.orders.page) => {
    try {
      const params = new URLSearchParams({
        status: filters.orderStatus,
        page: page.toString(),
        limit: '20'
      })
      
      if (searchTerms.orders.trim()) {
        params.append('search', searchTerms.orders.trim())
      }
      
      const response = await fetch(`/api/admin/orders?${params}`)
      const data = await response.json()
      
      if (response.ok) {
        setOrders(data.orders || [])
        const totalPages = Math.ceil(data.total / 20)
        setPagination(prev => ({
          ...prev,
          orders: {
            page,
            total: data.total,
            totalPages
          }
        }))
      }
    } catch (error) {
      console.error('주문 데이터 로드 오류:', error)
    }
  }

  const loadTickets = async (page = pagination.tickets.page) => {
    try {
      const params = new URLSearchParams({
        status: filters.ticketStatus,
        ticket_type: filters.ticketType,
        page: page.toString(),
        limit: '20'
      })
      
      if (searchTerms.tickets.trim()) {
        params.append('search', searchTerms.tickets.trim())
      }
      
      const response = await fetch(`/api/admin/tickets?${params}`)
      const data = await response.json()
      
      if (response.ok) {
        setTickets(data.tickets || [])
        const totalPages = Math.ceil(data.total / 20)
        setPagination(prev => ({
          ...prev,
          tickets: {
            page,
            total: data.total,
            totalPages
          }
        }))
      }
    } catch (error) {
      console.error('티켓 데이터 로드 오류:', error)
    }
  }

  const loadScanLogs = async () => {
    try {
      const response = await fetch('/api/admin/scan-logs?limit=20')
      const data = await response.json()
      
      if (response.ok) {
        setScanLogs(data.logs || [])
      }
    } catch (error) {
      console.error('스캔 로그 로드 오류:', error)
    }
  }

  const calculateStats = () => {
    const today = new Date().toDateString()
    const todayOrders = orders.filter(
      order => new Date(order.created_at).toDateString() === today
    ).length

    const totalRevenue = orders.reduce((sum, order) => sum + order.total_amount, 0)
    const totalTickets = tickets.length

    setStats({
      totalOrders: orders.length,
      totalRevenue,
      totalTickets,
      todayOrders,
    })
  }

  useEffect(() => {
    setPagination(prev => ({ ...prev, orders: { ...prev.orders, page: 1 } }))
    loadOrders(1)
  }, [filters.orderStatus, searchTerms.orders])

  useEffect(() => {
    setPagination(prev => ({ ...prev, tickets: { ...prev.tickets, page: 1 } }))
    loadTickets(1)
  }, [filters.ticketStatus, filters.ticketType, searchTerms.tickets])

  useEffect(() => {
    if (orders.length > 0 || tickets.length > 0) {
      calculateStats()
    }
  }, [orders, tickets])

  // 페이지네이션 핸들러
  const handleOrderPageChange = (newPage: number) => {
    loadOrders(newPage)
  }

  const handleTicketPageChange = (newPage: number) => {
    loadTickets(newPage)
  }

  // 검색 핸들러 (디바운스)
  const handleOrderSearch = (value: string) => {
    setSearchTerms(prev => ({ ...prev, orders: value }))
  }

  const handleTicketSearch = (value: string) => {
    setSearchTerms(prev => ({ ...prev, tickets: value }))
  }

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn")
    router.push("/admin")
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          updates: { status: newStatus }
        })
      })

      if (response.ok) {
        await loadOrders()
      }
    } catch (error) {
      console.error('주문 상태 업데이트 오류:', error)
    }
  }

  const updateTicketStatus = async (ticketId: number, newStatus: string) => {
    try {
      const response = await fetch('/api/admin/tickets', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticketId,
          updates: { status: newStatus }
        })
      })

      if (response.ok) {
        await loadTickets()
      }
    } catch (error) {
      console.error('티켓 상태 업데이트 오류:', error)
    }
  }

  const startEdit = (itemId: string, currentValue: string) => {
    setEditingItem(itemId)
    setEditValue(currentValue)
  }

  const cancelEdit = () => {
    setEditingItem(null)
    setEditValue("")
  }

  const saveEdit = async (type: 'order' | 'ticket', id: string | number) => {
    if (type === 'order') {
      await updateOrderStatus(id as string, editValue)
    } else {
      await updateTicketStatus(id as number, editValue)
    }
    setEditingItem(null)
    setEditValue("")
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pending: "outline",
      completed: "default", 
      cancelled: "destructive",
      active: "default",
      used: "secondary",
      expired: "destructive"
    }
    
    const labels: Record<string, string> = {
      pending: "대기",
      completed: "완료",
      cancelled: "취소",
      active: "활성",
      used: "사용",
      expired: "만료"
    }

    return (
      <Badge variant={variants[status] || "outline"}>
        {labels[status] || status}
      </Badge>
    )
  }

  // 페이지네이션 컴포넌트
  const Pagination = ({ 
    currentPage, 
    totalPages, 
    onPageChange 
  }: { 
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void 
  }) => {
    const pages = []
    const maxVisible = 5
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2))
    let endPage = Math.min(totalPages, startPage + maxVisible - 1)
    
    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1)
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    return (
      <div className="flex items-center justify-center space-x-2 mt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        {startPage > 1 && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(1)}
            >
              1
            </Button>
            {startPage > 2 && <span className="px-2">...</span>}
          </>
        )}
        
        {pages.map(page => (
          <Button
            key={page}
            variant={page === currentPage ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(page)}
          >
            {page}
          </Button>
        ))}
        
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="px-2">...</span>}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(totalPages)}
            >
              {totalPages}
            </Button>
          </>
        )}
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    )
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
            <Button variant="outline" onClick={loadData} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              새로고침
            </Button>
            <Link href="/admin/notices">
              <Button variant="outline">공지사항 관리</Button>
            </Link>
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

        {/* 탭 인터페이스 */}
        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="orders">주문 관리</TabsTrigger>
            <TabsTrigger value="tickets">티켓 관리</TabsTrigger>
            <TabsTrigger value="logs">스캔 로그</TabsTrigger>
          </TabsList>

          {/* 주문 관리 탭 */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>주문 관리</CardTitle>
                    <CardDescription>전체 주문 내역을 확인하고 관리할 수 있습니다</CardDescription>
                  </div>
                  <Select value={filters.orderStatus} onValueChange={(value) => 
                    setFilters(prev => ({ ...prev, orderStatus: value }))
                  }>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체 상태</SelectItem>
                      <SelectItem value="pending">대기</SelectItem>
                      <SelectItem value="completed">완료</SelectItem>
                      <SelectItem value="cancelled">취소</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">데이터를 불러오는 중...</div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">주문 내역이 없습니다.</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>주문번호</TableHead>
                        <TableHead>고객명</TableHead>
                        <TableHead>연락처</TableHead>
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
                          <TableCell>{order.customer_name}</TableCell>
                          <TableCell>{order.customer_phone}</TableCell>
                          <TableCell>{order.total_amount.toLocaleString()}원</TableCell>
                          <TableCell>{new Date(order.created_at).toLocaleString()}</TableCell>
                          <TableCell>
                            {editingItem === `order-${order.id}` ? (
                              <div className="flex items-center space-x-2">
                                <Select value={editValue} onValueChange={setEditValue}>
                                  <SelectTrigger className="w-24">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="pending">대기</SelectItem>
                                    <SelectItem value="completed">완료</SelectItem>
                                    <SelectItem value="cancelled">취소</SelectItem>
                                  </SelectContent>
                                </Select>
                                <Button size="sm" onClick={() => saveEdit('order', order.id)}>
                                  <Check className="h-3 w-3" />
                                </Button>
                                <Button size="sm" variant="outline" onClick={cancelEdit}>
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            ) : (
                              <div className="flex items-center space-x-2">
                                {getStatusBadge(order.status)}
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  onClick={() => startEdit(`order-${order.id}`, order.status)}
                                >
                                  <Edit2 className="h-3 w-3" />
                                </Button>
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="text-sm text-gray-600">
                              티켓 {order.order_items?.length || 0}개
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* 티켓 관리 탭 */}
          <TabsContent value="tickets">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>티켓 관리</CardTitle>
                    <CardDescription>개별 티켓의 상태를 확인하고 관리할 수 있습니다</CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Select value={filters.ticketType} onValueChange={(value) => 
                      setFilters(prev => ({ ...prev, ticketType: value }))
                    }>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">전체 타입</SelectItem>
                        <SelectItem value="adult">성인</SelectItem>
                        <SelectItem value="child">아동</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={filters.ticketStatus} onValueChange={(value) => 
                      setFilters(prev => ({ ...prev, ticketStatus: value }))
                    }>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">전체 상태</SelectItem>
                        <SelectItem value="active">활성</SelectItem>
                        <SelectItem value="used">사용</SelectItem>
                        <SelectItem value="expired">만료</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">데이터를 불러오는 중...</div>
                ) : tickets.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">티켓이 없습니다.</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>티켓 ID</TableHead>
                        <TableHead>주문 ID</TableHead>
                        <TableHead>고객명</TableHead>
                        <TableHead>티켓 타입</TableHead>
                        <TableHead>가격</TableHead>
                        <TableHead>상태</TableHead>
                        <TableHead>사용일시</TableHead>
                        <TableHead>관리</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tickets.map((ticket) => (
                        <TableRow key={ticket.id}>
                          <TableCell className="font-mono text-sm">{ticket.id}</TableCell>
                          <TableCell className="font-mono text-sm">{ticket.order_id}</TableCell>
                          <TableCell>{ticket.orders?.customer_name || '-'}</TableCell>
                          <TableCell>{ticket.ticket_type}</TableCell>
                          <TableCell>{ticket.price.toLocaleString()}원</TableCell>
                          <TableCell>
                            {editingItem === `ticket-${ticket.id}` ? (
                              <div className="flex items-center space-x-2">
                                <Select value={editValue} onValueChange={setEditValue}>
                                  <SelectTrigger className="w-20">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="active">활성</SelectItem>
                                    <SelectItem value="used">사용</SelectItem>
                                    <SelectItem value="expired">만료</SelectItem>
                                  </SelectContent>
                                </Select>
                                <Button size="sm" onClick={() => saveEdit('ticket', ticket.id)}>
                                  <Check className="h-3 w-3" />
                                </Button>
                                <Button size="sm" variant="outline" onClick={cancelEdit}>
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            ) : (
                              <div className="flex items-center space-x-2">
                                {getStatusBadge(ticket.status)}
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  onClick={() => startEdit(`ticket-${ticket.id}`, ticket.status)}
                                >
                                  <Edit2 className="h-3 w-3" />
                                </Button>
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            {ticket.used_at ? new Date(ticket.used_at).toLocaleString() : '-'}
                          </TableCell>
                          <TableCell>
                            <div className="text-sm text-gray-600">
                              수량: {ticket.quantity}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* 스캔 로그 탭 */}
          <TabsContent value="logs">
            <Card>
              <CardHeader>
                <CardTitle>스캔 로그</CardTitle>
                <CardDescription>최근 티켓 스캔 기록을 확인할 수 있습니다</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">데이터를 불러오는 중...</div>
                ) : scanLogs.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">스캔 로그가 없습니다.</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>로그 ID</TableHead>
                        <TableHead>티켓 ID</TableHead>
                        <TableHead>고유 코드</TableHead>
                        <TableHead>스캐너 ID</TableHead>
                        <TableHead>스캔 위치</TableHead>
                        <TableHead>스캔 일시</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {scanLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell>{log.id}</TableCell>
                          <TableCell>{log.ticket_id || '-'}</TableCell>
                          <TableCell className="font-mono text-sm">{log.unique_code}</TableCell>
                          <TableCell>{log.scanner_id}</TableCell>
                          <TableCell>{log.scan_location || '-'}</TableCell>
                          <TableCell>{new Date(log.scanned_at).toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
