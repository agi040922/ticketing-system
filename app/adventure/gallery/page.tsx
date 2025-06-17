import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { NavigationHeader } from "@/components/navigation-header"
import { ArrowLeft, Camera, Heart, Share } from "lucide-react"

export default function AdventureGalleryPage() {
  const galleryImages = [
    {
      src: "https://www.coexaqua.com/media/xnrgpngi/7.jpg",
      title: "언더워터 터널",
      description: "바다 속을 걷는 듯한 환상적인 경험"
    },
    {
      src: "https://www.hanwha.co.kr/images/newsMedia/photo/20210118_news04.jpg",
      title: "메인 수족관",
      description: "다양한 해양 생물들의 아름다운 모습"
    },
    {
      src: "https://static.hanatour.com/product/2021/09/10/0649jis4fa/default.jpg",
      title: "돌고래 퍼포먼스",
      description: "매일 진행되는 특별한 돌고래 쇼"
    },
    {
      src: "https://www.coexaqua.com/media/xnrgpngi/7.jpg",
      title: "터치 체험존",
      description: "직접 만져볼 수 있는 해양 생물들"
    },
    {
      src: "https://www.hanwha.co.kr/images/newsMedia/photo/20210118_news04.jpg",
      title: "피딩 쇼",
      description: "전문 다이버의 먹이주기 체험"
    },
    {
      src: "https://static.hanatour.com/product/2021/09/10/0649jis4fa/default.jpg",
      title: "4D 시뮬레이션",
      description: "최신 기술로 구현된 심해 탐험"
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      <NavigationHeader />
      
      {/* Header Section */}
      <section className="py-8 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-6">
            <Link href="/adventure/intro">
              <Button variant="ghost" size="sm" className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                뒤로가기
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">어드벤처체험 갤러리</h1>
              <p className="text-gray-600 mt-2">아쿠아리움 파크의 아름다운 순간들</p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {galleryImages.map((image, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="relative">
                  <img 
                    src={image.src} 
                    alt={image.title}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <button className="bg-white/80 p-2 rounded-full hover:bg-white transition-colors">
                      <Camera className="h-4 w-4 text-gray-700" />
                    </button>
                    <button className="bg-white/80 p-2 rounded-full hover:bg-white transition-colors">
                      <Heart className="h-4 w-4 text-gray-700" />
                    </button>
                    <button className="bg-white/80 p-2 rounded-full hover:bg-white transition-colors">
                      <Share className="h-4 w-4 text-gray-700" />
                    </button>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{image.title}</h3>
                  <p className="text-gray-600 text-sm">{image.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Photo Tips */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">촬영 팁</h2>
          <div className="bg-white rounded-lg p-8 shadow-sm">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">📸 최적 촬영 위치</h3>
                <p className="text-gray-600 mb-4">
                  언더워터 터널 중앙 지점과 메인 수족관 정면에서 가장 아름다운 사진을 촬영할 수 있습니다.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">⚠️ 촬영 주의사항</h3>
                <p className="text-gray-600 mb-4">
                  플래시 촬영은 금지되며, 해양 생물의 스트레스를 줄이기 위해 조용히 촬영해주세요.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">당신만의 특별한 순간을 만들어보세요</h2>
          <p className="text-xl text-blue-100 mb-8">
            아름다운 추억과 함께 소중한 사진들을 남겨가세요
          </p>
          <Link href="/purchase">
            <Button size="lg" variant="secondary" className="px-8 py-3">
              지금 예약하기
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
} 