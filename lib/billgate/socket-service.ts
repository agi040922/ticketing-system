import * as net from 'net';
import { seedEncrypt, seedDecrypt, makeBillgateMessage, parseBillgateMessage } from './seed-encryption';

export interface BillgateApprovalRequest {
  ServiceId: string;
  PayMethod: string;
  OrderData: string;
  Amt: string;
  Key: string;
  PlainMsgOk: string;
  TransactionNo: string;
  AuthType: string;
  Iden: string;
  IpAddr: string;
}

export interface BillgateCancelRequest {
  ServiceId: string;
  OrderData: string;
  TransactionNo: string;
  CancelAmt: string;
  PartialCancel: string;
  CancelReason: string;
  IpAddr: string;
}

export interface BillgateResponse {
  success: boolean;
  data?: Record<string, string>;
  error?: string;
}

/**
 * 빌게이트 Socket 통신 서비스
 * PHP Service.php의 Socket 통신 로직을 TypeScript로 포팅
 */
export class BillgateSocketService {
  private readonly host: string;
  private readonly port: number;
  private readonly timeout: number;

  constructor(
    host: string = process.env.BILLGATE_API_HOST || 'tapi.billgate.net',
    port: number = parseInt(process.env.BILLGATE_API_PORT || '30900'),
    timeout: number = 30000
  ) {
    this.host = host;
    this.port = port;
    this.timeout = timeout;
  }

  /**
   * 결제 승인 요청
   */
  async requestApproval(approvalData: BillgateApprovalRequest): Promise<BillgateResponse> {
    try {
      console.log('빌게이트 승인 요청 시작:', approvalData);

      // 승인 요청 메시지 생성
      const message = makeBillgateMessage({
        ServiceId: approvalData.ServiceId,
        PayMethod: approvalData.PayMethod,
        OrderData: approvalData.OrderData,
        Amt: approvalData.Amt,
        Key: approvalData.Key,
        PlainMsgOk: approvalData.PlainMsgOk,
        TransactionNo: approvalData.TransactionNo,
        AuthType: approvalData.AuthType,
        Iden: approvalData.Iden,
        IpAddr: approvalData.IpAddr,
        Mode: '0' // 승인 모드
      });

      console.log('승인 요청 메시지:', message);

      // SEED 암호화
      const encryptedMessage = seedEncrypt(message);
      console.log('암호화된 메시지:', encryptedMessage);

      // Socket 통신으로 전송
      const response = await this.sendSocketMessage(encryptedMessage);
      return response;

    } catch (error) {
      console.error('승인 요청 중 오류:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '승인 요청 실패'
      };
    }
  }

  /**
   * 결제 취소 요청
   */
  async requestCancel(cancelData: BillgateCancelRequest): Promise<BillgateResponse> {
    try {
      console.log('빌게이트 취소 요청 시작:', cancelData);

      // 취소 요청 메시지 생성
      const message = makeBillgateMessage({
        ServiceId: cancelData.ServiceId,
        OrderData: cancelData.OrderData,
        TransactionNo: cancelData.TransactionNo,
        CancelAmt: cancelData.CancelAmt,
        PartialCancel: cancelData.PartialCancel,
        CancelReason: cancelData.CancelReason,
        IpAddr: cancelData.IpAddr,
        Mode: '1' // 취소 모드
      });

      console.log('취소 요청 메시지:', message);

      // SEED 암호화
      const encryptedMessage = seedEncrypt(message);
      console.log('암호화된 메시지:', encryptedMessage);

      // Socket 통신으로 전송
      const response = await this.sendSocketMessage(encryptedMessage);
      return response;

    } catch (error) {
      console.error('취소 요청 중 오류:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '취소 요청 실패'
      };
    }
  }

  /**
   * Socket을 통한 메시지 전송 (PHP Service.php의 sendApprovalReq 함수 포팅)
   */
  private async sendSocketMessage(encryptedMessage: string): Promise<BillgateResponse> {
    return new Promise((resolve, reject) => {
      const socket = new net.Socket();
      let responseData = '';

      // 타임아웃 설정
      socket.setTimeout(this.timeout);

      socket.on('connect', () => {
        console.log(`빌게이트 서버 연결 성공: ${this.host}:${this.port}`);
        
        // 암호화된 메시지 전송
        socket.write(encryptedMessage);
        console.log('메시지 전송 완료');
      });

      socket.on('data', (data) => {
        responseData += data.toString();
        console.log('서버 응답 수신:', responseData);
      });

      socket.on('end', () => {
        console.log('서버 연결 종료');
        
        try {
          // 응답 메시지 복호화
          const decryptedResponse = seedDecrypt(responseData);
          console.log('복호화된 응답:', decryptedResponse);
          
          // 응답 메시지 파싱
          const parsedResponse = parseBillgateMessage(decryptedResponse);
          console.log('파싱된 응답:', parsedResponse);
          
          // 결과 코드 확인
          const resultCode = parsedResponse['ResultCode'] || parsedResponse['result_code'];
          const success = resultCode === '0000' || resultCode === '00';
          
          resolve({
            success,
            data: parsedResponse,
            error: success ? undefined : `결제 처리 실패: ${parsedResponse['ResultMsg'] || parsedResponse['result_msg'] || '알 수 없는 오류'}`
          });

        } catch (decryptError) {
          console.error('응답 복호화 오류:', decryptError);
          resolve({
            success: false,
            error: '응답 복호화에 실패했습니다.'
          });
        }
      });

      socket.on('timeout', () => {
        console.error('Socket 타임아웃');
        socket.destroy();
        resolve({
          success: false,
          error: '서버 응답 대기 시간이 초과되었습니다.'
        });
      });

      socket.on('error', (error) => {
        console.error('Socket 연결 오류:', error);
        resolve({
          success: false,
          error: `서버 연결 실패: ${error.message}`
        });
      });

      // 빌게이트 서버에 연결
      socket.connect(this.port, this.host);
    });
  }

  /**
   * 연결 테스트
   */
  async testConnection(): Promise<boolean> {
    return new Promise((resolve) => {
      const socket = new net.Socket();
      socket.setTimeout(5000);

      socket.on('connect', () => {
        console.log('빌게이트 서버 연결 테스트 성공');
        socket.end();
        resolve(true);
      });

      socket.on('timeout', () => {
        console.error('빌게이트 서버 연결 테스트 타임아웃');
        socket.destroy();
        resolve(false);
      });

      socket.on('error', (error) => {
        console.error('빌게이트 서버 연결 테스트 실패:', error);
        resolve(false);
      });

      socket.connect(this.port, this.host);
    });
  }
} 