import { mockCartItems, mockProducts, mockWishlistItems } from '../lib/mockData.js';

const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

export const getCart = async (req, res) => {
  try {
    const userId = req.user?.userId || 'guest';
    const cartItems = mockCartItems.get(userId) || [];
    
    res.json({
      success: true,
      items: cartItems
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const userId = req.user?.userId || 'guest';
    
    // Find product
    const product = mockProducts.find(p => p.id === productId || p._id === productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Get or create cart
    let cartItems = mockCartItems.get(userId) || [];
    
    // Check if item already exists
    const existingItemIndex = cartItems.findIndex(item => 
      (item.product.id || item.product._id) === productId
    );
    
    if (existingItemIndex >= 0) {
      // Update quantity
      cartItems[existingItemIndex].quantity += parseInt(quantity);
    } else {
      // Add new item
      cartItems.push({
        id: generateId(),
        product: product,
        quantity: parseInt(quantity),
        userId: userId,
        createdAt: new Date()
      });
    }
    
    mockCartItems.set(userId, cartItems);
    
    res.json({
      success: true,
      message: 'Item added to cart',
      items: cartItems
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    const userId = req.user?.userId || 'guest';
    
    let cartItems = mockCartItems.get(userId) || [];
    const itemIndex = cartItems.findIndex(item => 
      (item.product.id || item.product._id) === productId
    );
    
    if (itemIndex >= 0) {
      if (quantity <= 0) {
        cartItems.splice(itemIndex, 1);
      } else {
        cartItems[itemIndex].quantity = parseInt(quantity);
      }
      mockCartItems.set(userId, cartItems);
    }
    
    res.json({
      success: true,
      message: 'Cart updated',
      items: cartItems
    });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user?.userId || 'guest';
    
    let cartItems = mockCartItems.get(userId) || [];
    cartItems = cartItems.filter(item => 
      (item.product.id || item.product._id) !== productId
    );
    
    mockCartItems.set(userId, cartItems);
    
    res.json({
      success: true,
      message: 'Item removed from cart',
      items: cartItems
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const clearCart = async (req, res) => {
  try {
    const userId = req.user?.userId || 'guest';
    mockCartItems.set(userId, []);
    
    res.json({
      success: true,
      message: 'Cart cleared',
      items: []
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Wishlist functions
export const getWishlist = async (req, res) => {
  try {
    const userId = req.user?.userId || 'guest';
    const wishlistItems = mockWishlistItems.get(userId) || [];
    
    res.json({
      success: true,
      items: wishlistItems
    });
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user?.userId || 'guest';
    
    // Find product
    const product = mockProducts.find(p => p.id === productId || p._id === productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    let wishlistItems = mockWishlistItems.get(userId) || [];
    
    // Check if already in wishlist
    const exists = wishlistItems.some(item => 
      (item.product.id || item.product._id) === productId
    );
    
    if (!exists) {
      wishlistItems.push({
        id: generateId(),
        product: product,
        userId: userId,
        createdAt: new Date()
      });
      mockWishlistItems.set(userId, wishlistItems);
    }
    
    res.json({
      success: true,
      message: 'Item added to wishlist',
      items: wishlistItems
    });
  } catch (error) {
    console.error('Add to wishlist error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user?.userId || 'guest';
    
    let wishlistItems = mockWishlistItems.get(userId) || [];
    wishlistItems = wishlistItems.filter(item => 
      (item.product.id || item.product._id) !== productId
    );
    
    mockWishlistItems.set(userId, wishlistItems);
    
    res.json({
      success: true,
      message: 'Item removed from wishlist',
      items: wishlistItems
    });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
