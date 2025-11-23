// Хук для работы с API

import { useState, useEffect } from 'react';
import { api } from '../api';
import { ServiceTCOList } from '../api/Api';


export const useService = (id: number) => {
  const [service, setService] = useState<ServiceTCOList | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchService = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.serviceTco.serviceTcoRead(id.toString());
        setService(response.data as ServiceTCOList);
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
  const [services, setServices] = useState<ServiceTCOList[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.serviceTco.serviceTcoList({
        search,
        price_from: priceFrom,
        price_to: priceTo,
      });
      setServices(response.data as ServiceTCOList[]);
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
