"use client"

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'

interface PaymentReturnData {
  success: boolean;
  message: string;
  orderId?: string;
  approvalNo?: string;
  transactionNo?: string;
  qrImageUrl?: string;
  ticketUrl?: string;
  error?: string;
}

/**
 * 빌게이트 결제 완료 후 리턴 페이지 내부 컴포넌트
 */
function PaymentReturnContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [paymentResult, setPaymentResult] = useState<PaymentReturnData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const processPaymentReturn = async () => {
      try {
        // URL 파라미터에서 빌게이트 결제 결과 데이터 추출
        const billgateData = {
          ServiceId: searchParams.get('ServiceId'),
          PayMethod: searchParams.get('PayMethod'),
          OrderData: searchParams.get('OrderData'),
          Amt: searchParams.get('Amt'),
          Key: searchParams.get('Key'),
          PlainMsgOk: searchParams.get('PlainMsgOk'),
          TransactionNo: searchParams.get('TransactionNo'),
          AuthType: searchParams.get('AuthType'),
          Iden: searchParams.get('Iden'),
        };

        console.log('빌게이트 결제 리턴 데이터:', billgateData);

        // 필수 파라미터 확인
        if (!billgateData.OrderData || !billgateData.TransactionNo) {
          throw new Error('필수 결제 데이터가 누락되었습니다.');
        }

        // localStorage에서 고객 정보 가져오기
        const savedOrderData = localStorage.getItem('pendingOrderData');
        if (!savedOrderData) {
          throw new Error('고객 정보를 찾을 수 없습니다. 다시 시도해주세요.');
        }

        const orderData = JSON.parse(savedOrderData);
        console.log('저장된 주문 데이터:', orderData);

        // 빌게이트 승인 처리 API 호출 (실제 빌게이트 서버와 통신)
        const response = await fetch('/api/payment/approve', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            // 빌게이트 결제창에서 리턴된 데이터
            ...billgateData,
            
            // localStorage에서 가져온 고객 정보
            customerName: orderData.customerName,
            customerPhone: orderData.customerPhone,
            customerEmail: orderData.customerEmail,
            adultCount: orderData.adultCount || 0,
            childCount: orderData.childCount || 0,
          }),
        });

        const result = await response.json();
        
        if (result.success) {
          setPaymentResult({
            success: true,
            message: result.message,
            orderId: result.orderId,
            approvalNo: result.approvalNo,
            transactionNo: result.transactionNo,
            qrImageUrl: result.qrImageUrl,
            ticketUrl: result.ticketUrl
          });
          
          // 처리 완료 후 localStorage 정리
          localStorage.removeItem('pendingOrderData');
          
          console.log('빌게이트 승인 완료:', result);
        } else {
          throw new Error(result.message || '결제 승인 실패');
        }

      } catch (error) {
        console.error('결제 승인 처리 중 오류:', error);
        setPaymentResult({
          success: false,
          message: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
          error: error instanceof Error ? error.message : '알 수 없는 오류'
        });
      } finally {
        setLoading(false);
      }
    };

    processPaymentReturn();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center space-y-4 p-6">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
            <p className="text-lg font-medium">결제 승인 처리 중...</p>
            <p className="text-sm text-gray-600 text-center">
              빌게이트 서버와 통신하여 결제를 승인하고 있습니다.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {paymentResult?.success ? (
              <CheckCircle className="h-16 w-16 text-green-500" />
            ) : (
              <XCircle className="h-16 w-16 text-red-500" />
            )}
          </div>
          <CardTitle className={`text-2xl ${paymentResult?.success ? 'text-green-700' : 'text-red-700'}`}>
            {paymentResult?.success ? '결제 완료' : '결제 실패'}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-center text-gray-600">
            {paymentResult?.message}
          </p>

          {paymentResult?.success && (
            <>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-medium text-green-800 mb-2">📱 입장권 정보</h3>
                <p className="text-sm text-green-700">
                  주문번호: <span className="font-mono">{paymentResult.orderId}</span>
                </p>
                {paymentResult.approvalNo && (
                  <p className="text-sm text-green-700">
                    승인번호: <span className="font-mono">{paymentResult.approvalNo}</span>
                  </p>
                )}
                {paymentResult.transactionNo && (
                  <p className="text-sm text-green-700">
                    거래번호: <span className="font-mono">{paymentResult.transactionNo}</span>
                  </p>
                )}
                <p className="text-sm text-green-700 mt-2">
                  입장 시 QR코드를 제시해주세요.
                </p>
              </div>

              {paymentResult.qrImageUrl && (
                <div className="text-center">
                  <h3 className="font-medium mb-2">QR 코드</h3>
                  <img 
                    src={paymentResult.qrImageUrl} 
                    alt="입장권 QR 코드" 
                    className="mx-auto max-w-48 h-auto border rounded-lg"
                  />
                </div>
              )}
            </>
          )}

          {paymentResult?.error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-medium text-red-800 mb-2">❌ 오류 상세</h3>
              <p className="text-sm text-red-700">{paymentResult.error}</p>
              <p className="text-xs text-red-600 mt-2">
                문제가 지속되면 고객센터로 문의해주세요.
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button 
              onClick={() => router.push('/')}
              variant="outline"
              className="flex-1"
            >
              홈으로
            </Button>
            {paymentResult?.success ? (
              <Button 
                onClick={() => router.push('/reservation-check')}
                className="flex-1"
              >
                예약 확인
              </Button>
            ) : (
              <Button 
                onClick={() => router.push('/purchase')}
                className="flex-1"
              >
                다시 시도
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/**
 * 빌게이트 결제 완료 후 리턴 페이지
 * 결제창에서 결제 완료 후 사용자가 리디렉션되는 페이지
 */
export default function PaymentReturnPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Loader2 className="h-16 w-16 text-blue-500 animate-spin" />
            </div>
            <CardTitle className="text-xl">페이지 로딩 중...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    }>
      <PaymentReturnContent />
    </Suspense>
  )
} 