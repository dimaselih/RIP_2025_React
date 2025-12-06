import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { 
  fetchCalculation, 
  updateCartItem, 
  removeCartItem, 
  formCalculation,
  deleteCalculation 
} from '../../store/thunks/calculationThunks';
import { CalculationTCO } from '../../api/Api';
import { Breadcrumbs } from '../../components/layout';
import { ROUTES, ROUTE_LABELS } from '../../utils/constants';
import '../../styles/calculation.css';

type CalculationStatus = NonNullable<CalculationTCO['status']>;

const statusMap: Record<CalculationStatus, string> = {
  draft: 'Черновик',
  formed: 'Сформирована',
  completed: 'Завершена',
  rejected: 'Отклонена',
  deleted: 'Удалена',
};

const CalculationPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, initialized } = useSelector((state: RootState) => state.auth);
  
  const [calculation, setCalculation] = useState<CalculationTCO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  
  // Даты для расчета
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    if (!initialized) return;
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!id) {
      navigate('/calculations_tco');
      return;
    }

    loadCalculation();
  }, [id, isAuthenticated, initialized, navigate, dispatch]);

  const loadCalculation = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      const result = await dispatch(fetchCalculation(Number(id))).unwrap();
      setCalculation(result);
      
      // Если уже есть даты, заполняем форму
      if (result.start_date) setStartDate(result.start_date);
      if (result.end_date) setEndDate(result.end_date);
    } catch (err: any) {
      console.error('Failed to load calculation:', err);
      setError('Ошибка загрузки заявки');
    } finally {
      setLoading(false);
    }
  };

  const updateLocalQuantity = (serviceId: number, quantity: number) => {
    setCalculation((prev) => {
      if (!prev?.calculation_services) return prev;
      return {
        ...prev,
        calculation_services: prev.calculation_services.map((item) =>
          item.service_details?.id === serviceId ? { ...item, quantity } : item
        ),
      };
    });
  };

  const handleQuantityChange = async (serviceId: number, newQuantity: number) => {
    if (!calculation || !calculation.id || newQuantity < 1) return;
    const calcId = calculation.id;
    const prevCalculation = calculation;
    // Оптимистичное обновление, чтобы не моргал весь экран
    updateLocalQuantity(serviceId, newQuantity);
    
    try {
      await dispatch(updateCartItem({
        calculationId: calcId,
        serviceId,
        quantity: newQuantity,
      })).unwrap();
    } catch (err: any) {
      console.error('Failed to update quantity:', err);
      // Откат при ошибке
      setCalculation(prevCalculation);
      alert('Ошибка обновления количества');
    }
  };

  const handleRemoveService = async (serviceId: number) => {
    if (!calculation || !calculation.id) return;
    const calcId = calculation.id;
    
    if (!confirm('Удалить услугу из заявки?')) return;
    
    try {
      await dispatch(removeCartItem({
        calculationId: calcId,
        serviceId,
      })).unwrap();
      
      // Перезагружаем заявку
      await loadCalculation();
    } catch (err: any) {
      console.error('Failed to remove service:', err);
      alert('Ошибка удаления услуги');
    }
  };

  const handleFormCalculation = async () => {
    if (!calculation || !calculation.id || !startDate || !endDate) {
      alert('Заполните даты начала и окончания эксплуатации');
      return;
    }
    const calcId = calculation.id;
    
    if (new Date(startDate) > new Date(endDate)) {
      alert('Дата начала не может быть позже даты окончания');
      return;
    }
    
    try {
      setFormLoading(true);
      await dispatch(formCalculation({
        id: calcId,
        startDate,
        endDate,
      })).unwrap();
      
      alert('Заявка успешно сформирована!');
      navigate('/calculations_tco');
    } catch (err: any) {
      console.error('Failed to form calculation:', err);
      alert('Ошибка формирования заявки');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteCalculation = async () => {
    if (!calculation || !calculation.id) return;
    
    const calcId = calculation.id;
    
    if (!confirm('Удалить заявку? Это действие необратимо.')) return;
    
    try {
      await dispatch(deleteCalculation(calcId)).unwrap();
      alert('Заявка удалена');
      navigate('/calculations_tco');
    } catch (err: any) {
      console.error('Failed to delete calculation:', err);
      alert('Ошибка удаления заявки');
    }
  };

  const formatPrice = (price: any): string => {
    if (price === null || price === undefined) return '0.00';
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2);
  };

  const getPriceTypeLabel = (priceType?: string): string => {
    switch (priceType) {
      case 'monthly':
        return '/мес';
      case 'yearly':
        return '/год';
      default:
        return '';
    }
  };

  if (!initialized || loading) {
    return (
      <div className="calculation-page">
        <div className="calculation-container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Загрузка заявки...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !calculation) {
    return (
      <div className="calculation-page">
        <div className="calculation-container">
          <div className="error-container">
            <p className="error-message">{error || 'Заявка не найдена'}</p>
            <button 
              className="retry-btn"
              onClick={() => navigate('/calculations_tco')}
            >
              Вернуться к списку
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isDraft = calculation.status === 'draft';
  const services = (calculation.calculation_services ?? []).filter(
    (item): item is typeof item & { service_details: NonNullable<typeof item.service_details>; quantity: number } =>
      !!item.service_details && typeof item.quantity === 'number'
  );
  const hasServices = services.length > 0;
  const statusLabel = calculation.status ? statusMap[calculation.status as CalculationStatus] : 'Статус неизвестен';

  return (
    <div className="calculation-page">
      <Breadcrumbs 
        crumbs={[
          { label: ROUTE_LABELS.CALCULATIONS_TCO, path: ROUTES.CALCULATIONS_TCO },
          { label: calculation && calculation.id ? `Заявка #${calculation.id}` : ROUTE_LABELS.CALCULATION_TCO }
        ]} 
      />
      <div className="calculation-container">
        <div className="calculation-header">
          <div className="calculation-header-left">
            <h1 className="calculation-title">Заявка #{calculation.id ?? '—'}</h1>
            <span className={`calculation-status status-${calculation.status}`}>
              {statusLabel}
            </span>
          </div>
          <button 
            className="back-btn"
            onClick={() => navigate('/calculations_tco')}
          >
            📋 Все заявки
          </button>
        </div>

        <div className="calculation-info">
          <div className="calculation-info-item">
            <span className="info-label">Дата создания:</span>
            <span className="info-value">
              {calculation.created_at ? new Date(calculation.created_at).toLocaleDateString('ru-RU') : '—'}
            </span>
          </div>
          {calculation.formed_at && (
            <div className="calculation-info-item">
              <span className="info-label">Дата формирования:</span>
              <span className="info-value">{new Date(calculation.formed_at).toLocaleDateString('ru-RU')}</span>
            </div>
          )}
          {calculation.start_date && (
            <div className="calculation-info-item">
              <span className="info-label">Период обслуживания:</span>
              <span className="info-value">
                {calculation.start_date ? new Date(calculation.start_date).toLocaleDateString('ru-RU') : '—'} - {calculation.end_date ? new Date(calculation.end_date).toLocaleDateString('ru-RU') : '—'}
              </span>
            </div>
          )}
          {calculation.total_cost !== null && calculation.total_cost !== undefined && (
            <div className="calculation-info-item">
              <span className="info-label">Общая стоимость:</span>
              <span className="info-value total-cost">{formatPrice(calculation.total_cost)} ₽</span>
            </div>
          )}
          {calculation.duration_months && (
            <div className="calculation-info-item">
              <span className="info-label">Срок эксплуатации:</span>
              <span className="info-value">{calculation.duration_months} мес.</span>
            </div>
          )}
        </div>

        {/* Поля для ввода дат (только для черновиков) */}
        {isDraft && (
          <div className="date-fields-section">
            <div className="date-field-group">
              <label htmlFor="start-date" className="date-field-label">
                ДАТА НАЧАЛА ЭКСПЛУАТАЦИИ
              </label>
              <input
                id="start-date"
                type="date"
                className="date-field-input"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="date-field-group">
              <label htmlFor="end-date" className="date-field-label">
                ДАТА КОНЦА ЭКСПЛУАТАЦИИ
              </label>
              <input
                id="end-date"
                type="date"
                className="date-field-input"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate}
              />
            </div>
          </div>
        )}

        {!hasServices ? (
          <div className="no-services">
            <p>В заявке пока нет услуг</p>
            {isDraft && (
              <button 
                className="add-services-btn"
                onClick={() => navigate('/catalog_tco')}
              >
                Перейти к каталогу
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="services-list">
              <h2 className="services-title">Услуги в заявке</h2>
              <div className="calculation-services-list">
                {services.map((item) => {
                  const serviceId = item.service_details.id;
                  const quantityValue = item.quantity ?? 1;
                  
                  return (
                  <div key={item.id ?? serviceId ?? Math.random()} className="calculation-service-item">
                    <div className="calculation-service-item-image">
                      {item.service_details.image_url ? (
                        <img 
                          src={item.service_details.image_url} 
                          alt={item.service_details.name}
                        />
                      ) : (
                        <div className="calculation-service-item-no-image">Нет изображения</div>
                      )}
                    </div>
                    <div className="calculation-service-item-content">
                      <h3 className="calculation-service-item-name">{item.service_details.name}</h3>
                      <p className="calculation-service-item-description">{item.service_details.description}</p>
                      <div className="calculation-service-item-footer">
                        <div className="calculation-service-item-price">
                          <span className="price-label">Цена:</span>
                          <span className="price-value">
                            {formatPrice(item.service_details.price)} ₽{getPriceTypeLabel(item.service_details.price_type)}
                          </span>
                        </div>
                        {isDraft ? (
                          <div className="calculation-service-item-controls">
                            <div className="quantity-control">
                              <button 
                                className="quantity-btn"
                                onClick={() => { if (!serviceId) return; handleQuantityChange(serviceId, quantityValue - 1); }}
                                disabled={!serviceId || quantityValue <= 1}
                              >
                                −
                              </button>
                              <span className="quantity-value">{quantityValue}</span>
                              <button 
                                className="quantity-btn"
                                onClick={() => { if (!serviceId) return; handleQuantityChange(serviceId, quantityValue + 1); }}
                                disabled={!serviceId}
                              >
                                +
                              </button>
                            </div>
                            <button 
                              className="remove-service-btn"
                              onClick={() => { if (!serviceId) return; handleRemoveService(serviceId); }}
                              disabled={!serviceId}
                              title="Удалить услугу"
                            >
                              🗑️
                            </button>
                          </div>
                        ) : (
                          <div className="calculation-service-item-quantity">
                            <span className="quantity-label">Количество:</span>
                            <span className="quantity-value">{item.quantity}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );})}
              </div>
            </div>

            {isDraft && (
              <div className="calculation-actions">
                <button 
                  className="form-calculation-btn"
                  onClick={handleFormCalculation}
                  disabled={!hasServices || !startDate || !endDate || formLoading}
                >
                  {formLoading ? 'Формирование...' : 'Сформировать заявку'}
                </button>
                <button 
                  className="delete-calculation-btn"
                  onClick={handleDeleteCalculation}
                  disabled={formLoading}
                >
                  Удалить заявку
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CalculationPage;

