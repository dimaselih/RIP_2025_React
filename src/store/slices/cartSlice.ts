import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartState {
  calculation_id: number | null;
  services_count: number;
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  calculation_id: null,
  services_count: 0,
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCart: (state, action: PayloadAction<{ calculation_id: number | null; services_count: number }>) => {
      state.calculation_id = action.payload.calculation_id;
      state.services_count = action.payload.services_count;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    incrementCount: (state) => {
      state.services_count += 1;
    },
    decrementCount: (state) => {
      if (state.services_count > 0) {
        state.services_count -= 1;
      }
    },
    clearCart: (state) => {
      state.calculation_id = null;
      state.services_count = 0;
      state.error = null;
    },
  },
});

export const { setCart, setLoading, setError, incrementCount, decrementCount, clearCart } = cartSlice.actions;
export default cartSlice.reducer;







