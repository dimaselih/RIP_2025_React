import { Api } from './Api';
import { dest_api } from '../config/target_config';

// Используем baseURL из конфига или относительный путь для прокси Vite
// В development режиме Vite проксирует /api на http://localhost:8000
// В production используем абсолютный URL из конфига
const API_BASE_URL = dest_api || (import.meta.env.DEV ? '/api' : 'http://localhost:8000/api');

export const api = new Api({
    baseURL: API_BASE_URL,
    withCredentials: true, // Отправляем cookies для сессионной аутентификации
});

