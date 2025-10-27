// Хук для работы с фильтрами

import { useState, useCallback } from 'react';
import { FilterState } from '../types/common';

export const useFilters = (initialFilters: FilterState) => {
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  const updateFilter = useCallback((field: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  const applyFilters = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
  }, []);

  return {
    filters,
    updateFilter,
    resetFilters,
    applyFilters,
  };
};
