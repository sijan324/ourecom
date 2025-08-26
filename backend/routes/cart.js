// Cart & wishlist routes
import express from 'express';
import { auth } from '../middleware/auth.js';

// Use mock controllers for now since database is unavailable
import { 
  getCart, 
  addToCart, 
  updateCartItem,
  removeFromCart, 
  clearCart,
  getWishlist, 
  addToWishlist, 
  removeFromWishlist 
} from '../controllers/mockCartController.js';

const router = express.Router();

// Cart routes
router.get('/', getCart);
router.post('/add', addToCart);
router.put('/update/:productId', updateCartItem);
router.delete('/remove/:productId', removeFromCart);
router.delete('/clear', clearCart);

// Wishlist routes
router.get('/wishlist', getWishlist);
router.post('/wishlist/add', addToWishlist);
router.delete('/wishlist/remove/:productId', removeFromWishlist);

export default router;
