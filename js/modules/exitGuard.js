import { showConfirm } from "./confirmDialog.js";
import { showToast } from "./toast.js";
import { isRunningStandalone } from "./swRegister.js";
import { refresh } from "./router.js";

const PENDING_EXIT_WINDOW_MS = 2500;

let currentHash = "#/";
let allowExit = false;
let guardActive = false;
let pendingExit = false;
let pendingExitTimer = null;

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
 * يجعل زر/إيماءة الرجوع في الجهاز (أندرويد) بمثابة "خروج من التطبيق"، على نمط
 * "اضغط مرة أخرى للخروج" الشائع في التطبيقات: الضغطة الأولى تعرض تنبيهًا فقط،
 * والضغطة الثانية خلال ثوانٍ قليلة تعرض نافذة التأكيد الفعلية. يعمل فقط عند
 * تشغيل التطبيق كتطبيق مثبّت (standalone)، حتى لا يتعارض مع سلوك الرجوع
 * الطبيعي في متصفح عادي.
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

    if (!pendingExit) {
      pendingExit = true;
      showToast("اضغط زر الرجوع مرة أخرى للخروج من التطبيق", PENDING_EXIT_WINDOW_MS);
      clearTimeout(pendingExitTimer);
      pendingExitTimer = setTimeout(() => {
        pendingExit = false;
      }, PENDING_EXIT_WINDOW_MS);
      return;
    }

    clearTimeout(pendingExitTimer);
    pendingExit = false;

    showConfirm("هل تريد الخروج من التطبيق؟").then((confirmed) => {
      if (!confirmed) return;
      allowExit = true;
      // نرجع أبعد ما يمكن ضمن سجل هذه الجلسة (وليس خطوة واحدة فقط) حتى يصل
      // المتصفح فعليًا لاستنفاد السجل، وهو ما يُغلق التطبيق على أندرويد
      history.go(-(history.length + 10));
    });
  });
}
