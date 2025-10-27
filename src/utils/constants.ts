// Константы приложения

export const API_ENDPOINTS = {
  SERVICES: '/api/servicetco/',
  CALCULATIONS: '/api/calculation/',
  USERS: '/api/user/',
} as const;

export const ROUTES = {
  HOME: '/',
  CATALOG_TCO: '/catalog_tco',
  CATALOG_TCO_DETAIL: '/catalog_tco/:id',
} as const;

export const PRICE_TYPES = {
  ONE_TIME: 'one_time',
  MONTHLY: 'monthly',
  YEARLY: 'yearly',
} as const;

export const PRICE_TYPE_LABELS = {
  [PRICE_TYPES.ONE_TIME]: 'Единовременная',
  [PRICE_TYPES.MONTHLY]: 'Ежемесячная',
  [PRICE_TYPES.YEARLY]: 'Ежегодная',
} as const;
