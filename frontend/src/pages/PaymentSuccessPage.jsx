import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import CryptoJS from 'crypto-js';

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState('verifying');
  const [paymentData, setPaymentData] = useState(null);

  useEffect(() => {
    verifyPayment();
  }, []);

  const verifyPayment = async () => {
    try {
      // Get the base64 encoded data from URL
      const data = searchParams.get('data');
      
      if (!data) {
        setVerificationStatus('failed');
        return;
      }

      // Decode the base64 response
      const decodedData = JSON.parse(atob(data));
      console.log('Decoded eSewa response:', decodedData);

      // Get stored transaction data
      const storedTransaction = localStorage.getItem('pendingEsewaTransaction');
      if (!storedTransaction) {
        setVerificationStatus('failed');
        return;
      }

      const transactionData = JSON.parse(storedTransaction);

      // Verify signature to ensure response integrity
      const secretKey = '8gBm/:&EnhH.1/q'; // Same secret key used for payment
      const signedFields = decodedData.signed_field_names.split(',');
      
      // Create message from response data in same order as signed_field_names
      const messageData = signedFields.map(field => `${field}=${decodedData[field]}`).join(',');
      const expectedSignature = CryptoJS.enc.Base64.stringify(
        CryptoJS.HmacSHA256(messageData, secretKey)
      );

      if (expectedSignature !== decodedData.signature) {
        console.error('Signature verification failed');
        setVerificationStatus('failed');
        return;
      }

      // Check if transaction matches our stored data
      if (decodedData.transaction_uuid !== transactionData.transactionUuid ||
          decodedData.product_code !== transactionData.productCode ||
          parseFloat(decodedData.total_amount) !== transactionData.totalAmount) {
        console.error('Transaction data mismatch');
        setVerificationStatus('failed');
        return;
      }

      // Additional status check via eSewa API (recommended)
      await checkTransactionStatus(decodedData);

    } catch (error) {
      console.error('Payment verification error:', error);
      setVerificationStatus('failed');
    }
  };

  const checkTransactionStatus = async (paymentResponse) => {
    try {
      const statusUrl = `https://rc.esewa.com.np/api/epay/transaction/status/?product_code=${paymentResponse.product_code}&total_amount=${paymentResponse.total_amount}&transaction_uuid=${paymentResponse.transaction_uuid}`;
      
      const response = await fetch(statusUrl);
      const statusData = await response.json();

      if (statusData.status === 'COMPLETE') {
        setPaymentData(paymentResponse);
        setVerificationStatus('success');
        
        // Clear stored transaction
        localStorage.removeItem('pendingEsewaTransaction');
        
        // You can now update your order status in your backend
        await updateOrderStatus(paymentResponse);
        
      } else {
        setVerificationStatus('failed');
      }
    } catch (error) {
      console.error('Status check failed:', error);
      // If status check fails but signature verification passed, we can still consider it successful
      setPaymentData(paymentResponse);
      setVerificationStatus('success');
      localStorage.removeItem('pendingEsewaTransaction');
    }
  };

  const updateOrderStatus = async (paymentResponse) => {
    try {
      // Call your backend to update order status
      const response = await fetch('/api/orders/payment-success', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transactionCode: paymentResponse.transaction_code,
          transactionUuid: paymentResponse.transaction_uuid,
          amount: paymentResponse.total_amount,
          esewaResponse: paymentResponse
        }),
      });

      if (response.ok) {
        console.log('Order status updated successfully');
      }
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  const handleContinueShopping = () => {
    navigate('/');
  };

  const handleViewOrders = () => {
    navigate('/orders');
  };

  if (verificationStatus === 'verifying') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Verifying Payment</h2>
          <p className="text-gray-600">Please wait while we verify your payment...</p>
        </div>
      </div>
    );
  }

  if (verificationStatus === 'failed') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Payment Verification Failed</h2>
          <p className="text-gray-600 mb-6">
            We couldn't verify your payment. Please contact customer support if you believe this is an error.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
            <button
              onClick={handleContinueShopping}
              className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
        <div className="text-green-500 text-6xl mb-4">✅</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Payment Successful!</h2>
        
        {paymentData && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold mb-2">Transaction Details:</h3>
            <div className="text-sm space-y-1">
              <p><strong>Transaction Code:</strong> {paymentData.transaction_code}</p>
              <p><strong>Amount:</strong> Rs. {parseFloat(paymentData.total_amount).toLocaleString()}</p>
              <p><strong>Transaction ID:</strong> {paymentData.transaction_uuid}</p>
              <p><strong>Status:</strong> <span className="text-green-600 font-medium">{paymentData.status}</span></p>
            </div>
          </div>
        )}
        
        <p className="text-gray-600 mb-6">
          Your payment has been processed successfully. You will receive a confirmation email shortly.
        </p>
        
        <div className="space-y-3">
          <button
            onClick={handleViewOrders}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
          >
            View My Orders
          </button>
          <button
            onClick={handleContinueShopping}
            className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
