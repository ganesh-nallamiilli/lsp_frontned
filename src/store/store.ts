import { configureStore } from '@reduxjs/toolkit';
import ticketReducer from './slices/ticketSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    tickets: ticketReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 