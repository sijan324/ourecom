
import React, { useState } from 'react';

const EsewaPayment = ({ amount, onSuccess, onError, onCancel, orderDetails }) => {
  const [esewaId, setEsewaId] = useState('');
  const [mpin, setMpin] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!esewaId || !mpin) {
      setError('Please enter your eSewa ID and MPIN.');
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onSuccess({ esewaId, mpin });
    }, 1200);
  };

  return (
    <div className="esewa-payment">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-green-600 text-white px-6 py-3 rounded-lg text-xl font-bold">
              eSewa
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Pay with eSewa</h3>
          <p className="text-sm text-gray-600">Nepal's Digital Wallet</p>
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">Rs. {amount.toLocaleString()}</p>
            <p className="text-sm text-gray-500">Total Amount</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <div className="flex flex-col gap-2">
            <label className="font-medium text-gray-700">eSewa ID (Mobile Number)</label>
            <input
              type="text"
              className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400"
              placeholder="e.g. 9806800001"
              value={esewaId}
              onChange={e => setEsewaId(e.target.value)}
              disabled={isProcessing}
            />
            <button
              type="button"
              className="text-green-600 underline text-xs self-start"
              onClick={() => setShowQR(!showQR)}
              disabled={isProcessing}
            >
              {showQR ? 'Hide QR' : 'Scan QR instead'}
            </button>
            {showQR && (
              <div className="flex flex-col items-center mt-2">
                <img src="/esewa-qr-demo.png" alt="eSewa QR" className="w-32 h-32 border rounded" />
                <span className="text-xs text-gray-500 mt-1">(Simulated QR for test)</span>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-medium text-gray-700">MPIN</label>
            <input
              type="password"
              className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400"
              placeholder="e.g. 1234"
              value={mpin}
              onChange={e => setMpin(e.target.value)}
              disabled={isProcessing}
            />
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-xs text-yellow-700">
            <div><strong>Test Credentials:</strong></div>
            <div>eSewa ID: 9806800001 or 9806800002</div>
            <div>MPIN: 1234 (for test)</div>
          </div>
        </form>

        <div className="space-y-3">
          <button
            onClick={handleSubmit}
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
                Processing Payment...
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
        <div className="mt-4 text-xs text-gray-500 text-center">
          <p>🔒 Secured by eSewa's 256-bit SSL encryption</p>
          <p>Environment: Testing Mode (Simulated)</p>
        </div>
      </div>
    </div>
  );
};

export default EsewaPayment;
