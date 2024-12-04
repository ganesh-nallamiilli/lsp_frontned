import { configureStore } from '@reduxjs/toolkit';
import ticketReducer from './slices/ticketSlice';
import authReducer from './slices/authSlice';
import dashboardReducer from './slices/dashboardSlice';
import rtoReducer from './slices/rtoSlice';
import lookupReducer from './slices/lookupSlice';
import ordersReducer from './slices/ordersSlice';
import returnsReducer from './slices/returnsSlice';
import transactionReducer from './slices/transactionSlice';
import billingReducer from './slices/billingSlice';
import draftOrderReducer from './slices/draftOrderSlice';
import franchiseReducer from './slices/franchiseSlice';
import customerReducer from './slices/customerSlice';
import payoutReducer from './slices/payoutSlice';

export const store = configureStore({
  reducer: {
    tickets: ticketReducer,
    auth: authReducer,
    dashboard: dashboardReducer,
    rto: rtoReducer,
    lookup: lookupReducer,
    orders: ordersReducer,
    returns: returnsReducer,
    transactions: transactionReducer,
    billing: billingReducer,
    draftOrders: draftOrderReducer,
    franchise: franchiseReducer,
    customers: customerReducer,
    payouts: payoutReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 