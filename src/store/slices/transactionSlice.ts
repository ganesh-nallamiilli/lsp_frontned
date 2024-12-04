import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { config } from '../../config/env';

interface Transaction {
  _id: string;
  order_transaction_id: string;
  short_description: string;
  transaction_type: string;
  usage_type: string;
  shipping_charge: string;
  rto_charge: string;
  credit: string;
  debit: string;
  available: string;
  platform_charge?: string;
  platform_charge_amount?: string;
  gst_platform_charge?: string;
  total_platform_charge?: string;
  user_id: number;
  company_id: number;
  createdAt: string;
  updatedAt: string;
  id: number;
}

interface TransactionState {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  pagination: {
    per_page: number;
    page_no: number;
    total_rows: number;
    total_pages: number;
  };
}

interface FetchTransactionsParams {
  per_page?: number;
  page_no?: number;
  search?: string;
  from_date?: string;
  to_date?: string;
  transaction_type?: string;
}

const initialState: TransactionState = {
  transactions: [],
  loading: false,
  error: null,
  pagination: {
    per_page: 10,
    page_no: 1,
    total_rows: 0,
    total_pages: 0,
  },
};

export const fetchTransactions = createAsyncThunk(
  'transactions/fetchTransactions',
  async (params: FetchTransactionsParams = {}, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      
      const queryParams = new URLSearchParams({
        per_page: (params.per_page || 10).toString(),
        page_no: (params.page_no || 1).toString(),
      });

      if (params.search) queryParams.append('search', params.search);
      if (params.from_date) queryParams.append('from_date', params.from_date);
      if (params.to_date) queryParams.append('to_date', params.to_date);
      if (params.transaction_type) queryParams.append('transaction_type', params.transaction_type);

      const response = await axios.get(
        `${config.apiBaseUrl}/wallet?${queryParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch transactions');
    }
  }
);

export const exportTransactions = createAsyncThunk(
  'transactions/exportTransactions',
  async (filters: FetchTransactionsParams = {}, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      
      // Build query params
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });

      const response = await axios.get(
        `${config.apiBaseUrl}/wallet/download_csv?${queryParams.toString()}`,
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
      return rejectWithValue(error.response?.data?.message || 'Failed to export transactions');
    }
  }
);

const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload.data;
        state.pagination = action.payload.meta.pagination;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default transactionSlice.reducer; 