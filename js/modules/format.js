// تحويل عدد التكرار إلى صيغة عربية مكتوبة بدلاً من رمز ×
const ARABIC_REPEAT_WORDS = {
  1: "مرة واحدة",
  2: "مرتان",
  3: "ثلاث مرات",
  4: "أربع مرات",
  5: "خمس مرات",
  6: "ست مرات",
  7: "سبع مرات",
  8: "ثماني مرات",
  9: "تسع مرات",
  10: "عشر مرات",
  11: "إحدى عشرة مرة",
  33: "ثلاث وثلاثون مرة",
  34: "أربع وثلاثون مرة",
  100: "مئة مرة",
};

/**
 * @param {number} count
 * @returns {string} نص عربي لعدد مرات التكرار
 */
export function repeatText(count) {
  if (ARABIC_REPEAT_WORDS[count]) return ARABIC_REPEAT_WORDS[count];
  return `${count} مرة`;
}
