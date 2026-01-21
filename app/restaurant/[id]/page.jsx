import { loadRestaurants } from '@/app/data/restaurants';
import RestaurantClientWrapper from './RestaurantClientWrapper';
import Link from 'next/link';

// Генерируем статические пути для всех ресторанов
export async function generateStaticParams() {
  // Используем fetch на сервере для чтения CSV
  const fs = require('fs');
  const path = require('path');
  const { parseCSV, csvToObjects } = require('@/app/utils/csvParser');

  try {
    const filePath = path.join(process.cwd(), 'public', 'database_enriched.csv');
    const csvText = fs.readFileSync(filePath, 'utf-8');
    const csvLines = parseCSV(csvText);
    const csvData = csvToObjects(csvLines);

    return csvData.map((row) => ({
      id: row.id.toString(),
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

// Серверный компонент который передаёт данные в клиентский
export default async function RestaurantPage({ params }) {
  const { id } = await params;

  return <RestaurantClientWrapper id={id} />;
}
