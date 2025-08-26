import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const api = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const fetchWishlist = createAsyncThunk('wishlist/fetch', async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().user.user?.token;
    
    if (!token) {
      // Return local wishlist for guests
      const localWishlist = JSON.parse(localStorage.getItem('guestWishlist') || '[]');
      return { success: true, items: localWishlist };
    }
    
    const res = await axios.get(`${api}/cart/wishlist`, { 
      headers: { Authorization: `Bearer ${token}` } 
    });
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to fetch wishlist');
  }
});

export const addToWishlist = createAsyncThunk('wishlist/add', async ({ productId }, thunkAPI) => {
  try {
    const token = thunkAPI.getState().user.user?.token;
    
    if (!token) {
      // Handle guest wishlist
      const productRes = await axios.get(`${api}/products/${productId}`);
      const product = productRes.data.product;
      
      const guestWishlist = JSON.parse(localStorage.getItem('guestWishlist') || '[]');
      const exists = guestWishlist.some(item => 
        (item.product.id || item.product._id) === productId
      );
      
      if (!exists) {
        guestWishlist.push({
          id: Date.now().toString(),
          product: product
        });
        localStorage.setItem('guestWishlist', JSON.stringify(guestWishlist));
      }
      
      return { success: true, items: guestWishlist };
    }
    
    const res = await axios.post(`${api}/cart/wishlist/add`, { productId }, { 
      headers: { Authorization: `Bearer ${token}` } 
    });
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to add to wishlist');
  }
});

export const removeFromWishlist = createAsyncThunk('wishlist/remove', async (productId, thunkAPI) => {
  try {
    const token = thunkAPI.getState().user.user?.token;
    
    if (!token) {
      const guestWishlist = JSON.parse(localStorage.getItem('guestWishlist') || '[]');
      const updatedWishlist = guestWishlist.filter(item => 
        (item.product.id || item.product._id) !== productId
      );
      localStorage.setItem('guestWishlist', JSON.stringify(updatedWishlist));
      return { success: true, items: updatedWishlist };
    }
    
    const res = await axios.delete(`${api}/cart/wishlist/remove/${productId}`, { 
      headers: { Authorization: `Bearer ${token}` } 
    });
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to remove from wishlist');
  }
});

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: { 
    items: [], 
    loading: false, 
    error: null 
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => { 
        state.loading = true; 
        state.error = null; 
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => { 
        state.loading = false; 
        state.items = action.payload.items || action.payload; 
      })
      .addCase(fetchWishlist.rejected, (state, action) => { 
        state.loading = false; 
        state.error = action.payload; 
      })
      .addCase(addToWishlist.fulfilled, (state, action) => { 
        state.items = action.payload.items || action.payload; 
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => { 
        state.items = action.payload.items || action.payload; 
      });
  },
});

export const { clearError } = wishlistSlice.actions;
export default wishlistSlice.reducer;
