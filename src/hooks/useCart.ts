import { useState, useEffect } from 'react';
import { api } from '../api';

export const useCart = () => {
  const [cartCount, setCartCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCartCount = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.cartTco.cartTcoList();
      const data = response.data as { calculation_id: number | null; services_count: number };
      setCartCount(data.services_count || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки корзины');
      setCartCount(0); // При ошибке показываем 0
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartCount();
    
    // Обновляем количество каждые 5 секунд
    const interval = setInterval(() => {
      fetchCartCount();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return { cartCount, loading, error, refetch: fetchCartCount };
};



