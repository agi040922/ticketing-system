# Vercel 배포 가이드

## 🚀 Vercel을 통한 Next.js 티켓팅 시스템 배포

### **1단계: Vercel 환경 변수 설정**

Vercel 대시보드에서 다음 환경 변수들을 설정해야 합니다:

#### **📋 필수 환경 변수 목록**

```env
# 빌게이트 PG 설정 (테스트 환경)
BILLGATE_SERVICE_ID=M2103135
BILLGATE_API_HOST=tapi.billgate.net
BILLGATE_API_PORT=30900
BILLGATE_ENCRYPTION_KEY=QkZJRlBDRTI4T0c1OUtBMw==
BILLGATE_ENCRYPTION_IV=PRJ59Q2GHPT844TQ
BILLGATE_MODE=0
BILLGATE_PAYMENT_URL=https://tpay.billgate.net

# Next.js 설정 (중요: 실제 배포 URL로 변경)
NEXT_PUBLIC_BASE_URL=https://your-app-name.vercel.app

# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### **2단계: Vercel 환경 변수 설정 방법**

1. **Vercel 대시보드** 접속 → [vercel.com](https://vercel.com)
2. **프로젝트 선택** → Settings 탭 클릭
3. **Environment Variables** 메뉴 클릭
4. **Add New** 버튼으로 각 환경 변수 추가

![Vercel Environment Variables](https://user-images.githubusercontent.com/example/vercel-env.png)

### **3단계: 코드 수정 사항**

#### **❗ 중요: BASE_URL 동적 설정**

배포 후 실제 도메인을 얻기 전에는 다음과 같이 준비:

```typescript
// app/api/payment/prepare/route.ts 수정 필요
// 현재:
RETURN_URL: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/payment/return`,

// 배포 후 수정 예시:
RETURN_URL: `https://your-app-name.vercel.app/payment/return`,
```

### **4단계: 배포 단계별 절차**

#### **A. GitHub 저장소 준비**
```bash
# 변경사항 커밋
git add .
git commit -m "feat: 빌게이트 PG 연동 완료"
git push origin main
```

#### **B. Vercel 연결**
1. **Vercel 대시보드** → New Project 클릭
2. **GitHub 저장소 선택** → Import 클릭
3. **Framework Preset**: Next.js 자동 감지
4. **Root Directory**: `./` (기본값)
5. **Deploy** 클릭

#### **C. 배포 URL 확인 및 설정 업데이트**
```
배포 완료 후 URL: https://your-app-name.vercel.app
```

### **5단계: 배포 후 설정 업데이트**

#### **환경 변수 업데이트**
```env
# Vercel에서 업데이트 필요
NEXT_PUBLIC_BASE_URL=https://your-actual-domain.vercel.app
```

#### **결제 준비 API 수정**
```typescript
// app/api/payment/prepare/route.ts
RETURN_URL: `https://your-actual-domain.vercel.app/payment/return`,
```

### **6단계: 배포 후 테스트**

#### **✅ 체크리스트**
- [ ] 사이트 접속 확인: `https://your-app-name.vercel.app`
- [ ] 구매 페이지 접속: `/purchase`
- [ ] 빌게이트 SDK 로드 확인 (개발자 도구)
- [ ] 결제창 팝업 테스트
- [ ] 테스트 카드로 결제 완료 테스트
- [ ] 결제 완료 후 QR 코드 생성 확인

### **7단계: 도메인 설정 (선택사항)**

#### **커스텀 도메인 연결**
1. **Vercel 프로젝트** → Settings → Domains
2. **Add Domain** → 원하는 도메인 입력
3. **DNS 설정** → Vercel 제공 네임서버 설정
4. **환경 변수 업데이트** → 새 도메인으로 변경

### **8단계: 운영 환경 전환 (실제 서비스 시)**

#### **빌게이트 운영 환경 설정**
```env
# 실제 서비스 시 변경 필요
BILLGATE_SERVICE_ID=실제_발급받은_서비스_ID
BILLGATE_API_HOST=api.billgate.net
BILLGATE_ENCRYPTION_KEY=실제_발급받은_암호화_키
BILLGATE_ENCRYPTION_IV=실제_발급받은_IV
BILLGATE_MODE=1
BILLGATE_PAYMENT_URL=https://pay.billgate.net
```

## 🔧 **문제 해결**

### **자주 발생하는 문제들**

#### **1. 결제창이 404 오류**
```bash
# 환경 변수 확인
BILLGATE_PAYMENT_URL=https://tpay.billgate.net  # 테스트
BILLGATE_PAYMENT_URL=https://pay.billgate.net   # 운영
```

#### **2. RETURN_URL 오류**
```typescript
// 올바른 설정
RETURN_URL: `https://실제도메인.vercel.app/payment/return`
```

#### **3. 환경 변수 인식 안됨**
- Vercel 대시보드에서 환경 변수 재확인
- 변수명 오타 체크
- 배포 후 재시작: Settings → Functions → Redeploy

#### **4. CORS 오류**
```typescript
// next.config.mjs 추가 설정
async headers() {
  return [
    {
      source: '/api/:path*',
      headers: [
        { key: 'Access-Control-Allow-Origin', value: '*' },
        { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
      ],
    },
  ]
}
```

## 📞 **지원 및 문의**

### **빌게이트 고객센터**
- 전화: 1566-0123
- 이메일: center@billgate.net
- 기술문의: 02-6005-1661

### **Vercel 지원**
- 문서: [vercel.com/docs](https://vercel.com/docs)
- 커뮤니티: [github.com/vercel/vercel](https://github.com/vercel/vercel)

## 🎯 **마무리**

배포 완료 후 다음을 확인하세요:
1. ✅ 실제 결제 테스트 성공
2. ✅ QR 코드 생성 및 스캔 가능
3. ✅ 취소/환불 기능 정상 작동
4. ✅ 모든 환경 변수 정상 설정

축하합니다! 🎉 빌게이트 PG가 연동된 티켓팅 시스템이 성공적으로 배포되었습니다! 