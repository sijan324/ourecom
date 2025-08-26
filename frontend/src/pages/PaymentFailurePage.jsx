import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const PaymentFailurePage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Clear any pending transaction data
    localStorage.removeItem('pendingEsewaTransaction');
  }, []);

  const handleTryAgain = () => {
    navigate('/checkout');
  };

  const handleContinueShopping = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
        <div className="text-red-500 text-6xl mb-4">❌</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Payment Failed</h2>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700 text-sm">
            Your payment could not be processed. This might happen due to:
          </p>
          <ul className="text-red-600 text-sm mt-2 text-left list-disc list-inside">
            <li>Insufficient balance in your eSewa account</li>
            <li>Payment was cancelled</li>
            <li>Network connectivity issues</li>
            <li>Invalid payment details</li>
          </ul>
        </div>
        
        <p className="text-gray-600 mb-6">
          Don't worry! Your order is still in your cart. You can try again or choose a different payment method.
        </p>
        
        <div className="space-y-3">
          <button
            onClick={handleTryAgain}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 font-medium"
          >
            Try Payment Again
          </button>
          <button
            onClick={() => navigate('/cart')}
            className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 font-medium"
          >
            View Cart
          </button>
          <button
            onClick={handleContinueShopping}
            className="w-full text-gray-600 py-2 px-4 rounded-lg hover:text-gray-800"
          >
            Continue Shopping
          </button>
        </div>
        
        <div className="mt-6 text-xs text-gray-500">
          <p>Need help? Contact our customer support</p>
          <p>📞 +977-9800000000 | 📧 support@ourecom.com</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailurePage;
