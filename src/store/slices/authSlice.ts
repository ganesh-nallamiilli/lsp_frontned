import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

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

interface AuthState {
  loading: boolean;
  error: string | null;
  userId: number | null;
  otpSent: boolean;
  isNewUser: boolean;
}

const initialState: AuthState = {
  loading: false,
  error: null,
  userId: null,
  otpSent: false,
  isNewUser: false,
};

export const initiateLogin = createAsyncThunk(
  'auth/initiateLogin',
  async (login: string, { rejectWithValue }) => {
    try {
      const response = await axios.post<LoginResponse>(
        'http://localhost:8080/api/v1/lsp_backend/core_user/login',
        { login }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to initiate login');
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
      });
  },
});

export const { resetAuth } = authSlice.actions;
export default authSlice.reducer; 