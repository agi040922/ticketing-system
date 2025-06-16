"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Scan } from "lucide-react"

export default function ScannerLoginPage() {
  const router = useRouter()
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  })
  const [error, setError] = useState("")

  const handleLogin = () => {
    setError("")

    // 현장 운영자 인증 (실제로는 서버에서 처리)
    if (credentials.username === "scanner" && credentials.password === "scan123") {
      localStorage.setItem("scannerLoggedIn", "true")
      router.push("/scanner")
    } else {
      setError("아이디 또는 비밀번호가 올바르지 않습니다.")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-full max-w-md px-4">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeft className="h-4 w-4 mr-2" />
            메인으로 돌아가기
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            <Scan className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <CardTitle>현장 스캐너 로그인</CardTitle>
            <CardDescription>현장 운영자만 접근 가능합니다</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="username">아이디</Label>
              <Input
                id="username"
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                placeholder="현장 운영자 아이디"
              />
            </div>
            <div>
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                placeholder="비밀번호"
                onKeyPress={(e) => e.key === "Enter" && handleLogin()}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <Button className="w-full" onClick={handleLogin}>
              로그인
            </Button>

            <div className="text-center text-sm text-gray-600">
              <p>테스트 계정</p>
              <p>아이디: scanner / 비밀번호: scan123</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
