import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { config } from '../../config/env';

interface ShippingDetails {
  pending: number;
  searching_for_agent: number;
  agent_assigned: number;
  order_picked_up: number;
  out_for_delivery: number;
  order_delivered: number;
  cancelled: number;
  pickup_failed: number;
  pickup_rescheduled: number;
  in_transit: number;
  at_destination_hub: number;
  delivery_failed: number;
  delivery_rescheduled: number;
  total: number;
}

interface DashboardCounts {
  total_orders: number;
  total_orders_amount: string;
  total_rtos: number;
  total_returns: number;
  total_users: number;
  order_details: {
    accepted: number;
    completed: number;
    created: number;
    cancelled: number;
    InProgress: number;
  };
  total_wallet_count: string;
  total_platform_charge: string;
}

interface RTODetails {
  rto_initiated: number;
  rto_delivered: number;
  rto_disposed: number;
}

interface WalletDetails {
  total_credit: string;
  total_debit: string;
  total_available: string;
}

interface UserProfile {
  _id: string;
  name: string;
  company_id: number;
  mobile_number: string;
  profile_image: string;
  gst_number: string;
  pan_number: string;
  email: string;
  store_name: string;
  wallet: {
    total_credit: string;
    total_available: string;
  };
  // ... add other fields as needed
}

interface DashboardState {
  shippingDetails: ShippingDetails | null;
  dashboardCounts: DashboardCounts | null;
  rtoDetails: RTODetails | null;
  walletDetails: WalletDetails | null;
  userProfile: UserProfile | null;
  loading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  shippingDetails: null,
  dashboardCounts: null,
  rtoDetails: null,
  walletDetails: null,
  userProfile: null,
  loading: false,
  error: null,
};

export const fetchShippingDetails = createAsyncThunk(
  'dashboard/fetchShippingDetails',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${config.apiBaseUrl}/dashboard/shipping_details_count`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch shipping details');
    }
  }
);

export const fetchDashboardCounts = createAsyncThunk(
  'dashboard/fetchDashboardCounts',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${config.apiBaseUrl}/dashboard/count`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch dashboard counts');
    }
  }
);

export const fetchRTODetails = createAsyncThunk(
  'dashboard/fetchRTODetails',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${config.apiBaseUrl}/dashboard/rto_details_count`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch RTO details');
    }
  }
);

export const fetchWalletDetails = createAsyncThunk(
  'dashboard/fetchWalletDetails',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${config.apiBaseUrl}/wallet/get_user_wallet`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch wallet details');
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  'dashboard/fetchUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('id');
      
      if (!userId) {
        return rejectWithValue('No user ID found');
      }

      const response = await axios.get(
        `${config.apiBaseUrl}/auth/get/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user profile');
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchShippingDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchShippingDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.shippingDetails = action.payload.data;
      })
      .addCase(fetchShippingDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchDashboardCounts.fulfilled, (state, action) => {
        state.dashboardCounts = action.payload.data;
      })
      .addCase(fetchRTODetails.fulfilled, (state, action) => {
        state.rtoDetails = action.payload.data;
      })
      .addCase(fetchWalletDetails.fulfilled, (state, action) => {
        state.walletDetails = action.payload.data;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.userProfile = action.payload.data;
      });
  },
});

export default dashboardSlice.reducer; 