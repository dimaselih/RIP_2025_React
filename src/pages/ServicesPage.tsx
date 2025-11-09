import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Spinner, Alert, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setSearch, setPriceFrom, setPriceTo } from '../store/slices/filtersSlice';
import { Breadcrumbs } from '../components/layout';
import { ServiceCard } from '../components/ui/ServiceCard';
import { SearchAndCart } from '../components/ui/SearchAndCart';
import { ServiceTCO } from '../types/api';
import { useApi } from '../hooks/useApi';
import { useCart } from '../hooks/useCart';

export const ServicesPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const filters = useSelector((state: RootState) => state.filters);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Получаем количество товаров в корзине из API
  const { cartCount } = useCart();

  // Используем хук для получения данных с фильтрацией на бэкенде
  const { services, loading, error, refetch } = useApi(
    filters.search, 
    filters.priceFrom, 
    filters.priceTo
  );

  // Дополнительная фильтрация на клиенте (если бэкенд не поддерживает некоторые фильтры)
  const filteredServices = services.filter((service: ServiceTCO) => {
    // Фильтр по цене от (если бэкенд не поддерживает)
    if (filters.priceFrom !== undefined && service.price < filters.priceFrom) {
      return false;
    }

    // Фильтр по цене до (если бэкенд не поддерживает)
    if (filters.priceTo !== undefined && service.price > filters.priceTo) {
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
    dispatch(setSearch(query));
  };

  const handlePriceFromChange = (value: number | undefined) => {
    dispatch(setPriceFrom(value));
  };

  const handlePriceToChange = (value: number | undefined) => {
    dispatch(setPriceTo(value));
  };

  const handleViewDetails = (serviceId: number) => {
    navigate(`/catalog_tco/${serviceId}`);
  };

  const handleCartClick = () => {};

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
        priceFrom={filters.priceFrom}
        priceTo={filters.priceTo}
        onPriceFromChange={handlePriceFromChange}
        onPriceToChange={handlePriceToChange}
      />

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