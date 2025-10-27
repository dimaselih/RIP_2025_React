// API сервис для работы с Django бэкендом

import { ServiceTCO, CalculationTCO } from '../../types/api';
import { getMockServices, getMockService } from '../storage/mockData';

// В режиме разработки используем прокси из package.json (http://localhost:8000)
// В production можно указать реальный URL через переменную окружения
const API_BASE_URL = process.env.REACT_APP_API_URL || '';

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
    
    const config: RequestInit = {
      credentials: 'include', // Отправляем cookies для сессионной аутентификации
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      // console.debug(`[API] ${options.method || 'GET'} ${url}`);
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
  async getServices(search?: string, priceType?: string, priceFrom?: number, priceTo?: number): Promise<ServiceTCO[]> {
    // Если включено использование mock данных явно, возвращаем их
    if (USE_MOCK_DATA) {
      // console.debug('[MOCK] getServices', { search, priceType, priceFrom, priceTo });
      await delay(300); // Имитация задержки сети
      return getMockServices(search);
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
      return getMockServices(search);
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

  // Пользовательские методы пока не используются и удалены для чистоты кода
}

export const apiService = new ApiService();
