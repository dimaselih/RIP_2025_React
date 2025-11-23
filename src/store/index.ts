import { configureStore } from '@reduxjs/toolkit';
import filtersReducer from './slices/filtersSlice';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';

export const store = configureStore({
  reducer: {
    filters: filtersReducer,
    auth: authReducer,
    cart: cartReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

