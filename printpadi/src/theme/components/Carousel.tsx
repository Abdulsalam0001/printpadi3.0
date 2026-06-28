// ============================================================
// PrintPadi – Carousel Component
// Exact port of components/image-display.tsx
// Auto-advances every 3 seconds with dot indicators
// ============================================================

import React, { useState, useEffect } from 'react';

interface CarouselProps {
  images: string[];
  children?: React.ReactNode;
}

export const Carousel: React.FC<CarouselProps> = ({ images, children }) => {
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIdx(prev => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="carousel-wrap">
      <div 
        className="carousel-track" 
        style={{ transform: `translateX(-${currentIdx * 100}%)` }}
      >
        {images.map((img, i) => (
          <div key={i} className="carousel-slide">
            <img src={img} alt={`banner ${i + 1}`} />
            <div className="carousel-slide__overlay" />
            {i === currentIdx && children && (
              <div className="carousel-slide__content">{children}</div>
            )}
          </div>
        ))}
      </div>
      <div className="carousel-dots">
        {images.map((_, i) => (
          <div
            key={i}
            className={`carousel-dot ${i === currentIdx ? 'carousel-dot--active' : ''}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
