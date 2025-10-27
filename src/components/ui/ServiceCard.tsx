import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { ServiceTCO } from '../../types/api';

interface ServiceCardProps {
  service: ServiceTCO;
  onViewDetails: (serviceId: number) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  onViewDetails
}) => {

  const handleViewDetails = (e: React.MouseEvent) => {
    e.preventDefault();
    onViewDetails(service.id);
  };

  // Изображение по умолчанию, если image_url пустое
  const defaultImage = 'http://127.0.0.1:9000/technical/default-service.png';
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
            variant="primary"
            className="add-btn"
          >
            ДОБАВИТЬ
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};