import { icon } from "./icons.js";

const SHOW_DELAY_MS = 1500;

/** يسجّل عامل الخدمة إن كان مدعومًا */
export function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch((err) => {
      console.error("فشل تسجيل عامل الخدمة:", err);
    });
  });
}

/** @returns {boolean} هل التطبيق مثبَّت ويعمل حاليًا كتطبيق مستقل */
export function isRunningStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true
  );
}

/**
 * يدير حدث beforeinstallprompt ويعرض إشعارًا عائمًا أنيقًا لتثبيت التطبيق
 * في كل مرة يفتح المستخدم التطبيق، ولا يظهر إطلاقًا إذا كان التطبيق مثبتًا بالفعل.
 */
export function initInstallPrompt() {
  if (isRunningStandalone()) return;

  let deferredPrompt = null;

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredPrompt = event;
    setTimeout(showPrompt, SHOW_DELAY_MS);
  });

  window.addEventListener("appinstalled", () => {
    deferredPrompt = null;
    hidePrompt();
  });

  function showPrompt() {
    if (!deferredPrompt || document.querySelector(".install-toast")) return;

    const card = document.createElement("div");
    card.className = "install-toast";
    card.setAttribute("role", "dialog");
    card.setAttribute("aria-label", "تثبيت التطبيق");
    card.innerHTML = `
      <button type="button" class="install-toast__close" aria-label="إغلاق">✕</button>
      <div class="install-toast__icon">${icon("install")}</div>
      <div class="install-toast__body">
        <p class="install-toast__title">ثبّت حصني على جهازك</p>
        <p class="install-toast__desc">وصول أسرع وعمل كامل دون إنترنت</p>
      </div>
      <div class="install-toast__actions">
        <button type="button" class="install-toast__later">لاحقًا</button>
        <button type="button" class="install-toast__install">تثبيت</button>
      </div>
    `;

    card.querySelector(".install-toast__install").addEventListener("click", async () => {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      deferredPrompt = null;
      hidePrompt();
    });

    card.querySelector(".install-toast__later").addEventListener("click", hidePrompt);
    card.querySelector(".install-toast__close").addEventListener("click", hidePrompt);

    document.body.appendChild(card);
  }

  function hidePrompt() {
    const card = document.querySelector(".install-toast");
    if (!card) return;
    card.classList.add("is-leaving");
    setTimeout(() => card.remove(), 300);
  }
}
