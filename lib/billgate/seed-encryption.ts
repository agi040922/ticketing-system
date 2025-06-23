// @ts-ignore
const forge = require('../korea-forge-jclab-main/korea-forge-jclab-main/lib/index.js');

/**
 * 빌게이트 SEED 암호화 설정
 */
const BILLGATE_CONFIG = {
  // Base64로 인코딩된 키를 디코딩
  ENCRYPTION_KEY: Buffer.from('QkZJRlBDRTI4T0c1OUtBMw==', 'base64').toString('binary'),
  // IV는 16바이트
  ENCRYPTION_IV: 'PRJ59Q2GHPT844TQ'
};

/**
 * SEED-CBC 암호화
 * @param plaintext 암호화할 평문
 * @returns Base64로 인코딩된 암호문
 */
export function seedEncrypt(plaintext: string): string {
  try {
    // SEED-CBC 암호화 객체 생성
    const cipher = forge.cipher.createCipher('SEED-CBC', BILLGATE_CONFIG.ENCRYPTION_KEY);
    
    // IV 설정하고 암호화 시작
    cipher.start({
      iv: BILLGATE_CONFIG.ENCRYPTION_IV
    });
    
    // 평문을 바이트 버퍼로 변환하여 암호화
    cipher.update(forge.util.createBuffer(plaintext, 'utf8'));
    cipher.finish();
    
    // 암호화된 데이터를 Base64로 인코딩하여 반환
    return forge.util.encode64(cipher.output.getBytes());
  } catch (error) {
    console.error('SEED 암호화 오류:', error);
    throw new Error('SEED 암호화에 실패했습니다.');
  }
}

/**
 * SEED-CBC 복호화
 * @param ciphertext Base64로 인코딩된 암호문
 * @returns 복호화된 평문
 */
export function seedDecrypt(ciphertext: string): string {
  try {
    // SEED-CBC 복호화 객체 생성
    const decipher = forge.cipher.createDecipher('SEED-CBC', BILLGATE_CONFIG.ENCRYPTION_KEY);
    
    // IV 설정하고 복호화 시작
    decipher.start({
      iv: BILLGATE_CONFIG.ENCRYPTION_IV
    });
    
    // Base64 디코딩 후 복호화
    const encryptedBytes = forge.util.decode64(ciphertext);
    decipher.update(forge.util.createBuffer(encryptedBytes, 'binary'));
    decipher.finish();
    
    // 복호화된 데이터를 UTF-8 문자열로 반환
    return decipher.output.toString('utf8');
  } catch (error) {
    console.error('SEED 복호화 오류:', error);
    throw new Error('SEED 복호화에 실패했습니다.');
  }
}

/**
 * 빌게이트 메시지 생성 (PHP Service.php의 makeMsgByMap 함수 포팅)
 * @param dataMap 전송할 데이터 맵
 * @returns 빌게이트 형식의 메시지
 */
export function makeBillgateMessage(dataMap: Record<string, string>): string {
  const messages: string[] = [];
  
  for (const [key, value] of Object.entries(dataMap)) {
    if (value !== null && value !== undefined) {
      messages.push(`${key}=${value}`);
    }
  }
  
  return messages.join('&');
}

/**
 * 빌게이트 메시지 파싱 (PHP Service.php의 parseMsg 함수 포팅)
 * @param message 빌게이트 형식의 메시지
 * @returns 파싱된 데이터 맵
 */
export function parseBillgateMessage(message: string): Record<string, string> {
  const result: Record<string, string> = {};
  
  if (!message || message.trim() === '') {
    return result;
  }
  
  const pairs = message.split('&');
  for (const pair of pairs) {
    const [key, ...valueParts] = pair.split('=');
    if (key) {
      result[key] = valueParts.join('=') || '';
    }
  }
  
  return result;
}

/**
 * 테스트용 암호화/복호화 함수
 */
export function testSeedEncryption(): void {
  const testData = 'Hello, BillGate!';
  console.log('원본 데이터:', testData);
  
  const encrypted = seedEncrypt(testData);
  console.log('암호화된 데이터:', encrypted);
  
  const decrypted = seedDecrypt(encrypted);
  console.log('복호화된 데이터:', decrypted);
  
  console.log('암호화/복호화 성공:', testData === decrypted);
} 