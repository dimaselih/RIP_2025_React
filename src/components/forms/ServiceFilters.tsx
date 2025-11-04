import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

interface ServiceFiltersProps {
  onFiltersChange: (filters: ServiceFiltersState) => void;
  onApply: (filters: ServiceFiltersState) => void;
  onReset: () => void;
  appliedFilters?: ServiceFiltersState;
}

export interface ServiceFiltersState {
  search: string;
  priceFrom?: number;
  priceTo?: number;
}

const ServiceFilters: React.FC<ServiceFiltersProps> = ({
  onFiltersChange,
  onApply,
  onReset,
  appliedFilters
}) => {
  const reduxFilters = useSelector((state: RootState) => state.filters);
  const initialFilters = appliedFilters || {
    search: reduxFilters.search || '',
    priceFrom: reduxFilters.priceFrom,
    priceTo: reduxFilters.priceTo,
  };
  const [filters, setFilters] = useState<ServiceFiltersState>(initialFilters);

  // Синхронизируем с Redux при изменении
  useEffect(() => {
    setFilters({
      search: reduxFilters.search || '',
      priceFrom: reduxFilters.priceFrom,
      priceTo: reduxFilters.priceTo,
    });
  }, [reduxFilters]);

  const handleFilterChange = (field: keyof ServiceFiltersState, value: any) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    // Только обновляем локальное состояние, не применяем фильтры сразу
  };

  const handleApply = () => {
    onApply(filters);
  };

  const handleReset = () => {
    const resetFilters: ServiceFiltersState = {
      search: '',
      priceFrom: undefined,
      priceTo: undefined
    };
    setFilters(resetFilters);
    onFiltersChange(resetFilters);
    onReset();
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== undefined && value !== '' && value !== null
  );

  return (
    <div className="filters-container">
      <div className="filters-header d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0" style={{ fontFamily: 'Source Sans 3', fontWeight: 600, fontSize: '18px' }}>Фильтры</h5>
        {hasActiveFilters && (
          <Button variant="link" onClick={handleReset} className="clear-filters text-decoration-none p-0">
            Очистить
          </Button>
        )}
      </div>

      <Form className="filters-content">
        <Row className="align-items-end g-2">
          <Col md={4}>
            <Form.Group>
              <Form.Label>Цена от:</Form.Label>
              <Form.Control
                type="number"
                value={filters.priceFrom || ''}
                onChange={(e) => handleFilterChange('priceFrom', e.target.value ? Number(e.target.value) : undefined)}
                placeholder="0"
                className="filter-input"
              />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group>
              <Form.Label>Цена до:</Form.Label>
              <Form.Control
                type="number"
                value={filters.priceTo || ''}
                onChange={(e) => handleFilterChange('priceTo', e.target.value ? Number(e.target.value) : undefined)}
                placeholder="1000000"
                className="filter-input"
              />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Button 
              variant="primary" 
              onClick={handleApply}
              className="apply-filters-btn"
              style={{ width: '100%' }}
            >
              Применить фильтры
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export { ServiceFilters };