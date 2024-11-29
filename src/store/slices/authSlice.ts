import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { config } from '../../config/env';
import { toast } from 'react-hot-toast';

interface LoginResponse {
  meta: {
    status: boolean;
    message: string;
  };
  data: {
    status: boolean;
    message: string;
    id: number;
    new_user: boolean;
    otp_sent: boolean;
  };
}

interface VerifyOtpResponse {
  meta: {
    status: boolean;
    message: string;
  };
  data: {
    message: string;
    status: boolean;
    token: string;
    user: {
      id: number;
      email: string;
      mobile_number: string;
      name: string;
      company_id: number;
      user_types: Array<{ name: string }>;
      access_template_ids: number[];
    };
  };
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
  userProfile: UserProfile | null;
  pickupAddresses: PickupAddressResponse[];
  deliveryAddresses: DeliveryAddressResponse[];
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
  gst_address: {
    building: string;
    locality: string;
    city: string;
    state: string;
    area_code: string;
  };
}

interface UserProfile {
  _id: string;
  email: string;
  company_id: number;
  user_types: Array<{ name: string }>;
  is_active: boolean;
  id: number;
  otp: string;
  bank_details: {
    settlement_type: string;
    upi_address: string;
    beneficiary_name: string;
    settlement_bank_account_no: string;
    bank_name: string;
    settlement_ifsc_code: string;
  };
  gst_number: string;
  mobile_number: string;
  name: string;
  pan_number: string;
  store_name: string;
  draft_reasons: any[];
  gst_address: {
    building: string;
    locality: string;
    city: string;
    state: string;
    area_code: string;
  };
}

interface UserProfileResponse {
  meta: {
    status: boolean;
    message: string;
  };
  data: UserProfile;
}

interface PickupAddressPayload {
  person: {
    name: string;
  };
  contact: {
    phone: string;
    email: string;
  };
  location: {
    address: {
      name: string;
      building: string;
      locality: string;
      city: string;
      state: string;
      country: string;
      area_code: string;
    };
    gps: string;
  };
  provider_store_details: {
    time: {
      days: string;
      schedule: {
        holidays: string[];
      };
      range: {
        start: string;
        end: string;
      };
    };
  };
}

interface PickupAddressResponse {
  _id: string;
  person: {
    name: string;
  };
  contact: {
    phone: string;
    email: string;
  };
  location: {
    gps: string;
    address: {
      name: string;
      building: string;
      locality: string;
      city: string;
      state: string;
      area_code: string;
      country: string;
    };
  };
  provider_store_details: {
    time: {
      days: string;
      schedule: {
        holidays: string[];
      };
      range: {
        start: string;
        end: string;
      };
    };
  };
  id: number;
}

interface DeliveryAddressResponse {
  _id: string;
  person: {
    name: string;
  };
  contact: {
    phone: string;
    email: string;
  };
  location: {
    gps: string;
    address: {
      name: string;
      building: string;
      locality: string;
      city: string;
      state: string;
      area_code: string;
      country: string;
    };
  };
  id: number;
}

const initialState: AuthState = {
  loading: false,
  error: null,
  userId: null,
  otpSent: false,
  isNewUser: false,
  token: null,
  userProfile: null,
  pickupAddresses: [],
  deliveryAddresses: [],
};

export const initiateLogin = createAsyncThunk(
  'auth/initiateLogin',
  async (login: string, { rejectWithValue }) => {
    try {
      const response = await axios.post<LoginResponse>(
        `${config.apiBaseUrl}/auth/login`,
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
        `${config.apiBaseUrl}/auth/verify_otp`,
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
      const userId = localStorage.getItem('id');
      
      if (!token || !userId) {
        return rejectWithValue('No authentication token or user ID found');
      }

      const response = await axios.post(
        `${config.apiBaseUrl}/auth/${userId}/update`,
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

export const fetchUserProfile = createAsyncThunk(
  'auth/fetchUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      const userId = localStorage.getItem('id');
      const token = localStorage.getItem('token');
      
      if (!userId || !token) {
        return rejectWithValue('No user ID or token found');
      }

      const url = `${config.apiBaseUrl}/auth/get/${userId}`;
      console.log('Fetching profile from:', url);

      const response = await axios.get<UserProfileResponse>(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      console.log('Profile response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Profile fetch error:', error.response || error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user profile');
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'auth/updateUserProfile',
  async (userData: Partial<UserProfile>, { rejectWithValue }) => {
    try {
      const userId = localStorage.getItem('id');
      const token = localStorage.getItem('token');
      
      if (!userId || !token) {
        return rejectWithValue('No user ID or token found');
      }

      const response = await axios.post(
        `${config.apiBaseUrl}/auth/${userId}/update`,
        userData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
    }
  }
);

export const createPickupAddress = createAsyncThunk(
  'auth/createPickupAddress',
  async (addressData: PickupAddressPayload, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        return rejectWithValue('No authentication token found');
      }

      const response = await axios.post(
        `${config.apiBaseUrl}/pickup_address/create`,
        addressData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create pickup address');
    }
  }
);

export const fetchPickupAddresses = createAsyncThunk(
  'auth/fetchPickupAddresses',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue('No token found');
      }

      const response = await axios.get(
        `${config.apiBaseUrl}/pickup_address`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch pickup addresses');
    }
  }
);

export const fetchDeliveryAddresses = createAsyncThunk(
  'auth/fetchDeliveryAddresses',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue('No token found');
      }

      const response = await axios.get(
        `${config.apiBaseUrl}/delivery_address`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch delivery addresses');
    }
  }
);

export const createDeliveryAddress = createAsyncThunk(
  'auth/createDeliveryAddress',
  async (addressData: {
    person: {
      name: string;
    };
    contact: {
      phone: string;
      email: string;
    };
    location: {
      address: {
        name: string;
        building: string;
        locality: string;
        city: string;
        state: string;
        country: string;
        area_code: string;
      };
      gps: string;
    };
  }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        return rejectWithValue('No authentication token found');
      }

      const response = await axios.post(
        `${config.apiBaseUrl}/delivery_address/create`,
        addressData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create delivery address');
    }
  }
);

export const updatePickupAddress = createAsyncThunk(
  'auth/updatePickupAddress',
  async ({ id, addressData }: { id: string; addressData: PickupAddressPayload }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        return rejectWithValue('No authentication token found');
      }

      const response = await axios.post(
        `${config.apiBaseUrl}/pickup_address/${id}/update`,
        addressData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update pickup address');
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
        
        // Store id and new_user in localStorage
        localStorage.setItem('id', action.payload.data.id.toString());
        localStorage.setItem('new_user', action.payload.data.new_user.toString());
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
        localStorage.setItem('user_type', action.payload.data.user.user_types[0]?.name || '');
        localStorage.setItem('user_details', JSON.stringify({
          name: action.payload.data.user.name,
          email: action.payload.data.user.email,
          mobile_number: action.payload.data.user.mobile_number,
          company_id: action.payload.data.user.company_id
        }));
        localStorage.setItem('is_franchise', 
          (action.payload.data.user.user_types[0]?.name === 'FRANCHISE_USER').toString()
        );
        // Add new_user to localStorage here if not already set
        if (!localStorage.getItem('new_user')) {
          localStorage.setItem('new_user', (!action.payload.data.user.name).toString());
        }
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.userProfile = action.payload.data;
        state.error = null;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchPickupAddresses.fulfilled, (state, action) => {
        state.pickupAddresses = action.payload.data;
      })
      .addCase(fetchDeliveryAddresses.fulfilled, (state, action) => {
        state.deliveryAddresses = action.payload.data;
      })
      .addCase(createDeliveryAddress.fulfilled, (state, action) => {
        toast.success('Delivery address created successfully');
      })
      .addCase(createDeliveryAddress.rejected, (state, action) => {
        toast.error(action.payload as string || 'Failed to create delivery address');
      });
  },
});

export const { resetAuth } = authSlice.actions;
export default authSlice.reducer; 