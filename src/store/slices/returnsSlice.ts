import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { config } from '../../config/env';
import { Order } from '../../types/orders';

interface ReturnsState {
  orders: Order[];
  loading: boolean;
  error: string | null;
}

interface ReturnFilters {
  search?: string;
  category?: string;
  provider?: string;
  fulfillment_state?: string;
  from_date?: string;
  to_date?: string;
  created_by?: string;
}

const initialState: ReturnsState = {
  orders: [],
  loading: false,
  error: null,
};

export const fetchReturnOrders = createAsyncThunk(
  'returns/fetchReturnOrders',
  async (filters: ReturnFilters = {}, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      
      // Build query params
      const queryParams = new URLSearchParams({ return: 'true' });
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });

      const response = await axios.get(
        `${config.apiBaseUrl}/orders?${queryParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch return orders');
    }
  }
);

export const exportReturnOrders = createAsyncThunk(
  'returns/exportReturnOrders',
  async (filters: ReturnFilters = {}, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      
      // Build query params with return=true
      const queryParams = new URLSearchParams({ return: 'true' });
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });

      const response = await axios.get(
        `${config.apiBaseUrl}/orders/download_csv?${queryParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      // Download the file using the URL from the response
      const downloadUrl = response.data.data.url;
      window.open(downloadUrl, '_blank');
      
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to export return orders');
    }
  }
);

const returnsSlice = createSlice({
  name: 'returns',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReturnOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReturnOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchReturnOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default returnsSlice.reducer; 