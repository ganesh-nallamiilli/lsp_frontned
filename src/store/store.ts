import { configureStore } from '@reduxjs/toolkit';
import ticketReducer from './slices/ticketSlice';
import authReducer from './slices/authSlice';
import dashboardReducer from './slices/dashboardSlice';
import rtoReducer from './slices/rtoSlice';

export const store = configureStore({
  reducer: {
    tickets: ticketReducer,
    auth: authReducer,
    dashboard: dashboardReducer,
    rto: rtoReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 