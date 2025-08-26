import React, { useState } from 'react';
import CryptoJS from 'crypto-js';

const EsewaPayment = ({ amount, onSuccess, onError, onCancel, orderDetails }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  
  // eSewa Configuration from environment
  const esewaConfig = {
    productCode: 'EPAYTEST', // Your merchant code
    secretKey: '8gBm/:&EnhH.1/q', // Your secret key
    successUrl: `${window.location.origin}/payment/success`,
    failureUrl: `${window.location.origin}/payment/failure`,
    // Use RC (testing) URL for development, change to production URL for live
    paymentUrl: 'https://rc-epay.esewa.com.np/api/epay/main/v2/form',
    statusCheckUrl: 'https://rc.esewa.com.np/api/epay/transaction/status/',
    environment: 'testing' // Change to 'production' for live
  };

  // Generate unique transaction UUID
  const generateTransactionUuid = () => {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substr(2, 6);
    return `${timestamp}-${random}`;
  };

  // Generate HMAC SHA256 signature
  const generateSignature = (message, secretKey) => {
    const hash = CryptoJS.HmacSHA256(message, secretKey);
    return CryptoJS.enc.Base64.stringify(hash);
  };

  // Create eSewa payment form and submit
  const initiateEsewaPayment = async () => {
    setIsProcessing(true);
    
    try {
      const transactionUuid = generateTransactionUuid();
      
      // Calculate amounts (following eSewa format)
      const productAmount = amount;
      const taxAmount = 0; // Set tax if applicable
      const productServiceCharge = 0; // Set service charge if applicable
      const productDeliveryCharge = 0; // Set delivery charge if applicable
      const totalAmount = productAmount + taxAmount + productServiceCharge + productDeliveryCharge;
      
      // Fields to be signed (in exact order as per eSewa documentation)
      const signedFieldNames = 'total_amount,transaction_uuid,product_code';
      
      // Create message for signature (values in same order as signed_field_names)
      const message = `total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=${esewaConfig.productCode}`;
      
      // Generate signature
      const signature = generateSignature(message, esewaConfig.secretKey);
      
      // Store transaction data for verification
      const transactionData = {
        transactionUuid,
        amount: productAmount,
        totalAmount,
        productCode: esewaConfig.productCode,
        orderDetails,
        timestamp: new Date().toISOString()
      };
      
      localStorage.setItem('pendingEsewaTransaction', JSON.stringify(transactionData));
      
      // Create form data
      const formData = {
        amount: productAmount.toString(),
        tax_amount: taxAmount.toString(),
        total_amount: totalAmount.toString(),
        transaction_uuid: transactionUuid,
        product_code: esewaConfig.productCode,
        product_service_charge: productServiceCharge.toString(),
        product_delivery_charge: productDeliveryCharge.toString(),
        success_url: esewaConfig.successUrl,
        failure_url: esewaConfig.failureUrl,
        signed_field_names: signedFieldNames,
        signature: signature
      };

      // Create and submit form to eSewa
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = esewaConfig.paymentUrl;
      
      // Add form fields
      Object.keys(formData).forEach(key => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = formData[key];
        form.appendChild(input);
      });
      
      // Submit form
      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);
      
      console.log('eSewa payment initiated:', {
        transactionUuid,
        totalAmount,
        signature
      });

    } catch (error) {
      console.error('eSewa payment initiation failed:', error);
      onError('Failed to initiate eSewa payment. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="esewa-payment">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
        <div className="text-center mb-6">
          {/* eSewa Logo */}
          <div className="flex items-center justify-center mb-4">
            <div className="bg-green-600 text-white px-6 py-3 rounded-lg text-xl font-bold">
              eSewa
            </div>
          </div>
          
          <h3 className="text-lg font-semibold text-gray-800">Pay with eSewa</h3>
          <p className="text-sm text-gray-600">Nepal's Digital Wallet</p>
          
          {/* Payment Amount */}
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">Rs. {amount.toLocaleString()}</p>
            <p className="text-sm text-gray-500">Total Amount</p>
          </div>
        </div>

        {/* Payment Information */}
        <div className="space-y-4 mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 mb-2">Payment Process:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• You will be redirected to eSewa's secure payment page</li>
              <li>• Login with your eSewa ID and password</li>
              <li>• Enter the 6-digit token (use <strong>123456</strong> for testing)</li>
              <li>• Confirm the payment to complete the transaction</li>
            </ul>
          </div>

          {orderDetails && (
            <div className="border rounded-lg p-3">
              <h4 className="font-medium text-gray-800 mb-2">Order Summary:</h4>
              <div className="text-sm text-gray-600">
                <p>Order ID: {orderDetails.orderId || 'Pending'}</p>
                <p>Items: {orderDetails.itemCount || 1} item(s)</p>
              </div>
            </div>
          )}

          {/* Test Credentials for Development */}
          {esewaConfig.environment === 'testing' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-medium text-yellow-800 mb-2">Test Credentials:</h4>
              <div className="text-sm text-yellow-700">
                <p><strong>eSewa ID:</strong> 9806800001 or 9806800002</p>
                <p><strong>Password:</strong> Nepal@123</p>
                <p><strong>Token:</strong> 123456 (always use this for testing)</p>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={initiateEsewaPayment}
            disabled={isProcessing}
            className={`w-full flex items-center justify-center py-3 px-4 rounded-lg font-medium transition-all ${
              isProcessing
                ? 'bg-gray-400 cursor-not-allowed text-white'
                : 'bg-green-600 hover:bg-green-700 text-white transform hover:scale-105'
            }`}
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Redirecting to eSewa...
              </>
            ) : (
              <>
                <span className="mr-2">🔒</span>
                Pay Rs. {amount.toLocaleString()} via eSewa
              </>
            )}
          </button>

          <button
            onClick={onCancel}
            className="w-full py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            disabled={isProcessing}
          >
            Cancel Payment
          </button>
        </div>

        {/* Security Notice */}
        <div className="mt-4 text-xs text-gray-500 text-center">
          <p>🔒 Secured by eSewa's 256-bit SSL encryption</p>
          <p>Environment: {esewaConfig.environment === 'testing' ? 'Testing Mode (RC)' : 'Production Mode'}</p>
        </div>
      </div>
    </div>
  );
};

export default EsewaPayment;
