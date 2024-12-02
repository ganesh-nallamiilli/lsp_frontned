import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { config } from '../../config/env';

interface BillingData {
  _id: string;
  network_transaction_id: string;
  createdAt: string;
  order_created_date: string;
  payment_reference_id: string;
  total_amount: string;
  payment_status: string;
  refund_amount?: string;
  refund_status?: string;
  refund_reference_id?: string;
  cancellation_fee?: string;
  fulfillment_state?: string;
  cancellation_reason?: string;
  cancelled_by?: string;
  cancelled_date?: string;
  company_id: number;
  created_by_id: number;
  created_by_details: any;
  updatedAt: string;
  id: number;
}

interface BillingState {
  data: BillingData[];
  loading: boolean;
  error: string | null;
}

const initialState: BillingState = {
  data: [],
  loading: false,
  error: null,
};

export const fetchBillingData = createAsyncThunk(
  'billing/fetchBillingData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${config.apiBaseUrl}/user_payments?per_page=10&page_no=1`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch billing data');
    }
  }
);

const billingSlice = createSlice({
  name: 'billing',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBillingData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBillingData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchBillingData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default billingSlice.reducer; 