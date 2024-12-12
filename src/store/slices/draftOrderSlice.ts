import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { config } from '../../config/env';
import { toast } from 'react-hot-toast';

export const createDraftOrder = createAsyncThunk(
  'draftOrders/create',
  async (formData: any, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      console.log('Making API call with payload:', formData); // Debug log
      
      const response = await axios.post(
        `${config.apiBaseUrl}/draft_orders/create`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('API Response:', response.data); // Debug log
      return response.data;
      
    } catch (error: any) {
      console.error('API Error:', error.response || error); // Debug log
      
      const errorMessage = error.response?.data?.message 
        || error.message 
        || 'Failed to create draft order';
        
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchDraftOrders = createAsyncThunk(
  'draftOrders/fetch',
  async ({ page = 1, perPage = 10 }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get(
        `${config.apiBaseUrl}/draft_orders?per_page=${perPage}&page_no=${page}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
      
    } catch (error: any) {
      const errorMessage = error.response?.data?.message 
        || error.message 
        || 'Failed to fetch draft orders';
        
      return rejectWithValue(errorMessage);
    }
  }
);

export const bulkDeleteDraftOrders = createAsyncThunk(
  'draftOrders/bulkDelete',
  async (orderIds: string[], { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const payload = {
        data: orderIds.map(id => ({ id }))
      };

      const response = await axios.delete(
        `${config.apiBaseUrl}/draft_orders/bulk_delete`,
        {
          data: payload,
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message 
        || error.message 
        || 'Failed to delete draft orders';
      
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchDraftOrderById = createAsyncThunk(
  'draftOrders/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      console.log('Fetching draft order:', id);
      console.log('API URL:', `${config.apiBaseUrl}/draft_orders/get/${id}`);

      const response = await axios.get(
        `${config.apiBaseUrl}/draft_orders/get/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('API Response:', response.data);

      if (!response.data) {
        throw new Error('No data received from API');
      }

      return response.data.data || response.data;
      
    } catch (error: any) {
      console.error('API Error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch draft order';
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

interface LSPSearchPayload {
  context: {
    city: string;
    core_version: string;
    area_code: string;
  };
  message: {
    category_id: string;
    fulfillment_type: string;
    provider: {
      time: {
        days: string;
        schedule: {
          holidays: string[];
        };
        range: {
          start: string;
          end: string;
        };
        duration: string;
      };
    };
    fulfillment: {
      start: {
        gps: string;
        area_code: string;
      };
      end: {
        gps: string;
        area_code: string;
      };
    };
    payment: {
      type: string;
    };
    payload_details: {
      weight: number;
      weight_unit: string;
      length: number;
      length_unit: string;
      breadth: number;
      breadth_unit: string;
      height: number;
      height_unit: string;
    };
    product_category: string;
    value: {
      value: string;
      currency: string;
    };
    dangerous_goods: boolean;
  };
}

export const searchLSP = createAsyncThunk(
  'draftOrders/searchLSP',
  async (draftOrder: any, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const payload: LSPSearchPayload = {
        context: {
          city: draftOrder?.draft_order?.deliveryAddress?.city || '',
          core_version: "1.2.0",
          area_code: draftOrder?.draft_order?.deliveryAddress?.pincode || ''
        },
        message: {
          category_id: draftOrder?.draft_order?.orderDetails?.retail_order_category_type?.value || '',
          fulfillment_type: "Delivery",
          provider: {
            time: {
              days: "1,2,3,4,5,6,7",
              schedule: {
                holidays: []
              },
              range: {
                start: "0000",
                end: "2300"
              },
              duration: "PT45M"
            }
          },
          fulfillment: {
            start: {
              gps: draftOrder?.draft_order?.pickupAddress?.location?.gps || "12.9423572,77.696726",
              area_code: draftOrder?.draft_order?.pickupAddress?.pincode || "560103"
            },
            end: {
              gps: draftOrder?.draft_order?.deliveryAddress?.location?.gps || "12.9394125,77.68924140000001",
              area_code: draftOrder?.draft_order?.deliveryAddress?.pincode || ""
            }
          },
          payment: {
            type: draftOrder?.draft_order?.orderDetails?.retail_order_payment_method || ""
          },
          payload_details: {
            weight: draftOrder?.draft_order?.packageDetails?.weight?.value || 0,
            weight_unit: draftOrder?.draft_order?.packageDetails?.weight?.type || "",
            length: draftOrder?.draft_order?.packageDetails?.length || 0,
            length_unit: "centimeter",
            breadth: draftOrder?.draft_order?.packageDetails?.breadth || 0,
            breadth_unit: "centimeter",
            height: draftOrder?.draft_order?.packageDetails?.height || 0,
            height_unit: "centimeter"
          },
          product_category: draftOrder?.draft_order?.orderDetails?.retail_order_category?.value || "",
          value: {
            value: draftOrder?.draft_order?.orderDetails?.retail_order_amount?.toString() || "",
            currency: "INR"
          },
          dangerous_goods: false
        }
      };

      const response = await axios.post(
        `http://20.197.4.12:3008/api/v1/ondc/lsp_bap/clientApis/msn_search`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to search LSP');
    }
  }
);

interface DraftOrderState {
  orders: any[];
  selectedDraftOrder: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: DraftOrderState = {
  orders: [],
  selectedDraftOrder: null,
  loading: false,
  error: null,
};

const draftOrderSlice = createSlice({
  name: 'draftOrders',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createDraftOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log('Creating draft order...'); // Debug log
      })
      .addCase(createDraftOrder.fulfilled, (state, action) => {
        state.loading = false;
        console.log('Draft order created successfully:', action.payload); // Debug log
        toast.success('Draft order saved successfully');
      })
      .addCase(createDraftOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        console.error('Draft order creation failed:', action.payload); // Debug log
        toast.error(action.payload as string);
      })
      .addCase(fetchDraftOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDraftOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchDraftOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(bulkDeleteDraftOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bulkDeleteDraftOrders.fulfilled, (state) => {
        state.loading = false;
        toast.success('Draft orders deleted successfully');
      })
      .addCase(bulkDeleteDraftOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchDraftOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDraftOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedDraftOrder = action.payload;
        state.error = null;
      })
      .addCase(fetchDraftOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(searchLSP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchLSP.fulfilled, (state, action) => {
        state.loading = false;
        // Handle the LSP search response as needed
        // You might want to store it in a new state property
      })
      .addCase(searchLSP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default draftOrderSlice.reducer; 