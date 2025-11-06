// write.js
import { db, serverTimestamp, doc, setDoc, nowPlusDays, parseExpiry, buildViewLink } from './app.js';

const $ = (s) => document.querySelector(s);
const textInput = $('#textInput');
const expirySel = $('#expiry');
const renderSel = $('#render');
const shareBtn  = $('#shareBtn');
const clearBtn  = $('#clearBtn');
const resultBox = $('#result');
const shareLink = $('#shareLink');
const copyBtn   = $('#copyBtn');
const qrBtn     = $('#qrBtn');
const qrBox     = $('#qrcode');
const waBtn     = $('#waBtn');

function randomId(length = 12) {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from(bytes, b => alphabet[b % alphabet.length]).join('');
}

shareBtn.addEventListener('click', async () => {
  const content = (textInput.value || '').trim();
  if (!content) { alert('Please paste some text first.'); textInput.focus(); return; }

  const expiryDays = parseExpiry(expirySel.value);
  const id = randomId(10);

  try {
    await setDoc(doc(db, 'pastes', id), {
      content,
      render: renderSel.value,   // 'plain' | 'markdown'
      createdAt: serverTimestamp(),
      expiresAt: nowPlusDays(expiryDays),
      version: 1
    });

    const link = buildViewLink(id);
    shareLink.value = link;
    resultBox.classList.remove('hidden');
    qrBox.classList.add('hidden');
    qrBox.innerHTML = '';
  } catch (e) {
    console.error(e);
    alert('Failed to save. Check Firebase config & rules, then try again.');
  }
});

clearBtn.addEventListener('click', () => { textInput.value = ''; textInput.focus(); });

copyBtn.addEventListener('click', async () => {
  if (!shareLink.value) return;
  try {
    await navigator.clipboard.writeText(shareLink.value);
    copyBtn.textContent = 'Copied!';
    setTimeout(()=>copyBtn.textContent='Copy Link', 900);
  } catch { alert('Copy failed. Manually select and copy.'); }
});

qrBtn.addEventListener('click', () => {
  if (!shareLink.value) return;
  if (!qrBox.classList.contains('hidden')) { qrBox.classList.add('hidden'); qrBox.innerHTML=''; return; }
  qrBox.classList.remove('hidden');
  new QRCode(qrBox, { text: shareLink.value, width: 180, height: 180 });
});

waBtn.addEventListener('click', () => {
  if (!shareLink.value) return;
  const msg = encodeURIComponent(`Check this note: ${shareLink.value}`);
  window.open(`https://wa.me/?text=${msg}`, '_blank');
});
