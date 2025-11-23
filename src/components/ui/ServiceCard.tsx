import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { ServiceTCOList } from '../../api/Api';
import { IMAGES } from '../../utils/imagePaths';

interface ServiceCardProps {
  service: ServiceTCOList;
  onViewDetails: (serviceId: number) => void;
  onAddToCart?: (serviceId: number) => void;
  isAuthenticated?: boolean;
  isAddingToCart?: boolean;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  onViewDetails,
  onAddToCart,
  isAuthenticated = false,
  isAddingToCart = false
}) => {

  const handleViewDetails = (e: React.MouseEvent) => {
    e.preventDefault();
    onViewDetails(service.id);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onAddToCart && isAuthenticated) {
      onAddToCart(service.id);
    }
  };

  // Изображение по умолчанию, если image_url пустое
  const defaultImage = IMAGES.DEFAULT_SERVICE;
  const imageUrl = service.image_url || defaultImage;

  return (
    <Card className="service-card">
      <Card.Img
        variant="top"
        src={imageUrl}
        alt={service.name}
        className="card-image"
        onError={(e) => {
          // Если изображение не загрузилось, используем изображение по умолчанию
          const target = e.target as HTMLImageElement;
          target.src = defaultImage;
        }}
      />
      <Card.Body className="service-content">
        <div className="service-info">
          <Card.Title className="service-title">{service.name}</Card.Title>
          <Card.Text className="service-description">{service.description}</Card.Text>
        </div>
        <div className="service-actions">
          <Button
            onClick={handleViewDetails}
            variant="outline-primary"
            className="details-btn"
          >
            ПОДРОБНЕЕ
          </Button>
          <Button
            onClick={handleAddToCart}
            variant="primary"
            className="add-btn"
            disabled={!isAuthenticated || isAddingToCart}
            title={!isAuthenticated ? 'Войдите, чтобы добавить услугу' : 'Добавить в корзину'}
          >
            {isAddingToCart ? 'ДОБАВЛЕНИЕ...' : 'ДОБАВИТЬ'}
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};