import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const api = import.meta.env.VITE_API_URL;

export const placeOrder = createAsyncThunk('orders/place', async (data, thunkAPI) => {
  try {
    const token = thunkAPI.getState().user.user?.token;
    const res = await axios.post(`${api}/orders`, data, { headers: { Authorization: `Bearer ${token}` } });
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message);
  }
});

export const fetchOrders = createAsyncThunk('orders/fetch', async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().user.user?.token;
    const res = await axios.get(`${api}/orders`, { 
      headers: token ? { Authorization: `Bearer ${token}` } : {} 
    });
    return res.data.orders || res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to fetch orders');
  }
});

const orderSlice = createSlice({
  name: 'orders',
  initialState: { list: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(placeOrder.fulfilled, (state, action) => { state.loading = false; })
      .addCase(placeOrder.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchOrders.fulfilled, (state, action) => { state.list = action.payload; });
  },
});

export default orderSlice.reducer;
