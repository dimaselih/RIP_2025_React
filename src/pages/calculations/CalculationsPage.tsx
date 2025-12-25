import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { fetchCalculations, fetchCalculation, completeCalculation } from '../../store/thunks/calculationThunks';
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
  const [creatorFilter, setCreatorFilter] = useState<string>('');
  
  // Фильтры
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [formedDateFilter, setFormedDateFilter] = useState<string>('');

  const getCreator = (calc: any) =>
    (calc?.creatorDisplay ??
      calc?.creator_username ??
      calc?.creatorUsername ??
      calc?.creator ??
      '').toString().toLowerCase();

  const normalizeCalc = (item: any) => ({
    ...item,
    // нормализуем названия полей дат, если бек вернёт camelCase
    start_date: item.start_date ?? item.startDate ?? null,
    end_date: item.end_date ?? item.endDate ?? null,
  });

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
      if (formedDateFilter) {
        params.date_from = formedDateFilter;
        params.date_to = formedDateFilter; // Фильтруем по точной дате
      }
      
      const result = await dispatch(fetchCalculations(params)).unwrap();
      const mapped = result.map((c: any) =>
        normalizeCalc({
          ...c,
          creatorDisplay:
            c?.creator_username ??
            c?.creator ??
            c?.creatorUsername ??
            c?.creator_email ??
            '',
        })
      );
      
      // Догружаем start_date / end_date, если список их не вернул
      const needDetails = mapped.filter((c) => !c.start_date || !c.end_date);
      if (needDetails.length > 0) {
        try {
          const details = await Promise.all(
            needDetails.map(async (c) => {
              try {
                const full = await dispatch(fetchCalculation(c.id as number)).unwrap();
                return full;
              } catch {
                return null;
              }
            })
          );

          const detailById = new Map(
            details
              .filter(Boolean)
              .map((d: any) => [d.id, d])
          );

          const merged = mapped.map((item) => {
            const detail = detailById.get(item.id);
            return detail ? normalizeCalc({ ...item, ...detail }) : item;
          });
          setCalculations(merged);
        } catch {
          // если не удалось догрузить детали — показываем как есть
          setCalculations(mapped);
        }
      } else {
        setCalculations(mapped);
      }
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
  }, [isAuthenticated, initialized, navigate, statusFilter, formedDateFilter]);

  const handleClearFilters = () => {
    setStatusFilter('');
    setFormedDateFilter('');
    setCreatorFilter('');
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

  const handleStatusChange = async (
    id: number,
    action: 'complete' | 'reject'
  ) => {
    setActionLoadingId(id);
    try {
      // Отправляем действие
      await dispatch(completeCalculation({ id, action })).unwrap();

      // Подождём немного, чтобы сервер успел обновить
      await new Promise((res) => setTimeout(res, 1500));

      // Обновляем список заявок и ждём завершения
      await loadCalculations({ silent: true });
      
      // Убираем спиннер только после полного обновления
      setActionLoadingId(null);
    } catch (err: any) {
      console.error('Ошибка смены статуса:', err);
      alert(err || 'Не удалось сменить статус');
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

  const visibleCalculations = calculations
    .filter(
      (calc): calc is CalculationTCO & { id: number; status: CalculationStatus } =>
        typeof calc.id === 'number' &&
        !!calc.status &&
        calc.status !== 'draft' &&
        calc.status !== 'deleted'
    )
    .filter((calc: any) =>
      creatorFilter ? getCreator(calc).includes(creatorFilter.toLowerCase()) : true
    );

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
            <label htmlFor="formed-date-filter" className="filter-label">Дата формирования</label>
            <input
              id="formed-date-filter"
              type="date"
              className="filter-input"
              value={formedDateFilter}
              onChange={(e) => setFormedDateFilter(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label htmlFor="creator-filter" className="filter-label">Создатель</label>
            <input
              id="creator-filter"
              type="text"
              className="filter-input"
              value={creatorFilter}
              onChange={(e) => setCreatorFilter(e.target.value)}
              placeholder="email / имя"
            />
          </div>

          <button 
            className="filter-clear-btn"
            onClick={handleClearFilters}
            disabled={!statusFilter && !formedDateFilter && !creatorFilter}
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
          <div className="cards-wrapper">
            {visibleCalculations.map((calc) => (
              <div
                key={calc.id}
                className="calculation-card"
                onClick={() => handleRowClick(calc.id)}
              >
                <div className="card-top">
                  <div className="card-title">Счёт №{calc.id}</div>
                  <span className={`status-badge ${statusColors[calc.status]}`}>
                    {statusLabels[calc.status]}
                  </span>
                </div>

                <div className="card-grid">
                  <div className="card-cell">
                    <div className="card-label">Статус</div>
                    <div className="card-value">{statusLabels[calc.status]}</div>
                  </div>
                  <div className="card-cell">
                    <div className="card-label">Дата создания</div>
                    <div className="card-value">{formatDate(calc.created_at)}</div>
                  </div>
                  <div className="card-cell">
                    <div className="card-label">Дата формирования</div>
                    <div className="card-value">{formatDate(calc.formed_at)}</div>
                  </div>
                  <div className="card-cell">
            <div className="card-label">Общая стоимость</div>
                    <div className="card-value card-accent">{formatCost(calc.total_cost)}</div>
                  </div>
                  <div className="card-cell">
                    <div className="card-label">Создатель</div>
                    <div className="card-value">
                      {(calc as any).creatorDisplay ||
                        (calc as any).creator_username ||
                        (calc as any).creator ||
                        '—'}
                    </div>
                  </div>
                </div>

                {(user?.is_staff || user?.is_superuser) && (
                  <div className="card-actions">
                    {actionLoadingId === calc.id ? (
                      <div className="card-admin-loading">
                        <span className="small-spinner" aria-label="Выполняется..." />
                      </div>
                    ) : (
                      <div className="card-admin-actions">
                        <button
                          className="status-btn success"
                          onClick={(e) => {
                            e.stopPropagation();
                          handleStatusChange(calc.id, 'complete');
                          }}
                          disabled={calc.status !== 'formed'}
                        >
                          Завершить
                        </button>
                        <button
                          className="status-btn danger"
                          onClick={(e) => {
                            e.stopPropagation();
                          handleStatusChange(calc.id, 'reject');
                          }}
                          disabled={calc.status !== 'formed'}
                        >
                          Отклонить
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CalculationsPage;

