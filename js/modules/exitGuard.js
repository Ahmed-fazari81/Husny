import { showConfirm } from "./confirmDialog.js";
import { isRunningStandalone } from "./swRegister.js";

let currentHash = "#/";
let allowExit = false;

/** يُستدعى من الموجّه بعد كل تنقّل ليعرف الحارس أين يعيد المستخدم عند الإلغاء */
export function trackHash(hash) {
  currentHash = hash || "#/";
}

/**
 * يجعل زر/إيماءة الرجوع في الجهاز (أندرويد) بمثابة "خروج من التطبيق" مع تأكيد،
 * بدلًا من التنقل داخل السجل. يعمل فقط عند تشغيل التطبيق كتطبيق مثبّت (standalone)،
 * حتى لا يتعارض مع سلوك الرجوع الطبيعي في متصفح عادي.
 *
 * ملاحظة: نظام iOS لا يملك زر/إيماءة رجوع للأجهزة على مستوى النظام لتطبيقات الويب
 * المضافة للشاشة الرئيسية، لذا لا يوجد ما يمكن اعتراضه هناك؛ الخروج يتم بإيماءة
 * النظام المعتادة (كأي تطبيق آخر) ولا يمكن لأي كود ويب منعها أو إضافة تأكيد لها.
 */
export function initExitGuard() {
  if (!isRunningStandalone()) return;

  history.pushState({ hisniGuard: true }, "", currentHash);

  window.addEventListener("popstate", () => {
    if (allowExit) return;

    // إعادة نفس الموضع فورًا لمنع أي تنقّل فعلي أو وميض بصري قبل التأكيد
    history.pushState({ hisniGuard: true }, "", currentHash);

    showConfirm("هل تريد الخروج من التطبيق؟").then((confirmed) => {
      if (!confirmed) return;
      allowExit = true;
      history.back();
    });
  });
}
