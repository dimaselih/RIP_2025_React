// Вспомогательные функции

import { PRICE_TYPE_LABELS } from '../constants';

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
  }).format(price);
};

export const formatPriceType = (priceType: string): string => {
  return PRICE_TYPE_LABELS[priceType as keyof typeof PRICE_TYPE_LABELS] || priceType;
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('ru-RU');
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const getDefaultImageUrl = (): string => {
  return 'https://via.placeholder.com/300x200?text=No+Image';
};
