import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { config } from '../../config/env';


interface RTOOrder {
  id: string;
  customerName: string;
  orderNumber: string;
  status: string;
  createdAt: string;
  total: number;
  items: any[];
  shippingAddress: any;
}

interface RTOState {
  orders: RTOOrder[];
  loading: boolean;
  error: string | null;
}

const initialState: RTOState = {
  orders: [],
  loading: false,
  error: null,
};

export const fetchRTOOrders = createAsyncThunk(
  'rto/fetchRTOOrders',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${config.apiBaseUrl}/orders?rto=true`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("response.data",Array.isArray(response.data.data));
      if (!Array.isArray(response.data.data)) {
        return rejectWithValue('Invalid response format from server');
      }
      
      return response.data.data;
    } catch (error: any) {
      if (error.response) {
        return rejectWithValue(error.response.data?.message || 'Server error occurred');
      } else if (error.request) {
        return rejectWithValue('No response from server');
      } else {
        return rejectWithValue(error.message || 'Failed to fetch RTO orders');
      }
    }
  }
);

const rtoSlice = createSlice({
  name: 'rto',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRTOOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRTOOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchRTOOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default rtoSlice.reducer; 