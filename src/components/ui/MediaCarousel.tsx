import React, { useState, useRef, useEffect } from 'react';
import { IMAGES } from '../../utils/imagePaths';
import './MediaCarousel.css';

const DEFAULT_IMAGE_URL = IMAGES.DEFAULT_SERVICE;

interface MediaItem {
  id: number;
  file_url: string;
  file_type: 'photo' | 'video';
}

interface MediaCarouselProps {
  media: MediaItem[];
  fallbackImageUrl?: string;
}

export const MediaCarousel: React.FC<MediaCarouselProps> = ({ 
  media, 
  fallbackImageUrl = DEFAULT_IMAGE_URL 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [videoError, setVideoError] = useState<Record<number, boolean>>({});
  const videoRef = useRef<HTMLVideoElement>(null);

  console.log('[MediaCarousel] Media items:', media.map(m => ({ id: m.id, url: m.file_url, type: m.file_type })));

  // Автовоспроизведение видео при смене слайда
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Браузер может блокировать автовоспроизведение
        console.log('Autoplay blocked, user interaction required');
      });
    }
  }, [currentIndex]);

  // Если нет media, показываем fallback
  if (!media || media.length === 0) {
    return (
      <div className="media-carousel-container">
        <img 
          src={fallbackImageUrl} 
          alt="Service" 
          className="carousel-media"
          onError={(e) => {
            (e.target as HTMLImageElement).src = DEFAULT_IMAGE_URL;
          }}
        />
      </div>
    );
  }

  const handleVideoError = (id: number) => {
    console.error(`Video load error for id ${id}`);
    setVideoError(prev => ({ ...prev, [id]: true }));
  };

  const renderMedia = (item: MediaItem, isActive: boolean = true) => {
    // Если видео не загрузилось - показываем fallback
    if (item.file_type === 'video' && videoError[item.id]) {
      return (
        <div className="video-error">
          <img 
            src={fallbackImageUrl} 
            alt="Video unavailable" 
            className="carousel-media"
          />
          <div className="video-error-text">Видео недоступно</div>
        </div>
      );
    }

    if (item.file_type === 'video') {
      return (
        <video
          ref={isActive ? videoRef : null}
          key={`video-${item.id}`}
          className="carousel-media carousel-video"
          autoPlay
          muted
          loop
          playsInline
          controls
          onError={() => handleVideoError(item.id)}
        >
          <source src={item.file_url} type="video/mp4" />
          <source src={item.file_url} type="video/webm" />
          <source src={item.file_url} type="video/ogg" />
          Ваш браузер не поддерживает видео.
        </video>
      );
    }

    return (
      <img
        key={`img-${item.id}`}
        className="carousel-media"
        src={item.file_url}
        alt={`Media ${item.id}`}
        onError={(e) => {
          (e.target as HTMLImageElement).src = fallbackImageUrl;
        }}
      />
    );
  };

  // Если только один элемент
  if (media.length === 1) {
    return (
      <div className="media-carousel-container">
        {renderMedia(media[0])}
      </div>
    );
  }

  // Несколько элементов - карусель
  const currentItem = media[currentIndex];

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? media.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === media.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="media-carousel-container">
      {/* Текущее изображение/видео */}
      {renderMedia(currentItem)}

      {/* Стрелки навигации */}
      <button className="carousel-btn carousel-btn-prev" onClick={goToPrev} aria-label="Предыдущий">
        ‹
      </button>
      <button className="carousel-btn carousel-btn-next" onClick={goToNext} aria-label="Следующий">
        ›
      </button>

      {/* Индикаторы */}
      <div className="carousel-indicators">
        {media.map((item, index) => (
          <button
            key={index}
            className={`carousel-dot ${index === currentIndex ? 'active' : ''} ${item.file_type === 'video' ? 'video-dot' : ''}`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Слайд ${index + 1}${item.file_type === 'video' ? ' (видео)' : ''}`}
          />
        ))}
      </div>
    </div>
  );
};
