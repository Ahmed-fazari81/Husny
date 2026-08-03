import { icon } from "./icons.js";

// إحداثيات الكعبة المشرفة
const KAABA_LAT = 21.4225;
const KAABA_LON = 39.8262;

const toRad = (deg) => (deg * Math.PI) / 180;
const toDeg = (rad) => (rad * 180) / Math.PI;

/**
 * يحسب زاوية اتجاه القبلة (بالدرجات من الشمال الحقيقي، باتجاه عقارب الساعة)
 * @param {number} lat خط عرض المستخدم
 * @param {number} lon خط طول المستخدم
 */
function calculateQiblaBearing(lat, lon) {
  const phi1 = toRad(lat);
  const phi2 = toRad(KAABA_LAT);
  const deltaLambda = toRad(KAABA_LON - lon);

  const y = Math.sin(deltaLambda) * Math.cos(phi2);
  const x =
    Math.cos(phi1) * Math.sin(phi2) - Math.sin(phi1) * Math.cos(phi2) * Math.cos(deltaLambda);

  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

/** يحسب المسافة التقريبية بالكيلومترات إلى الكعبة (معادلة الهافرساين) */
function calculateDistanceKm(lat, lon) {
  const R = 6371;
  const phi1 = toRad(lat);
  const phi2 = toRad(KAABA_LAT);
  const dPhi = toRad(KAABA_LAT - lat);
  const dLambda = toRad(KAABA_LON - lon);

  const a = Math.sin(dPhi / 2) ** 2 + Math.cos(phi1) * Math.cos(phi2) * Math.sin(dLambda / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * يبني صفحة اتجاه القبلة داخل الحاوية
 * @param {HTMLElement} container
 * @param {object} section
 */
export function renderQibla(container, section) {
  let qiblaBearing = null;
  let orientationHandler = null;
  let liveActive = false;

  container.innerHTML = `
    <header class="section-view__header">
      <span class="section-card__icon" style="--section-color:${section.color}; margin-inline:auto;">${icon(section.icon)}</span>
      <h2 class="section-view__title">${section.title}</h2>
      <p class="section-view__desc">${section.description}</p>
    </header>

    <div class="qibla">
      <div class="qibla__compass">
        <svg class="qibla__dial" viewBox="0 0 240 240" aria-hidden="true">
          <circle cx="120" cy="120" r="112" />
          <circle cx="120" cy="120" r="86" />
          <text x="120" y="26" text-anchor="middle">N</text>
          <text x="120" y="224" text-anchor="middle">S</text>
          <text x="16" y="126" text-anchor="middle">W</text>
          <text x="224" y="126" text-anchor="middle">E</text>
        </svg>
        <div class="qibla__needle" id="qibla-needle">
          <span class="qibla__needle-kaaba">🕋</span>
        </div>
      </div>

      <p class="qibla__status" id="qibla-status" role="status">
        اضغط على الزر لتحديد اتجاه القبلة من مكانك.
      </p>

      <div class="qibla__actions">
        <button type="button" class="qibla__btn qibla__btn--primary" id="qibla-locate-btn">
          ${icon("compass")} تحديد الاتجاه
        </button>
      </div>

      <p class="qibla__note">
        قد يطلب منك المتصفح تفعيل خدمة الموقع والسماح للتطبيق بالوصول إليها — هذا مطلوب لحساب اتجاه الكعبة من مكانك فقط. على الجوّالات الداعمة، سيتحرك السهم تلقائيًا مع حركة جهازك بمجرد التحديد.
      </p>
    </div>
  `;

  const statusEl = container.querySelector("#qibla-status");
  const needleEl = container.querySelector("#qibla-needle");
  const locateBtn = container.querySelector("#qibla-locate-btn");

  function setNeedleRotation(deg) {
    needleEl.style.transform = `translate(-50%, -100%) rotate(${deg}deg)`;
  }

  function handleOrientation(event) {
    if (qiblaBearing === null) return;

    let heading;
    if (typeof event.webkitCompassHeading === "number") {
      heading = event.webkitCompassHeading;
    } else if (event.alpha !== null) {
      heading = 360 - event.alpha;
    } else {
      return;
    }

    setNeedleRotation((qiblaBearing - heading + 360) % 360);
  }

  function startLiveCompass() {
    if (liveActive || typeof DeviceOrientationEvent === "undefined") return;
    const eventName =
      "ondeviceorientationabsolute" in window ? "deviceorientationabsolute" : "deviceorientation";
    orientationHandler = handleOrientation;
    window.addEventListener(eventName, orientationHandler);
    liveActive = true;
  }

  function locateAndOrient() {
    if (!("geolocation" in navigator)) {
      statusEl.textContent = "متصفحك لا يدعم تحديد الموقع الجغرافي.";
      return;
    }

    locateBtn.disabled = true;
    statusEl.textContent = "جارٍ تحديد موقعك...";

    navigator.geolocation.getCurrentPosition(
      (position) => {
        locateBtn.disabled = false;
        const { latitude, longitude } = position.coords;
        qiblaBearing = calculateQiblaBearing(latitude, longitude);
        const distance = Math.round(calculateDistanceKm(latitude, longitude));

        setNeedleRotation(qiblaBearing);
        startLiveCompass();

        const liveNote = liveActive ? " (السهم يتحرك تلقائيًا مع جهازك)" : "";
        statusEl.innerHTML = `اتجاه القبلة: <strong>${Math.round(qiblaBearing)}°</strong> من الشمال — المسافة إلى الكعبة: <strong>${distance.toLocaleString("ar")}</strong> كم${liveNote}`;
      },
      (error) => {
        locateBtn.disabled = false;
        if (error.code === error.PERMISSION_DENIED) {
          statusEl.textContent =
            "تم رفض إذن الوصول للموقع. يرجى تفعيل خدمة الموقع والسماح للتطبيق بالوصول إليها من إعدادات المتصفح، ثم إعادة المحاولة.";
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          statusEl.textContent = "تعذّر تحديد موقعك الحالي. تأكد من تفعيل خدمة الموقع على جهازك.";
        } else {
          statusEl.textContent = "انتهت مهلة تحديد الموقع. حاول مرة أخرى.";
        }
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 300000 }
    );
  }

  async function onLocateClick() {
    // على iOS يجب طلب إذن مستشعر الاتجاه مباشرة داخل حدث الضغط، قبل أي عملية غير متزامنة،
    // وإلا يُرفض الإذن تلقائيًا لخروج الطلب عن سياق تفاعل المستخدم
    if (
      typeof DeviceOrientationEvent !== "undefined" &&
      typeof DeviceOrientationEvent.requestPermission === "function"
    ) {
      try {
        await DeviceOrientationEvent.requestPermission();
      } catch {
        // نتجاهل الفشل ونكمل بالاتجاه الثابت فقط
      }
    }

    locateAndOrient();
  }

  locateBtn.addEventListener("click", onLocateClick);
}
