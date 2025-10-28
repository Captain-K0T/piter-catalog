// app/data/restaurants.js
import { parseCSV, csvToObjects } from '@/app/utils/csvParser';

// Вспомогательная функция для извлечения текста из HTML
const getTextSummary = (html) => {
  if (!html) return '';
  const plainText = html.replace(/<[^>]+>/g, ' ');
  const sentences = plainText.split(/[.!?]+\s/).filter(Boolean);
  return sentences.slice(0, 2).join('. ') + (sentences.length > 2 ? '...' : '.');
};

// Функция для загрузки и парсинга CSV
export async function loadRestaurants(limit = null) {
  try {
    const response = await fetch('/database_enriched.csv');
    const csvText = await response.text();
    const csvLines = parseCSV(csvText);
    const csvData = csvToObjects(csvLines);

    // Преобразуем CSV данные в формат ресторанов
    const restaurants = csvData.map(row => {
      // Собираем фотографии из колонок photo_path_1 до photo_path_10
      const photo_path = [];
      for (let i = 1; i <= 10; i++) {
        const photoPath = row[`photo_path_${i}`];
        if (photoPath && photoPath.trim() !== '') {
          // Добавляем префикс /posts/ к пути фотографии
          photo_path.push(`/posts/${photoPath}`);
        }
      }

      // Собираем хэштеги из колонок hashtag_1 до hashtag_6
      const hashtags = [];
      for (let i = 1; i <= 6; i++) {
        const hashtag = row[`hashtag_${i}`];
        if (hashtag && hashtag.trim() !== '') {
          hashtags.push(hashtag);
        }
      }

      // Обрабатываем средний чек - удаляем все нецифровые символы и преобразуем в число
      let average_check = null;
      const checkValue = row.average_check_2gis || row['average_check_2gis'] || '';
      if (checkValue && checkValue.trim() !== '') {
        const numericValue = checkValue.replace(/[^\d]/g, '');
        average_check = numericValue ? parseInt(numericValue, 10) : null;
      }

      return {
        id: parseInt(row.id),
        telegram_link: row.telegram_link,
        twogis_link: row.link_1, // Ссылка на 2GIS
        restaurant_link: row.link_2, // Ссылка на сайт ресторана
        title_2gis: row.title_2gis,
        rating_2gis: row.rating_2gis,
        average_check_2gis: average_check,
        photo_path,
        hashtags,
        text_summary: getTextSummary(row.text_html),
        text_html: row.text_html,
      };
    });

    // Сортируем по ID (новые сначала)
    const sorted = restaurants.sort((a, b) => b.id - a.id);

    // Если указан лимит, возвращаем только первые N записей
    return limit ? sorted.slice(0, limit) : sorted;
  } catch (error) {
    console.error('Error loading restaurants:', error);
    return [];
  }
}