import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { config } from '../../config/env';

interface LookupCode {
  lookup_type: string;
  lookup_code: string;
  display_name: string;
  is_enabled: boolean;
  id: number;
}

interface User {
  id: string;
  name: string;
}

interface LookupCategory {
  lookup_type: string;
  lookup_code: string;
  display_name: string;
  is_enabled: boolean;
  id: number;
}

interface LookupState {
  categoryTypes: LookupCode[];
  fulfillmentStatuses: LookupCode[];
  providers: string[];
  users: User[];
  loading: boolean;
  error: string | null;
  retailOrderCategories: LookupCategory[];
  timeDurations: Array<{
    lookup_code: string;
    display_name: string;
    id: number;
  }>;
  rtoFulfillmentStatuses: LookupCode[];
}

const initialState: LookupState = {
  categoryTypes: [],
  fulfillmentStatuses: [],
  providers: [],
  users: [],
  loading: false,
  error: null,
  retailOrderCategories: [],
  timeDurations: [],
  rtoFulfillmentStatuses: [],
};

export const fetchCategoryTypes = createAsyncThunk(
  'lookup/fetchCategoryTypes',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${config.apiBaseUrl}/lookup_code/CATEGORY_TYPE`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch category types');
    }
  }
);

export const fetchFulfillmentStatuses = createAsyncThunk(
  'lookup/fetchFulfillmentStatuses',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${config.apiBaseUrl}/lookup_code/FULFILLMENT_STATUS`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch fulfillment statuses');
    }
  }
);

export const fetchProviders = createAsyncThunk(
  'lookup/fetchProviders',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${config.apiBaseUrl}/orders/all_seller_np`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch providers');
    }
  }
);

export const fetchUsers = createAsyncThunk(
  'lookup/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${config.apiBaseUrl}/orders/all_users?per_page=-1`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
    }
  }
);

export const fetchRetailOrderCategories = createAsyncThunk(
  'lookup/fetchRetailOrderCategories',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${config.apiBaseUrl}/lookup_code/RETAIL_ORDER_CATEGORIES`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch retail order categories');
    }
  }
);

export const fetchTimeDurations = createAsyncThunk(
  'lookup/fetchTimeDurations',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${config.apiBaseUrl}/lookup_code/TIME_DURATION`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch time durations');
    }
  }
);

export const fetchRTOFulfillmentStatuses = createAsyncThunk(
  'lookup/fetchRTOFulfillmentStatuses',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${config.apiBaseUrl}/lookup_code/CATEGORY_TYPE`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch RTO fulfillment statuses');
    }
  }
);

const lookupSlice = createSlice({
  name: 'lookup',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategoryTypes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategoryTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.categoryTypes = action.payload;
      })
      .addCase(fetchCategoryTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchFulfillmentStatuses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFulfillmentStatuses.fulfilled, (state, action) => {
        state.loading = false;
        state.fulfillmentStatuses = action.payload;
      })
      .addCase(fetchFulfillmentStatuses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchProviders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProviders.fulfilled, (state, action) => {
        state.loading = false;
        state.providers = action.payload;
      })
      .addCase(fetchProviders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchRetailOrderCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRetailOrderCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.retailOrderCategories = action.payload;
      })
      .addCase(fetchRetailOrderCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchTimeDurations.fulfilled, (state, action) => {
        state.timeDurations = action.payload;
      })
      .addCase(fetchRTOFulfillmentStatuses.fulfilled, (state, action) => {
        state.rtoFulfillmentStatuses = action.payload;
      });
  },
});

export default lookupSlice.reducer; 