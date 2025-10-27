import React from 'react';
import { Link } from 'react-router-dom';

export const HomePage: React.FC = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Asset Cost Calculator</h1>
          <p className="hero-subtitle">
            Система расчета стоимости активов TCO для эффективного управления IT-инфраструктурой
          </p>
          <div className="hero-cta">
            <Link to="/catalog_tco" className="cta-button">
              Перейти к каталогу услуг
            </Link>
          </div>
        </div>

        {/* Background decoration */}
        <div className="hero-bg-decoration"></div>
      </div>

      {/* Main Feature Section */}
      <div className="main-feature-section">
        <div className="main-feature-card">
          <div className="main-feature-content">
            <div className="main-feature-icon">
              <div className="main-icon-circle">
                <span className="main-icon-text">💰</span>
              </div>
            </div>
            <h2 className="main-feature-title">Расчет TCO</h2>
            <p className="main-feature-description">
              Полный расчет общей стоимости владения активами с учетом всех затрат на протяжении жизненного цикла
            </p>
            <div className="main-feature-benefits">
              <div className="benefit-item">
                <span className="benefit-icon">📊</span>
                <span className="benefit-text">Детальные отчеты</span>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon">🔄</span>
                <span className="benefit-text">Анализ жизненного цикла</span>
              </div>
            </div>
            <div className="main-feature-cta">
              <Link to="/catalog_tco" className="primary-cta-button">
                Начать расчет TCO
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;