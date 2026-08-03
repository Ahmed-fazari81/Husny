import { icon } from "./icons.js";

const SHOW_DELAY_MS = 1500;

/** يسجّل عامل الخدمة إن كان مدعومًا، ويراقب توفر تحديثات جديدة */
export function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;

  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("sw.js")
      .then((registration) => watchForUpdates(registration))
      .catch((err) => {
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
 * يراقب تسجيل عامل الخدمة لاكتشاف نسخة جديدة، ويعرض إشعارًا يطلب من المستخدم
 * الضغط على "تحديث الآن" بدلًا من تحديث الصفحة تلقائيًا وبصمت (لتفادي مفاجأته
 * بإعادة تحميل أثناء استخدامه للتطبيق). عند التحديث الفعلي تُعاد الصفحة تلقائيًا.
 */
function watchForUpdates(registration) {
  if (registration.waiting) {
    showUpdateToast(registration);
  }

  registration.addEventListener("updatefound", () => {
    const newWorker = registration.installing;
    if (!newWorker) return;

    newWorker.addEventListener("statechange", () => {
      // "installed" مع وجود متحكّم حالي يعني أن هذا تحديث لنسخة سابقة، وليس أول تثبيت
      if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
        showUpdateToast(registration);
      }
    });
  });

  // تحقّق من وجود تحديث كلما عاد المستخدم للتطبيق (بعد تصغيره أو تبديل التطبيقات)
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      registration.update().catch(() => {});
    }
  });

  let reloaded = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (reloaded) return;
    reloaded = true;
    window.location.reload();
  });
}

function showUpdateToast(registration) {
  if (document.querySelector('[data-toast="update"]')) return;

  const card = document.createElement("div");
  card.className = "app-toast";
  card.dataset.toast = "update";
  card.setAttribute("role", "dialog");
  card.setAttribute("aria-label", "تحديث التطبيق");
  card.innerHTML = `
    <button type="button" class="app-toast__close" aria-label="إغلاق">✕</button>
    <div class="app-toast__icon">${icon("refresh")}</div>
    <div class="app-toast__body">
      <p class="app-toast__title">يتوفر تحديث جديد</p>
      <p class="app-toast__desc">حدّث الآن لتحصل على أحدث الأذكار والميزات</p>
    </div>
    <div class="app-toast__actions">
      <button type="button" class="app-toast__btn app-toast__btn--primary">تحديث الآن</button>
    </div>
  `;

  const hide = () => {
    card.classList.add("is-leaving");
    setTimeout(() => card.remove(), 300);
  };

  card.querySelector(".app-toast__btn--primary").addEventListener("click", () => {
    registration.waiting?.postMessage({ type: "SKIP_WAITING" });
    hide();
  });
  card.querySelector(".app-toast__close").addEventListener("click", hide);

  document.body.appendChild(card);
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
    if (!deferredPrompt || document.querySelector('[data-toast="install"]')) return;

    const card = document.createElement("div");
    card.className = "app-toast";
    card.dataset.toast = "install";
    card.setAttribute("role", "dialog");
    card.setAttribute("aria-label", "تثبيت التطبيق");
    card.innerHTML = `
      <button type="button" class="app-toast__close" aria-label="إغلاق">✕</button>
      <div class="app-toast__icon">${icon("install")}</div>
      <div class="app-toast__body">
        <p class="app-toast__title">ثبّت حصني على جهازك</p>
        <p class="app-toast__desc">وصول أسرع وعمل كامل دون إنترنت</p>
      </div>
      <div class="app-toast__actions">
        <button type="button" class="app-toast__btn app-toast__btn--ghost">لاحقًا</button>
        <button type="button" class="app-toast__btn app-toast__btn--primary">تثبيت</button>
      </div>
    `;

    card.querySelector(".app-toast__btn--primary").addEventListener("click", async () => {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      deferredPrompt = null;
      hidePrompt();
    });

    card.querySelector(".app-toast__btn--ghost").addEventListener("click", hidePrompt);
    card.querySelector(".app-toast__close").addEventListener("click", hidePrompt);

    document.body.appendChild(card);
  }

  function hidePrompt() {
    const card = document.querySelector('[data-toast="install"]');
    if (!card) return;
    card.classList.add("is-leaving");
    setTimeout(() => card.remove(), 300);
  }
}
