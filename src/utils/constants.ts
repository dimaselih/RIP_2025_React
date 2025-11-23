// Константы приложения

export const API_ENDPOINTS = {
  SERVICES: '/api/servicetco/',
  CALCULATIONS: '/api/calculation/',
  USERS: '/api/user/',
} as const;

export const ROUTES = {
  HOME: '/',
  CATALOG_TCO: '/catalog_tco',
  CALCULATIONS_TCO: '/calculations_tco',
  CALCULATION_TCO: '/calculation_tco',
  PROFILE: '/profile',
  LOGIN: '/login',
  REGISTER: '/register',
} as const;

export type RouteKeyType = keyof typeof ROUTES;

export const ROUTE_LABELS: { [key in RouteKeyType]: string } = {
  HOME: 'Главная',
  CATALOG_TCO: 'Каталог услуг TCO',
  CALCULATIONS_TCO: 'Мои заявки',
  CALCULATION_TCO: 'Заявка',
  PROFILE: 'Личный кабинет',
  LOGIN: 'Вход',
  REGISTER: 'Регистрация',
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
