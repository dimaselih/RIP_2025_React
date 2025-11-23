import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { fetchCalculations } from '../../store/thunks/calculationThunks';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
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
  const { isAuthenticated, initialized } = useSelector((state: RootState) => state.auth);
  
  const [calculations, setCalculations] = useState<CalculationTCO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Фильтры
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [dateFromFilter, setDateFromFilter] = useState<string>('');
  const [dateToFilter, setDateToFilter] = useState<string>('');

  useEffect(() => {
    // Ждем пока проверится авторизация (initialized станет true)
    if (!initialized) return;
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Загружаем заявки
    loadCalculations();
  }, [isAuthenticated, initialized, navigate, dispatch, statusFilter, dateFromFilter, dateToFilter]);

  const loadCalculations = async () => {
    try {
      setLoading(true);
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
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    setStatusFilter('');
    setDateFromFilter('');
    setDateToFilter('');
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatCost = (cost?: number) => {
    if (!cost) return '—';
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
    }).format(cost);
  };

  const handleRowClick = (id: number) => {
    navigate(`/calculation_tco/${id}`);
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

  if (error) {
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
          <h1 className="calculations-title">Мои заявки</h1>
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
              <option value="draft">Черновик</option>
              <option value="formed">Сформирована</option>
              <option value="completed">Завершена</option>
              <option value="rejected">Отклонена</option>
              <option value="deleted">Удалена</option>
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
                </tr>
              </thead>
              <tbody>
                {calculations.map((calc) => (
                  <tr 
                    key={calc.id} 
                    onClick={() => handleRowClick(calc.id)}
                    className="calculation-row"
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

