/**
 * 빌게이트 PG 연동 통합 테스트 스크립트
 * 
 * 이 스크립트는 다음 기능들을 테스트합니다:
 * 1. CHECK_SUM 생성 및 검증
 * 2. SEED 암호화/복호화
 * 3. Socket 통신 연결 테스트
 * 4. 결제 준비 API 테스트
 * 
 * 사용법: node test-billgate-complete.js
 */

const { CheckSumUtil } = require('./lib/billgate/checksum');
const { seedEncrypt, seedDecrypt, testSeedEncryption } = require('./lib/billgate/seed-encryption');
const { BillgateSocketService } = require('./lib/billgate/socket-service');

console.log('🚀 빌게이트 PG 연동 통합 테스트 시작\n');

// 1. CHECK_SUM 생성 테스트
console.log('=== 1. CHECK_SUM 생성 테스트 ===');
try {
  const testData = 'M2103135ORDER123456782500020241201120000';
  const checkSum = CheckSumUtil.genCheckSum(testData);
  console.log('✅ CHECK_SUM 생성 성공:', checkSum);
  console.log('   - 길이:', checkSum.length, '자리');
  
  // 검증 테스트
  const isValid = CheckSumUtil.isValidCheckSum(testData, checkSum);
  console.log('✅ CHECK_SUM 검증 결과:', isValid ? '성공' : '실패');
} catch (error) {
  console.error('❌ CHECK_SUM 테스트 실패:', error.message);
}

console.log('\n=== 2. SEED 암호화 테스트 ===');
try {
  testSeedEncryption();
  console.log('✅ SEED 암호화 테스트 완료');
} catch (error) {
  console.error('❌ SEED 암호화 테스트 실패:', error.message);
}

console.log('\n=== 3. Socket 연결 테스트 ===');
async function testSocketConnection() {
  try {
    const socketService = new BillgateSocketService();
    const connected = await socketService.testConnection();
    
    if (connected) {
      console.log('✅ 빌게이트 서버 연결 성공');
    } else {
      console.log('❌ 빌게이트 서버 연결 실패');
    }
  } catch (error) {
    console.error('❌ Socket 연결 테스트 오류:', error.message);
  }
}

// 4. 결제 준비 API 테스트
console.log('\n=== 4. 결제 준비 API 테스트 ===');
async function testPaymentPrepare() {
  try {
    const testOrderData = {
      orderId: `TEST_${Date.now()}`,
      amount: 43000,
      customerName: '테스트고객',
      customerPhone: '010-1234-5678',
      adultCount: 1,
      childCount: 1
    };

    console.log('📤 테스트 주문 데이터:', testOrderData);

    const response = await fetch('http://localhost:3000/api/payment/prepare', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testOrderData)
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('✅ 결제 준비 API 성공');
      console.log('   - CHECK_SUM:', result.checkSum);
      console.log('   - 결제창 URL:', result.paymentUrl);
      console.log('   - 주문 날짜:', result.orderDate);
    } else {
      console.log('❌ 결제 준비 API 실패:', result.message);
    }
  } catch (error) {
    console.error('❌ 결제 준비 API 테스트 오류:', error.message);
  }
}

// 5. 빌게이트 메시지 생성/파싱 테스트
console.log('\n=== 5. 빌게이트 메시지 처리 테스트 ===');
try {
  const { makeBillgateMessage, parseBillgateMessage } = require('./lib/billgate/seed-encryption');
  
  const testMessage = {
    ServiceId: 'M2103135',
    PayMethod: '11',
    OrderData: 'TEST123456',
    Amt: '25000',
    Key: 'testkey123'
  };

  const messageString = makeBillgateMessage(testMessage);
  console.log('✅ 메시지 생성:', messageString);

  const parsedMessage = parseBillgateMessage(messageString);
  console.log('✅ 메시지 파싱:', parsedMessage);
  
  // 원본과 파싱 결과 비교
  const isEqual = JSON.stringify(testMessage) === JSON.stringify(parsedMessage);
  console.log('✅ 메시지 일치성:', isEqual ? '성공' : '실패');
} catch (error) {
  console.error('❌ 메시지 처리 테스트 실패:', error.message);
}

// 모든 테스트 실행
async function runAllTests() {
  await testSocketConnection();
  
  // 로컬 서버가 실행 중인 경우에만 API 테스트 실행
  try {
    await testPaymentPrepare();
  } catch (error) {
    console.log('⚠️  결제 준비 API 테스트 건너뛰기 (서버 미실행)');
  }

  console.log('\n🎉 모든 테스트 완료!');
  console.log('\n📋 다음 단계:');
  console.log('1. npm run dev 로 개발 서버 실행');
  console.log('2. http://localhost:3000/purchase 에서 실제 결제 테스트');
  console.log('3. 빌게이트 테스트 카드로 결제 진행');
  console.log('4. 결제 완료 후 DB 확인');
}

runAllTests().catch(console.error); 