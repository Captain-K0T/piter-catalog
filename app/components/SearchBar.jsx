// app/components/SearchBar.jsx
import { useState } from 'react';

const SearchBar = ({ searchTerm, setSearchTerm, suggestions }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative w-full max-w-full">
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>
        <input
          type="search"
          placeholder="Поиск ресторанов..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 150)}
          className="w-full h-9 pl-9 pr-3 py-1 text-base rounded-md border border-gray-200 bg-[#f3f3f5] text-gray-900 outline-none transition-all focus:border-[#EC5E54] focus:ring-2 focus:ring-[#EC5E54]/20"
        />
      </div>
      {isFocused && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-2 rounded-md shadow-xl max-w-full overflow-hidden border border-gray-200 bg-white">
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              onClick={() => {
                setSearchTerm(suggestion.title_2gis);
                setIsFocused(false);
              }}
              className="px-4 py-3 cursor-pointer transition-colors hover:bg-gray-50"
            >
              {suggestion.title_2gis}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
