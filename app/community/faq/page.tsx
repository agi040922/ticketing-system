"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { NavigationHeader } from "@/components/navigation-header"
import { ArrowLeft, HelpCircle, ChevronDown, Search, Phone, Mail } from "lucide-react"
import { useState } from "react"

export default function CommunityFaqPage() {
  const [openItems, setOpenItems] = useState<number[]>([])

  const toggleItem = (id: number) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  const faqCategories = [
    {
      title: "이용 및 예약",
      faqs: [
        {
          id: 1,
          question: "온라인으로 예약할 수 있나요?",
          answer: "네, 홈페이지에서 24시간 온라인 예약이 가능합니다. 온라인 예약 시 할인 혜택도 받으실 수 있습니다."
        },
        {
          id: 2,
          question: "당일 입장이 가능한가요?",
          answer: "당일 입장도 가능하지만, 성수기나 주말에는 매진될 수 있으니 사전 예약을 권장드립니다."
        },
        {
          id: 3,
          question: "입장권 환불이 가능한가요?",
          answer: "사용 전에는 100% 환불 가능합니다 (수수료 제외). 자세한 환불 정책은 요금안내 페이지를 참고해주세요."
        }
      ]
    },
    {
      title: "시설 이용",
      faqs: [
        {
          id: 4,
          question: "주차장이 있나요?",
          answer: "네, 200대 규모의 무료 주차장을 운영하고 있습니다. 입장권 구매 시 주차료는 무료입니다."
        },
        {
          id: 5,
          question: "음식물 반입이 가능한가요?",
          answer: "외부 음식물 반입은 금지되어 있습니다. 관내 카페테리아와 레스토랑을 이용해주세요."
        },
        {
          id: 6,
          question: "애완동물 동반이 가능한가요?",
          answer: "안전상의 이유로 애완동물 동반은 불가능합니다. (안내견 제외)"
        }
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      <NavigationHeader />
      
      {/* Header Section */}
      <section className="py-8 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-6">
            <Link href="/">
              <Button variant="ghost" size="sm" className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                홈으로
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">자주하는 질문</h1>
              <p className="text-gray-600 mt-2">궁금한 점들을 빠르게 해결해보세요</p>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="질문을 검색해보세요..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {faqCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{category.title}</h2>
              <div className="space-y-4">
                {category.faqs.map((faq) => (
                  <Card key={faq.id}>
                    <Collapsible open={openItems.includes(faq.id)} onOpenChange={() => toggleItem(faq.id)}>
                      <CollapsibleTrigger asChild>
                        <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-left text-lg font-medium text-gray-900 flex items-center">
                              <HelpCircle className="h-5 w-5 text-blue-600 mr-3" />
                              {faq.question}
                            </CardTitle>
                            <ChevronDown 
                              className={`h-5 w-5 text-gray-500 transition-transform ${
                                openItems.includes(faq.id) ? 'transform rotate-180' : ''
                              }`} 
                            />
                          </div>
                        </CardHeader>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <CardContent className="pt-0">
                          <div className="pl-8 pb-4">
                            <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                          </div>
                        </CardContent>
                      </CollapsibleContent>
                    </Collapsible>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">답변을 찾지 못하셨나요?</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-blue-600">
                  <Phone className="h-5 w-5 mr-2" />
                  전화 문의
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-2xl font-bold text-gray-900">054-639-4842</p>
                  <div className="text-gray-600">
                    <p>운영시간: 09:00 - 18:00</p>
                    <p>점심시간: 12:00 - 13:00</p>
                    <p>휴무일: 매주 월요일</p>
                  </div>
                  <Button className="w-full">
                    지금 전화하기
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-green-600">
                  <Mail className="h-5 w-5 mr-2" />
                  이메일 문의
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-lg font-semibold text-gray-900">info@aquarium.co.kr</p>
                  <div className="text-gray-600">
                    <p>24시간 문의 접수</p>
                    <p>답변 시간: 영업일 기준 24시간 이내</p>
                    <p>첨부파일 가능</p>
                  </div>
                  <Button variant="outline" className="w-full">
                    이메일 보내기
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">더 많은 정보가 필요하신가요?</h2>
          <p className="text-xl text-blue-100 mb-8">
            공지사항과 이벤트 정보도 확인해보세요
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/community/notices">
              <Button size="lg" variant="secondary">
                공지사항 보기
              </Button>
            </Link>
            <Link href="/community/events">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                이벤트 확인하기
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
} 