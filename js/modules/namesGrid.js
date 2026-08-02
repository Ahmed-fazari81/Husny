import { icon } from "./icons.js";

/**
 * يبني صفحة أسماء الله الحسنى: حديث تمهيدي ثم شبكة بطاقات مرقّمة من 1 إلى 99
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
        ${intro.source ? `<p class="names-intro__source">${intro.source.type === "quran" ? "📖" : "🕊️"} ${intro.source.reference}${intro.source.grade ? ` · ${intro.source.grade}` : ""}</p>` : ""}
        ${intro.virtue ? `<p class="names-intro__virtue">${intro.virtue}</p>` : ""}
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
    card.innerHTML = `
      <span class="name-card__number">${index + 1}</span>
      <p class="name-card__name">${item.text}</p>
      ${item.virtue ? `<p class="name-card__meaning">${item.virtue}</p>` : ""}
    `;
    grid.appendChild(card);
  });
}
