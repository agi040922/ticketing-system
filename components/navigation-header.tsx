"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Ticket, ChevronDown, Menu, X, User, LogOut, Settings, ShoppingBag } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function NavigationHeader() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, profile, signOut, loading } = useAuth()

  const menuItems = [
    {
      title: "목포플레이파크",
      items: [
        { name: "소개", href: "/adventure/intro" },
        { name: "이용방법", href: "/adventure/guide" },
        { name: "갤러리", href: "/adventure/gallery" },
        { name: "오시는길", href: "/adventure/location" },
      ],
    },
    {
      title: "시설안내",
      items: [
        { name: "코스구성", href: "/facilities/course" },
        { name: "편의시설", href: "/facilities/amenities" },
      ],
    },
    {
      title: "이용안내",
      items: [
        { name: "시설 이용안내", href: "/guide/facility" },
        { name: "이용안전수칙", href: "/guide/safety" },
        { name: "이용제한 및 유의사항", href: "/guide/restrictions" },
        { name: "요금안내", href: "/guide/pricing" },
      ],
    },
    {
      title: "이용권구매",
      items: [
        { name: "온라인 예약", href: "/purchase" },
        { name: "예약 확인", href: "/reservation-check" },
      ],
    },
    {
      title: "커뮤니티",
      items: [
        { name: "공지사항", href: "/community/notices" },
        { name: "자주묻는 질문", href: "/community/faq" },
        { name: "이벤트", href: "/community/events" },
      ],
    },
  ]

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('로그아웃 실패:', error)
    }
  }

  return (
    <header className="bg-white shadow-sm border-b relative z-50">
      <div className="h-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex justify-between items-center h-full">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <div className="relative h-16 w-auto">
                <Image
                  src="/플레이파크 - 글씨-1.png"
                  alt="목포플레이파크"
                  width={200}
                  height={64}
                  className="object-contain h-16 w-auto"
                  priority
                />
              </div>
            </Link>

            {/* Desktop Navigation Menu */}
            <nav className="hidden lg:flex space-x-8">
              {menuItems.map((menu) => (
                <div
                  key={menu.title}
                  className="relative group"
                  onMouseEnter={() => setActiveDropdown(menu.title)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button className="flex items-center text-gray-700 hover:text-blue-600 font-medium py-2 transition-colors duration-200">
                    {menu.title}
                    <ChevronDown
                      className={`ml-1 h-4 w-4 transition-transform duration-200 ${activeDropdown === menu.title ? "rotate-180" : ""}`}
                    />
                  </button>

                  {/* Dropdown Menu with Animation */}
                  <div
                    className={`absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg transition-all duration-200 ${
                      activeDropdown === menu.title
                        ? "opacity-100 visible transform translate-y-0"
                        : "opacity-0 invisible transform -translate-y-2"
                    }`}
                  >
                    <div className="py-2">
                      {menu.items.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </nav>

            {/* User Menu / Login Button */}
            <div className="hidden lg:flex items-center space-x-4">
              {loading ? (
                <div className="h-8 w-8 animate-pulse bg-gray-200 rounded-full" />
              ) : user && profile ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2 p-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={profile.avatar_url || ''} />
                        <AvatarFallback>
                          {profile.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{profile.name}</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-3 py-2 border-b">
                      <p className="text-sm font-medium">{profile.name}</p>
                      <p className="text-xs text-gray-500">{profile.email}</p>
                    </div>
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="flex items-center cursor-pointer">
                        <User className="h-4 w-4 mr-2" />
                        내 정보
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/profile/tickets" className="flex items-center cursor-pointer">
                        <Ticket className="h-4 w-4 mr-2" />
                        내 티켓
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/profile/coupons" className="flex items-center cursor-pointer">
                        <ShoppingBag className="h-4 w-4 mr-2" />
                        내 쿠폰
                      </Link>
                    </DropdownMenuItem>
                    {profile.role === 'admin' && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href="/admin" className="flex items-center cursor-pointer">
                            <Settings className="h-4 w-4 mr-2" />
                            관리자 페이지
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="flex items-center cursor-pointer">
                      <LogOut className="h-4 w-4 mr-2" />
                      로그아웃
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" asChild>
                    <Link href="/auth/login">로그인</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/auth/register">회원가입</Link>
                  </Button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-700 hover:text-blue-600 p-2"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 py-4">
          <div className="space-y-4">
            {menuItems.map((menu) => (
              <div key={menu.title}>
                <button
                  onClick={() => setActiveDropdown(activeDropdown === menu.title ? null : menu.title)}
                  className="flex items-center justify-between w-full text-left text-gray-700 font-medium py-2 px-4"
                >
                  {menu.title}
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${activeDropdown === menu.title ? "rotate-180" : ""}`}
                  />
                </button>
                {activeDropdown === menu.title && (
                  <div className="pl-4 space-y-2 mt-2">
                    {menu.items.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="block text-sm text-gray-600 hover:text-blue-600 py-1 px-4"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            {/* Mobile User Menu */}
            <div className="border-t border-gray-200 pt-4 px-4">
              {loading ? (
                <div className="h-8 w-8 animate-pulse bg-gray-200 rounded-full" />
              ) : user && profile ? (
                <div className="space-y-2">
                  <div className="flex items-center space-x-3 pb-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={profile.avatar_url || ''} />
                      <AvatarFallback>
                        {profile.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{profile.name}</p>
                      <p className="text-xs text-gray-500">{profile.email}</p>
                    </div>
                  </div>
                  <Link
                    href="/profile"
                    className="block text-sm text-gray-600 hover:text-blue-600 py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    내 정보
                  </Link>
                  <Link
                    href="/profile/tickets"
                    className="block text-sm text-gray-600 hover:text-blue-600 py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    내 티켓
                  </Link>
                  <Link
                    href="/profile/coupons"
                    className="block text-sm text-gray-600 hover:text-blue-600 py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    내 쿠폰
                  </Link>
                  {profile.role === 'admin' && (
                    <Link
                      href="/admin"
                      className="block text-sm text-gray-600 hover:text-blue-600 py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      관리자 페이지
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleSignOut()
                      setMobileMenuOpen(false)
                    }}
                    className="text-left text-sm text-gray-600 hover:text-blue-600 py-2 w-full"
                  >
                    로그아웃
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link
                    href="/auth/login"
                    className="block text-sm text-gray-600 hover:text-blue-600 py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    로그인
                  </Link>
                  <Link
                    href="/auth/register"
                    className="block text-sm text-gray-600 hover:text-blue-600 py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    회원가입
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
