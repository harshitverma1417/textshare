// app.js
//
// Loads Firebase from CDN (no npm), initializes your app, and provides
// small helper functions used by write.js and view.js.

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import {
  getFirestore,
  serverTimestamp,
  doc,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

// (Optional) App Check — leave commented until the site works end-to-end.
// import { initializeAppCheck, ReCaptchaV3Provider } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app-check.js";

/* -----------------------------------------------------------
   1) PASTE YOUR OWN FIREBASE CONFIG VALUES HERE
      (Firebase Console → Project: textshare-harshit → Project Overview → Your apps → Web (</>) → SDK snippet → "CDN")
------------------------------------------------------------ */
export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",                   // <-- replace
  authDomain: "textshare-harshit.firebaseapp.com",
  projectId: "textshare-harshit",
  storageBucket: "textshare-harshit.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",      // <-- replace
  appId: "YOUR_APP_ID"                      // <-- replace
};

/* -----------------------------------------------------------
   2) Initialize Firebase & Firestore
------------------------------------------------------------ */
export const app = initializeApp(firebaseConfig);
export const db  = getFirestore(app);

// (Optional later) Enable App Check AFTER everything works, then:
// try {
//   initializeAppCheck(app, {
//     provider: new ReCaptchaV3Provider("YOUR_RECAPTCHA_V3_SITE_KEY"),
//     isTokenAutoRefreshEnabled: true
//   });
// } catch (e) { /* ignore if not configured yet */ }

/* -----------------------------------------------------------
   3) Small helpers used around the app
------------------------------------------------------------ */

// Safer link builder that always yields .../textshare/ before appending view.html
export const buildViewLink = (id) => {
  const base = new URL("./", location.href).href; // ensures trailing slash
  return `${base}view.html?id=${encodeURIComponent(id)}`;
};

// Expiry helpers
export const nowPlusDays = (days) => {
  const d = new Date();
  d.setDate(d.getDate() + (Number.isFinite(days) ? days : 30));
  return d;
};

export const parseExpiry = (code) => ({
  "1d": 1,
  "7d": 7,
  "30d": 30,
  "90d": 90
}[code] ?? 30);

// Re-export firestore helpers so other files can import from ./app.js
export { serverTimestamp, doc, getDoc, setDoc };

/* -----------------------------------------------------------
   4) UI polish: theme toggle & current year (non-essential)
------------------------------------------------------------ */
(function () {
  const btn = document.getElementById("themeBtn");
  const apply = (mode) => { document.documentElement.dataset.theme = mode; };
  const saved = localStorage.getItem("theme");
  if (saved) apply(saved);

  btn?.addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
    apply(next);
    localStorage.setItem("theme", next);
  });

  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
