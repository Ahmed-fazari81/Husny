// تحميل بيانات JSON مع تخزين مؤقت في الذاكرة لتفادي الجلب المتكرر
const cache = new Map();

/**
 * @param {string} url مسار ملف JSON
 * @returns {Promise<any>}
 */
async function loadJson(url) {
  if (cache.has(url)) return cache.get(url);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`تعذّر تحميل الملف: ${url}`);
  }
  const data = await response.json();
  cache.set(url, data);
  return data;
}

/** @returns {Promise<{sections: Array}>} */
export function loadSections() {
  return loadJson("data/sections.json");
}

/**
 * @param {{id: string, file: string}} section
 */
export function loadSectionContent(section) {
  return loadJson(section.file);
}
