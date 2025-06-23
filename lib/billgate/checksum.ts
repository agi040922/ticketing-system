import crypto from 'crypto';

/**
 * 빌게이트 CHECK_SUM 생성 유틸리티
 * PHP billgateClass/Util.php의 CheckSumUtil 클래스를 TypeScript로 포팅
 */
export class CheckSumUtil {
  private static readonly INIT_KEY = "billgatehashkey";

  /**
   * 4바이트 랜덤 키 생성
   * @returns 8자리 16진수 문자열
   */
  private static getRandomKey(): string {
    const randomBytes = crypto.randomBytes(4);
    return randomBytes.toString('hex');
  }

  /**
   * MD5 해시 생성
   * @param data 해시할 데이터
   * @returns MD5 해시 (32자리 16진수)
   */
  private static getMD5(data: string): string {
    return crypto.createHash('md5').update(data).digest('hex');
  }

  /**
   * CHECK_SUM 생성
   * 빌게이트 결제 요청 시 데이터 위변조 방지를 위한 체크섬 생성
   * 
   * @param input SERVICE_ID + ORDER_ID + AMOUNT 조합 문자열
   * @returns 생성된 CHECK_SUM (8자리 랜덤키 + 32자리 MD5 해시)
   * 
   * @example
   * const input = "M2103135" + "test_20231201123456" + "1004";
   * const checkSum = CheckSumUtil.genCheckSum(input);
   * console.log(checkSum); // "a1b2c3d4" + "md5hash..." (총 40자리)
   */
  public static genCheckSum(input: string): string {
    const randomKey = this.getRandomKey();
    const hashInput = randomKey + input + this.INIT_KEY;
    const hash = this.getMD5(hashInput);
    
    return randomKey + hash;
  }

  /**
   * CHECK_SUM 검증
   * @param checkSum 검증할 CHECK_SUM
   * @param target 원본 데이터 (SERVICE_ID + ORDER_ID + AMOUNT)
   * @returns 검증 결과 (true/false)
   */
  public static verifyCheckSum(checkSum: string, target: string): boolean {
    if (checkSum.length !== 40) {
      return false;
    }

    const randomKey = checkSum.substring(0, 8);
    const receivedHash = checkSum.substring(8);
    
    const expectedHashInput = randomKey + target + this.INIT_KEY;
    const expectedHash = this.getMD5(expectedHashInput);
    
    return receivedHash === expectedHash;
  }
}

/**
 * CHECK_SUM 생성을 위한 입력 파라미터 타입
 */
export interface CheckSumParams {
  serviceId: string;    // 서비스 ID (예: M2103135)
  orderId: string;      // 주문번호 (예: test_20231201123456)
  amount: string;       // 결제금액 (예: 1004)
}

/**
 * 결제 파라미터로부터 CHECK_SUM 생성하는 헬퍼 함수
 */
export function generateCheckSumFromParams(params: CheckSumParams): string {
  const input = params.serviceId + params.orderId + params.amount;
  return CheckSumUtil.genCheckSum(input);
} 