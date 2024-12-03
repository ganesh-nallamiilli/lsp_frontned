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

interface Franchise {
  franchiseName: string;
  ownerName: string;
  email: string;
  mobile: string;
  panNumber: string;
  createDate: string;
  status: boolean;
}

interface MarkupDetail {
  shipping_service_type: string;
  markup_type: string;
  markup_value: number;
}

interface FranchiseState {
  franchises: Franchise[];
  loading: boolean;
  error: string | null;
  currentFranchise: Franchise | null;
  markupDetails: MarkupDetail[];
}

const initialState: FranchiseState = {
  franchises: [],
  loading: false,
  error: null,
  currentFranchise: null,
  markupDetails: [],
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

export const fetchFranchises = createAsyncThunk(
  'franchise/fetchFranchises',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${config.apiBaseUrl}/auth?is_franchise=true`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch franchises');
    }
  }
);

export const fetchFranchiseById = createAsyncThunk(
  'franchise/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${config.apiBaseUrl}/auth/get/${id}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch franchise details');
    }
  }
);

export const fetchMarkupDetails = createAsyncThunk(
  'franchise/fetchMarkupDetails',
  async (franchiseUserId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${config.apiBaseUrl}/np_markup?created_by_id=${franchiseUserId}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch markup details');
    }
  }
);

interface MarkupUpdatePayload {
  id: string;
  markupData: {
    category_type: string;
    markup_type: string;
    markup_value: number;
    created_by_id: number;
  };
}

export const updateMarkup = createAsyncThunk(
  'franchise/updateMarkup',
  async ({ id, markupData }: MarkupUpdatePayload, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${config.apiBaseUrl}/np_markup/${id}/update`,
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
      return rejectWithValue(error.response?.data?.message || 'Failed to update markup');
    }
  }
);

export const updateFranchise = createAsyncThunk(
  'franchise/updateFranchise',
  async ({ id, franchiseData }: { id: string; franchiseData: FranchisePayload }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/api/v1/lsp_backend/auth/${id}/update`,
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
      return rejectWithValue(error.response?.data?.message || 'Failed to update franchise');
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
      })
      .addCase(fetchFranchises.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFranchises.fulfilled, (state, action) => {
        state.loading = false;
        state.franchises = action.payload;
      })
      .addCase(fetchFranchises.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchFranchiseById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFranchiseById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentFranchise = action.payload;
      })
      .addCase(fetchFranchiseById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch franchise';
      })
      .addCase(fetchMarkupDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMarkupDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.markupDetails = action.payload;
      })
      .addCase(fetchMarkupDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateFranchise.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFranchise.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateFranchise.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateMarkup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMarkup.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateMarkup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default franchiseSlice.reducer; 