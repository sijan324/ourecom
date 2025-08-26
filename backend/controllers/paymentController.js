// eSewa payment controller
import axios from 'axios';
import { prisma } from '../lib/prisma.js';

// Initiate eSewa payment (sandbox)
export const initiatePayment = async (req, res) => {
  try {
    const { orderId, amount } = req.body;
    
    const order = await prisma.order.findUnique({
      where: { id: orderId }
    });
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // eSewa sandbox endpoint
    const url = process.env.ESEWA_ENV === 'live'
      ? 'https://epay.esewa.com.np/api/epay/main/v2/process'
      : 'https://rc-epay.esewa.com.np/api/epay/main/v2/process';
      
    const payload = {
      amt: amount,
      psc: 0,
      pdc: 0,
      txAmt: 0,
      tAmt: amount,
      pid: orderId,
      scd: process.env.ESEWA_MERCHANT_CODE,
      su: `${process.env.FRONTEND_URL}/payment/success?oid=${orderId}`,
      fu: `${process.env.FRONTEND_URL}/payment/fail?oid=${orderId}`
    };
    
    res.json({ url, payload });
  } catch (error) {
    console.error('Initiate payment error:', error);
    res.status(500).json({ message: 'Error initiating payment' });
  }
};

// Verify eSewa payment
export const verifyPayment = async (req, res) => {
  try {
    const { orderId, refId } = req.body;
    
    const order = await prisma.order.findUnique({
      where: { id: orderId }
    });
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // eSewa verify endpoint
    const url = process.env.ESEWA_ENV === 'live'
      ? 'https://epay.esewa.com.np/api/epay/main/v2/record'
      : 'https://rc-epay.esewa.com.np/api/epay/main/v2/record';
      
    const verifyRes = await axios.post(url, {
      amt: order.totalPrice,
      rid: refId,
      pid: orderId,
      scd: process.env.ESEWA_MERCHANT_CODE
    });
    
    if (verifyRes.data.status === 'COMPLETE') {
      const updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: {
          isPaid: true,
          paidAt: new Date(),
          paymentResult: JSON.stringify(verifyRes.data)
        }
      });
      
      return res.json({ success: true, order: updatedOrder });
    }
    
    res.status(400).json({ success: false, message: 'Payment not verified' });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(400).json({ success: false, message: 'Verification failed' });
  }
};
