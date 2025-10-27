import React, { useState } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { PriceType } from '../../types/api';

interface ServiceFiltersProps {
  onFiltersChange: (filters: ServiceFiltersState) => void;
  onApply: (filters: ServiceFiltersState) => void;
  onReset: () => void;
  appliedFilters?: ServiceFiltersState;
}

export interface ServiceFiltersState {
  search: string;
  priceType?: PriceType;
  priceFrom?: number;
  priceTo?: number;
}

const ServiceFilters: React.FC<ServiceFiltersProps> = ({
  onFiltersChange,
  onApply,
  onReset,
  appliedFilters
}) => {
  const [filters, setFilters] = useState<ServiceFiltersState>(
    appliedFilters || {
      search: '',
      priceType: undefined,
      priceFrom: undefined,
      priceTo: undefined
    }
  );

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
      priceType: undefined,
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
          <Col md={3}>
            <Form.Group>
              <Form.Label>Тип цены:</Form.Label>
              <Form.Select
                value={filters.priceType || ''}
                onChange={(e) => handleFilterChange('priceType', e.target.value || undefined)}
                className="filter-select"
              >
                <option value="">Все типы</option>
                <option value="one_time">Единовременная</option>
                <option value="monthly">Ежемесячная</option>
                <option value="yearly">Ежегодная</option>
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={3}>
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

          <Col md={3}>
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

          <Col md={3}>
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