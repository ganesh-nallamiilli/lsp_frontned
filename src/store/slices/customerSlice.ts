import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { config } from '../../config/env';
import { Customer } from '../../types/customer';

interface CustomerState {
  customers: Customer[];
  loading: boolean;
  error: string | null;
  pagination: {
    per_page: number;
    page_no: number;
    total_rows: number;
    total_pages: number;
  };
}

const initialState: CustomerState = {
  customers: [],
  loading: false,
  error: null,
  pagination: {
    per_page: 10,
    page_no: 1,
    total_rows: 0,
    total_pages: 0,
  },
};

export const fetchCustomers = createAsyncThunk(
  'customers/fetchCustomers',
  async ({ page, perPage, search }: { page: number; perPage: number; search?: string }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue('No authentication token found');
      }

      const queryParams = new URLSearchParams({
        per_page: perPage.toString(),
        page_no: page.toString(),
      });
      
      if (search) {
        queryParams.append('search', search);
      }

      const response = await axios.get(
        `${config.apiBaseUrl}/auth?${queryParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      return {
        data: response.data.data,
        pagination: response.data.meta.pagination,
      };
    } catch (error: any) {
      console.error('API Error:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch customers');
    }
  }
);

const customerSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.customers = [];
      });
  },
});

export default customerSlice.reducer; 