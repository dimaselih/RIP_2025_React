// Хук для работы с API

import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { ServiceTCO } from '../types/api';


export const useService = (id: number) => {
  const [service, setService] = useState<ServiceTCO | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchService = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await apiService.getService(id);
        setService(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка загрузки услуги');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchService();
    }
  }, [id]);

  return { service, loading, error };
};

// Основной хук для API с фильтрацией на бэкенде
export const useApi = (search?: string, priceFrom?: number, priceTo?: number) => {
  const [services, setServices] = useState<ServiceTCO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.getServices(search, undefined, priceFrom, priceTo);
      setServices(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки услуг');
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    fetchServices();
  };

  useEffect(() => {
    fetchServices();
  }, [search, priceFrom, priceTo]);

  return { services, loading, error, refetch };
};
