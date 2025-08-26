import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const api = import.meta.env.VITE_API_URL;

export const fetchProducts = createAsyncThunk('products/fetch', async (params, thunkAPI) => {
  try {
    const res = await axios.get(`${api}/products`, { params });
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message);
  }
});

export const fetchProduct = createAsyncThunk('products/fetchOne', async (id, thunkAPI) => {
  try {
    const res = await axios.get(`${api}/products/${id}`);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message);
  }
});

const productSlice = createSlice({
  name: 'products',
  initialState: { list: [], total: 0, product: null, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchProducts.fulfilled, (state, action) => { state.loading = false; state.list = action.payload.products; state.total = action.payload.total; })
      .addCase(fetchProducts.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchProduct.fulfilled, (state, action) => { state.product = action.payload; });
  },
});

export default productSlice.reducer;
