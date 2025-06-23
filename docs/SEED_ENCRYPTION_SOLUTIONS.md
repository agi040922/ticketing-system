# SEED 암호화 해결방안 분석

## 🔍 현황 분석

빌게이트 PG 연동을 위해서는 SEED-CBC 암호화가 필수적입니다. Node.js 기본 `crypto` 모듈은 SEED 알고리즘을 지원하지 않으므로, 대안을 찾아야 합니다.

---

## 💡 발견된 해결방안들

### 1. korea-forge (추천 ⭐⭐⭐⭐⭐)
```bash
# GitHub: https://github.com/jc-lab/korea-forge
# 설명: node-forge의 fork 버전으로 SEED 지원
```

**장점:**
- node-forge 기반으로 안정성 확보
- SEED-128 지원
- 한국 개발자가 직접 개발 (한국 환경에 특화)
- 테스트 코드 포함

**단점:**
- 공식 npm 패키지가 아님 (직접 설치 필요)
- 커뮤니티 지원 제한적

**설치 방법:**
```bash
# 직접 GitHub에서 설치
npm install git+https://github.com/jc-lab/korea-forge.git

# 또는 fork해서 우리 프로젝트로 가져오기
```

### 2. tomyun/crypto-js (추천 ⭐⭐⭐⭐)
```bash
# GitHub: https://github.com/tomyun/crypto-js
# 브랜치: xeit (SEED 지원)
```

**장점:**
- crypto-js 기반으로 익숙한 API
- SEED-128 및 CP949 인코딩 지원
- 한국 특화 기능들 포함

**단점:**
- 특정 브랜치에서만 SEED 지원
- 메인테이너 활동 불명확

### 3. 직접 구현 (추천 ⭐⭐⭐)
웹어셈블리(WASM) 또는 C++ 애드온으로 SEED 직접 구현

**장점:**
- 완전한 제어 가능
- 성능 최적화 가능
- 프로젝트 요구사항에 정확히 맞춤

**단점:**
- 개발 시간 오래 걸림
- 보안 검증 필요
- 유지보수 부담

### 4. 기존 Java/C# 라이브러리를 Node.js로 포팅 (추천 ⭐⭐)
빌게이트 제공 샘플 코드를 참고하여 직접 포팅

**장점:**
- 빌게이트와 호환성 보장
- 레퍼런스 코드 존재

**단점:**
- 시간 소모적
- 버그 발생 가능성

---

## 🚀 권장 해결방안

### 단계 1: korea-forge 우선 시도
```bash
npm install git+https://github.com/jc-lab/korea-forge.git
```

**테스트 코드:**
```javascript
const forge = require('korea-forge');

// SEED 암호화 테스트
function testSeedEncryption() {
  try {
    const key = forge.util.createBuffer('my-secret-key-32-bytes-long!!');
    const iv = forge.util.createBuffer('1234567890123456');
    
    const cipher = forge.cipher.createCipher('SEED-CBC', key);
    cipher.start({iv: iv});
    cipher.update(forge.util.createBuffer('test message'));
    cipher.finish();
    
    const encrypted = cipher.output.toHex();
    console.log('SEED 암호화 성공:', encrypted);
    return true;
  } catch (error) {
    console.error('SEED 암호화 실패:', error);
    return false;
  }
}
```

### 단계 2: tomyun/crypto-js 대안
```bash
npm install git+https://github.com/tomyun/crypto-js.git#xeit-3.1.2
```

**테스트 코드:**
```javascript
const CryptoJS = require('crypto-js');

// SEED 암호화 테스트 (tomyun 버전)
function testSeedEncryptionCryptoJS() {
  try {
    const encrypted = CryptoJS.SEED.encrypt("test message", "secret key");
    const decrypted = CryptoJS.SEED.decrypt(encrypted, "secret key");
    
    console.log('암호화:', encrypted.toString());
    console.log('복호화:', decrypted.toString(CryptoJS.enc.Utf8));
    return true;
  } catch (error) {
    console.error('SEED 암호화 실패:', error);
    return false;
  }
}
```

### 단계 3: 빌게이트 측 문의
SEED 암호화가 해결되지 않으면 빌게이트 기술지원팀에 문의:
- Node.js용 SEED 라이브러리 제공 요청
- 대안 암호화 알고리즘 사용 가능 여부 확인

---

## 🧪 검증 계획

### 1. 라이브러리 검증
```javascript
// 검증 스크립트: /tests/seed-encryption-test.js
const testCases = [
  {
    plaintext: 'test123',
    key: 'my-secret-key-123',
    expected: '예상되는 암호화 결과'
  }
];

// 빌게이트 샘플과 동일한 결과가 나오는지 확인
```

### 2. 성능 테스트
```javascript
// 1000번 암호화/복호화 성능 측정
console.time('SEED 암호화 성능');
for (let i = 0; i < 1000; i++) {
  // 암호화/복호화 실행
}
console.timeEnd('SEED 암호화 성능');
```

### 3. 호환성 테스트
- 빌게이트 PHP 샘플과 동일한 결과 확인
- 다양한 문자열 길이로 테스트
- 특수문자, 한글 포함 테스트

---

## 📝 실행 계획

### Week 1: 라이브러리 조사 및 테스트
- [ ] korea-forge 설치 및 테스트
- [ ] tomyun/crypto-js 설치 및 테스트
- [ ] 빌게이트 PHP 샘플과 결과 비교

### Week 2: 통합 및 검증
- [ ] 선택된 라이브러리를 프로젝트에 통합
- [ ] CHECK_SUM 생성 API 구현
- [ ] 빌게이트 테스트 서버와 연동 테스트

### Week 3: 최적화 및 예외처리
- [ ] 에러 처리 강화
- [ ] 성능 최적화
- [ ] 보안 검토

---

## ⚠️ 주의사항

1. **라이선스 확인**: 사용할 라이브러리의 라이선스가 상업적 사용에 문제없는지 확인
2. **보안 검토**: 암호화 라이브러리는 보안 검토 필수
3. **백업 계획**: SEED 암호화가 실패할 경우를 대비한 대안 마련
4. **문서화**: 선택한 라이브러리와 구현 방법을 상세히 문서화

---

## 🔗 참고 링크

- [korea-forge GitHub](https://github.com/jc-lab/korea-forge)
- [tomyun/crypto-js GitHub](https://github.com/tomyun/crypto-js)
- [SEED 알고리즘 Wikipedia](https://en.wikipedia.org/wiki/SEED)
- [KISA SEED 공식 문서](https://seed.kisa.or.kr/)

**다음 단계**: BillgatePay-PHP.zip 파일 분석하여 정확한 SEED 구현 스펙 확인 필요 