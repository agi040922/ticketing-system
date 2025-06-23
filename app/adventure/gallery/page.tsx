import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { NavigationHeader } from "@/components/navigation-header"
import { ArrowLeft, Camera, Heart, Share } from "lucide-react"

export default function AdventureGalleryPage() {
  const galleryImages = [
    {
      src: "https://www.hanwha.co.kr/images/newsMedia/photo/20210118_news04.jpg",
      title: "스릴 놀이기구",
      description: "짜릿한 스릴을 선사하는 다양한 놀이기구들"
    },
    {
      src: "https://static.hanatour.com/product/2021/09/10/0649jis4fa/default.jpg",
      title: "자연 체험존",
      description: "목포의 아름다운 자연 속에서 즐기는 생태 체험"
    },
    {
      src: "https://www.coexaqua.com/media/xnrgpngi/7.jpg",
      title: "가족 놀이시설",
      description: "온 가족이 함께 즐길 수 있는 안전한 놀이공간"
    },
    {
      src: "https://www.hanwha.co.kr/images/newsMedia/photo/20210118_news04.jpg",
      title: "어드벤처 체험",
      description: "모험과 스릴이 가득한 특별한 체험활동"
    },
    {
      src: "https://static.hanatour.com/product/2021/09/10/0649jis4fa/default.jpg",
      title: "자연 학습 프로그램",
      description: "아이들을 위한 교육적인 자연 학습 체험"
    },
    {
      src: "https://www.coexaqua.com/media/xnrgpngi/7.jpg",
      title: "계절별 특별 프로그램",
      description: "사계절 내내 즐길 수 있는 다양한 이벤트"
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      <NavigationHeader />
      
      {/* Header Section */}
      <section className="py-8 bg-gradient-to-b from-green-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-6">
            <Link href="/adventure/intro">
              <Button variant="ghost" size="sm" className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                뒤로가기
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">갤러리</h1>
              <p className="text-gray-600 mt-2">목포 플레이파크의 아름다운 순간들</p>
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
                  롤러코스터 전망대와 자연 체험존 중앙에서 가장 아름다운 사진을 촬영할 수 있습니다.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">⚠️ 촬영 주의사항</h3>
                <p className="text-gray-600 mb-4">
                  놀이기구 이용 중 촬영은 안전상 금지되며, 다른 이용객의 프라이버시를 존중해주세요.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">당신만의 특별한 순간을 만들어보세요</h2>
          <p className="text-xl text-green-100 mb-8">
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