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

interface RTOFilters {
  search?: string;
  category?: string;
  provider?: string;
  fulfillment_state?: string;
  from_date?: string;
  to_date?: string;
  created_by?: string;
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
  async (filters: RTOFilters = {}, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      
      // Build query params
      const queryParams = new URLSearchParams({ rto: 'true' });
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

export const exportRTOOrders = createAsyncThunk(
  'rto/exportRTOOrders',
  async (filters: RTOFilters = {}, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      
      // Build query params with rto=true
      const queryParams = new URLSearchParams({ rto: 'true' });
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
      return rejectWithValue(error.response?.data?.message || 'Failed to export RTO orders');
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