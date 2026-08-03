import { showConfirm } from "./confirmDialog.js";
import { isRunningStandalone } from "./swRegister.js";
import { refresh } from "./router.js";

let currentHash = "#/";
let allowExit = false;
let guardActive = false;

/**
 * يُستدعى من الموجّه بعد كل تنقّل ليعرف الحارس أين يعيد المستخدم عند الإلغاء.
 * يعيد أيضًا تثبيت علامة الحارس على المدخلة الحالية في كل مرة (وليس مرة واحدة فقط
 * عند البدء)، حتى لا تُفقد هذه العلامة أبدًا مهما تعددت عمليات التنقل الداخلي.
 */
export function trackHash(hash) {
  currentHash = hash || "#/";
  if (guardActive) {
    history.replaceState({ hisniGuard: true }, "", currentHash);
  }
}

/**
 * يجعل زر/إيماءة الرجوع في الجهاز (أندرويد) بمثابة "خروج من التطبيق" مع تأكيد،
 * في كل الشاشات دون استثناء، بدلًا من التنقل داخل السجل. يعمل فقط عند تشغيل
 * التطبيق كتطبيق مثبّت (standalone)، حتى لا يتعارض مع سلوك الرجوع الطبيعي
 * في متصفح عادي.
 *
 * ملاحظة: نظام iOS لا يملك زر/إيماءة رجوع للأجهزة على مستوى النظام لتطبيقات الويب
 * المضافة للشاشة الرئيسية، لذا لا يوجد ما يمكن اعتراضه هناك؛ الخروج يتم بإيماءة
 * النظام المعتادة (كأي تطبيق آخر) ولا يمكن لأي كود ويب منعها أو إضافة تأكيد لها.
 */
export function initExitGuard() {
  if (!isRunningStandalone()) return;

  guardActive = true;
  history.pushState({ hisniGuard: true }, "", currentHash);

  window.addEventListener("popstate", () => {
    if (allowExit) return;

    // إعادة نفس الموضع فورًا لمنع أي تنقّل فعلي، ثم تصحيح العرض صراحةً في حال
    // نفّذ حدث hashchange عرضًا انتقاليًا خاطئًا قبل أن يصل تنفيذنا إلى هنا
    history.pushState({ hisniGuard: true }, "", currentHash);
    refresh();

    showConfirm("هل تريد الخروج من التطبيق؟").then((confirmed) => {
      if (!confirmed) return;
      allowExit = true;
      // نرجع أبعد ما يمكن ضمن سجل هذه الجلسة (وليس خطوة واحدة فقط) حتى يصل
      // المتصفح فعليًا لاستنفاد السجل، وهو ما يُغلق التطبيق على أندرويد
      history.go(-(history.length + 10));
    });
  });
}
