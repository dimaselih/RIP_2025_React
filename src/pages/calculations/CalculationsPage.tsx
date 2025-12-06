import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { fetchCalculations, completeCalculation } from '../../store/thunks/calculationThunks';
import { CalculationTCO } from '../../api/Api';
import { Breadcrumbs } from '../../components/layout';
import { ROUTE_LABELS } from '../../utils/constants';
import '../../styles/calculations.css';

type CalculationStatus = NonNullable<CalculationTCO['status']>;

const statusLabels: Record<CalculationStatus, string> = {
  draft: 'Черновик',
  formed: 'Сформирована',
  completed: 'Завершена',
  rejected: 'Отклонена',
  deleted: 'Удалена',
};

const statusColors: Record<CalculationStatus, string> = {
  draft: 'status-draft',
  formed: 'status-formed',
  completed: 'status-completed',
  rejected: 'status-rejected',
  deleted: 'status-deleted',
};

const CalculationsPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, initialized, user } = useSelector((state: RootState) => state.auth);
  
  const [calculations, setCalculations] = useState<CalculationTCO[]>([]);
  const [loading, setLoading] = useState(true); // первичная загрузка
  const [refreshing, setRefreshing] = useState(false); // обновления по short-poll
  const [error, setError] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);
  
  // Фильтры
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [dateFromFilter, setDateFromFilter] = useState<string>('');
  const [dateToFilter, setDateToFilter] = useState<string>('');

  const loadCalculations = async (options?: { silent?: boolean }) => {
    const silent = options?.silent;
    try {
      if (silent) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      
      // Формируем параметры для фильтрации
      const params: any = {};
      if (statusFilter) params.status = statusFilter;
      if (dateFromFilter) params.date_from = dateFromFilter;
      if (dateToFilter) params.date_to = dateToFilter;
      
      const result = await dispatch(fetchCalculations(params)).unwrap();
      setCalculations(result);
    } catch (err: any) {
      console.error('Failed to load calculations:', err);
      setError('Ошибка загрузки заявок');
    } finally {
      if (silent) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    // Ждем пока проверится авторизация (initialized станет true)
    if (!initialized) return;
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Загружаем заявки
    loadCalculations();
    const id = setInterval(() => loadCalculations({ silent: true }), 5000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, initialized, navigate, statusFilter, dateFromFilter, dateToFilter]);

  const handleClearFilters = () => {
    setStatusFilter('');
    setDateFromFilter('');
    setDateToFilter('');
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatCost = (cost?: number | string | null) => {
    if (cost === null || cost === undefined) return '—';
    const num = typeof cost === 'string' ? parseFloat(cost) : cost;
    if (Number.isNaN(num)) return '—';
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
    }).format(num);
  };

  const handleRowClick = (id: number) => {
    navigate(`/calculation_tco/${id}`);
  };

  const handleStatusChange = async (id: number, action: 'complete' | 'reject') => {
    try {
      setActionLoadingId(id);
      await dispatch(completeCalculation({ id, action })).unwrap();
      await loadCalculations({ silent: true });
    } catch (err: any) {
      alert(err || 'Не удалось сменить статус');
    } finally {
      setActionLoadingId(null);
    }
  };

  if (!initialized || loading) {
    return (
      <div className="calculations-page">
        <div className="calculations-container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Загрузка заявок...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !refreshing) {
    return (
      <div className="calculations-page">
        <div className="calculations-container">
          <div className="error-container">
            <p className="error-message">{error}</p>
            <button className="retry-btn" onClick={() => window.location.reload()}>
              Повторить
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="calculations-page">
      <Breadcrumbs crumbs={[{ label: ROUTE_LABELS.CALCULATIONS_TCO }]} />
      <div className="calculations-container">
        <div className="calculations-header">
          <h1 className="calculations-title">Заявки</h1>
          {refreshing && <span className="small-spinner" aria-label="Обновление..." />}
        </div>

        {/* Фильтры */}
        <div className="calculations-filters">
          <div className="filter-group">
            <label htmlFor="status-filter" className="filter-label">Статус</label>
            <select
              id="status-filter"
              className="filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Все</option>
              <option value="formed">Сформирована</option>
              <option value="completed">Завершена</option>
              <option value="rejected">Отклонена</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="date-from-filter" className="filter-label">Дата начала</label>
            <input
              id="date-from-filter"
              type="date"
              className="filter-input"
              value={dateFromFilter}
              onChange={(e) => setDateFromFilter(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label htmlFor="date-to-filter" className="filter-label">Дата окончания</label>
            <input
              id="date-to-filter"
              type="date"
              className="filter-input"
              value={dateToFilter}
              onChange={(e) => setDateToFilter(e.target.value)}
              min={dateFromFilter}
            />
          </div>

          <button 
            className="filter-clear-btn"
            onClick={handleClearFilters}
            disabled={!statusFilter && !dateFromFilter && !dateToFilter}
          >
            Сбросить
          </button>
        </div>

        {calculations.length === 0 && !loading ? (
          <div className="no-calculations">
            <p>У вас пока нет заявок</p>
            <p className="no-calculations-hint">
              Заявка создастся автоматически при добавлении первой услуги в корзину
            </p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="calculations-table">
              <thead>
                <tr>
                  <th>№</th>
                  <th>Статус</th>
                  <th>Дата создания</th>
                  <th>Дата формирования</th>
                  <th>Стоимость</th>
                  <th>Период (мес.)</th>
                  {(user?.is_staff || user?.is_superuser) && <th>Действия</th>}
                </tr>
              </thead>
              <tbody>
                {calculations
                  .filter(
                    (calc): calc is CalculationTCO & { id: number; status: CalculationStatus } =>
                      typeof calc.id === 'number' &&
                      !!calc.status &&
                      calc.status !== 'draft' &&
                      calc.status !== 'deleted'
                  )
                  .map((calc) => (
                    <tr 
                      key={calc.id} 
                      className="calculation-row"
                      onClick={() => handleRowClick(calc.id)}
                    >
                      <td>{calc.id}</td>
                      <td>
                        <span className={`status-badge ${statusColors[calc.status]}`}>
                          {statusLabels[calc.status]}
                        </span>
                      </td>
                      <td>{formatDate(calc.created_at)}</td>
                      <td>{formatDate(calc.formed_at)}</td>
                      <td className="cost-cell">{formatCost(calc.total_cost)}</td>
                      <td>{calc.duration_months || '—'}</td>
                      {(user?.is_staff || user?.is_superuser) && (
                        <td className="actions-cell">
                          <button
                            className="status-btn success"
                            onClick={(e) => { e.stopPropagation(); handleStatusChange(calc.id, 'complete'); }}
                            disabled={actionLoadingId === calc.id || calc.status !== 'formed'}
                          >
                            {actionLoadingId === calc.id ? '...' : 'Завершить'}
                          </button>
                          <button
                            className="status-btn danger"
                            onClick={(e) => { e.stopPropagation(); handleStatusChange(calc.id, 'reject'); }}
                            disabled={actionLoadingId === calc.id || calc.status !== 'formed'}
                          >
                            Отклонить
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalculationsPage;

