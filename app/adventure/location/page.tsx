import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { NavigationHeader } from "@/components/navigation-header"
import { ArrowLeft, MapPin, Car, Train, Bus, Clock, Phone } from "lucide-react"

export default function AdventureLocationPage() {
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
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">오시는길</h1>
              <p className="text-gray-600 mt-2">목포 플레이파크 찾아오는 방법</p>
            </div>
          </div>
        </div>
      </section>

      {/* Address Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-green-600">
                    <MapPin className="h-5 w-5 mr-2" />
                    주소 정보
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-lg font-semibold">목포 플레이파크</p>
                      <p className="text-gray-600">전라남도 목포시 플레이파크로 123</p>
                    </div>
                    <div>
                      <p className="font-semibold">연락처</p>
                      <p className="text-gray-600">061-639-4842</p>
                    </div>
                    <div>
                      <p className="font-semibold">운영시간</p>
                      <p className="text-gray-600">
                        평일: 09:00 - 18:00<br />
                        주말: 09:00 - 20:00
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div>
              {/* Map placeholder */}
              <div className="bg-gray-100 rounded-lg h-80 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">지도는 실제 서비스에서 제공됩니다</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Transportation */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">대중교통 이용</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <Train className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle>KTX/기차</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  목포역 하차<br />
                  택시 15분 거리<br />
                  <span className="text-sm text-green-600">가장 편리한 방법</span>
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Bus className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>버스</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  시내버스: 101, 102번<br />
                  마을버스: 201, 202번<br />
                  플레이파크 정류장 하차
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Car className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <CardTitle>자가용</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  무료 주차장 완비<br />
                  300대 주차 가능<br />
                  네비게이션: "목포 플레이파크"
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Parking Information */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">주차 안내</h2>
          <Card>
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">🚗 주차 요금</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• 입장권 구매 시 <strong>무료</strong></li>
                    <li>• 일반 주차: 시간당 2,000원</li>
                    <li>• 대형버스: 시간당 5,000원</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">⏰ 이용 시간</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• 평일: 08:30 - 18:30</li>
                    <li>• 주말: 08:30 - 20:30</li>
                    <li>• 야간 주차 불가</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">길 찾기 문의</h2>
          <p className="text-xl text-green-100 mb-8">
            찾아오시는 길에 궁금한 점이 있으시면 언제든 연락주세요
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="flex items-center">
              <Phone className="h-5 w-5 mr-2" />
              <span className="text-xl font-semibold">061-639-4842</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              <span>상담시간: 09:00 - 18:00</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 