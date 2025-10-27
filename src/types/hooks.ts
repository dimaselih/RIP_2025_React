// Типы для React хуков

import { ServiceTCO, CalculationTCO, User, ServiceFilters, CalculationFilters } from './api';
import { FilterState, LoadingState, PaginationState } from './common';

// ==================== API ХУКИ ====================

export interface UseServicesResult {
  services: ServiceTCO[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export interface UseServiceResult {
  service: ServiceTCO | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export interface UseCalculationsResult {
  calculations: CalculationTCO[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export interface UseCalculationResult {
  calculation: CalculationTCO | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export interface UseUserResult {
  user: User | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

// ==================== ФИЛЬТРЫ ХУКИ ====================

export interface UseFiltersResult<T> {
  filters: T;
  updateFilter: <K extends keyof T>(field: K, value: T[K]) => void;
  resetFilters: () => void;
  applyFilters: (newFilters: T) => void;
  hasActiveFilters: boolean;
}

export interface UseServiceFiltersResult extends UseFiltersResult<ServiceFilters> {}

export interface UseCalculationFiltersResult extends UseFiltersResult<CalculationFilters> {}

// ==================== ЛОКАЛЬНОЕ ХРАНЕНИЕ ====================

export interface UseLocalStorageResult<T> {
  value: T;
  setValue: (value: T) => void;
  removeValue: () => void;
}

// ==================== МОДАЛЬНЫЕ ОКНА ====================

export interface UseModalResult {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

// ==================== УВЕДОМЛЕНИЯ ====================

export interface UseNotificationsResult {
  notifications: HookNotification[];
  addNotification: (notification: Omit<HookNotification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

export interface HookNotification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}

// ==================== ПАГИНАЦИЯ ====================

export interface UsePaginationResult {
  pagination: PaginationState;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  goToFirstPage: () => void;
  goToLastPage: () => void;
}

// ==================== ПОИСК ====================

export interface UseSearchResult {
  query: string;
  setQuery: (query: string) => void;
  clearQuery: () => void;
  isSearching: boolean;
  searchResults: any[];
}

// ==================== СОРТИРОВКА ====================

export interface UseSortResult {
  sortField: string;
  sortDirection: 'asc' | 'desc';
  setSort: (field: string, direction?: 'asc' | 'desc') => void;
  toggleSort: (field: string) => void;
  clearSort: () => void;
}

// ==================== ФОРМЫ ====================

export interface UseFormResult<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  isValid: boolean;
  setValue: <K extends keyof T>(field: K, value: T[K]) => void;
  setError: <K extends keyof T>(field: K, error: string) => void;
  setTouched: <K extends keyof T>(field: K, touched: boolean) => void;
  handleSubmit: (onSubmit: (values: T) => void) => (e: React.FormEvent) => void;
  reset: () => void;
  validate: () => boolean;
}

// ==================== ДЕБАУНС ====================

export interface UseDebounceResult<T> {
  value: T;
  setValue: (value: T) => void;
  debouncedValue: T;
  isPending: boolean;
}

// ==================== ИНТЕРВАЛЫ ====================

export interface UseIntervalResult {
  start: () => void;
  stop: () => void;
  isRunning: boolean;
}

// ==================== ТАЙМЕРЫ ====================

export interface UseTimeoutResult {
  start: (callback: () => void, delay: number) => void;
  stop: () => void;
  isActive: boolean;
}

// ==================== РАЗМЕРЫ ====================

export interface UseWindowSizeResult {
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

// ==================== КЛАВИАТУРА ====================

export interface UseKeyboardResult {
  key: string | null;
  code: string | null;
  isPressed: boolean;
  modifiers: {
    ctrl: boolean;
    shift: boolean;
    alt: boolean;
    meta: boolean;
  };
}

// ==================== КЛИК ВНЕ ====================

export interface UseClickOutsideResult {
  ref: React.RefObject<HTMLElement>;
  isOutside: boolean;
}

// ==================== ПРЕДВАРИТЕЛЬНАЯ ЗАГРУЗКА ====================

export interface UsePrefetchResult {
  prefetch: (url: string) => Promise<void>;
  isPrefetching: boolean;
  prefetchedUrls: Set<string>;
}
