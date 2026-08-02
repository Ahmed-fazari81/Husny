let toastEl = null;
let hideTimer = null;

function ensureToastElement() {
  if (toastEl) return toastEl;
  toastEl = document.createElement("div");
  toastEl.className = "toast";
  toastEl.setAttribute("role", "status");
  toastEl.setAttribute("aria-live", "polite");
  document.body.appendChild(toastEl);
  return toastEl;
}

/**
 * @param {string} message
 * @param {number} duration
 */
export function showToast(message, duration = 2200) {
  const el = ensureToastElement();
  el.textContent = message;
  el.classList.add("is-visible");
  clearTimeout(hideTimer);
  hideTimer = setTimeout(() => {
    el.classList.remove("is-visible");
  }, duration);
}
