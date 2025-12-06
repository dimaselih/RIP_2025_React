import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CustomUser } from '../../api/Api';

interface AuthState {
  user: CustomUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  initialized: boolean; // Флаг что проверка авторизации была выполнена
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  initialized: false, // Изначально false - проверка еще не была
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setUser: (state, action: PayloadAction<CustomUser | null>) => {
      state.user = action.payload;
      state.isAuthenticated = action.payload !== null;
      state.initialized = true; // Помечаем что проверка была выполнена
    },
    clearError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      state.initialized = true;
    },
  },
});

export const { setLoading, setError, setUser, clearError, logout } = authSlice.actions;
export default authSlice.reducer;


