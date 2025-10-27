import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Spinner, Alert, Button } from 'react-bootstrap';
import { Breadcrumbs } from '../components/layout';
import { ServiceCard } from '../components/ui/ServiceCard';
import { SearchAndCart } from '../components/ui/SearchAndCart';
import { ServiceFilters, ServiceFiltersState } from '../components/forms/ServiceFilters';
import { ServiceTCO } from '../types/api';
import { useApi } from '../hooks/useApi';

export const ServicesPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<ServiceFiltersState>({
    search: '',
    priceType: undefined,
    priceFrom: undefined,
    priceTo: undefined
  });

  // Используем хук для получения данных с фильтрацией на бэкенде
  const { services, loading, error, refetch } = useApi(filters.search, filters.priceFrom, filters.priceTo);

  // Дополнительная фильтрация по типу цены на клиенте (если бэкенд не поддерживает)
  const filteredServices = services.filter((service: ServiceTCO) => {
    // Фильтр по типу цены
    if (filters.priceType && service.price_type !== filters.priceType) {
      return false;
    }

    return true;
  });

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    // Не применяем поиск сразу, только обновляем локальное состояние
  };

  const handleSearchSubmit = (query: string) => {
    setSearchQuery(query);
    setFilters(prev => ({ ...prev, search: query }));
  };

  const handleFiltersChange = (_newFilters: ServiceFiltersState) => {
    // Управляем применением фильтров через кнопку «Применить»
  };

  const handleApplyFilters = (newFilters: ServiceFiltersState) => {
    // Применяем фильтры - это вызовет повторный запрос к API
    setFilters(newFilters);
    setSearchQuery(newFilters.search || '');
    
    // Сигнализируем компоненту фильтров о применении
    // Так он сохранит свои значения
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    const resetFilters = {
      search: '',
      priceType: undefined,
      priceFrom: undefined,
      priceTo: undefined
    };
    setFilters(resetFilters);
  };

  const handleViewDetails = (serviceId: number) => {
    navigate(`/catalog_tco/${serviceId}`);
  };


  const handleCartClick = () => {};

  const handleFiltersToggle = () => {
    setIsFiltersOpen(!isFiltersOpen);
  };

  if (loading) {
    return (
      <Container fluid className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <div className="mt-2">Загрузка...</div>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container fluid className="catalog-page">
        <Alert variant="danger">
          <Alert.Heading>Ошибка загрузки</Alert.Heading>
          <p>{error}</p>
          <Button onClick={refetch} variant="outline-danger">Повторить</Button>
        </Alert>
      </Container>
    );
  }

  return (
    <div className="catalog-page">
      {/* Breadcrumbs */}
      <Breadcrumbs />

      {/* Поиск и корзина */}
      <SearchAndCart
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onSearchSubmit={handleSearchSubmit}
        cartCount={cartCount}
        onCartClick={handleCartClick}
        onFiltersToggle={handleFiltersToggle}
        isFiltersOpen={isFiltersOpen}
      />

      {/* Фильтры */}
      {isFiltersOpen && (
        <ServiceFilters
          onFiltersChange={handleFiltersChange}
          onApply={handleApplyFilters}
          onReset={handleResetFilters}
          appliedFilters={filters}
        />
      )}

      {/* Сетка услуг */}
      <div className="services-grid">
        {filteredServices.length > 0 ? (
          filteredServices.map((service: ServiceTCO) => (
            <ServiceCard
              key={service.id}
              service={service}
              onViewDetails={handleViewDetails}
            />
          ))
        ) : (
          <div className="no-services">
            {searchQuery || Object.values(filters).some(v => v && v !== '') ? (
              `По запросу "${searchQuery}" ничего не найдено`
            ) : (
              'Нет доступных услуг'
            )}
          </div>
        )}
      </div>
    </div>
  );
};