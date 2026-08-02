// طبقة تخزين محلية بسيطة (localStorage) مع بادئة موحدة للمفاتيح
const PREFIX = "hisni:";

/**
 * @param {string} key
 * @param {*} fallback
 */
export function getItem(key, fallback = null) {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

/**
 * @param {string} key
 * @param {*} value
 */
export function setItem(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // التخزين قد يكون معطلًا (وضع التصفح الخاص)، نتجاهل بصمت
  }
}

export const StorageKeys = {
  THEME: "theme",
  FONT_SCALE: "fontScale",
  LAST_SECTION: "lastSection",
};
