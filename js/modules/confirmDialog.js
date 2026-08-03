// نافذة تأكيد بسيطة (نعم/لا) بمظهر متسق مع التطبيق، بديلة عن confirm() الافتراضية للمتصفح

/**
 * @param {string} message
 * @returns {Promise<boolean>} true إذا ضغط المستخدم "نعم"
 */
export function showConfirm(message) {
  return new Promise((resolve) => {
    const overlay = document.createElement("div");
    overlay.className = "confirm-overlay";
    overlay.innerHTML = `
      <div class="confirm-dialog" role="alertdialog" aria-modal="true" aria-label="تأكيد">
        <p class="confirm-dialog__message">${message}</p>
        <div class="confirm-dialog__actions">
          <button type="button" class="confirm-dialog__no">لا</button>
          <button type="button" class="confirm-dialog__yes">نعم</button>
        </div>
      </div>
    `;

    const finish = (result) => {
      overlay.classList.add("is-leaving");
      setTimeout(() => overlay.remove(), 200);
      resolve(result);
    };

    overlay.querySelector(".confirm-dialog__yes").addEventListener("click", () => finish(true));
    overlay.querySelector(".confirm-dialog__no").addEventListener("click", () => finish(false));
    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) finish(false);
    });

    document.body.appendChild(overlay);
  });
}
