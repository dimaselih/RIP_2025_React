// API типы для Django бэкенда

// ==================== ОСНОВНЫЕ СУЩНОСТИ ====================

export interface ServiceTCO {
  id: number;
  name: string;
  description: string;
  fullDescription: string;
  price: number;
  price_type: PriceType;
  image_url?: string;
  is_deleted: boolean;
}

export interface CalculationTCO {
  id: number;
  status: CalculationStatus;
  created_at: string;
  creator: number;
  formed_at?: string;
  completed_at?: string;
  moderator?: number;
  total_cost?: number;
  duration_months?: number;
  start_date?: string;
  end_date?: string;
}

export interface CalculationService {
  id: number;
  calculation: number;
  service: number;
  quantity: number;
}

export interface User {
  id: number;
  email: string;
  is_staff: boolean;
  is_superuser: boolean;
  is_active: boolean;
  date_joined: string;
}

// ==================== ENUMS И ТИПЫ ====================

export type PriceType = 'one_time' | 'monthly' | 'yearly';

export type CalculationStatus = 'draft' | 'formed' | 'completed' | 'rejected' | 'deleted';

// ==================== API ОТВЕТЫ ====================

export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export interface ApiError {
  message: string;
  status: number;
  details?: Record<string, string[]>;
}

// ==================== ЗАПРОСЫ ====================

export interface ServiceListRequest {
  search?: string;
  price_type?: PriceType;
  price_from?: number;
  price_to?: number;
  date_from?: string;
  date_to?: string;
}

export interface CalculationListRequest {
  status?: CalculationStatus;
  date_from?: string;
  date_to?: string;
}

export interface AddToCartRequest {
  service_id: number;
  quantity: number;
}

// ==================== АВТОРИЗАЦИЯ ====================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  status: 'ok' | 'error';
  message?: string;
  error?: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  is_staff?: boolean;
  is_superuser?: boolean;
}

export interface RegisterResponse {
  status: 'Success' | 'Error' | 'Exist';
  error?: string;
}

export interface UserProfile {
  id: number;
  email: string;
  is_staff: boolean;
  is_superuser: boolean;
  is_active: boolean;
  date_joined: string;
}

export interface UpdateProfileRequest {
  email?: string;
  password?: string;
  is_staff?: boolean;
  is_superuser?: boolean;
}

export interface UpdateCalculationRequest {
  start_date?: string;
  end_date?: string;
}

export interface CompleteCalculationRequest {
  action: 'complete' | 'reject';
  moderator_comment?: string;
}

// ==================== РАСШИРЕННЫЕ ТИПЫ ====================

export interface ServiceTCOWithDetails extends ServiceTCO {
  calculation_services?: CalculationService[];
}

export interface CalculationTCOWithDetails extends CalculationTCO {
  calculation_services?: CalculationServiceWithService[];
  creator_details?: User;
  moderator_details?: User;
}

export interface CalculationServiceWithService extends CalculationService {
  service_details: ServiceTCO;
}

export interface UserWithPermissions extends User {
  permissions: string[];
  groups: string[];
}

// ==================== ФИЛЬТРЫ ====================

export interface ServiceFilters {
  search: string;
  price_type?: PriceType;
  price_from?: number;
  price_to?: number;
  date_from?: string;
  date_to?: string;
}

export interface CalculationFilters {
  status?: CalculationStatus;
  creator?: number;
  moderator?: number;
  date_from?: string;
  date_to?: string;
}

// ==================== ПАГИНАЦИЯ ====================

export interface PaginationParams {
  page?: number;
  page_size?: number;
}

export interface PaginatedResponse<T> {
  results: T[];
  count: number;
  next?: string;
  previous?: string;
}

// ==================== СТАТИСТИКА ====================

export interface ServiceStats {
  total_services: number;
  active_services: number;
  total_calculations: number;
  completed_calculations: number;
}

export interface CalculationStats {
  total_cost: number;
  average_cost: number;
  most_popular_service: ServiceTCO;
  calculation_trends: {
    date: string;
    count: number;
    total_cost: number;
  }[];
}
