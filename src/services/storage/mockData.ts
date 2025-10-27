// Mock данные для демонстрации без бэкенда

import { ServiceTCO } from '../../types/api';

export const mockServices: ServiceTCO[] = [
  {
    id: 1,
    name: 'Лицензирование ПО',
    description: 'Приобретение лицензий на программное обеспечение для бизнес-процессов',
    fullDescription: 'Включено:\n- Лицензии Microsoft Office и Windows\n- Лицензии Adobe Creative Suite\n- ERP и CRM системы\n- Системы мониторинга и безопасности\n- Базы данных и СУБД\n- Средства разработки\n- Ежегодное продление лицензий',
    price: 950000,
    price_type: 'yearly',
    is_deleted: false
  },
  {
    id: 2,
    name: 'Обучение персонала',
    description: 'Обучение персонала работе с аппаратурой и программным обеспечением',
    fullDescription: 'Включено:\n- Обучение работе с оборудованием\n- Курсы по эксплуатации техники\n- Обучение программному обеспечению\n- Инструктажи по безопасности\n- Тренинги по решению проблем\n- Изучение технической документации\n- Повышение квалификации персонала',
    price: 680000,
    price_type: 'one_time',
    is_deleted: false
  }
];

export const getMockServices = (search?: string): ServiceTCO[] => {
  if (!search) return mockServices;
  
  return mockServices.filter(service => 
    service.name.toLowerCase().includes(search.toLowerCase()) ||
    service.description.toLowerCase().includes(search.toLowerCase()) ||
    (service.fullDescription && service.fullDescription.toLowerCase().includes(search.toLowerCase()))
  );
};

export const getMockService = (id: number): ServiceTCO | undefined => {
  return mockServices.find(service => service.id === id);
};

// Добавляем новые функции для расширенной фильтрации
export const getFilteredMockServices = (
  search?: string,
  priceType?: string,
  priceFrom?: number,
  priceTo?: number
): ServiceTCO[] => {
  let filtered = mockServices;
  
  if (search) {
    filtered = filtered.filter(service => 
      service.name.toLowerCase().includes(search.toLowerCase()) ||
      service.description.toLowerCase().includes(search.toLowerCase()) ||
      (service.fullDescription && service.fullDescription.toLowerCase().includes(search.toLowerCase()))
    );
  }
  
  if (priceType) {
    filtered = filtered.filter(service => service.price_type === priceType);
  }
  
  if (priceFrom !== undefined) {
    filtered = filtered.filter(service => service.price >= priceFrom);
  }
  
  if (priceTo !== undefined) {
    filtered = filtered.filter(service => service.price <= priceTo);
  }
  
  return filtered;
};
