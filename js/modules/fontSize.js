import { getItem, setItem, StorageKeys } from "./storage.js";

const root = document.documentElement;
const MIN_SCALE = 0.8;
const MAX_SCALE = 1.6;
const STEP = 0.1;

/** يطبّق حجم الخط المحفوظ عند بدء التشغيل */
export function initFontSize() {
  const saved = getItem(StorageKeys.FONT_SCALE, 1);
  applyScale(saved);
}

function applyScale(scale) {
  const clamped = Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale));
  root.style.setProperty("--font-scale", clamped.toFixed(2));
  setItem(StorageKeys.FONT_SCALE, clamped);
  return clamped;
}

function currentScale() {
  return parseFloat(getComputedStyle(root).getPropertyValue("--font-scale")) || 1;
}

export function increaseFontSize() {
  return applyScale(currentScale() + STEP);
}

export function decreaseFontSize() {
  return applyScale(currentScale() - STEP);
}

export function resetFontSize() {
  return applyScale(1);
}
