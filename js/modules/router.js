// موجّه بسيط قائم على الـ hash، بدون أي مكتبة خارجية
// يستخدم replaceState بدل تعديل location.hash مباشرة حتى لا يتراكم سجل المتصفح
// مع كل تنقل داخلي، فيبقى زر الرجوع في الجهاز مخصصًا لتأكيد الخروج من التطبيق (exitGuard.js)
const root = document.documentElement;

let resolveRoute = () => {};
let onNavigate = () => {};

function currentRoute() {
  const hash = window.location.hash.replace(/^#\/?/, "");
  const [route, id] = hash.split("/");
  return { route, id };
}

/**
 * @param {{home: () => void, section: (id: string) => void}} handlers
 * @param {(hash: string) => void} [onRouteResolved] يُستدعى بعد كل عرض بالـ hash الحالي (لتتبعه في exitGuard)
 */
export function initRouter(handlers, onRouteResolved) {
  onNavigate = onRouteResolved || (() => {});

  resolveRoute = () => {
    const { route, id } = currentRoute();

    if (route === "section" && id) {
      root.setAttribute("data-route", "section");
      handlers.section(id);
    } else {
      root.setAttribute("data-route", "home");
      handlers.home();
    }

    onNavigate(window.location.hash || "#/");
  };

  window.addEventListener("hashchange", resolveRoute);
  resolveRoute();
}

function navigate(hash) {
  history.replaceState(history.state, "", hash);
  resolveRoute();
}

export function goHome() {
  navigate("#/");
}

/** @param {string} id */
export function goToSection(id) {
  navigate(`#/section/${id}`);
}
