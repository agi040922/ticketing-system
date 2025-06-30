"use client"

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { createSupabaseClient } from '@/lib/supabase'
import { Mail, ArrowLeft, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react'

export default function VerifyEmailPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createSupabaseClient()

  useEffect(() => {
    // URL에서 이메일 파라미터 가져오기
    const emailParam = searchParams.get('email')
    if (emailParam) {
      setEmail(emailParam)
    }
  }, [searchParams])

  // 인증 이메일 재발송
  const resendEmail = async () => {
    if (!email) {
      setError('이메일 주소가 필요합니다.')
      return
    }

    try {
      setLoading(true)
      setError('')
      setMessage('')

      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email
      })

      if (error) {
        setError(error.message)
      } else {
        setMessage('인증 이메일이 다시 전송되었습니다.')
      }
    } catch (error: any) {
      setError('이메일 재발송에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* 뒤로 가기 버튼 */}
        <Button
          variant="ghost"
          size="sm"
          className="mb-4"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          뒤로 가기
        </Button>

        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Mail className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl">이메일 인증이 필요합니다</CardTitle>
            <CardDescription>
              회원가입을 완료하려면 이메일 인증을 해주세요
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* 이메일 주소 표시 */}
            {email && (
              <div className="bg-gray-50 p-4 rounded-lg border">
                <p className="text-sm text-gray-600 mb-1">인증 이메일이 전송된 주소:</p>
                <p className="font-semibold text-gray-900">{email}</p>
              </div>
            )}

            {/* 성공/오류 메시지 */}
            {message && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* 안내 메시지 */}
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2">📧 다음 단계</h3>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li className="flex items-start">
                    <span className="font-bold mr-2">1.</span>
                    <span>이메일 받은함을 확인하세요</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-bold mr-2">2.</span>
                    <span>인증 링크를 클릭하세요</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-bold mr-2">3.</span>
                    <span>인증 완료 후 로그인하세요</span>
                  </li>
                </ul>
              </div>

              <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                <h3 className="font-semibold text-amber-900 mb-2">⚠️ 이메일이 오지 않았나요?</h3>
                <ul className="space-y-1 text-sm text-amber-800">
                  <li>• 스팸함(정크메일)을 확인해보세요</li>
                  <li>• 이메일 주소가 올바른지 확인해보세요</li>
                  <li>• 몇 분 후에 다시 확인해보세요</li>
                </ul>
              </div>
            </div>

            {/* 액션 버튼들 */}
            <div className="space-y-3">
              {/* 이메일 재발송 */}
              <Button
                variant="outline"
                size="lg"
                className="w-full"
                onClick={resendEmail}
                disabled={loading || !email}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                {loading ? '전송 중...' : '인증 이메일 다시 보내기'}
              </Button>

              {/* 로그인 페이지로 이동 */}
              <Button
                size="lg"
                className="w-full"
                onClick={() => router.push('/auth/login')}
              >
                로그인 페이지로 이동
              </Button>
            </div>

            {/* 추가 안내 */}
            <div className="text-center">
              <p className="text-xs text-gray-500">
                이메일 인증 후 바로 로그인할 수 있습니다.
                <br />
                문제가 지속되면 고객센터로 문의해주세요.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 