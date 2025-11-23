import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, loginUser } from '../../store/thunks/authThunks';
import { RootState, AppDispatch } from '../../store';
import '../../styles/auth.css';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, loading } = useSelector((state: RootState) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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
    if (!email || !password || !confirmPassword) {
      setValidationError('Заполните все поля');
      return;
    }

    if (!email.includes('@')) {
      setValidationError('Введите корректный email');
      return;
    }

    if (password.length < 6) {
      setValidationError('Пароль должен содержать минимум 6 символов');
      return;
    }

    if (password !== confirmPassword) {
      setValidationError('Пароли не совпадают');
      return;
    }

    // Отправка запроса на регистрацию
    const result = await dispatch(registerUser({ email, password }));
    
    if (registerUser.fulfilled.match(result)) {
      // После успешной регистрации автоматически выполняем вход
      const loginResult = await dispatch(loginUser({ email, password }));
      
      if (loginUser.fulfilled.match(loginResult)) {
        // После успешного входа перенаправляем в каталог
        navigate('/catalog_tco');
      } else {
        // Если автологин не удался, перенаправляем на страницу входа
        navigate('/login');
      }
    }
  };

  const handleCloseAlert = () => {
    setValidationError('');
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Регистрация</h1>

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
              placeholder="Введите пароль (минимум 6 символов)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              autoComplete="new-password"
              required
            />
          </div>

          <div className="auth-form-group">
            <label htmlFor="confirmPassword" className="auth-form-label">
              Подтверждение пароля
            </label>
            <input
              id="confirmPassword"
              type="password"
              className="auth-form-input"
              placeholder="Повторите пароль"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
              autoComplete="new-password"
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
                Регистрация...
              </>
            ) : (
              'Зарегистрироваться'
            )}
          </button>

          <div className="auth-footer">
            Уже есть аккаунт?{' '}
            <Link to="/login" className="auth-link">
              Войти
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;

