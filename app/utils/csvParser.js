// Простой CSV парсер для работы в браузере
export function parseCSV(csvText) {
  const lines = csvText.split('\n').map(line => {
    const fields = [];
    let currentField = '';
    let insideQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = line[i + 1];

      if (char === '"') {
        if (insideQuotes && nextChar === '"') {
          currentField += '"';
          i++;
        } else {
          insideQuotes = !insideQuotes;
        }
      } else if (char === ',' && !insideQuotes) {
        fields.push(currentField.trim());
        currentField = '';
      } else {
        currentField += char;
      }
    }
    fields.push(currentField.trim());
    return fields;
  }).filter(line => line.length > 1 && line[0]); // Убираем пустые строки

  return lines;
}

// Конвертирует CSV строки в объекты с заголовками
export function csvToObjects(csvLines) {
  if (csvLines.length === 0) return [];

  const headers = csvLines[0];
  const objects = [];

  for (let i = 1; i < csvLines.length; i++) {
    const line = csvLines[i];
    const obj = {};

    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = line[j] || '';
    }

    objects.push(obj);
  }

  return objects;
}
