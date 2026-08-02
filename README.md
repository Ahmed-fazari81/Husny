# 🕌 حصني | Hisni — أذكار وأدعية إسلامية (PWA)

> اقرأ بالإنجليزية: [README.en below ⬇](#-hisni--islamic-azkar--duas-pwa-english)

تطبيق ويب تقدمي (PWA) خفيف الوزن لأذكار الصباح والمساء، والرقية الشرعية، وأدعية القرآن، وأسماء الله الحسنى، وتحديد اتجاه القبلة — مبني بالكامل بـ **HTML / CSS / JavaScript** بدون أي إطار عمل (Vanilla JS)، ويعمل **دون إنترنت بالكامل** بعد أول زيارة، وقابل للتثبيت على الجوال والحاسوب.

## ✨ المزايا

- 📱 **PWA حقيقي**: قابل للتثبيت (Add to Home Screen) على أندرويد وiOS وويندوز وماك ولينكس.
- 🔌 **Offline-first**: عامل خدمة (Service Worker) يخزّن كل الملفات والبيانات مؤقتًا، فيعمل التطبيق كاملًا بلا إنترنت بعد أول تحميل.
- 🌗 **وضع ليلي/نهاري** مع اتباع تفضيل النظام تلقائيًا.
- 🔤 **حجم خط قابل للتعديل** لراحة القراءة.
- 🕋 **ستة أقسام**: أذكار الصباح، أذكار المساء، الرقية الشرعية، أدعية من القرآن، أسماء الله الحسنى، واتجاه القبلة.
- 🧭 **بوصلة قبلة تفاعلية**: تحديد اتجاه الكعبة المشرفة والمسافة إليها من موقعك، مع دعم البوصلة الحية على الجوال (Device Orientation).
- 📤 **مشاركة الذكر/الدعاء** كنص أو كصورة أنيقة (عبر Web Share API أو تنزيل مباشر).
- 💾 **حفظ آخر قسم تمت زيارته** محليًا (localStorage) لاستئناف القراءة بسرعة.
- 🎨 حركات وانتقالات ناعمة بـ CSS ومظهر متسق عبر الوضعين الليلي والنهاري.
- 🗂️ بنية بيانات (JSON) قابلة للتوسع لإضافة أقسام جديدة أو ترجمات دون إعادة هيكلة.
- ✅ لا حاجة لأدوات بناء (build tools) — يعمل مباشرة كملفات ثابتة.

## 📚 مصادر المحتوى

النصوص مجمّعة من مصادر إسلامية موثوقة متعددة (وليست معتمدة على كتاب واحد):

- **آيات القرآن الكريم**: موثّقة برقم السورة والآية.
- **الأحاديث النبوية**: موثّقة بمصدرها (البخاري، مسلم، أبو داود، الترمذي، النسائي، ابن ماجه...) ودرجة صحتها (صحيح/حسن) كما هو شائع في كتب التخريج المعتمدة (كصحيح الترغيب والترهيب، وموسوعة الحديث لدرر السنية، وموقع الدرر السنية، وموقع الإسلام سؤال وجواب).

> ⚠️ يُنصح بمراجعة أهل العلم عند الشك في أي نص، ونرحب بالمساهمات لتصحيح أي خطأ عبر Issue أو Pull Request.

## 🖼️ لقطات الشاشة

> أضف لقطات الشاشة الخاصة بك في `docs/screenshots/` وحدّث الروابط أدناه بعد أول تشغيل.

|    الشاشة الرئيسية    |         صفحة قسم         |
| :-------------------: | :----------------------: |
| _(أضف صورة home.png)_ | _(أضف صورة section.png)_ |

## 🚀 التشغيل محليًا

لا حاجة لأي أدوات بناء معقدة، فقط خادم ثابت (Static Server) لأن Service Worker وES Modules يتطلبان بروتوكول `http`.

```bash
# باستخدام Node.js (npx serve)
npx serve .

# أو باستخدام Python
python -m http.server 5000
```

ثم افتح المتصفح على `http://localhost:5000`.

### فحص جودة الكود

```bash
npm install
npm run lint      # فحص ESLint
npm run format    # تنسيق تلقائي بـ Prettier
```

## 🗂️ هيكلة المشروع

```
حصني/
├── index.html              # الصفحة الرئيسية (SPA shell)
├── offline.html            # صفحة احتياطية عند فقد الاتصال قبل أول تخزين
├── manifest.json           # بيانات تثبيت PWA
├── sw.js                   # عامل الخدمة (التخزين المؤقت والعمل دون إنترنت)
├── css/
│   ├── main.css             # ملف تجميع الأنماط
│   ├── variables.css        # المتغيرات والثيمات (فاتح/داكن)
│   ├── base.css              # إعادة الضبط والطباعة
│   ├── layout.css            # هيكل الصفحات
│   ├── components.css        # المكونات (بطاقات، أزرار...)
│   └── animations.css        # الحركات والانتقالات
├── js/
│   ├── app.js                # نقطة الدخول
│   └── modules/
│       ├── router.js          # التوجيه بين الشاشات (hash router)
│       ├── dataLoader.js      # تحميل ملفات JSON
│       ├── render.js          # بناء الواجهة
│       ├── icons.js           # أيقونات SVG
│       ├── theme.js           # الوضع الليلي/النهاري
│       ├── fontSize.js        # حجم الخط
│       ├── storage.js         # طبقة localStorage
│       ├── share.js           # مشاركة كنص/صورة
│       ├── toast.js           # تنبيهات عائمة
│       └── swRegister.js      # تسجيل عامل الخدمة وزر التثبيت
├── data/
│   ├── sections.json          # فهرس الأقسام (قابل للتوسع)
│   ├── morning-azkar.json
│   ├── evening-azkar.json
│   ├── ruqyah.json
│   ├── quran-duas.json
│   └── sunnah-duas.json
└── assets/
    ├── icons/                 # أيقونات PWA بجميع المقاسات
    └── fonts/                  # خط Cairo مستضاف محليًا (offline-first)
```

## ➕ إضافة قسم جديد

هناك نوعان من الأقسام في `data/sections.json`، يحددهما حقل `"type"`:

### أ) قسم نصي عادي (`"type": "list"`) — مثال: مواقيت الصلاة

1. أنشئ ملف `data/prayer-times.json` بنفس بنية الملفات الحالية:
   ```json
   {
     "id": "prayer-times",
     "title": "مواقيت الصلاة",
     "items": [
       { "id": "x-1", "text": "...", "count": 1, "source": { "type": "quran", "reference": "..." } }
     ]
   }
   ```
2. أضف مدخلًا جديدًا في `data/sections.json` بحقل `"type": "list"` (id، title، icon، file، color...).
3. إن كانت الأيقونة جديدة، أضف رسمها SVG في `js/modules/icons.js`.
4. أضف اسم الملف الجديد إلى قائمة `PRECACHE_ASSETS` في `sw.js` ليتوفر دون إنترنت.

### ب) قسم تفاعلي (`"type"` مخصص) — مثال: اتجاه القبلة

قسم "اتجاه القبلة" الحالي مثال على نوع مختلف: لا يملك حقل `"file"` (لا بيانات JSON)، بل نوعه `"qibla"`. في [js/app.js](js/app.js)، دالة `showSection` تتحقق من `section.type` وتستدعي واجهة عرض مخصصة (`renderQibla` من [js/modules/qibla.js](js/modules/qibla.js)) بدلاً من تحميل ملف بيانات. يمكن تكرار هذا النمط لإضافة أي ميزة تفاعلية أخرى (مثل مواقيت الصلاة الحية بالاعتماد على الموقع الجغرافي).

في الحالتين، لا حاجة لتعديل الشاشة الرئيسية أو الموجّه — تُقرأ الأقسام ديناميكيًا من `sections.json`.

## 🧩 التقنيات المستخدمة

HTML5 · CSS3 (Custom Properties, Grid, Animations) · Vanilla JavaScript (ES Modules) · Web App Manifest · Service Worker API · Web Share API · localStorage

## 📄 الترخيص

هذا المشروع مرخّص بموجب [رخصة MIT](LICENSE) للكود المصدري. النصوص الدينية جزء من التراث الإسلامي العام.

## 🤝 المساهمة

المساهمات مرحّب بها! سواء بإضافة أقسام جديدة، ترجمات، تحسينات بصرية، أو تصحيح نص. الرجاء فتح Issue أو Pull Request.

---

# 🕌 Hisni — Islamic Azkar & Duas PWA (English)

A lightweight Progressive Web App for Morning & Evening Azkar, Legal Ruqyah, Quranic Duas, the 99 Names of Allah, and Qibla direction — built entirely with **vanilla HTML/CSS/JavaScript** (no frameworks), fully **offline-first** after the first visit, and installable on mobile and desktop.

## ✨ Features

- 📱 **True PWA**: installable on Android, iOS, Windows, macOS, and Linux.
- 🔌 **Offline-first**: a Service Worker precaches all assets and data so the app works fully offline after the first load.
- 🌗 **Light/Dark mode** with automatic system preference detection.
- 🔤 **Adjustable font size** for comfortable reading.
- 🕋 **Six sections**: Morning Azkar, Evening Azkar, Legal Ruqyah, Quranic Duas, the 99 Names of Allah, and Qibla direction.
- 🧭 **Interactive Qibla compass**: bearing and distance to the Kaaba from your location, with live compass support on mobile (Device Orientation).
- 📤 **Share as text or image** via the Web Share API (or direct download fallback).
- 💾 **Remembers your last visited section** via localStorage.
- 🎨 Smooth CSS transitions and micro-interactions, consistent across light and dark mode.
- 🗂️ Extensible JSON data schema for adding new sections or translations without restructuring.
- ✅ No build tools required — runs as plain static files.

## 📚 Content Sources

Texts are compiled from multiple trusted Islamic sources (not a single book):

- **Quranic verses**: referenced by Surah name and Ayah number.
- **Hadith**: referenced by their source collection (Bukhari, Muslim, Abu Dawud, Tirmidhi, Nasa'i, Ibn Majah...) with authenticity grading (Sahih/Hasan) as commonly documented on trusted hadith verification sites (e.g., Dorar.net, IslamQA).

> ⚠️ Please consult qualified scholars if in doubt about any text. Contributions to correct errors are welcome via Issues or Pull Requests.

## 🚀 Running Locally

No build tools needed — just a static server, since Service Workers and ES Modules require `http(s)`.

```bash
npx serve .
# or
python -m http.server 5000
```

Then open `http://localhost:5000`.

### Code Quality

```bash
npm install
npm run lint
npm run format
```

## 🗂️ Project Structure

See the Arabic section above — the structure is identical (`css/`, `js/modules/`, `data/`, `assets/`).

## ➕ Adding a New Section

Sections in `data/sections.json` come in two kinds, controlled by the `"type"` field:

**a) A text section (`"type": "list"`)** — create `data/<section-id>.json` following the existing schema, register it in `sections.json` (id, title, icon, file, color...), add a new SVG icon in `js/modules/icons.js` if needed, and add the file path to `PRECACHE_ASSETS` in `sw.js`.

**b) An interactive section** (like Qibla) — omit `"file"` and give it a custom `"type"` (e.g. `"qibla"`). In [js/app.js](js/app.js), `showSection` checks `section.type` and calls a dedicated render function (`renderQibla` in [js/modules/qibla.js](js/modules/qibla.js)) instead of loading a JSON file. Reuse this pattern for other interactive features (e.g. live prayer times).

No other logic changes are required — the home screen and router read sections dynamically.

## 🧩 Tech Stack

HTML5 · CSS3 (Custom Properties, Grid, Animations) · Vanilla JavaScript (ES Modules) · Web App Manifest · Service Worker API · Web Share API · localStorage

## 📄 License

Licensed under the [MIT License](LICENSE) for the source code. Religious texts are part of the public Islamic heritage.

## 🤝 Contributing

Contributions are welcome — new sections, translations, visual improvements, or text corrections. Please open an Issue or Pull Request.
