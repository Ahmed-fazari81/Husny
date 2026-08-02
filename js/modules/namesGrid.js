import { icon } from "./icons.js";

/**
 * يبني صفحة أسماء الله الحسنى: حديث تمهيدي ثم شبكة بطاقات تعرض الأسماء فقط
 * @param {HTMLElement} container
 * @param {object} section
 * @param {{intro?: object, items: Array}} content
 */
export function renderNamesGrid(container, section, content) {
  const intro = content.intro;
  const introHtml = intro
    ? `
      <div class="names-intro">
        <p class="names-intro__text">${intro.text}</p>
      </div>
    `
    : "";

  container.innerHTML = `
    <header class="section-view__header">
      <span class="section-card__icon" style="--section-color:${section.color}; margin-inline:auto;">${icon(section.icon)}</span>
      <h2 class="section-view__title">${section.title}</h2>
      <p class="section-view__desc">${section.description}</p>
    </header>

    ${introHtml}

    <div class="names-grid"></div>
  `;

  const grid = container.querySelector(".names-grid");

  content.items.forEach((item, index) => {
    const card = document.createElement("article");
    card.className = "name-card";
    card.style.setProperty("--i", String(index));
    card.innerHTML = `<p class="name-card__name">${item.text}</p>`;
    grid.appendChild(card);
  });
}
