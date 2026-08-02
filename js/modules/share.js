import { showToast } from "./toast.js";

const APP_NAME = "تطبيق حصني - أذكار وأدعية";

/**
 * يبني نص المشاركة الكامل لعنصر ذكر/دعاء
 * @param {object} item
 * @param {string} sectionTitle
 */
function buildShareText(item, sectionTitle) {
  const sourceLine = item.source
    ? `\n\n${item.source.type === "quran" ? "📖" : "🕊️"} ${item.source.reference}${item.source.grade ? ` (${item.source.grade})` : ""}`
    : "";
  return `${item.text}${sourceLine}\n\n${sectionTitle} — ${APP_NAME}`;
}

/**
 * مشاركة كنص عبر Web Share API مع نسخ إلى الحافظة كبديل
 * @param {object} item
 * @param {string} sectionTitle
 */
export async function shareAsText(item, sectionTitle) {
  const text = buildShareText(item, sectionTitle);

  if (navigator.share) {
    try {
      await navigator.share({ text, title: APP_NAME });
      return;
    } catch (err) {
      if (err && err.name === "AbortError") return;
      // فشل المشاركة الأصلية -> نجرب النسخ كبديل
    }
  }

  try {
    await navigator.clipboard.writeText(text);
    showToast("تم نسخ النص إلى الحافظة");
  } catch {
    showToast("تعذّرت المشاركة أو النسخ");
  }
}

/**
 * يلف النص العربي على عدة أسطر بحسب عرض الرسم المتاح
 * @param {CanvasRenderingContext2D} ctx
 * @param {string} text
 * @param {number} maxWidth
 */
function wrapText(ctx, text, maxWidth) {
  const words = text.split(" ");
  const lines = [];
  let current = "";

  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines;
}

/**
 * يرسم بطاقة الذكر كصورة على Canvas ويعيد Blob بصيغة PNG
 * @param {object} item
 * @param {string} sectionTitle
 * @param {string} accentColor
 */
async function renderCardImage(item, sectionTitle, accentColor = "#0f766e") {
  const width = 1080;
  const height = 1350;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  // الخلفية
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#0b1120");
  gradient.addColorStop(1, "#111a2e");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // إطار زخرفي بسيط
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 4;
  ctx.strokeRect(40, 40, width - 80, height - 80);
  ctx.strokeStyle = "rgba(255,255,255,0.25)";
  ctx.lineWidth = 1;
  ctx.strokeRect(56, 56, width - 112, height - 112);

  ctx.direction = "rtl";
  ctx.textAlign = "center";
  ctx.fillStyle = "#f1f5f9";

  // نص الذكر
  ctx.font = "600 52px 'Traditional Arabic', 'Amiri', serif";
  const maxTextWidth = width - 200;
  const lines = wrapText(ctx, item.text, maxTextWidth);
  const lineHeight = 78;
  const blockHeight = lines.length * lineHeight;
  let y = (height - blockHeight) / 2 - 40;

  for (const line of lines) {
    ctx.fillText(line, width / 2, y);
    y += lineHeight;
  }

  // المصدر
  if (item.source) {
    ctx.font = "36px 'Tajawal', sans-serif";
    ctx.fillStyle = accentColor;
    const gradeText = item.source.grade ? ` (${item.source.grade})` : "";
    ctx.fillText(`${item.source.reference}${gradeText}`, width / 2, y + 30);
  }

  // اسم القسم والتطبيق أسفل البطاقة
  ctx.font = "30px 'Tajawal', sans-serif";
  ctx.fillStyle = "rgba(241,245,249,0.7)";
  ctx.fillText(sectionTitle, width / 2, height - 130);
  ctx.font = "bold 34px 'Tajawal', sans-serif";
  ctx.fillStyle = "#f1f5f9";
  ctx.fillText(APP_NAME, width / 2, height - 80);

  return new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
}

/**
 * مشاركة الذكر كصورة، مع تنزيل الصورة كبديل عند عدم دعم مشاركة الملفات
 * @param {object} item
 * @param {string} sectionTitle
 * @param {string} accentColor
 */
export async function shareAsImage(item, sectionTitle, accentColor) {
  showToast("جارٍ إنشاء الصورة...");
  const blob = await renderCardImage(item, sectionTitle, accentColor);
  if (!blob) {
    showToast("تعذّر إنشاء الصورة");
    return;
  }
  const file = new File([blob], `${item.id}.png`, { type: "image/png" });

  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: APP_NAME });
      return;
    } catch (err) {
      if (err && err.name === "AbortError") return;
    }
  }

  // بديل: تنزيل الصورة مباشرة
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${item.id}.png`;
  link.click();
  URL.revokeObjectURL(url);
  showToast("تم تنزيل الصورة");
}
