import { getItem, setItem, StorageKeys } from "./storage.js";

const root = document.documentElement;

/** يطبّق الثيم المخزن عند بدء التشغيل */
export function initTheme() {
  const saved = getItem(StorageKeys.THEME, null);
  if (saved === "dark" || saved === "light") {
    root.setAttribute("data-theme", saved);
  }
}

/** @returns {"light"|"dark"} الثيم الفعّال حاليًا */
export function getCurrentTheme() {
  const attr = root.getAttribute("data-theme");
  if (attr) return attr;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/** يبدّل بين الوضع الليلي والنهاري ويحفظ الاختيار */
export function toggleTheme() {
  const next = getCurrentTheme() === "dark" ? "light" : "dark";
  root.setAttribute("data-theme", next);
  setItem(StorageKeys.THEME, next);
  return next;
}
