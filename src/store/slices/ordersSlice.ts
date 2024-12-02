import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { config } from '../../config/env';
import { Order } from '../../types/orders';

interface OrdersState {
  orders: Order[];
  loading: boolean;
  error: string | null;
  pagination: PaginationMeta;
}

interface OrderFilters {
  search?: string;
  category?: string;
  provider?: string;
  fulfillment_state?: string;
  from_date?: string;
  to_date?: string;
  created_by?: string;
}

interface PaginationMeta {
  per_page: number;
  page_no: number;
  total_rows: number;
  total_pages: number;
}

interface DraftOrdersResponse {
  meta: {
    status: boolean;
    message: string;
    pagination: PaginationMeta;
  };
  data: Order[];
}

const initialState: OrdersState = {
  orders: [],
  loading: false,
  error: null,
  pagination: {
    per_page: 10,
    page_no: 1,
    total_rows: 0,
    total_pages: 0,
  },
};

export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (filters: OrderFilters = {}, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      
      // Build query params
      const queryParams = new URLSearchParams({
        per_page: '-1',
        page_no: '1'
      });
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
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders');
    }
  }
);

export const fetchDraftOrders = createAsyncThunk(
  'orders/fetchDraftOrders',
  async ({ page = 1, perPage = 10 }) => {
    const response = await fetch(
      `${config.apiBaseUrl}/draft_orders?per_page=${perPage}&page_no=${page}`
    );
    const data: DraftOrdersResponse = await response.json();
    return data;
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchDraftOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDraftOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.data;
        state.pagination = action.payload.meta.pagination;
      })
      .addCase(fetchDraftOrders.rejected, (state) => {
        state.loading = false;
        state.error = 'Failed to fetch draft orders';
      });
  },
});

export default ordersSlice.reducer; 