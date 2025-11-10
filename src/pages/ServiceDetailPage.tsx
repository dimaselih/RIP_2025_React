import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { Breadcrumbs } from '../components/layout';
import { useService } from '../hooks/useApi';
import { IMAGES } from '../utils/imagePaths';
import '../styles/service_detail.css';

const DEFAULT_IMAGE_URL = IMAGES.DEFAULT_SERVICE;

export const ServiceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const serviceId = id ? parseInt(id) : 0;
  const { service, loading, error } = useService(serviceId);


  const handleGoBack = () => {
    navigate('/catalog_tco');
  };

  if (loading) {
    return (
      <Container fluid className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <div className="mt-2">Загрузка услуги...</div>
        </div>
      </Container>
    );
  }

  if (error || !service) {
    return (
      <Container fluid className="service-detail-page">
        <Alert variant="danger">
          <Alert.Heading>Ошибка</Alert.Heading>
          <p>{error || 'Услуга не найдена'}</p>
          <Button onClick={handleGoBack} variant="outline-danger">Вернуться к каталогу</Button>
        </Alert>
      </Container>
    );
  }

  const imageUrl = service.image_url || DEFAULT_IMAGE_URL;
  const priceText = service.price ? `${service.price} ₽` : '';
  const priceTypeText = service.price_type === 'monthly' ? '/мес' : 
                       service.price_type === 'yearly' ? '/год' : '';

  return (
    <Container fluid className="service-detail-page">
      {/* Breadcrumbs */}
      <Breadcrumbs />
      
      {/* Back Section */}
      <div className="home-section">
        <Button onClick={handleGoBack} variant="outline-primary" className="home-button">
          НАЗАД
        </Button>
      </div>

      {/* Main Content */}
      <Row className="service-detail-content">
        {/* Service Image */}
        <Col md={6} className="service-image-large">
          <Card.Img 
            src={imageUrl} 
            alt={service.name} 
            className="detail-image"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = DEFAULT_IMAGE_URL;
            }}
          />
        </Col>

        {/* Service Info */}
        <Col md={6} className="service-info-large">
          <Card className="border-0 bg-transparent">
            <Card.Body className="p-0">
              <Card.Title as="h1" className="service-title-large">{service.name}</Card.Title>

              {service.price && (
                <Card.Text className="service-price-large">
                  {priceText}{priceTypeText}
                </Card.Text>
              )}

              {service.fullDescription && (
                <div className="included-services-section">
                  <Card.Title as="h2" className="section-title">Включенные услуги</Card.Title>
                  <Card.Text className="description-text">
                    {service.fullDescription.split('\r\n').map((line, index) => (
                      <div key={index}>{line}</div>
                    ))}
                  </Card.Text>
                </div>
              )}

              <div className="service-actions">
                <Button
                  variant="primary"
                  className="add-btn-large"
                >
                  ДОБАВИТЬ В КОРЗИНУ
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ServiceDetailPage;