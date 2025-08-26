import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  CreditCardIcon, 
  TruckIcon, 
  ShieldCheckIcon,
  CheckCircleIcon,
  PhoneIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';
import { clearCart } from '../store/cartSlice';
import EsewaPayment from '../components/EsewaPayment';
import axios from 'axios';

const EnhancedCheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalPrice, loading: cartLoading } = useSelector(state => state.cart);
  const { user } = useSelector(state => state.user);

  const [step, setStep] = useState(1);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [showEsewaPayment, setShowEsewaPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Nepal'
  });

  const [errors, setErrors] = useState({});
  
  const shippingCost = totalPrice > 2000 ? 0 : 100;
  const taxRate = 0.13;
  const tax = totalPrice * taxRate;
  const finalTotal = totalPrice + shippingCost + tax;

  useEffect(() => {
    // Don't redirect immediately - wait for cart to load
    if (!cartLoading && items.length === 0 && !orderPlaced) {
      navigate('/cart');
    }
  }, [cartLoading, items, navigate, orderPlaced]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Format phone number for Nepal (10 digits starting with 98)
    if (name === 'phone') {
      const cleaned = value.replace(/\D/g, '');
      const limited = cleaned.slice(0, 10);
      setFormData(prev => ({ ...prev, [name]: limited }));
    } else if (name === 'postalCode') {
      // Format postal code (5 digits)
      const cleaned = value.replace(/\D/g, '');
      const limited = cleaned.slice(0, 5);
      setFormData(prev => ({ ...prev, [name]: limited }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateStep = (stepNumber) => {
    const newErrors = {};
    
    if (stepNumber === 1) {
      // Name validations
      if (!formData.firstName.trim()) {
        newErrors.firstName = 'First name is required';
      } else if (formData.firstName.length < 2) {
        newErrors.firstName = 'First name must be at least 2 characters';
      }
      
      if (!formData.lastName.trim()) {
        newErrors.lastName = 'Last name is required';
      } else if (formData.lastName.length < 2) {
        newErrors.lastName = 'Last name must be at least 2 characters';
      }
      
      // Email validation
      if (!formData.email.trim()) {
        newErrors.email = 'Email address is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
      
      // Phone validation for Nepal
      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone number is required';
      } else if (!/^98\d{8}$/.test(formData.phone)) {
        newErrors.phone = 'Phone number must be 10 digits starting with 98';
      }
      
      // Address validation
      if (!formData.address.trim()) {
        newErrors.address = 'Street address is required';
      } else if (formData.address.length < 10) {
        newErrors.address = 'Please enter a complete address';
      }
      
      // City validation
      if (!formData.city) {
        newErrors.city = 'Please select your city';
      }
      
      // Postal code validation
      if (!formData.postalCode.trim()) {
        newErrors.postalCode = 'Postal code is required';
      } else if (!/^\d{5}$/.test(formData.postalCode)) {
        newErrors.postalCode = 'Postal code must be 5 digits';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handlePlaceOrder = async () => {
    if (paymentMethod === 'esewa') {
      setShowEsewaPayment(true);
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        shippingInfo: formData,
        paymentMethod,
        totalAmount: finalTotal,
        orderItems: items.map(item => ({
          product: item.product.id || item.product._id,
          quantity: item.quantity,
          price: item.product.price
        }))
      };

      const response = await axios.post('http://localhost:5000/api/orders', orderData);
      
      if (response.data.success) {
        setOrderPlaced(true);
        dispatch(clearCart());
        setTimeout(() => {
          navigate('/order-success', { state: { order: response.data.order } });
        }, 2000);
      }
    } catch (error) {
      console.error('Order placement failed:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEsewaSuccess = async (paymentData) => {
    setLoading(true);
    try {
      const orderData = {
        shippingInfo: formData,
        paymentMethod: 'esewa',
        totalAmount: finalTotal,
        paymentDetails: paymentData,
        orderItems: items.map(item => ({
          product: item.product.id || item.product._id,
          quantity: item.quantity,
          price: item.product.price
        }))
      };

      const response = await axios.post('http://localhost:5000/api/orders', orderData);
      
      if (response.data.success) {
        setOrderPlaced(true);
        dispatch(clearCart());
        setShowEsewaPayment(false);
        setTimeout(() => {
          navigate('/order-success', { state: { order: response.data.order } });
        }, 2000);
      }
    } catch (error) {
      console.error('Order placement failed:', error);
      alert('Payment successful but order creation failed. Please contact support.');
    } finally {
      setLoading(false);
    }
  };

  const handleEsewaFailure = () => {
    setShowEsewaPayment(false);
    alert('Payment failed. Please try again.');
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NP', {
      style: 'currency',
      currency: 'NPR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (showEsewaPayment) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-md mx-auto">
          <div className="mb-4">
            <button
              onClick={() => setShowEsewaPayment(false)}
              className="text-blue-600 hover:text-blue-800 flex items-center"
            >
              ← Back to Checkout
            </button>
          </div>
          <EsewaPayment
            amount={finalTotal}
            orderDetails={{
              orderId: Date.now(),
              itemCount: items.length,
              totalAmount: finalTotal,
              tax: tax
            }}
            onSuccess={handleEsewaSuccess}
            onError={handleEsewaFailure}
            onCancel={() => setShowEsewaPayment(false)}
          />
        </div>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md w-full mx-4">
          <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h2>
          <p className="text-gray-600 mb-4">Thank you for your order. You will receive a confirmation email shortly.</p>
          <div className="animate-pulse text-blue-600">Redirecting to order confirmation...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {cartLoading ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading cart...</span>
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                  step >= stepNumber ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div className={`w-16 h-1 mx-2 ${
                    step > stepNumber ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-2 space-x-20">
            <span className="text-sm text-gray-600">Shipping</span>
            <span className="text-sm text-gray-600">Payment</span>
            <span className="text-sm text-gray-600">Review</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {step === 1 && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center justify-between">
                  <div className="flex items-center">
                    <TruckIcon className="h-6 w-6 mr-2 text-blue-600" />
                    Shipping Information
                  </div>
                  {/* Test Data Button */}
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      firstName: 'John',
                      lastName: 'Doe',
                      email: 'john.doe@example.com',
                      phone: '9876543210',
                      address: 'Thamel, Near Kathmandu Durbar High School',
                      city: 'Kathmandu',
                      postalCode: '44600'
                    }))}
                    className="text-sm bg-blue-100 text-blue-600 px-3 py-1 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    📝 Fill Test Data
                  </button>
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="Enter your first name"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                        errors.firstName ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.firstName && <span className="text-red-500 text-sm">{errors.firstName}</span>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Enter your last name"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                        errors.lastName ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.lastName && <span className="text-red-500 text-sm">{errors.lastName}</span>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="example@email.com"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <PhoneIcon className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="98xxxxxxxx"
                        className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                          errors.phone ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                    </div>
                    {errors.phone && <span className="text-red-500 text-sm">{errors.phone}</span>}
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Street Address *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPinIcon className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Enter your full street address"
                        className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                          errors.address ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                    </div>
                    {errors.address && <span className="text-red-500 text-sm">{errors.address}</span>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City *
                    </label>
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                        errors.city ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select your city</option>
                      <option value="Kathmandu">Kathmandu</option>
                      <option value="Lalitpur">Lalitpur</option>
                      <option value="Bhaktapur">Bhaktapur</option>
                      <option value="Pokhara">Pokhara</option>
                      <option value="Chitwan">Chitwan</option>
                      <option value="Butwal">Butwal</option>
                      <option value="Biratnagar">Biratnagar</option>
                      <option value="Dharan">Dharan</option>
                      <option value="Hetauda">Hetauda</option>
                      <option value="Janakpur">Janakpur</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.city && <span className="text-red-500 text-sm">{errors.city}</span>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Postal Code *
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      placeholder="44600"
                      maxLength="5"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                        errors.postalCode ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.postalCode && <span className="text-red-500 text-sm">{errors.postalCode}</span>}
                  </div>
                </div>

                {/* Additional Information Section */}
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="font-medium text-blue-800 mb-2">📋 Delivery Information</h3>
                  <div className="text-sm text-blue-700 space-y-1">
                    <p>• Please ensure your phone number is active for delivery coordination</p>
                    <p>• Delivery time: 2-5 business days within Kathmandu Valley</p>
                    <p>• Outside valley: 5-10 business days</p>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <CreditCardIcon className="h-6 w-6 mr-2 text-blue-600" />
                  Payment Method
                </h2>
                
                <div className="space-y-4">
                  <div className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                    paymentMethod === 'esewa' ? 'border-green-500 bg-green-50' : 'border-gray-200'
                  }`} onClick={() => setPaymentMethod('esewa')}>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        value="esewa"
                        checked={paymentMethod === 'esewa'}
                        onChange={() => setPaymentMethod('esewa')}
                        className="text-green-600"
                      />
                      <div className="ml-3">
                        <div className="font-medium">eSewa</div>
                        <div className="text-sm text-gray-500">Pay securely with eSewa digital wallet</div>
                      </div>
                      <div className="ml-auto bg-green-600 text-white px-3 py-1 rounded text-sm font-medium">
                        eSewa
                      </div>
                    </div>
                  </div>
                  
                  <div className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                    paymentMethod === 'khalti' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'
                  }`} onClick={() => setPaymentMethod('khalti')}>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        value="khalti"
                        checked={paymentMethod === 'khalti'}
                        onChange={() => setPaymentMethod('khalti')}
                        className="text-purple-600"
                      />
                      <div className="ml-3">
                        <div className="font-medium">Khalti</div>
                        <div className="text-sm text-gray-500">Pay with Khalti digital wallet</div>
                      </div>
                      <div className="ml-auto bg-purple-600 text-white px-3 py-1 rounded text-sm font-medium">
                        Khalti
                      </div>
                    </div>
                  </div>
                  
                  <div className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                    paymentMethod === 'cod' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`} onClick={() => setPaymentMethod('cod')}>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        value="cod"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                        className="text-blue-600"
                      />
                      <div className="ml-3">
                        <div className="font-medium">Cash on Delivery</div>
                        <div className="text-sm text-gray-500">Pay when you receive your order</div>
                      </div>
                      <div className="ml-auto bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium">
                        COD
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <ShieldCheckIcon className="h-6 w-6 mr-2 text-blue-600" />
                  Review Order
                </h2>
                
                {/* Shipping Details */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium mb-2 flex items-center">
                    <MapPinIcon className="h-5 w-5 mr-2" />
                    Shipping Address
                  </h3>
                  <p className="text-sm text-gray-600">
                    {formData.firstName} {formData.lastName}<br />
                    {formData.address}<br />
                    {formData.city}, {formData.postalCode}<br />
                    {formData.country}<br />
                    <PhoneIcon className="h-4 w-4 inline mr-1" />
                    {formData.phone}
                  </p>
                </div>
                
                {/* Payment Method */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium mb-2 flex items-center">
                    <CreditCardIcon className="h-5 w-5 mr-2" />
                    Payment Method
                  </h3>
                  <p className="text-sm text-gray-600 capitalize">
                    {paymentMethod === 'esewa' ? 'eSewa Digital Wallet' : 
                     paymentMethod === 'khalti' ? 'Khalti Digital Wallet' : 
                     'Cash on Delivery'}
                  </p>
                </div>
                
                {/* Order Items */}
                <div className="space-y-4">
                  <h3 className="font-medium">Order Items</h3>
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <img
                        src={item.product.images?.[0] || '/api/placeholder/100/100'}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-grow">
                        <h4 className="font-medium">{item.product.name}</h4>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        <p className="text-sm text-gray-600">Unit Price: {formatPrice(item.product.price)}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatPrice(item.product.price * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-between mt-6">
              {step > 1 && (
                <button
                  onClick={() => setStep(step - 1)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Back
                </button>
              )}
              
              {step < 3 ? (
                <button
                  onClick={handleNextStep}
                  className="ml-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Continue
                </button>
              ) : (
                <button
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className={`ml-auto px-8 py-3 rounded-lg font-medium ${
                    paymentMethod === 'esewa' 
                      ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800' 
                      : paymentMethod === 'khalti'
                      ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800'
                      : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
                  } text-white`}
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                      Processing...
                    </div>
                  ) : paymentMethod === 'esewa' ? (
                    'Pay with eSewa'
                  ) : paymentMethod === 'khalti' ? (
                    'Pay with Khalti'
                  ) : (
                    'Place Order'
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal ({items.length} items)</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className={shippingCost === 0 ? 'text-green-600' : ''}>
                    {shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (13%)</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <hr />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-blue-600">{formatPrice(finalTotal)}</span>
                </div>
              </div>
              
              <div className="mt-6 space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <ShieldCheckIcon className="h-4 w-4 mr-2 text-green-500" />
                  Secure checkout
                </div>
                <div className="flex items-center">
                  <TruckIcon className="h-4 w-4 mr-2 text-blue-500" />
                  Free shipping on orders over Rs. 2000
                </div>
                {totalPrice < 2000 && (
                  <div className="text-orange-600 text-xs">
                    Add {formatPrice(2000 - totalPrice)} more for free shipping!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedCheckoutPage;
