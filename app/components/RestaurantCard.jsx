// app/components/RestaurantCard.jsx
import Link from 'next/link';
import { metroStations } from '../data/metroStations';

const Tag = ({ tag, onTagClick }) => {
  const cleanTag = tag.replace(/#/g, '').replace(/_/g, ' ');
  return (
    <button
      onClick={() => onTagClick(tag)}
      className="inline-flex items-center justify-center rounded-md bg-[#f3f3f5] text-[#030213] px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-colors hover:bg-gray-200"
    >
      {cleanTag}
    </button>
  );
};

const RestaurantCard = ({ restaurant, onTagClick }) => {
  const {
    id,
    title_2gis,
    photo_path,
    hashtags,
    rating_2gis,
    average_check_2gis,
   } = restaurant;

  const metroTags = hashtags.filter(tag => metroStations.has(tag));
  const categoryTags = hashtags.filter(tag => !metroStations.has(tag));

  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="p-4">
        <div className="flex gap-3">
          {/* Vertical thumbnail image on the left */}
          <Link href={`/restaurant/${id}`} className="shrink-0">
            <div className="w-24 h-32 rounded-lg overflow-hidden bg-gray-100">
              {photo_path && photo_path[0] ? (
                <img
                  src={photo_path[0]}
                  alt={title_2gis}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400 text-xs">Нет фото</span>
                </div>
              )}
            </div>
          </Link>

          {/* Content on the right */}
          <div className="flex-1 min-w-0 flex flex-col gap-2">
            {/* Name and Rating */}
            <div className="flex items-start justify-between gap-2">
              <Link href={`/restaurant/${id}`} className="flex-1 min-w-0">
                <h3 className="text-lg font-medium line-clamp-2 hover:text-[#EC5E54] transition-colors">
                  {title_2gis}
                </h3>
              </Link>
              <div className="flex items-center gap-1 shrink-0">
                <svg
                  className="w-4 h-4 fill-[#EC5E54]"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                <span className="text-sm text-gray-600">
                  {rating_2gis || 'N/A'}
                </span>
              </div>
            </div>

            {/* Average Bill with icon */}
            <div className="flex items-center gap-1.5 text-sm text-gray-600">
              <svg
                className="w-4 h-4"
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

            {/* Tags - can wrap to multiple lines */}
            <div className="flex flex-wrap gap-1.5">
              {metroTags.map(tag => <Tag key={tag} tag={tag} onTagClick={onTagClick} />)}
              {categoryTags.map(tag => <Tag key={tag} tag={tag} onTagClick={onTagClick} />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;
