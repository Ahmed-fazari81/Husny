import { loadSections, loadSectionContent } from "./modules/dataLoader.js";
import { renderHome, renderSection, renderLoading, renderError } from "./modules/render.js";
import { initRouter, goHome, goToSection } from "./modules/router.js";
import { initTheme, toggleTheme, getCurrentTheme } from "./modules/theme.js";
import { initFontSize, increaseFontSize, decreaseFontSize } from "./modules/fontSize.js";
import { registerServiceWorker, initInstallPrompt } from "./modules/swRegister.js";
import { initExitGuard, trackHash } from "./modules/exitGuard.js";
import { icon } from "./modules/icons.js";
import { renderQibla } from "./modules/qibla.js";
import { renderNamesGrid } from "./modules/namesGrid.js";

const main = document.getElementById("main-view");
const backBtn = document.getElementById("back-btn");
const themeBtn = document.getElementById("theme-btn");

let sectionsIndex = [];

function applyThemeIcon() {
  themeBtn.innerHTML = getCurrentTheme() === "dark" ? icon("sun") : icon("moon");
}

async function showHome() {
  renderLoading(main);
  try {
    const { sections } = await loadSections();
    sectionsIndex = sections;
    renderHome(main, sections, (id) => goToSection(id));
  } catch {
    renderError(main, "تعذّر تحميل الأقسام. تحقق من اتصالك بالإنترنت عند أول استخدام.");
  }
}

async function showSection(id) {
  renderLoading(main);
  try {
    if (sectionsIndex.length === 0) {
      sectionsIndex = (await loadSections()).sections;
    }
    const section = sectionsIndex.find((s) => s.id === id);
    if (!section) {
      renderError(main, "القسم غير موجود.");
      return;
    }
    if (section.type === "qibla") {
      renderQibla(main, section);
      return;
    }

    const content = await loadSectionContent(section);

    if (section.type === "names") {
      renderNamesGrid(main, section, content);
      return;
    }

    renderSection(main, section, content);
  } catch {
    renderError(main, "تعذّر تحميل محتوى هذا القسم.");
  }
}

function initHeaderControls() {
  applyThemeIcon();
  backBtn.innerHTML = `${icon("back")}<span class="visually-hidden">رجوع</span>`;

  const fontIncBtn = document.getElementById("font-inc");
  const fontDecBtn = document.getElementById("font-dec");
  fontIncBtn.innerHTML = icon("plus");
  fontDecBtn.innerHTML = icon("minus");

  themeBtn.addEventListener("click", () => {
    toggleTheme();
    applyThemeIcon();
  });
  backBtn.addEventListener("click", goHome);
  fontIncBtn.addEventListener("click", increaseFontSize);
  fontDecBtn.addEventListener("click", decreaseFontSize);
}

function init() {
  initTheme();
  initFontSize();
  initHeaderControls();
  registerServiceWorker();
  initInstallPrompt();

  initRouter(
    {
      home: showHome,
      section: showSection,
    },
    trackHash
  );

  initExitGuard();
}

document.addEventListener("DOMContentLoaded", init);
