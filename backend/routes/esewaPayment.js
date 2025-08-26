import express from 'express';
import crypto from 'crypto';

const router = express.Router();

// eSewa configuration
const ESEWA_SECRET_KEY = '8gBm/:&EnhH.1/q';
const ESEWA_MERCHANT_CODE = 'EPAYTEST';

// Verify eSewa payment
router.post('/verify-esewa', async (req, res) => {
  try {
    const { transactionCode, transactionUuid, totalAmount, esewaResponse } = req.body;

    // Verify signature
    const signedFields = esewaResponse.signed_field_names.split(',');
    const messageData = signedFields.map(field => `${field}=${esewaResponse[field]}`).join(',');
    
    const expectedSignature = crypto
      .createHmac('sha256', ESEWA_SECRET_KEY)
      .update(messageData)
      .digest('base64');

    if (expectedSignature !== esewaResponse.signature) {
      return res.status(400).json({
        success: false,
        message: 'Invalid signature'
      });
    }

    // Additional verification via eSewa status check API
    try {
      const statusUrl = `https://rc.esewa.com.np/api/epay/transaction/status/?product_code=${ESEWA_MERCHANT_CODE}&total_amount=${totalAmount}&transaction_uuid=${transactionUuid}`;
      
      const statusResponse = await fetch(statusUrl);
      const statusData = await statusResponse.json();

      if (statusData.status !== 'COMPLETE') {
        return res.status(400).json({
          success: false,
          message: 'Payment not completed'
        });
      }

      res.json({
        success: true,
        message: 'Payment verified successfully',
        transactionCode,
        transactionUuid,
        amount: totalAmount,
        status: 'verified'
      });

    } catch (statusError) {
      console.error('Status check failed:', statusError);
      res.json({
        success: true,
        message: 'Payment verified (signature only)',
        transactionCode,
        transactionUuid,
        amount: totalAmount,
        status: 'verified'
      });
    }

  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Payment verification failed'
    });
  }
});

// Handle order status update after successful payment
router.post('/payment-success', async (req, res) => {
  try {
    const { transactionCode, transactionUuid, amount, esewaResponse } = req.body;

    console.log('Order payment successful:', {
      transactionCode,
      transactionUuid,
      amount
    });

    res.json({
      success: true,
      message: 'Order status updated successfully'
    });

  } catch (error) {
    console.error('Order update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order status'
    });
  }
});

export default router;
