import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api';
import { Login, CustomUser } from '../../api/Api';
import { setUser, setLoading, setError, logout as logoutAction } from '../slices/authSlice';
import { clearCart } from '../slices/cartSlice';
import { resetFilters } from '../slices/filtersSlice';

// Логин пользователя
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const response = await api.login.loginCreate({
        email: credentials.email,
        password: credentials.password,
      } as Login);

      if ((response.data as any)?.status === 'ok') {
        // После успешного логина получаем профиль пользователя
        await dispatch(fetchUserProfile());
        
        dispatch(setLoading(false));
        return response.data;
      } else {
        const errorMessage = (response.data as any)?.error || 'Ошибка авторизации';
        dispatch(setError(errorMessage));
        dispatch(setLoading(false));
        return rejectWithValue(errorMessage);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.error || 'Ошибка авторизации. Проверьте данные и попробуйте снова';
      dispatch(setError(errorMessage));
      dispatch(setLoading(false));
      return rejectWithValue(errorMessage);
    }
  }
);

// Регистрация пользователя
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: { email: string; password: string; is_staff?: boolean; is_superuser?: boolean }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const response = await api.user.userCreate({
        email: userData.email,
        password: userData.password,
        is_staff: userData.is_staff || false,
        is_superuser: userData.is_superuser || false,
      } as CustomUser);

      if ((response.data as any)?.status === 'Success') {
        dispatch(setLoading(false));
        return response.data;
      } else if ((response.data as any)?.status === 'Exist') {
        const errorMessage = 'Пользователь с таким email уже существует';
        dispatch(setError(errorMessage));
        dispatch(setLoading(false));
        return rejectWithValue(errorMessage);
      } else {
        const errorMessage = (response.data as any)?.error || 'Ошибка регистрации';
        dispatch(setError(errorMessage));
        dispatch(setLoading(false));
        return rejectWithValue(errorMessage);
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.error || 'Ошибка регистрации. Попробуйте позже';
      dispatch(setError(errorMessage));
      dispatch(setLoading(false));
      return rejectWithValue(errorMessage);
    }
  }
);

// Получение профиля пользователя
export const fetchUserProfile = createAsyncThunk(
  'auth/fetchProfile',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.user.userProfileList();
      const profile = response.data as unknown as CustomUser;
      dispatch(setUser(profile));
      return profile;
    } catch (error: any) {
      // Если не авторизован, просто очищаем пользователя
      if (error.response?.status === 401) {
        dispatch(setUser(null));
        return rejectWithValue('Не авторизован');
      }
      console.error('Fetch profile error:', error);
      const errorMessage = error.response?.data?.error || 'Ошибка загрузки профиля';
      dispatch(setError(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

// Обновление профиля пользователя
export const updateUserProfile = createAsyncThunk(
  'auth/updateProfile',
  async (profileData: Partial<CustomUser>, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const response = await api.user.userProfileUpdateUpdate(profileData as CustomUser);
      
      // Обновляем профиль в store
      await dispatch(fetchUserProfile());
      
      dispatch(setLoading(false));
      return response.data;
    } catch (error: any) {
      console.error('Update profile error:', error);
      const errorMessage = error.response?.data?.error || 'Ошибка обновления профиля. Попробуйте позже';
      dispatch(setError(errorMessage));
      dispatch(setLoading(false));
      return rejectWithValue(errorMessage);
    }
  }
);

// Выход пользователя
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { dispatch }) => {
    try {
      await api.logout.logoutCreate();
    } catch (error) {
      // Игнорируем ошибки при выходе
      console.warn('Logout error:', error);
    } finally {
      // Очищаем состояние независимо от результата запроса
      dispatch(logoutAction());
      dispatch(clearCart());
      dispatch(resetFilters());
    }
  }
);

// Проверка авторизации при загрузке приложения
export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { dispatch }) => {
    try {
      await dispatch(fetchUserProfile());
    } catch (error) {
      // Если не авторизован, просто игнорируем
      dispatch(setUser(null));
    }
  }
);


