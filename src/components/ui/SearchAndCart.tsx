import React, { useState, useEffect } from 'react';
import { Form, InputGroup, Button, Badge } from 'react-bootstrap';
import { IMAGES } from '../../utils/imagePaths';

interface SearchAndCartProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearchSubmit: (query: string) => void;
  cartCount: number;
  onCartClick: () => void;
  priceFrom?: number;
  priceTo?: number;
  onPriceFromChange: (value: number | undefined) => void;
  onPriceToChange: (value: number | undefined) => void;
}

export const SearchAndCart: React.FC<SearchAndCartProps> = ({
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  cartCount,
  onCartClick,
  priceFrom,
  priceTo,
  onPriceFromChange,
  onPriceToChange
}) => {
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [localPriceFrom, setLocalPriceFrom] = useState<string>(priceFrom?.toString() || '');
  const [localPriceTo, setLocalPriceTo] = useState<string>(priceTo?.toString() || '');

  // Синхронизируем локальные значения с Redux при изменении извне
  useEffect(() => {
    setLocalPriceFrom(priceFrom?.toString() || '');
  }, [priceFrom]);

  useEffect(() => {
    setLocalPriceTo(priceTo?.toString() || '');
  }, [priceTo]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalQuery(value);
    // Не применяем поиск сразу, только обновляем локальное состояние
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      applyAllFilters();
    }
  };

  const handleClearSearch = () => {
    setLocalQuery('');
    onSearchChange('');
    onSearchSubmit('');
  };

  const handlePriceFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalPriceFrom(value);
  };

  const handlePriceToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalPriceTo(value);
  };

  const handlePriceFromKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      applyAllFilters();
    }
  };

  const handlePriceToKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      applyAllFilters();
    }
  };

  const applyAllFilters = () => {
    // Применяем поисковый запрос
    onSearchSubmit(localQuery);
    
    // Применяем фильтры по цене
    const fromValue = localPriceFrom.trim();
    const toValue = localPriceTo.trim();
    onPriceFromChange(fromValue ? Number(fromValue) : undefined);
    onPriceToChange(toValue ? Number(toValue) : undefined);
  };

  return (
    <div className="search-cart-section">
      <div className="search-container">
        <Form onSubmit={(e) => { e.preventDefault(); applyAllFilters(); }} className="search-form">
          <InputGroup className="search-box">
            <Form.Control
              type="text"
              placeholder="Поиск услуг..."
              className="search-input"
              value={localQuery}
              onChange={handleInputChange}
              onKeyDown={handleSearchKeyDown}
            />
            {localQuery && (
              <Button
                variant="outline-secondary"
                onClick={handleClearSearch}
                title="Очистить поиск"
                className="clear-search"
                type="button"
              >
                ×
              </Button>
            )}
          </InputGroup>
        </Form>
        
        {/* Фильтры по цене */}
        <div className="price-filters">
          <Form.Control
            type="number"
            placeholder="Цена от"
            className="price-filter-input"
            value={localPriceFrom}
            onChange={handlePriceFromChange}
            onKeyDown={handlePriceFromKeyDown}
            min="0"
          />
          <span className="price-filter-separator">—</span>
          <Form.Control
            type="number"
            placeholder="Цена до"
            className="price-filter-input"
            value={localPriceTo}
            onChange={handlePriceToChange}
            onKeyDown={handlePriceToKeyDown}
            min="0"
          />
          <Button
            variant="primary"
            onClick={applyAllFilters}
            className="apply-price-filters-btn"
            title="Применить фильтры и поиск"
            type="button"
          >
            Поиск
          </Button>
        </div>
      </div>
      <div
        className={`cart-container ${cartCount > 0 ? 'cart-link' : 'cart-inactive'}`}
        onClick={cartCount > 0 ? onCartClick : undefined}
        style={{ cursor: cartCount > 0 ? 'pointer' : 'default' }}
      >
        <img
          src={IMAGES.CART}
          alt="Cart"
          className="cart-img"
        />
        <Badge bg={cartCount > 0 ? "primary" : "secondary"} className="cart-count">
          {cartCount}
        </Badge>
      </div>
    </div>
  );
};
