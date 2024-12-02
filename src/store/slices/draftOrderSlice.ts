import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { config } from '../../config/env';
import { toast } from 'react-hot-toast';

export const createDraftOrder = createAsyncThunk(
  'draftOrders/create',
  async (formData: any, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      console.log('Making API call with payload:', formData); // Debug log
      
      const response = await axios.post(
        `${config.apiBaseUrl}/draft_orders/create`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('API Response:', response.data); // Debug log
      return response.data;
      
    } catch (error: any) {
      console.error('API Error:', error.response || error); // Debug log
      
      const errorMessage = error.response?.data?.message 
        || error.message 
        || 'Failed to create draft order';
        
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchDraftOrders = createAsyncThunk(
  'draftOrders/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await axios.get(
        `${config.apiBaseUrl}/draft_orders`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
      
    } catch (error: any) {
      const errorMessage = error.response?.data?.message 
        || error.message 
        || 'Failed to fetch draft orders';
        
      return rejectWithValue(errorMessage);
    }
  }
);

const draftOrderSlice = createSlice({
  name: 'draftOrders',
  initialState: {
    orders: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createDraftOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log('Creating draft order...'); // Debug log
      })
      .addCase(createDraftOrder.fulfilled, (state, action) => {
        state.loading = false;
        console.log('Draft order created successfully:', action.payload); // Debug log
        toast.success('Draft order saved successfully');
      })
      .addCase(createDraftOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        console.error('Draft order creation failed:', action.payload); // Debug log
        toast.error(action.payload as string);
      })
      .addCase(fetchDraftOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDraftOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchDraftOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default draftOrderSlice.reducer; 