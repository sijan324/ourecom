// Admin controller: analytics
import { prisma } from '../lib/prisma.js';

export const getAnalytics = async (req, res) => {
  try {
    const totalOrders = await prisma.order.count();
    
    const revenueResult = await prisma.order.aggregate({
      where: { isPaid: true },
      _sum: { totalPrice: true }
    });
    
    const totalUsers = await prisma.user.count();
    const totalProducts = await prisma.product.count();
    
    res.json({
      totalOrders,
      totalRevenue: revenueResult._sum.totalPrice || 0,
      totalUsers,
      totalProducts
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ message: 'Error fetching analytics' });
  }
};
