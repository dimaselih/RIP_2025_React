import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../store/thunks/authThunks';
import { RootState, AppDispatch } from '../../store';
import '../../styles/auth.css';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, loading } = useSelector((state: RootState) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState('');

  // Редирект если уже авторизован
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/catalog_tco');
    }
  }, [isAuthenticated, navigate]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    // Валидация
    if (!email || !password) {
      setValidationError('Заполните все поля');
      return;
    }

    if (!email.includes('@')) {
      setValidationError('Введите корректный email');
      return;
    }

    // Отправка запроса
    await dispatch(loginUser({ email, password }));
    
    // Редирект произойдет автоматически через useEffect при isAuthenticated
  };

  const handleCloseAlert = () => {
    setValidationError('');
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Вход в систему</h1>

        {validationError && (
          <div className="auth-alert auth-alert-danger">
            <span>{validationError}</span>
            <button 
              className="auth-alert-close" 
              onClick={handleCloseAlert}
              aria-label="Закрыть"
            >
              ×
            </button>
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-form-group">
            <label htmlFor="email" className="auth-form-label">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="auth-form-input"
              placeholder="Введите email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              autoComplete="email"
              required
            />
          </div>

          <div className="auth-form-group">
            <label htmlFor="password" className="auth-form-label">
              Пароль
            </label>
            <input
              id="password"
              type="password"
              className="auth-form-input"
              placeholder="Введите пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              autoComplete="current-password"
              required
            />
          </div>

          <button
            type="submit"
            className="auth-submit-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="auth-spinner" />
                Вход...
              </>
            ) : (
              'Войти'
            )}
          </button>

          <div className="auth-footer">
            Нет аккаунта?{' '}
            <Link to="/register" className="auth-link">
              Зарегистрироваться
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

