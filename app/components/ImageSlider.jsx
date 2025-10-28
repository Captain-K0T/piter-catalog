// app/components/ImageSlider.jsx
"use client";

import { useState, useRef } from 'react';

const ImageSlider = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const isScrolling = useRef(false);

  if (!images || images.length === 0) {
    return <div className="h-[180px] w-full bg-gray-200 rounded-xl" />;
  }

  // Для одного изображения показываем его без слайдера
  if (images.length === 1) {
    return (
      <div className="relative w-full h-[180px] bg-gray-100 overflow-hidden rounded-xl">
        <img
          src={images[0]}
          alt="Фото заведения"
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  const scrollToIndex = (index) => {
    if (scrollRef.current) {
      const scrollWidth = scrollRef.current.scrollWidth;
      const containerWidth = scrollRef.current.offsetWidth;
      const slideWidth = containerWidth * 0.6; // 60% ширины
      const gap = 5; // gap-[5px] = 5px

      const scrollPosition = index * (slideWidth + gap);
      isScrolling.current = true;
      scrollRef.current.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });

      // Сбрасываем флаг после завершения анимации
      setTimeout(() => {
        isScrolling.current = false;
      }, 500);
    }
  };

  const goToPrevious = (e) => {
    e.stopPropagation();
    e.preventDefault();
    const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
    scrollToIndex(newIndex);
  };

  const goToNext = (e) => {
    e.stopPropagation();
    e.preventDefault();
    const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
    scrollToIndex(newIndex);
  };

  // Обработка свайпов
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diffX = touchStartX.current - touchEndX.current;
    const threshold = 50; // минимальное расстояние для свайпа

    if (Math.abs(diffX) > threshold) {
      if (diffX > 0) {
        // Свайп влево - следующее фото
        goToNext({ stopPropagation: () => {}, preventDefault: () => {} });
      } else {
        // Свайп вправо - предыдущее фото
        goToPrevious({ stopPropagation: () => {}, preventDefault: () => {} });
      }
    }
  };

  // Отслеживание текущего слайда при прокрутке
  const handleScroll = () => {
    if (scrollRef.current && !isScrolling.current) {
      const containerWidth = scrollRef.current.offsetWidth;
      const slideWidth = containerWidth * 0.6;
      const gap = 5;
      const scrollLeft = scrollRef.current.scrollLeft;

      const index = Math.round(scrollLeft / (slideWidth + gap));
      setCurrentIndex(index);
    }
  };

  const openImage = (imageSrc) => {
    window.open(imageSrc, '_blank');
  };

  return (
    <div className="relative w-full">
      {/* Горизонтальный скролл контейнер */}
      <div className="relative h-[180px]">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="flex gap-[5px] overflow-x-auto scrollbar-hide h-full"
        >
          {images.map((image, index) => {
            const isVideo = image?.endsWith('.mp4') || image?.endsWith('.webm');
            return (
              <div
                key={index}
                className="slider-slide flex-shrink-0 h-full overflow-hidden bg-gray-100 cursor-pointer"
                onClick={() => !isVideo && openImage(image)}
              >
                {isVideo ? (
                  <video
                    src={image}
                    className="w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                ) : (
                  <img
                    src={image}
                    alt={`Фото заведения ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Стрелки навигации */}
        <button
          onClick={goToPrevious}
          className="slider-arrow slider-arrow-left z-20 bg-black/50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-black/70 transition-all text-xl"
          aria-label="Предыдущее фото"
        >
          ‹
        </button>
        <button
          onClick={goToNext}
          className="slider-arrow slider-arrow-right z-20 bg-black/50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-black/70 transition-all text-xl"
          aria-label="Следующее фото"
        >
          ›
        </button>
      </div>

      {/* Индикаторы (точки) */}
      <div className="slider-dots">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setCurrentIndex(index);
              scrollToIndex(index);
            }}
            className={`slider-dot transition-all ${currentIndex === index ? 'slider-dot-active' : ''}`}
            aria-label={`Перейти к фото ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;