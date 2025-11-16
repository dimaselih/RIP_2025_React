import React, { useState, useEffect } from 'react';

interface CarouselSlide {
  icon: string;
  title: string;
  description: string;
  benefits: Array<{ icon: string; text: string }>;
}

const carouselSlides: CarouselSlide[] = [
  {
    icon: '💰',
    title: 'Расчет TCO',
    description: 'Полный расчет общей стоимости владения активами с учетом всех затрат на протяжении жизненного цикла',
    benefits: [
      { icon: '📊', text: 'Детальные отчеты' },
      { icon: '🔄', text: 'Анализ жизненного цикла' }
    ]
  },
  {
    icon: '📈',
    title: 'Оптимизация затрат',
    description: 'Выявление скрытых расходов и возможностей для снижения общей стоимости владения',
    benefits: [
      { icon: '💡', text: 'Умная аналитика' },
      { icon: '🎯', text: 'Точные прогнозы' }
    ]
  },
  {
    icon: '⚙️',
    title: 'Управление активами',
    description: 'Комплексный подход к управлению IT-инфраструктурой с учетом всех факторов стоимости',
    benefits: [
      { icon: '🔍', text: 'Детальный анализ' },
      { icon: '📋', text: 'Планирование бюджета' }
    ]
  }
];

export const HomePage: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 5000); // Переключение каждые 5 секунд

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);
    setIsAutoPlaying(false);
  };

  return (
    <div className="home-page">
      <div className="carousel-section">
        <div className="carousel-container">
          <button 
            className="carousel-button carousel-button-prev" 
            onClick={prevSlide}
            aria-label="Предыдущий слайд"
          >
            ‹
          </button>
          
          <div className="carousel-wrapper">
            <div 
              className="carousel-slides"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {carouselSlides.map((slide, index) => (
                <div key={index} className="carousel-slide">
        <div className="main-feature-card">
          <div className="main-feature-content">
            <div className="main-feature-icon">
              <div className="main-icon-circle">
                          <span className="main-icon-text">{slide.icon}</span>
              </div>
            </div>
                      <h2 className="main-feature-title">{slide.title}</h2>
            <p className="main-feature-description">
                        {slide.description}
            </p>
            <div className="main-feature-benefits">
                        {slide.benefits.map((benefit, benefitIndex) => (
                          <div key={benefitIndex} className="benefit-item">
                            <span className="benefit-icon">{benefit.icon}</span>
                            <span className="benefit-text">{benefit.text}</span>
                          </div>
                        ))}
                      </div>
              </div>
              </div>
            </div>
              ))}
            </div>
          </div>

          <button 
            className="carousel-button carousel-button-next" 
            onClick={nextSlide}
            aria-label="Следующий слайд"
          >
            ›
          </button>
        </div>

        <div className="carousel-indicators">
          {carouselSlides.map((_, index) => (
            <button
              key={index}
              className={`carousel-indicator ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Перейти к слайду ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;