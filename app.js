// app.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getFirestore, serverTimestamp, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";
// App Check is optional; leave as-is for now
import { initializeAppCheck, ReCaptchaV3Provider } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app-check.js";

// 1) PASTE YOUR CONFIG HERE (from Firebase console → Your app → CDN)
export const firebaseConfig = {
  apiKey: "AIzaSyB_UkIznwrrIPa0dw0_7Dwxgm8Vb5QtGcc",
  authDomain: "textshare-harshit.firebaseapp.com",
  projectId: "textshare-harshit",
  storageBucket: "textshare-harshit.appspot.com",
  messagingSenderId: "841688229362",
  appId: "1:841688229362:web:bddf8c3cee5c8e621d376b"
};

// 2) Initialize Firebase + Firestore
export const app = initializeApp(firebaseConfig);
export const db  = getFirestore(app);

// 3) (Optional, later) App Check — keep disabled until site works
try {
  // Replace SITE_KEY when you set up App Check; it's OK if this throws when empty.
  // initializeAppCheck(app, { provider: new ReCaptchaV3Provider("YOUR_RECAPTCHA_V3_SITE_KEY"), isTokenAutoRefreshEnabled: true });
} catch (_) {}

// helpers
export const nowPlusDays = (days) => { const d = new Date(); d.setDate(d.getDate() + days); return d; };
export const parseExpiry = (code) => ({ '1d':1, '7d':7, '30d':30, '90d':90 }[code] || 30);
export const buildViewLink = (id) => `${location.origin}${location.pathname.replace(/index\.html?$/,'')}view.html?id=${encodeURIComponent(id)}`;
export { serverTimestamp, doc, getDoc, setDoc };

// theme + year
(function(){
  const btn = document.getElementById('themeBtn');
  const apply = (mode) => document.documentElement.dataset.theme = mode;
  const saved = localStorage.getItem('theme'); if (saved) apply(saved);
  btn?.addEventListener('click', ()=>{ const cur = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light'; apply(cur); localStorage.setItem('theme',cur); });
  const y = document.getElementById('year'); if (y) y.textContent = new Date().getFullYear();
})();
