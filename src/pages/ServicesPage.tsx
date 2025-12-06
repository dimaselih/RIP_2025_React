import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Spinner, Alert, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { setSearch, setPriceFrom, setPriceTo } from '../store/slices/filtersSlice';
import { addServiceToCart, fetchCartInfo } from '../store/thunks/calculationThunks';
import { Breadcrumbs } from '../components/layout';
import { ROUTE_LABELS } from '../utils/constants';
import { ServiceCard } from '../components/ui/ServiceCard';
import { SearchAndCart } from '../components/ui/SearchAndCart';
import { ServiceTCOList } from '../api/Api';
import { fetchServices } from '../store/thunks/serviceThunks';
import '../styles/catalog.css';

export const ServicesPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const filters = useSelector((state: RootState) => state.filters);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { services_count: cartCount } = useSelector((state: RootState) => state.cart);
  const [searchQuery, setSearchQuery] = useState('');
  const [addingServiceId, setAddingServiceId] = useState<number | null>(null);
  const [services, setServices] = useState<ServiceTCOList[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Загружаем услуги через thunk
  const loadServices = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await dispatch(fetchServices({
        search: filters.search,
        price_from: filters.priceFrom,
        price_to: filters.priceTo,
      })).unwrap();
      setServices(result);
    } catch (err: any) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки услуг');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
    if (isAuthenticated) {
      dispatch(fetchCartInfo());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.search, filters.priceFrom, filters.priceTo, isAuthenticated]);

  // Дополнительная фильтрация на клиенте (если бэкенд не поддерживает некоторые фильтры)
  const filteredServices = services.filter((service: ServiceTCOList) => {
    // Фильтр по цене от (если бэкенд не поддерживает)
    const price = parseFloat(service.price);
    if (filters.priceFrom !== undefined && price < filters.priceFrom) {
      return false;
    }

    // Фильтр по цене до (если бэкенд не поддерживает)
    if (filters.priceTo !== undefined && price > filters.priceTo) {
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

  const handleAddToCart = async (serviceId: number) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      setAddingServiceId(serviceId);
      await dispatch(addServiceToCart({ serviceId, quantity: 1 })).unwrap();
      await dispatch(fetchCartInfo());
    } catch (error: any) {
      console.error('Failed to add service to cart:', error);
      alert('Ошибка добавления в корзину. Попробуйте позже.');
    } finally {
      setAddingServiceId(null);
    }
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
          <Button onClick={loadServices} variant="outline-danger">Повторить</Button>
        </Alert>
      </Container>
    );
  }

  return (
    <div className="catalog-page">
      {/* Breadcrumbs */}
      <Breadcrumbs crumbs={[{ label: ROUTE_LABELS.CATALOG_TCO }]} />

      {/* Поиск и корзина */}
      <SearchAndCart
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onSearchSubmit={handleSearchSubmit}
        cartCount={cartCount}
        priceFrom={filters.priceFrom}
        priceTo={filters.priceTo}
        onPriceFromChange={handlePriceFromChange}
        onPriceToChange={handlePriceToChange}
        />

      {/* Сетка услуг */}
      <div className="services-grid">
        {filteredServices.length > 0 ? (
          filteredServices.map((service: ServiceTCOList) => (
            <ServiceCard
              key={service.id}
              service={service}
              onViewDetails={handleViewDetails}
              onAddToCart={handleAddToCart}
              isAuthenticated={isAuthenticated}
              isAddingToCart={addingServiceId === service.id}
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