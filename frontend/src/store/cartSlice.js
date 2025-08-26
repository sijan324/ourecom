import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const api = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Async thunks for cart operations
export const fetchCart = createAsyncThunk('cart/fetch', async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().user.user?.token;
    if (!token) {
      // Return local cart for guests
      const localCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
      return { success: true, items: localCart };
    }
    const res = await axios.get(`${api}/cart`, { 
      headers: { Authorization: `Bearer ${token}` } 
    });
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to fetch cart');
  }
});

export const addToCart = createAsyncThunk('cart/add', async ({ productId, quantity = 1 }, thunkAPI) => {
  try {
    const token = thunkAPI.getState().user.user?.token;
    
    if (!token) {
      // Handle guest cart
      const productRes = await axios.get(`${api}/products/${productId}`);
      const product = productRes.data.product;
      
      const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
      const existingItemIndex = guestCart.findIndex(item => 
        (item.product.id || item.product._id) === productId
      );
      
      if (existingItemIndex >= 0) {
        guestCart[existingItemIndex].quantity += quantity;
      } else {
        guestCart.push({
          id: Date.now().toString(),
          product: product,
          quantity: quantity
        });
      }
      
      localStorage.setItem('guestCart', JSON.stringify(guestCart));
      return { success: true, items: guestCart };
    }
    
    const res = await axios.post(`${api}/cart/add`, { productId, quantity }, { 
      headers: { Authorization: `Bearer ${token}` } 
    });
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to add to cart');
  }
});

export const updateCartQuantity = createAsyncThunk(
  'cart/updateQuantity', 
  async ({ productId, quantity }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().user.user?.token;
      
      if (!token) {
        const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
        const itemIndex = guestCart.findIndex(item => 
          (item.product.id || item.product._id) === productId
        );
        
        if (itemIndex >= 0) {
          if (quantity <= 0) {
            guestCart.splice(itemIndex, 1);
          } else {
            guestCart[itemIndex].quantity = quantity;
          }
        }
        
        localStorage.setItem('guestCart', JSON.stringify(guestCart));
        return { success: true, items: guestCart };
      }
      
      const res = await axios.put(`${api}/cart/update/${productId}`, { quantity }, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to update quantity');
    }
  }
);

export const removeFromCart = createAsyncThunk('cart/remove', async (productId, thunkAPI) => {
  try {
    const token = thunkAPI.getState().user.user?.token;
    
    if (!token) {
      const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
      const updatedCart = guestCart.filter(item => 
        (item.product.id || item.product._id) !== productId
      );
      localStorage.setItem('guestCart', JSON.stringify(updatedCart));
      return { success: true, items: updatedCart };
    }
    
    const res = await axios.delete(`${api}/cart/remove/${productId}`, { 
      headers: { Authorization: `Bearer ${token}` } 
    });
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to remove from cart');
  }
});

export const clearCart = createAsyncThunk('cart/clear', async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().user.user?.token;
    
    if (!token) {
      localStorage.removeItem('guestCart');
      return { success: true, items: [] };
    }
    
    const res = await axios.delete(`${api}/cart/clear`, { 
      headers: { Authorization: `Bearer ${token}` } 
    });
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to clear cart');
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: { 
    items: [], 
    loading: false, 
    error: null,
    totalItems: 0,
    totalPrice: 0,
    shippingInfo: {
      address: '',
      city: '',
      postalCode: '',
      country: 'Nepal',
      phone: ''
    },
    paymentMethod: 'esewa'
  },
  reducers: {
    setShippingInfo: (state, action) => {
      state.shippingInfo = action.payload;
    },
    setPaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
    },
    calculateTotals: (state) => {
      state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
      state.totalPrice = state.items.reduce((total, item) => {
        const price = item.product?.price || 0;
        return total + (price * item.quantity);
      }, 0);
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => { 
        state.loading = true; 
        state.error = null; 
      })
      .addCase(fetchCart.fulfilled, (state, action) => { 
        state.loading = false; 
        state.items = action.payload.items || action.payload;
        cartSlice.caseReducers.calculateTotals(state);
      })
      .addCase(fetchCart.rejected, (state, action) => { 
        state.loading = false; 
        state.error = action.payload; 
      })
      .addCase(addToCart.pending, (state) => { 
        state.loading = true; 
        state.error = null; 
      })
      .addCase(addToCart.fulfilled, (state, action) => { 
        state.loading = false; 
        state.items = action.payload.items || action.payload;
        cartSlice.caseReducers.calculateTotals(state);
      })
      .addCase(addToCart.rejected, (state, action) => { 
        state.loading = false; 
        state.error = action.payload; 
      })
      .addCase(updateCartQuantity.fulfilled, (state, action) => { 
        state.items = action.payload.items || action.payload;
        cartSlice.caseReducers.calculateTotals(state);
      })
      .addCase(removeFromCart.fulfilled, (state, action) => { 
        state.items = action.payload.items || action.payload;
        cartSlice.caseReducers.calculateTotals(state);
      })
      .addCase(clearCart.fulfilled, (state, action) => { 
        state.items = action.payload.items || [];
        state.totalItems = 0;
        state.totalPrice = 0;
      });
  },
});

export const { setShippingInfo, setPaymentMethod, calculateTotals, clearError } = cartSlice.actions;
export default cartSlice.reducer;
