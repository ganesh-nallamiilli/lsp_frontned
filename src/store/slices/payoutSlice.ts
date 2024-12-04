import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { config } from '../../config/env';

interface PayoutItem {
  network_transaction_id: string;
  order_create_date: string;
  order_created_time: string;
  payment_status: string;
  settlement_status: string;
  total_shipping_charge: string;
  merchant_payable_amount: string;
  platform_charges: string;
  razorpay_order_id: string;
  // Add other fields as needed
}

interface PayoutState {
  items: PayoutItem[];
  loading: boolean;
  error: string | null;
  pagination: {
    per_page: number;
    page_no: number;
    total_rows: number;
    total_pages: number;
  };
}

const initialState: PayoutState = {
  items: [],
  loading: false,
  error: null,
  pagination: {
    per_page: 10,
    page_no: 1,
    total_rows: 0,
    total_pages: 0,
  },
};

export const fetchPayouts = createAsyncThunk(
  'payouts/fetchPayouts',
  async ({ page = 1, perPage = 10 }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${config.apiBaseUrl}/payout?per_page=${perPage}&page_no=${page}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch payouts');
    }
  }
);

const payoutSlice = createSlice({
  name: 'payouts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPayouts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPayouts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.pagination = action.payload.meta.pagination;
      })
      .addCase(fetchPayouts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default payoutSlice.reducer;