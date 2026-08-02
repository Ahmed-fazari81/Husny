// موجّه بسيط قائم على الـ hash، بدون أي مكتبة خارجية
const root = document.documentElement;

/**
 * @param {{home: () => void, section: (id: string) => void}} handlers
 */
export function initRouter(handlers) {
  const resolve = () => {
    const hash = window.location.hash.replace(/^#\/?/, "");
    const [route, id] = hash.split("/");

    if (route === "section" && id) {
      root.setAttribute("data-route", "section");
      handlers.section(id);
    } else {
      root.setAttribute("data-route", "home");
      handlers.home();
    }
  };

  window.addEventListener("hashchange", resolve);
  resolve();
}

export function goHome() {
  window.location.hash = "#/";
}

/** @param {string} id */
export function goToSection(id) {
  window.location.hash = `#/section/${id}`;
}
