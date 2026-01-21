"use client";

import { useState, useMemo, useEffect } from 'react';
import { loadRestaurants } from '@/app/data/restaurants';
import SearchBar from '@/app/components/SearchBar';
import CategoryFilter from '@/app/components/CategoryFilter';
import RestaurantCard from '@/app/components/RestaurantCard';

const ITEMS_PER_PAGE = 10;
const BASE_PATH = '/piter-catalog-tma';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [allRestaurants, setAllRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
    }

    // Загружаем все рестораны
    loadRestaurants().then(restaurants => {
      setAllRestaurants(restaurants);
      setLoading(false);
    });
  }, []);

  const filteredRestaurants = useMemo(() => {
    let filtered = allRestaurants;

    if (activeCategory) {
      filtered = filtered.filter(restaurant =>
        restaurant.hashtags.includes(activeCategory)
      );
    }

    if (searchTerm.length > 0) {
      filtered = filtered.filter(restaurant =>
        restaurant.title_2gis.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [searchTerm, activeCategory, allRestaurants]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredRestaurants.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentRestaurants = filteredRestaurants.slice(startIndex, endIndex);

  const handleCategoryClick = (category) => {
    setActiveCategory(prev => (prev === category ? null : category));
    setCurrentPage(1);
  };

  const handleTagClick = (tag) => {
    setSearchTerm('');
    handleCategoryClick(tag);
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 2) {
        pages.push(1, 2, 3, 'ellipsis', totalPages);
      } else if (currentPage >= totalPages - 1) {
        pages.push(1, 'ellipsis', totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, 'ellipsis', currentPage, currentPage + 1, 'ellipsis', totalPages);
      }
    }

    return pages;
  };

  const searchSuggestions = useMemo(() => {
    if (searchTerm.length < 2) return [];
    return allRestaurants
      .filter(r => r.title_2gis.toLowerCase().includes(searchTerm.toLowerCase()))
      .slice(0, 5);
  }, [searchTerm, allRestaurants]);

  if (loading) {
    return (
      <main className="p-4 flex flex-col gap-4 items-center justify-center min-h-screen bg-white">
        <div className="text-xl text-gray-600">Загрузка...</div>
      </main>
    );
  }

  return (
    <div className="min-h-screen max-w-[480px] mx-auto bg-white">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white">
        <div className="px-4 py-4">
          {/* Logo and Name */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full shrink-0 bg-[#EC5E54] overflow-hidden">
              <img
                src={`${BASE_PATH}/vp-logo.jpg`}
                alt="Вкусный Питер"
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="text-2xl font-medium text-gray-900">Вкусный Питер</h1>
          </div>

          {/* Search Bar */}
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={handleSearchChange}
            suggestions={searchSuggestions}
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="py-6 space-y-6">
        {/* Cuisine Tags */}
        <CategoryFilter
          activeCategory={activeCategory}
          onCategoryClick={handleCategoryClick}
        />

        {/* Restaurant List */}
        <div className="px-4 space-y-3">
          {currentRestaurants.length > 0 ? (
            currentRestaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                onTagClick={handleTagClick}
              />
            ))
          ) : (
            <div className="text-center py-12 text-gray-500">
              Рестораны не найдены
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <nav className="flex justify-center items-center gap-1 px-4">
            {/* Previous Button */}
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className={`inline-flex items-center justify-center h-9 px-3 text-sm font-medium rounded-md border border-gray-200 transition-colors ${
                currentPage === 1
                  ? 'opacity-50 cursor-not-allowed text-gray-400'
                  : 'cursor-pointer hover:bg-gray-50 text-gray-700'
              }`}
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
                <path d="m15 18-6-6 6-6"/>
              </svg>
            </button>

            {/* Page Numbers */}
            <div className="flex gap-1">
              {getPageNumbers().map((page, index) => (
                <div key={index}>
                  {page === 'ellipsis' ? (
                    <span className="inline-flex items-center justify-center w-9 h-9 text-sm text-gray-500">...</span>
                  ) : (
                    <button
                      onClick={() => setCurrentPage(page)}
                      className={`inline-flex items-center justify-center w-9 h-9 text-sm font-medium rounded-md border transition-colors ${
                        currentPage === page
                          ? 'bg-[#EC5E54] text-white border-transparent'
                          : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Next Button */}
            <button
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className={`inline-flex items-center justify-center h-9 px-3 text-sm font-medium rounded-md border border-gray-200 transition-colors ${
                currentPage === totalPages
                  ? 'opacity-50 cursor-not-allowed text-gray-400'
                  : 'cursor-pointer hover:bg-gray-50 text-gray-700'
              }`}
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
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </button>
          </nav>
        )}
      </main>
    </div>
  );
}
