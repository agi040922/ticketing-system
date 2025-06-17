"use client"

import { useState } from "react"
import Link from "next/link"
import { Ticket, ChevronDown, Menu, X } from "lucide-react"

export function NavigationHeader() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const menuItems = [
    {
      title: "어드벤처체험",
      items: [
        { name: "어드벤처 소개", href: "/adventure/intro" },
        { name: "이용방법", href: "/adventure/guide" },
        { name: "어드벤처체험 갤러리", href: "/adventure/gallery" },
        { name: "오시는 길", href: "/adventure/location" },
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
        { name: "이용제한 및 유의사항", href: "/guide/restrictions" },
        { name: "이용 안전수칙", href: "/guide/safety" },
        { name: "요금안내", href: "/guide/pricing" },
      ],
    },
    {
      title: "이용권구매",
      items: [
        { name: "구매하기", href: "/purchase" },
        { name: "구매확인", href: "/reservation-check" },
      ],
    },
    {
      title: "커뮤니티",
      items: [
        { name: "공지사항", href: "/community/notices" },
        { name: "자주하는 질문", href: "/community/faq" },
        { name: "이벤트", href: "/community/events" },
      ],
    },
  ]

  return (
    <header className="bg-white shadow-sm relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Ticket className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">아쿠아리움 파크</h1>
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

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4">
            <div className="space-y-4">
              {menuItems.map((menu) => (
                <div key={menu.title}>
                  <button
                    onClick={() => setActiveDropdown(activeDropdown === menu.title ? null : menu.title)}
                    className="flex items-center justify-between w-full text-left text-gray-700 font-medium py-2"
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
                          className="block text-sm text-gray-600 hover:text-blue-600 py-1"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
