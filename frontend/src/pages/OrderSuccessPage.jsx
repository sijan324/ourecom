import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircleIcon, TruckIcon, ClockIcon } from '@heroicons/react/24/outline';

const OrderSuccessPage = () => {
  const location = useLocation();
  const order = location.state?.order;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NP', {
      style: 'currency',
      currency: 'NPR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Message */}
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center mb-8">
          <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Order Placed Successfully!
          </h1>
          <p className="text-gray-600 mb-6">
            Thank you for your order. We've received your order and will start processing it soon.
          </p>
          
          {order && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600">Order ID</p>
              <p className="text-lg font-mono font-medium text-gray-900">
                #{order.id || order._id}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="text-center">
              <ClockIcon className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <h3 className="font-medium text-gray-900">Processing</h3>
              <p className="text-sm text-gray-600">Order being prepared</p>
            </div>
            <div className="text-center">
              <TruckIcon className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <h3 className="font-medium text-gray-900">Shipping</h3>
              <p className="text-sm text-gray-600">2-5 business days</p>
            </div>
            <div className="text-center">
              <CheckCircleIcon className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <h3 className="font-medium text-gray-900">Delivered</h3>
              <p className="text-sm text-gray-600">Track your package</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/orders"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              View Order Details
            </Link>
            <Link
              to="/"
              className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>

        {/* Order Summary */}
        {order && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              {order.orderItems?.map((item, index) => (
                <div key={index} className="flex items-center space-x-4 py-4 border-b">
                  <img
                    src={item.product?.images?.[0] || '/api/placeholder/80/80'}
                    alt={item.product?.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-grow">
                    <h3 className="font-medium text-gray-900">{item.product?.name}</h3>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Total Amount</span>
                <span className="text-blue-600">{formatPrice(order.totalAmount)}</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Payment Method: {order.paymentMethod === 'esewa' ? 'eSewa' : 
                                order.paymentMethod === 'khalti' ? 'Khalti' : 
                                'Cash on Delivery'}
              </p>
            </div>
          </div>
        )}

        {/* What's Next */}
        <div className="bg-blue-50 rounded-2xl p-6 mt-8">
          <h3 className="text-lg font-medium text-blue-900 mb-4">What happens next?</h3>
          <ul className="space-y-2 text-blue-800">
            <li className="flex items-start">
              <span className="font-medium mr-2">1.</span>
              You'll receive an order confirmation email shortly
            </li>
            <li className="flex items-start">
              <span className="font-medium mr-2">2.</span>
              We'll prepare your order and notify you when it ships
            </li>
            <li className="flex items-start">
              <span className="font-medium mr-2">3.</span>
              Track your package using the tracking number we'll send
            </li>
            <li className="flex items-start">
              <span className="font-medium mr-2">4.</span>
              Enjoy your new items!
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
