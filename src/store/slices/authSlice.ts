import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { config } from '../../config/env';

interface LoginResponse {
  data: {
    id: number;
    message: string;
    new_user: boolean;
    otp_sent: boolean;
    status: boolean;
  };
  status: boolean;
}

interface VerifyOtpResponse {
  data: {
    new_user: boolean;
    status: boolean;
    token: string;
    verified: boolean;
    user_data: {
      _id: number;
      company_id: number;
      email: string;
      mobile_number: string;
      name: string;
      user_types: Array<{ name: string }>;
      // ... other user data fields
    };
  };
  status: boolean;
}

interface VerifyOtpPayload {
  id: number;
  otp: string;
}

interface AuthState {
  loading: boolean;
  error: string | null;
  userId: number | null;
  otpSent: boolean;
  isNewUser: boolean;
  token: string | null;
}

interface UserData {
  email?: string;
  mobile_number?: string;
}

interface RegistrationPayload {
  store_name: string;
  gst_number: string;
  pan_number: string;
  name: string;
  mobile_number: string;
  email: string;
  address: {
    building: string;
    locality: string;
    city: string;
    state: string;
    area_code: string;
  };
}

const initialState: AuthState = {
  loading: false,
  error: null,
  userId: null,
  otpSent: false,
  isNewUser: false,
  token: null,
};

export const initiateLogin = createAsyncThunk(
  'auth/initiateLogin',
  async (login: string, { rejectWithValue }) => {
    try {
      const response = await axios.post<LoginResponse>(
        `${config.apiBaseUrl}/core_user/login`,
        { login }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to initiate login');
    }
  }
);

export const verifyOtp = createAsyncThunk(
  'auth/verifyOtp',
  async (payload: VerifyOtpPayload, { rejectWithValue }) => {
    try {
      const response = await axios.post<VerifyOtpResponse>(
        `${config.apiBaseUrl}/core_user/verify_otp`,
        payload
      );
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to verify OTP');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData: RegistrationPayload, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        return rejectWithValue('No authentication token found');
      }

      const response = await axios.post(
        `${config.apiBaseUrl}/core_user/user_onboarding`,
        userData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to register user');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetAuth: (state) => {
      state.loading = false;
      state.error = null;
      state.otpSent = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initiateLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(initiateLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.userId = action.payload.data.id;
        state.otpSent = action.payload.data.otp_sent;
        state.isNewUser = action.payload.data.new_user;
      })
      .addCase(initiateLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.data.token;
        
        // Store important data in localStorage
        localStorage.setItem('token', action.payload.data.token);
        localStorage.setItem('user_id', action.payload.data.user_data._id.toString());
        localStorage.setItem('user_type', action.payload.data.user_data.user_types[0]?.name || '');
        localStorage.setItem('user_details', JSON.stringify({
          name: action.payload.data.user_data.name,
          email: action.payload.data.user_data.email,
          mobile_number: action.payload.data.user_data.mobile_number,
          company_id: action.payload.data.user_data.company_id
        }));
        localStorage.setItem('is_franchise', 
          (action.payload.data.user_data.user_types[0]?.name === 'FRANCHISE_USER').toString()
        );
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetAuth } = authSlice.actions;
export default authSlice.reducer; 