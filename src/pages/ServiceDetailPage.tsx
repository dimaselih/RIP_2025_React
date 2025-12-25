import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { addServiceToCart } from '../store/thunks/calculationThunks';
import { fetchService } from '../store/thunks/serviceThunks';
import { Breadcrumbs } from '../components/layout';
import { ROUTES, ROUTE_LABELS } from '../utils/constants';
import { IMAGES } from '../utils/imagePaths';
import { ServiceTCOList } from '../api/Api';
import { MediaCarousel } from '../components/ui/MediaCarousel';
import { dest_api } from '../config/target_config';
import '../styles/service_detail.css';

const DEFAULT_IMAGE_URL = IMAGES.DEFAULT_SERVICE;

interface MediaItem {
  id: number;
  file_url: string;
  file_type: 'photo' | 'video';
}

// Функция для преобразования URL MinIO в прокси URL (для разработки)
const normalizeMediaUrl = (url: string): string => {
  if (import.meta.env.DEV && url && url.startsWith('http://127.0.0.1:9000/')) {
    // В режиме разработки используем прокси
    return url.replace('http://127.0.0.1:9000', '/minio');
  }
  return url;
};

export const ServiceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  const serviceId = id ? parseInt(id) : 0;
  const [service, setService] = useState<ServiceTCOList | null>(null);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    const loadService = async () => {
      if (!serviceId) {
        setError('Услуга не найдена');
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const result = await dispatch(fetchService(serviceId)).unwrap();
        setService(result);
        
        // Загружаем media для услуги
        try {
          const apiBaseUrl = dest_api || (import.meta.env.DEV ? '' : 'http://localhost:8000');
          const mediaResponse = await fetch(`${apiBaseUrl}/api/service_tco/${serviceId}/media/`, {
            credentials: 'include',
          });
          if (mediaResponse.ok) {
            const mediaData = await mediaResponse.json();
            
            // Сначала добавляем media из таблицы (приоритет - они идут по id)
            const allMedia: MediaItem[] = [];
            const existingUrls = new Set<string>();
            
            // Добавляем media из таблицы (исключаем дубликаты по URL)
            if (mediaData && Array.isArray(mediaData) && mediaData.length > 0) {
              mediaData.forEach((item: any) => {
                const fileUrl = item.file_url;
                if (fileUrl && !existingUrls.has(fileUrl)) {
                  const normalizedUrl = normalizeMediaUrl(fileUrl);
                  allMedia.push({
                    id: item.id || 0,
                    file_url: normalizedUrl,
                    file_type: (item.file_type === 'video' ? 'video' : 'photo')
                  });
                  existingUrls.add(fileUrl); // Используем оригинальный URL для проверки дубликатов
                }
              });
            }
            
            // Затем добавляем image_url из услуги в начало, если его еще нет
            if (result.image_url && !existingUrls.has(result.image_url)) {
              const normalizedImageUrl = normalizeMediaUrl(result.image_url);
              allMedia.unshift({
                id: -1, // Отрицательный ID для image_url
                file_url: normalizedImageUrl,
                file_type: 'photo'
              });
            }
            
            setMedia(allMedia);
          } else {
            // Если media не загрузились, но есть image_url - используем его
            if (result.image_url) {
              setMedia([{
                id: 0,
                file_url: normalizeMediaUrl(result.image_url),
                file_type: 'photo'
              }]);
            } else {
              setMedia([]);
            }
          }
        } catch (mediaErr) {
                // Если media не загрузились, но есть image_url - используем его
                if (result.image_url) {
                  setMedia([{
                    id: 0,
                    file_url: normalizeMediaUrl(result.image_url),
                    file_type: 'photo'
                  }]);
                } else {
                  setMedia([]);
                }
        }
      } catch (err: any) {
        setError(err instanceof Error ? err.message : 'Ошибка загрузки услуги');
      } finally {
        setLoading(false);
      }
    };

    loadService();
  }, [dispatch, serviceId]);

  const handleGoBack = () => {
    navigate('/catalog_tco');
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!service || !service.id) return;

    try {
      setIsAddingToCart(true);
      await dispatch(addServiceToCart({ serviceId })).unwrap();
    } catch (error: any) {
      alert('Ошибка добавления в корзину. Попробуйте позже.');
    } finally {
      setIsAddingToCart(false);
    }
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
      <Breadcrumbs 
        crumbs={[
          { label: ROUTE_LABELS.CATALOG_TCO, path: ROUTES.CATALOG_TCO },
          { label: service.name || 'Детали услуги' }
        ]} 
      />
      
      {/* Back Section */}
      <div className="home-section">
        <Button onClick={handleGoBack} variant="outline-primary" className="home-button">
          НАЗАД
        </Button>
      </div>

      {/* Main Content */}
      <Row className="service-detail-content">
        {/* Service Media Carousel */}
        <Col md={6} className="service-image-large">
          {media.length > 0 ? (
            <MediaCarousel 
              media={media} 
              fallbackImageUrl={service.image_url || DEFAULT_IMAGE_URL} 
            />
          ) : (
            <img 
              src={service.image_url || DEFAULT_IMAGE_URL} 
              alt={service.name || 'Service'} 
              className="detail-image"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = DEFAULT_IMAGE_URL;
              }}
            />
          )}
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
                  <div className="description-text">
                    {service.fullDescription.split('\r\n').map((line, index) => (
                      <div key={index}>{line}</div>
                    ))}
                  </div>
                </div>
              )}

              <div className="service-actions">
                <Button
                  variant="primary"
                  className="add-btn-large"
                  onClick={handleAddToCart}
                  disabled={!isAuthenticated || isAddingToCart}
                  title={!isAuthenticated ? 'Войдите, чтобы добавить услугу' : 'Добавить в корзину'}
                >
                  {isAddingToCart ? 'ДОБАВЛЕНИЕ...' : 'ДОБАВИТЬ В КОРЗИНУ'}
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