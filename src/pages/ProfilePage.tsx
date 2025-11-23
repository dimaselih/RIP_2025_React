import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { updateUserProfile } from '../store/thunks/authThunks';
import { Breadcrumbs } from '../components/layout';
import { ROUTE_LABELS } from '../utils/constants';
import '../styles/profile.css';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated, initialized, loading } = useSelector((state: RootState) => state.auth);

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!initialized) return;
    
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, initialized, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');
    setSuccessMessage('');

    // Валидация
    if (!oldPassword || !newPassword || !confirmPassword) {
      setValidationError('Заполните все поля');
      return;
    }

    if (newPassword.length < 6) {
      setValidationError('Новый пароль должен содержать минимум 6 символов');
      return;
    }

    if (newPassword !== confirmPassword) {
      setValidationError('Пароли не совпадают');
      return;
    }

    if (oldPassword === newPassword) {
      setValidationError('Новый пароль должен отличаться от старого');
      return;
    }

    // Отправка запроса
    try {
      setIsSubmitting(true);
      await dispatch(updateUserProfile({ password: newPassword })).unwrap();
      
      // Успех
      setSuccessMessage('Пароль успешно изменен!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      setValidationError(error || 'Ошибка изменения пароля');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseAlert = () => {
    setValidationError('');
    setSuccessMessage('');
  };

  if (!initialized || loading) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Загрузка профиля...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="profile-page">
      <Breadcrumbs crumbs={[{ label: ROUTE_LABELS.PROFILE }]} />
      <div className="profile-container">
        <h1 className="profile-title">Личный кабинет</h1>

        {/* Информация о пользователе */}
        <div className="profile-info-card">
          <h2 className="card-title">Информация профиля</h2>
          <div className="info-row">
            <span className="info-label">Email:</span>
            <span className="info-value">{user.email}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Статус:</span>
            <span className="info-value">
              {user.is_superuser ? 'Администратор' : user.is_staff ? 'Модератор' : 'Пользователь'}
            </span>
          </div>
          <div className="info-row">
            <span className="info-label">Дата регистрации:</span>
            <span className="info-value">
              {new Date(user.date_joined).toLocaleDateString('ru-RU')}
            </span>
          </div>
        </div>

        {/* Форма смены пароля */}
        <div className="profile-form-card">
          <h2 className="card-title">Изменить пароль</h2>

          {validationError && (
            <div className="profile-alert profile-alert-danger">
              <span>{validationError}</span>
              <button 
                className="profile-alert-close" 
                onClick={handleCloseAlert}
                aria-label="Закрыть"
              >
                ×
              </button>
            </div>
          )}

          {successMessage && (
            <div className="profile-alert profile-alert-success">
              <span>{successMessage}</span>
              <button 
                className="profile-alert-close" 
                onClick={handleCloseAlert}
                aria-label="Закрыть"
              >
                ×
              </button>
            </div>
          )}

          <form className="profile-form" onSubmit={handleSubmit}>
            <div className="profile-form-group">
              <label htmlFor="oldPassword" className="profile-form-label">
                Старый пароль
              </label>
              <input
                id="oldPassword"
                type="password"
                className="profile-form-input"
                placeholder="Введите старый пароль"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                disabled={isSubmitting}
                autoComplete="current-password"
              />
            </div>

            <div className="profile-form-group">
              <label htmlFor="newPassword" className="profile-form-label">
                Новый пароль
              </label>
              <input
                id="newPassword"
                type="password"
                className="profile-form-input"
                placeholder="Введите новый пароль (минимум 6 символов)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={isSubmitting}
                autoComplete="new-password"
              />
            </div>

            <div className="profile-form-group">
              <label htmlFor="confirmPassword" className="profile-form-label">
                Подтверждение нового пароля
              </label>
              <input
                id="confirmPassword"
                type="password"
                className="profile-form-input"
                placeholder="Повторите новый пароль"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isSubmitting}
                autoComplete="new-password"
              />
            </div>

            <button
              type="submit"
              className="profile-submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="profile-spinner" />
                  Сохранение...
                </>
              ) : (
                'Изменить пароль'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;



