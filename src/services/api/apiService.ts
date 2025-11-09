// API сервис для работы с Django бэкендом

import { ServiceTCO, CalculationTCO } from '../../types/api';
import { getMockServices, getMockService, getFilteredMockServices } from '../storage/mockData';
import { dest_api } from '../../config/target_config';

// API base URL - используем target_config для переключения между веб и Tauri
const API_BASE_URL = dest_api;

// Флаг для использования mock данных (true = mock, false = реальный API)
// По умолчанию используем реальный API
const USE_MOCK_DATA = process.env.REACT_APP_USE_MOCK === 'true';

// Примечание: подробные debug-логи отключены для чистоты консоли

// Имитация задержки сети
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class ApiService {
  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    // Логирование для демонстрации подключения по IP
    if (API_BASE_URL) {
      console.log(`[TAURI API] Запрос к: ${url}`);
      console.log(`[TAURI API] IP адрес сервера: ${API_BASE_URL}`);
    }
    
    const config: RequestInit = {
      credentials: 'include', // Отправляем cookies для сессионной аутентификации
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Услуги с фильтрацией на бэкенде
  async getServices(search?: string, priceFrom?: number, priceTo?: number): Promise<ServiceTCO[]> {
    // Если включено использование mock данных явно, возвращаем их
    if (USE_MOCK_DATA) {
      // console.debug('[MOCK] getServices', { search, priceFrom, priceTo });
      await delay(300); // Имитация задержки сети
      return getFilteredMockServices(search, undefined, priceFrom, priceTo);
    }
    
    // Пытаемся получить данные с бэкенда
    try {
      // Строим параметры запроса для фильтрации на бэкенде
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (priceFrom !== undefined) params.append('price_from', priceFrom.toString());
      if (priceTo !== undefined) params.append('price_to', priceTo.toString());
      
      const queryString = params.toString();
      const url = `/api/servicetco/${queryString ? '?' + queryString : ''}`;
      
      // console.debug('[API] Request URL with filters:', url);
      
      return await this.request<ServiceTCO[]>(url);
    } catch (error) {
      // Если нет доступа к бэкенду, используем mock данные
      console.warn('[FALLBACK TO MOCK] Backend unavailable, using mock data');
      await delay(300);
      return getFilteredMockServices(search, undefined, priceFrom, priceTo);
    }
  }

  async getService(id: number): Promise<ServiceTCO> {
    // Если включено использование mock данных явно, возвращаем их
    if (USE_MOCK_DATA) {
      // console.debug('[MOCK] getService', id);
      await delay(300); // Имитация задержки сети
      const service = getMockService(id);
      if (!service) {
        throw new Error(`Service with id ${id} not found`);
      }
      return service;
    }
    
    // Пытаемся получить данные с бэкенда
    try {
      return await this.request<ServiceTCO>(`/api/servicetco/${id}/`);
    } catch (error) {
      // Если нет доступа к бэкенду, используем mock данные
      console.warn('[FALLBACK TO MOCK] Backend unavailable, using mock data');
      await delay(300);
      const service = getMockService(id);
      if (!service) {
        throw new Error(`Service with id ${id} not found`);
      }
      return service;
    }
  }

  // Расчеты
  async getCalculations(): Promise<CalculationTCO[]> {
    if (USE_MOCK_DATA) {
      // console.debug('[MOCK] getCalculations');
      await delay(300);
      return [];
    }
    
    return this.request<CalculationTCO[]>('/api/calculation/');
  }

  async getCalculation(id: number): Promise<CalculationTCO> {
    if (USE_MOCK_DATA) {
      console.log('[MOCK] getCalculation', id);
      await delay(300);
      throw new Error('Calculation not implemented in mock data');
    }
    
    return this.request<CalculationTCO>(`/api/calculation/${id}/`);
  }

  // Получение количества товаров в корзине
  async getCartCount(): Promise<number> {
    try {
      const response = await this.request<{ calculation_id: number; services_count: number }>('/api/cart_tco/');
      return response.services_count || 0;
    } catch (error) {
      // Если сервис недоступен, возвращаем 0
      console.warn('[CART] Failed to get cart count, returning 0:', error);
      return 0;
    }
  }
}

export const apiService = new ApiService();
