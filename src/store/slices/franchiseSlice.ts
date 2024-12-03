import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { config } from '../../config/env';

interface FranchisePayload {
  name: string;
  mobile_number: string;
  email: string;
  store_name: string;
  profile_image: string;
  gst_number: string;
  pan_number: string;
  name_as_per_pan: string;
  gst_address: {
    name: string;
    locality: string;
    building: string;
    city: string;
    state: string;
    area_code: string;
    country: string;
  };
  user_types: Array<{ name: string }>;
  access_template_ids: number[];
  is_active: boolean;
  bank_details: {
    settlement_type: string;
    beneficiary_name: string;
    upi_address: string;
    settlement_bank_account_no: string;
    settlement_ifsc_code: string;
    bank_name: string;
  };
  draft_reasons: any[];
  wallet: {
    total_credit: string;
    total_debit: string;
    total_available: string;
  };
  is_franchise: boolean;
}

interface FranchiseState {
  loading: boolean;
  error: string | null;
}

const initialState: FranchiseState = {
  loading: false,
  error: null,
};

interface FranchiseResponse {
  data: {
    id: number;
    // ... other response fields
  };
}

export const createFranchise = createAsyncThunk(
  'franchise/createFranchise',
  async (franchiseData: FranchisePayload, { rejectWithValue }) => {
    try {
      const response = await axios.post<FranchiseResponse>(
        `${config.apiBaseUrl}/auth/create`,
        franchiseData,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create franchise');
    }
  }
);

interface MarkupPayload {
  category_type: string;
  markup_type: string;
  markup_value: number;
  created_by_id: number;
}

export const createMarkup = createAsyncThunk(
  'franchise/createMarkup',
  async (markupData: MarkupPayload, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${config.apiBaseUrl}/np_markup/create`,
        markupData,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create markup');
    }
  }
);

const franchiseSlice = createSlice({
  name: 'franchise',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createFranchise.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createFranchise.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createFranchise.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default franchiseSlice.reducer; 