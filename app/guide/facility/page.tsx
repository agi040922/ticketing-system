import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { NavigationHeader } from "@/components/navigation-header"
import { ArrowLeft, Clock, Users, AlertTriangle, CheckCircle, Info, Shield } from "lucide-react"

export default function GuideFacilityPage() {
  const guidelines = [
    {
      category: "일반 이용 수칙",
      icon: Info,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      rules: [
        "입장 시 티켓을 반드시 소지하고 계세요",
        "재입장은 당일 1회만 가능합니다",
        "파크 내에서는 금연입니다",
        "음주 후 놀이기구 이용은 금지됩니다",
        "애완동물 동반 입장은 불가합니다"
      ]
    },
    {
      category: "놀이기구 이용 수칙",
      icon: Shield,
      color: "text-red-600",
      bgColor: "bg-red-50",
      rules: [
        "각 놀이기구별 키 제한을 확인해주세요",
        "안전벨트 착용은 필수입니다",
        "임신부는 스릴 놀이기구 이용을 금합니다",
        "심장질환, 고혈압 환자는 사전 상담하세요",
        "놀이기구 이용 중 휴대폰 사용 금지"
      ]
    },
    {
      category: "자연 체험존 수칙",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
      rules: [
        "자연을 보호하고 훼손하지 말아주세요",
        "야생동물에게 먹이를 주지 마세요",
        "지정된 산책로만 이용해주세요",
        "큰 소리로 떠들거나 뛰어다니지 마세요",
        "쓰레기는 지정된 장소에 버려주세요"
      ]
    },
    {
      category: "어린이 동반 수칙",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      rules: [
        "만 5세 미만 어린이는 보호자 동반 필수",
        "어린이의 안전은 보호자가 책임져주세요",
        "키즈존에서는 나이 제한을 준수해주세요",
        "어린이가 뛰어다니지 않도록 주의해주세요",
        "응급상황 시 즉시 직원에게 신고하세요"
      ]
    }
  ]

  const facilityHours = [
    {
      facility: "스릴 놀이기구",
      weekday: "09:30 - 17:30",
      weekend: "09:30 - 19:30",
      notes: "날씨에 따라 운영 중단될 수 있음"
    },
    {
      facility: "패밀리 놀이시설",
      weekday: "09:00 - 18:00",
      weekend: "09:00 - 20:00",
      notes: "연중무휴 운영"
    },
    {
      facility: "자연 체험존",
      weekday: "09:00 - 18:00",
      weekend: "09:00 - 19:00",
      notes: "가이드 투어: 10시, 14시"
    },
    {
      facility: "어드벤처 존",
      weekday: "10:00 - 17:00",
      weekend: "10:00 - 19:00",
      notes: "사전 예약 권장"
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      <NavigationHeader />
      
      {/* Header Section */}
      <section className="py-8 bg-gradient-to-b from-green-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-6">
            <Link href="/">
              <Button variant="ghost" size="sm" className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                홈으로
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">시설 이용안내</h1>
              <p className="text-gray-600 mt-2">안전하고 즐거운 이용을 위한 가이드라인</p>
            </div>
          </div>
        </div>
      </section>

      {/* Guidelines */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">이용 수칙</h2>
            <p className="text-xl text-gray-600">
              모든 이용객의 안전과 즐거움을 위해 다음 수칙을 준수해주세요
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {guidelines.map((guideline, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className={guideline.bgColor}>
                  <CardTitle className="flex items-center text-xl">
                    <guideline.icon className={`h-6 w-6 mr-3 ${guideline.color}`} />
                    {guideline.category}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <ul className="space-y-3">
                    {guideline.rules.map((rule, ruleIndex) => (
                      <li key={ruleIndex} className="flex items-start">
                        <span className={`inline-block w-2 h-2 rounded-full mt-2 mr-3 ${guideline.color.replace('text', 'bg')}`}></span>
                        <span className="text-gray-700">{rule}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Operating Hours */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">시설별 운영시간</h2>
            <p className="text-xl text-gray-600">각 시설의 운영시간을 확인하세요</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">시설명</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">평일</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">주말/공휴일</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">특이사항</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {facilityHours.map((facility, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{facility.facility}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{facility.weekday}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{facility.weekend}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{facility.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Info */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">응급상황 대응</h2>
            <p className="text-xl text-gray-600">안전사고 발생 시 즉시 연락하세요</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-red-200">
              <CardHeader className="bg-red-50">
                <CardTitle className="flex items-center text-red-600">
                  <AlertTriangle className="h-6 w-6 mr-2" />
                  응급상황
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div>
                    <p className="font-semibold text-gray-900">응급실 직통</p>
                    <p className="text-lg font-bold text-red-600">119</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">파크 응급실</p>
                    <p className="text-lg font-bold text-red-600">내선 911</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200">
              <CardHeader className="bg-blue-50">
                <CardTitle className="flex items-center text-blue-600">
                  <Info className="h-6 w-6 mr-2" />
                  고객서비스
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div>
                    <p className="font-semibold text-gray-900">안내데스크</p>
                    <p className="text-lg font-bold text-blue-600">내선 100</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">분실물센터</p>
                    <p className="text-lg font-bold text-blue-600">내선 200</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-200">
              <CardHeader className="bg-green-50">
                <CardTitle className="flex items-center text-green-600">
                  <Shield className="h-6 w-6 mr-2" />
                  보안센터
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div>
                    <p className="font-semibold text-gray-900">보안관제실</p>
                    <p className="text-lg font-bold text-green-600">내선 300</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">미아보호소</p>
                    <p className="text-lg font-bold text-green-600">내선 400</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Important Notice */}
      <section className="py-16 bg-amber-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg p-8 shadow-sm border border-amber-200">
            <div className="flex items-start">
              <AlertTriangle className="h-8 w-8 text-amber-600 mr-4 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">중요 공지사항</h3>
                <div className="space-y-3 text-gray-700">
                  <p>• 기상악화(태풍, 폭우, 폭설 등) 시 일부 시설 운영이 중단될 수 있습니다.</p>
                  <p>• 놀이기구 정기점검으로 인한 운영 중단은 홈페이지를 통해 사전 공지됩니다.</p>
                  <p>• 분실물은 당일 분실물센터에서 찾아가시기 바랍니다.</p>
                  <p>• 파크 내 모든 구역은 CCTV로 보안관제가 이루어집니다.</p>
                  <p>• 고객의 안전을 위해 음주 상태의 놀이기구 이용은 절대 금지됩니다.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">안전한 이용을 위해 협조해주세요</h2>
          <p className="text-xl text-green-100 mb-8">
            모든 이용객이 안전하고 즐겁게 이용할 수 있도록 수칙을 준수해주세요
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/purchase">
              <Button size="lg" variant="secondary" className="px-8 py-3">
                지금 예약하기
              </Button>
            </Link>
            <Link href="/guide/safety">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600 px-8 py-3">
                안전수칙 보기
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
} 