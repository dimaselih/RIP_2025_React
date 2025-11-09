import React from 'react';
import { Link } from 'react-router-dom';

export const HomePage: React.FC = () => {
  return (
    <div className="home-page">
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
                Перейти к каталогу услуг
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;