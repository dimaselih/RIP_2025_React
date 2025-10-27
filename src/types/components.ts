// Типы для React компонентов

import { ReactNode } from 'react';
import { ServiceTCO, CalculationTCO, User } from './api';
import { FilterState, BreadcrumbItem, LoadingState, NavigationItem } from './common';

// ==================== КОМПОНЕНТЫ УСЛУГ ====================

export interface ServiceCardProps {
  service: ServiceTCO;
  onAddToCart?: (serviceId: number, quantity: number) => void;
  onViewDetails?: (serviceId: number) => void;
  showActions?: boolean;
  className?: string;
}

export interface ServiceListProps {
  services: ServiceTCO[];
  loading?: boolean;
  error?: string;
  onServiceClick?: (service: ServiceTCO) => void;
  onAddToCart?: (serviceId: number, quantity: number) => void;
  className?: string;
}

export interface ServiceFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onReset?: () => void;
  loading?: boolean;
  className?: string;
}

// ==================== КОМПОНЕНТЫ РАСЧЕТОВ ====================

export interface CalculationCardProps {
  calculation: CalculationTCO;
  onViewDetails?: (calculationId: number) => void;
  onEdit?: (calculationId: number) => void;
  onDelete?: (calculationId: number) => void;
  showActions?: boolean;
  className?: string;
}

export interface CalculationListProps {
  calculations: CalculationTCO[];
  loading?: boolean;
  error?: string;
  onCalculationClick?: (calculation: CalculationTCO) => void;
  onEdit?: (calculationId: number) => void;
  onDelete?: (calculationId: number) => void;
  className?: string;
}

// ==================== НАВИГАЦИЯ ====================

export interface NavbarProps {
  user?: User;
  onLogin?: () => void;
  onLogout?: () => void;
  className?: string;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export interface NavigationProps {
  items: NavigationItem[];
  activeItem?: string;
  onItemClick?: (href: string) => void;
  className?: string;
}

// ==================== ФОРМЫ ====================

export interface LoginFormProps {
  onSubmit: (credentials: LoginCredentials) => void;
  loading?: boolean;
  error?: string;
  className?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegistrationFormProps {
  onSubmit: (data: RegistrationData) => void;
  loading?: boolean;
  error?: string;
  className?: string;
}

export interface RegistrationData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName?: string;
  lastName?: string;
}

// ==================== МОДАЛЬНЫЕ ОКНА ====================

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

// ==================== УВЕДОМЛЕНИЯ ====================

export interface NotificationProps {
  notification: NotificationItem;
  onClose: (id: string) => void;
  className?: string;
}

export interface NotificationItem {
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

// ==================== ЗАГРУЗКА ====================

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export interface LoadingStateProps {
  loading: LoadingState;
  children: ReactNode;
  fallback?: ReactNode;
  className?: string;
}

// ==================== ПАГИНАЦИЯ ====================

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showFirstLast?: boolean;
  showPrevNext?: boolean;
  maxVisiblePages?: number;
  className?: string;
}

// ==================== ПОИСК ====================

export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onSearch?: (query: string) => void;
  loading?: boolean;
  className?: string;
}

// ==================== СОРТИРОВКА ====================

export interface SortSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SortOption[];
  className?: string;
}

export interface SortOption {
  value: string;
  label: string;
  direction?: 'asc' | 'desc';
}

// ==================== ФИЛЬТРЫ ====================

export interface FilterChipProps {
  label: string;
  onRemove: () => void;
  className?: string;
}

export interface FilterChipsProps {
  filters: Record<string, any>;
  onRemoveFilter: (key: string) => void;
  onClearAll: () => void;
  className?: string;
}
