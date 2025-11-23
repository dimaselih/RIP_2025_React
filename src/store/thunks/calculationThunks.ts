import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api';
import { CalculationTCO, FormCalculationTCO } from '../../api/Api';
import { setCart } from '../slices/cartSlice';

// Получение списка заявок
export const fetchCalculations = createAsyncThunk(
  'calculations/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.calculationTco.calculationTcoList();
      return (response.data as unknown) as CalculationTCO[];
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Ошибка загрузки заявок';
      return rejectWithValue(errorMessage);
    }
  }
);

// Получение деталей заявки
export const fetchCalculation = createAsyncThunk(
  'calculations/fetchOne',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await api.calculationTco.calculationTcoRead(id.toString());
      return (response.data as unknown) as CalculationTCO;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Ошибка загрузки заявки';
      return rejectWithValue(errorMessage);
    }
  }
);

// Добавление услуги в корзину (заявку-черновик)
export const addServiceToCart = createAsyncThunk(
  'calculations/addToCart',
  async ({ serviceId }: { serviceId: number; quantity?: number }, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.serviceTco.serviceTcoAddToCartCreate(serviceId.toString());
      
      // Обновляем корзину после добавления
      await dispatch(fetchCartInfo());
      
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Ошибка добавления услуги в корзину';
      return rejectWithValue(errorMessage);
    }
  }
);

// Обновление количества услуги в корзине
export const updateCartItem = createAsyncThunk(
  'calculations/updateCartItem',
  async (
    { calculationId, serviceId, quantity }: { calculationId: number; serviceId: number; quantity: number },
    { dispatch, rejectWithValue }
  ) => {
    try {
      // Используем прямой вызов request для передачи query параметров
      const response = await (api as any).request({
        path: `/calculation-service/update/`,
        method: 'PUT',
        secure: true,
        query: {
          calculation_id: calculationId.toString(),
          service_id: serviceId.toString(),
        },
        body: { quantity },
        type: 'application/json' as any,
      });
      
      // Обновляем детали заявки
      await dispatch(fetchCalculation(calculationId));
      
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Ошибка обновления услуги в корзине';
      return rejectWithValue(errorMessage);
    }
  }
);

// Удаление услуги из корзины
export const removeCartItem = createAsyncThunk(
  'calculations/removeCartItem',
  async (
    { calculationId, serviceId }: { calculationId: number; serviceId: number },
    { dispatch, rejectWithValue }
  ) => {
    try {
      // Используем прямой вызов request для передачи query параметров
      await (api as any).request({
        path: `/calculation-service/`,
        method: 'DELETE',
        secure: true,
        query: {
          calculation_id: calculationId.toString(),
          service_id: serviceId.toString(),
        },
      });
      
      // Обновляем детали заявки
      await dispatch(fetchCalculation(calculationId));
      
      return { calculationId, serviceId };
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Ошибка удаления услуги из корзины';
      return rejectWithValue(errorMessage);
    }
  }
);

// Формирование заявки (из черновика в сформированную)
export const formCalculation = createAsyncThunk(
  'calculations/form',
  async ({ id, startDate, endDate }: { id: number; startDate: string; endDate: string }, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.calculationTco.calculationTcoFormUpdate(
        id.toString(),
        { start_date: startDate, end_date: endDate } as FormCalculationTCO
      );
      
      // Обновляем корзину (черновик больше не существует)
      await dispatch(fetchCartInfo());
      
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Ошибка формирования заявки';
      return rejectWithValue(errorMessage);
    }
  }
);

// Обновление заявки (только для черновика)
export const updateCalculation = createAsyncThunk(
  'calculations/update',
  async ({ id, data }: { id: number; data: FormCalculationTCO }, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.calculationTco.calculationTcoUpdateUpdate(id.toString(), data);
      
      // Обновляем детали заявки
      await dispatch(fetchCalculation(id));
      
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Ошибка обновления заявки';
      return rejectWithValue(errorMessage);
    }
  }
);

// Удаление заявки (логическое удаление черновика)
export const deleteCalculation = createAsyncThunk(
  'calculations/delete',
  async (id: number, { dispatch, rejectWithValue }) => {
    try {
      await api.calculationTco.calculationTcoDeleteDelete(id.toString());
      
      // Обновляем корзину (черновик удален)
      await dispatch(fetchCartInfo());
      
      return id;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Ошибка удаления заявки';
      return rejectWithValue(errorMessage);
    }
  }
);

// Получение информации о корзине
export const fetchCartInfo = createAsyncThunk(
  'calculations/fetchCartInfo',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.cartTco.cartTcoList();
      const data = (response.data as unknown) as { calculation_id: number | null; services_count: number };
      dispatch(setCart({
        calculation_id: data.calculation_id,
        services_count: data.services_count,
      }));
      return data;
    } catch (error: any) {
      // Если не авторизован, просто возвращаем пустую корзину
      if (error.response?.status === 401) {
        dispatch(setCart({ calculation_id: null, services_count: 0 }));
        return { calculation_id: null, services_count: 0 };
      }
      const errorMessage = error.response?.data?.error || error.message || 'Ошибка загрузки корзины';
      return rejectWithValue(errorMessage);
    }
  }
);




