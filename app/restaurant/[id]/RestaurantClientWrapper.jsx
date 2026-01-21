"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { loadRestaurants } from '@/app/data/restaurants';
import { metroStations } from '@/app/data/metroStations';
import { categories } from '@/app/data/categories';
import Badge from '@/app/components/Badge';

export default function RestaurantClientWrapper({ id }) {
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    // Загружаем рестораны и находим нужный
    loadRestaurants().then(restaurants => {
      const found = restaurants.find(r => r.id.toString() === id);
      setRestaurant(found);
      setLoading(false);
    });
  }, [id]);

  const handlePrevImage = () => {
    if (!restaurant || !restaurant.photo_path) return;
    setCurrentImageIndex((prev) =>
      prev === 0 ? restaurant.photo_path.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    if (!restaurant || !restaurant.photo_path) return;
    setCurrentImageIndex((prev) =>
      prev === restaurant.photo_path.length - 1 ? 0 : prev + 1
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <div className="text-xl text-gray-600">Загрузка...</div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4 text-center">
        <h1 className="text-2xl font-bold mb-4 text-gray-900">Заведение не найдено</h1>
        <Link href="/" className="text-[#EC5E54]">
          Вернуться на главную
        </Link>
      </div>
    );
  }

  const {
    title_2gis,
    photo_path,
    hashtags,
    rating_2gis,
    average_check_2gis,
    text_summary,
    text_html,
    telegram_link,
    twogis_link,
    restaurant_link
  } = restaurant;

  // Создаём Set из названий категорий для быстрой проверки (в нижнем регистре)
  const categoryNamesLower = new Set(categories.map(cat => cat.name.toLowerCase()));
  const metroStationsLower = new Set([...metroStations].map(station => station.toLowerCase()));

  // Разделяем теги на метро и кухню (сравнение без учёта регистра)
  const metroTags = hashtags.filter(tag => metroStationsLower.has(tag.toLowerCase()));
  const cuisineTags = hashtags.filter(tag => categoryNamesLower.has(tag.toLowerCase()));

  // Проверяем длину полного текста, а не обрезанного summary
  const isTextLong = text_html && text_html.length > 500;
  const displayedText = text_summary;

  const images = photo_path || [];
  const hasMultipleImages = images.length > 1;

  return (
    <div className="min-h-screen bg-white max-w-[480px] mx-auto pb-32">
      {/* Header with back button */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="px-4 py-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-[#EC5E54] transition-opacity"
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6"/>
            </svg>
            <span className="font-medium">Назад</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="pb-6">
        {/* Image Slider */}
        {images.length > 0 && (
          <div className="flex flex-col items-center py-4">
            <div className="relative aspect-[3/4] max-h-[600px] w-[90%] max-w-[380px]">
              <img
                src={images[currentImageIndex]}
                alt={`${title_2gis} - фото ${currentImageIndex + 1}`}
                className="w-full h-full object-cover rounded-lg"
              />

              {/* Navigation Buttons */}
              {hasMultipleImages && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full transition-colors"
                    aria-label="Previous image"
                  >
                    <svg
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m15 18-6-6 6-6"/>
                    </svg>
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full transition-colors"
                    aria-label="Next image"
                  >
                    <svg
                      className="w-5 h-5 rotate-180"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m15 18-6-6 6-6"/>
                    </svg>
                  </button>
                </>
              )}

              {/* Image Counter */}
              {hasMultipleImages && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/80 px-3 py-1 rounded-full">
                  <span className="text-sm font-medium">
                    {currentImageIndex + 1} / {images.length}
                  </span>
                </div>
              )}
            </div>

            {/* Dots indicator */}
            {hasMultipleImages && (
              <div className="flex justify-center gap-1.5 mt-3">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentImageIndex ? "bg-[#EC5E54]" : "bg-gray-300"
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        <div className="px-4 py-6 space-y-6">
          {/* Restaurant Info */}
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-3">
              <h1 className="flex-1 text-2xl font-semibold text-gray-900">{title_2gis}</h1>
              <div className="flex items-center gap-1.5 shrink-0">
                <svg
                  className="w-5 h-5 fill-[#EC5E54]"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                <span className="font-medium">{rating_2gis || 'N/A'}</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-gray-600">
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"></path>
                <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"></path>
              </svg>
              <span>{average_check_2gis ? `${Math.round(average_check_2gis)} ₽` : 'N/A'}</span>
            </div>
          </div>

          {/* Location Tags (Metro) */}
          {metroTags && metroTags.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gray-600">
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                <span className="font-medium">Метро</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {metroTags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag.replace(/#/g, '').replace(/_/g, ' ')}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Cuisine Tags */}
          {cuisineTags && cuisineTags.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gray-600">
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m16 2-2.3 2.3a3 3 0 0 0 0 4.2l1.8 1.8a3 3 0 0 0 4.2 0L22 8"/>
                  <path d="M15 15 3.3 3.3a4.2 4.2 0 0 0 0 6l7.3 7.3c.7.7 2 .7 2.8 0L15 15Zm0 0 7 7"/>
                  <path d="m2.1 21.8 6.4-6.3"/>
                  <path d="m19 5-7 7"/>
                </svg>
                <span className="font-medium">Кухня</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {cuisineTags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag.replace(/#/g, '').replace(/_/g, ' ')}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          {text_summary && (
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-gray-900">О ресторане</h2>
              <div className="text-gray-600 leading-relaxed">
                {displayedText}
              </div>
              {isTextLong && telegram_link && (
                <a
                  href={telegram_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-[5px] !text-[#EC5E54]"
                >
                  Читать полностью
                </a>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Fixed Bottom Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 max-w-[480px] mx-auto">
        <div className="space-y-2">
          {twogis_link && twogis_link.trim() !== '' && (
            <a
              href={twogis_link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full h-9 px-4 py-2 rounded-md text-sm font-medium bg-[#EC5E54] !text-white transition-all"
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              <span>Открыть на карте 2GIS</span>
            </a>
          )}

          {restaurant_link && restaurant_link.trim() !== '' && (
            <a
              href={restaurant_link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full h-9 px-4 py-2 rounded-md text-sm font-medium border border-gray-200 bg-white text-gray-900 transition-all"
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15 3 21 3 21 9"/>
                <line x1="10" x2="21" y1="14" y2="3"/>
              </svg>
              <span>Сайт ресторана</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
