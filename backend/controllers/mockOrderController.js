import { mockOrders, mockCartItems } from '../lib/mockData.js';

const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

export const createOrder = async (req, res) => {
  try {
    const { shippingInfo, paymentMethod, totalAmount } = req.body;
    const userId = req.user?.userId || 'guest';
    
    // Get cart items
    const cartItems = mockCartItems.get(userId) || [];
    
    if (cartItems.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }
    
    // Create order
    const order = {
      id: generateId(),
      _id: generateId(),
      user: userId,
      orderItems: cartItems.map(item => ({
        product: item.product,
        quantity: item.quantity,
        price: item.product.price
      })),
      shippingInfo,
      paymentMethod,
      totalAmount,
      orderStatus: 'pending',
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'completed',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    mockOrders.push(order);
    
    // Clear cart after order
    mockCartItems.set(userId, []);
    
    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user?.userId || 'guest';
    const userOrders = mockOrders.filter(order => order.user === userId);
    
    res.json({
      success: true,
      orders: userOrders
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = mockOrders.find(order => order.id === id || order._id === id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const orderIndex = mockOrders.findIndex(order => order.id === id || order._id === id);
    
    if (orderIndex === -1) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    mockOrders[orderIndex].orderStatus = status;
    mockOrders[orderIndex].updatedAt = new Date();
    
    res.json({
      success: true,
      message: 'Order status updated',
      order: mockOrders[orderIndex]
    });
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
