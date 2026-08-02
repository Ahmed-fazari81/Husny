import { icon } from "./icons.js";
import { shareAsText, shareAsImage } from "./share.js";
import { repeatText } from "./format.js";

/**
 * يبني شبكة أيقونات الأقسام في الشاشة الرئيسية
 * @param {HTMLElement} container
 * @param {Array} sections
 * @param {(id: string) => void} onSelect
 */
export function renderHome(container, sections, onSelect) {
  container.innerHTML = `
    <section class="home-hero">
      <h1>حصنك اليومي من الأذكار والأدعية</h1>
     </section>
    <nav class="sections-grid" aria-label="أقسام التطبيق"></nav>
  `;

  const grid = container.querySelector(".sections-grid");

  sections.forEach((section) => {
    const card = document.createElement("button");
    card.className = "section-card";
    card.style.setProperty("--section-color", section.color);
    card.setAttribute("data-section-id", section.id);
    card.setAttribute("aria-label", section.title);
    card.innerHTML = `
      <span class="section-card__icon">${icon(section.icon)}</span>
      <span class="section-card__title">${section.title}</span>
      <span class="section-card__desc">${section.description}</span>
    `;
    card.addEventListener("click", () => onSelect(section.id));
    grid.appendChild(card);
  });
}

/**
 * يبني بطاقة ذكر/دعاء واحدة
 * @param {object} item
 * @param {object} section
 * @param {number} index
 */
function buildDhikrCard(item, section, index) {
  const card = document.createElement("article");
  card.className = "dhikr-card";
  card.style.setProperty("--i", String(index));

  const sourceLabel = item.source
    ? `${item.source.type === "quran" ? "📖" : "🕊️"} ${item.source.reference}${
        item.source.grade ? ` · ${item.source.grade}` : ""
      }`
    : "";

  const occasionBadge = item.occasion
    ? `<span class="dhikr-card__badge">${item.occasion}</span>`
    : "";

  card.innerHTML = `
    <p class="dhikr-card__text">${item.text}</p>
    ${item.virtue ? `<p class="dhikr-card__virtue">${item.virtue}</p>` : ""}
    <div class="dhikr-card__meta">
      <div>
        <p class="dhikr-card__source">${sourceLabel}</p>
        ${occasionBadge}
      </div>
      <div class="dhikr-card__actions">
        ${item.count > 1 ? `<span class="dhikr-card__count">${repeatText(item.count)}</span>` : ""}
        <button class="icon-btn" data-action="copy" title="نسخ النص" aria-label="نسخ النص">${icon("copy")}</button>
        <button class="icon-btn" data-action="share-text" title="مشاركة كنص" aria-label="مشاركة كنص">${icon("share")}</button>
        <button class="icon-btn" data-action="share-image" title="مشاركة كصورة" aria-label="مشاركة كصورة">${icon("image")}</button>
      </div>
    </div>
  `;

  card.querySelector('[data-action="copy"]').addEventListener("click", async (e) => {
    await navigator.clipboard.writeText(item.text);
    pulse(e.currentTarget);
    import("./toast.js").then(({ showToast }) => showToast("تم نسخ الذكر"));
  });

  card.querySelector('[data-action="share-text"]').addEventListener("click", (e) => {
    pulse(e.currentTarget);
    shareAsText(item, section.title);
  });

  card.querySelector('[data-action="share-image"]').addEventListener("click", (e) => {
    pulse(e.currentTarget);
    shareAsImage(item, section.title, section.color);
  });

  return card;
}

function pulse(el) {
  el.classList.remove("is-pulsing");
  // إعادة تشغيل الحركة
  void el.offsetWidth;
  el.classList.add("is-pulsing");
}

/**
 * يبني صفحة القسم كاملة (عنوان + قائمة الأذكار)
 * @param {HTMLElement} container
 * @param {object} section
 * @param {object} content
 */
export function renderSection(container, section, content) {
  container.innerHTML = `
    <header class="section-view__header">
      <span class="section-card__icon" style="--section-color:${section.color}; margin-inline:auto;">${icon(section.icon)}</span>
      <h2 class="section-view__title">${section.title}</h2>
      <p class="section-view__desc">${section.description}</p>
    </header>
    <div class="dhikr-list"></div>
  `;

  const list = container.querySelector(".dhikr-list");
  content.items.forEach((item, index) => {
    list.appendChild(buildDhikrCard(item, section, index));
  });
}

export function renderLoading(container) {
  container.innerHTML = `<div class="spinner" role="status" aria-label="جارٍ التحميل"></div>`;
}

export function renderError(container, message) {
  container.innerHTML = `<p style="text-align:center; color: var(--color-text-muted); padding: var(--space-xl) 0;">${message}</p>`;
}
