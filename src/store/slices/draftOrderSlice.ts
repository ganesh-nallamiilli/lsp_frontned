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
  async ({ page = 1, perPage = 10 }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get(
        `${config.apiBaseUrl}/draft_orders?per_page=${perPage}&page_no=${page}`,
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

export const bulkDeleteDraftOrders = createAsyncThunk(
  'draftOrders/bulkDelete',
  async (orderIds: string[], { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const payload = {
        data: orderIds.map(id => ({ id }))
      };

      const response = await axios.delete(
        `${config.apiBaseUrl}/draft_orders/bulk_delete`,
        {
          data: payload,
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
        || 'Failed to delete draft orders';
      
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchDraftOrderById = createAsyncThunk(
  'draftOrders/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      console.log('Fetching draft order:', id);
      console.log('API URL:', `${config.apiBaseUrl}/draft_orders/get/${id}`);

      const response = await axios.get(
        `${config.apiBaseUrl}/draft_orders/get/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('API Response:', response.data);

      if (!response.data) {
        throw new Error('No data received from API');
      }

      return response.data.data || response.data;
      
    } catch (error: any) {
      console.error('API Error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch draft order';
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

interface DraftOrderState {
  orders: any[];
  selectedDraftOrder: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: DraftOrderState = {
  orders: [],
  selectedDraftOrder: null,
  loading: false,
  error: null,
};

const draftOrderSlice = createSlice({
  name: 'draftOrders',
  initialState: initialState,
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
      })
      .addCase(bulkDeleteDraftOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bulkDeleteDraftOrders.fulfilled, (state) => {
        state.loading = false;
        toast.success('Draft orders deleted successfully');
      })
      .addCase(bulkDeleteDraftOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchDraftOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDraftOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedDraftOrder = action.payload;
        state.error = null;
      })
      .addCase(fetchDraftOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default draftOrderSlice.reducer; 