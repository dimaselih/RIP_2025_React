import React, { useState } from 'react';
import { Form, InputGroup, Button, Badge } from 'react-bootstrap';

interface SearchAndCartProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearchSubmit: (query: string) => void;
  cartCount: number;
  onCartClick: () => void;
  onFiltersToggle: () => void;
  isFiltersOpen: boolean;
}

export const SearchAndCart: React.FC<SearchAndCartProps> = ({
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  cartCount,
  onCartClick,
  onFiltersToggle,
  isFiltersOpen
}) => {
  const [localQuery, setLocalQuery] = useState(searchQuery);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalQuery(value);
    onSearchChange(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchSubmit(localQuery);
  };

  const handleClearSearch = () => {
    setLocalQuery('');
    onSearchChange('');
    onSearchSubmit('');
  };

  return (
    <div className="search-cart-section">
      <div className="search-container">
        <Form onSubmit={handleSubmit} className="search-form">
          <InputGroup className="search-box">
            <Form.Control
              type="text"
              placeholder="Поиск услуг..."
              className="search-input"
              value={localQuery}
              onChange={handleInputChange}
            />
            {localQuery && (
              <Button
                variant="outline-secondary"
                onClick={handleClearSearch}
                title="Очистить поиск"
                className="clear-search"
              >
                ×
              </Button>
            )}
          </InputGroup>
        </Form>
        <Button
          variant={isFiltersOpen ? "primary" : "outline-primary"}
          className="filters-toggle"
          onClick={onFiltersToggle}
        >
          Фильтры
        </Button>
      </div>
      <div
        className={`cart-container ${cartCount > 0 ? 'cart-link' : 'cart-inactive'}`}
        onClick={cartCount > 0 ? onCartClick : undefined}
        style={{ cursor: cartCount > 0 ? 'pointer' : 'default' }}
      >
        <img
          src="http://127.0.0.1:9000/technical/cart.png"
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
