// Общие типы для UI и состояния приложения

// ==================== НАВИГАЦИЯ ====================

export interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}

export interface NavigationItem {
  label: string;
  href: string;
  icon?: string;
  children?: NavigationItem[];
}

// ==================== ФИЛЬТРЫ И ПОИСК ====================

export interface FilterState {
  search: string;
  priceFrom: string;
  priceTo: string;
  dateFrom: string;
  dateTo: string;
}

export interface SortOptions {
  field: string;
  direction: 'asc' | 'desc';
}

// ==================== UI СОСТОЯНИЕ ====================

export interface LoadingState {
  isLoading: boolean;
  error?: string;
}

export interface PaginationState {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
}

// ==================== ФОРМЫ ====================

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'date' | 'select' | 'textarea';
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
}

export interface FormState<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  isValid: boolean;
}

// ==================== УВЕДОМЛЕНИЯ ====================

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// ==================== МОДАЛЬНЫЕ ОКНА ====================

export interface ModalState {
  isOpen: boolean;
  title?: string;
  content?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  onClose?: () => void;
}

// ==================== ТЕМА И НАСТРОЙКИ ====================

export interface Theme {
  mode: 'light' | 'dark';
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
}

export interface UserPreferences {
  theme: Theme;
  language: string;
  notifications: boolean;
  autoSave: boolean;
}

// ==================== ОШИБКИ ====================

export interface ValidationError {
  field: string;
  message: string;
}

// ==================== УТИЛИТЫ ====================

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
