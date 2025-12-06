import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api';
import { ServiceTCOList } from '../../api/Api';

// Получение списка услуг с фильтрацией
export const fetchServices = createAsyncThunk(
  'services/fetchAll',
  async (
    params: { search?: string; price_from?: number; price_to?: number } = {},
    { rejectWithValue }
  ) => {
    try {
      const response = await api.serviceTco.serviceTcoList({
        search: params?.search,
        price_from: params?.price_from,
        price_to: params?.price_to,
      });
      return (response.data as unknown) as ServiceTCOList[];
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Ошибка загрузки услуг';
      return rejectWithValue(errorMessage);
    }
  }
);

// Получение деталей услуги
export const fetchService = createAsyncThunk(
  'services/fetchOne',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await api.serviceTco.serviceTcoRead(id.toString());
      return (response.data as unknown) as ServiceTCOList;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Ошибка загрузки услуги';
      return rejectWithValue(errorMessage);
    }
  }
);







