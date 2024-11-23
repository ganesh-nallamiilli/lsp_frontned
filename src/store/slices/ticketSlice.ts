import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// Types
interface Ticket {
  status: 'OPEN' | 'CLOSED';
  ticketType: string;
  ticketId: string;
  networkIssueId: string;
  orderId: string;
  category: string;
  network: string;
  participants: string[];
  creationDateTime: string;
  issueCategory: string;
  issueSubCategory: string;
  relayDateTime: string;
  lastUpdateDateTime: string;
  closedDateTime: string;
  assignedAgent: string;
  assignedSeller: string;
}

interface TicketState {
  tickets: Ticket[];
  loading: boolean;
  error: string | null;
  currentTicket: Ticket | null;
}

const initialState: TicketState = {
  tickets: [],
  loading: false,
  error: null,
  currentTicket: null,
};

// Async Thunks
export const fetchTickets = createAsyncThunk(
  'tickets/fetchTickets',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('YOUR_API_ENDPOINT/tickets');
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch tickets');
    }
  }
);

export const createTicket = createAsyncThunk(
  'tickets/createTicket',
  async (ticketData: Partial<Ticket>, { rejectWithValue }) => {
    try {
      const response = await axios.post('YOUR_API_ENDPOINT/tickets', ticketData);
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to create ticket');
    }
  }
);

export const assignTicket = createAsyncThunk(
  'tickets/assignTicket',
  async ({ ticketId, assigneeData }: { ticketId: string; assigneeData: any }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`YOUR_API_ENDPOINT/tickets/${ticketId}/assign`, assigneeData);
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to assign ticket');
    }
  }
);

// Slice
const ticketSlice = createSlice({
  name: 'tickets',
  initialState,
  reducers: {
    setCurrentTicket: (state, action: PayloadAction<Ticket>) => {
      state.currentTicket = action.payload;
    },
    clearCurrentTicket: (state) => {
      state.currentTicket = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Tickets
      .addCase(fetchTickets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTickets.fulfilled, (state, action) => {
        state.loading = false;
        state.tickets = action.payload;
      })
      .addCase(fetchTickets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create Ticket
      .addCase(createTicket.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTicket.fulfilled, (state, action) => {
        state.loading = false;
        state.tickets.push(action.payload);
      })
      .addCase(createTicket.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Assign Ticket
      .addCase(assignTicket.fulfilled, (state, action) => {
        const index = state.tickets.findIndex(t => t.ticketId === action.payload.ticketId);
        if (index !== -1) {
          state.tickets[index] = action.payload;
        }
      });
  },
});

export const { setCurrentTicket, clearCurrentTicket } = ticketSlice.actions;
export default ticketSlice.reducer; 