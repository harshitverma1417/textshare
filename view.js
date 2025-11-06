// view.js
import { db, doc, getDoc } from './app.js';

const statusEl = document.getElementById('status');
const contentEl = document.getElementById('content');

function getId(){ return new URL(location.href).searchParams.get('id'); }

function renderMarkdown(md){
  const html = marked.parse(md, { breaks: true, gfm: true });
  contentEl.innerHTML = html;
  contentEl.querySelectorAll('a').forEach(a => { a.target = '_blank'; a.rel = 'noopener'; });
  Prism.highlightAllUnder(contentEl);
}

(async () => {
  const id = getId();
  if (!id) { statusEl.textContent = 'No id provided.'; return; }

  try {
    const snap = await getDoc(doc(db, 'pastes', id));
    if (!snap.exists()) { statusEl.textContent = 'Not found or expired.'; return; }

    const data = snap.data();
    statusEl.classList.add('hidden');
    contentEl.classList.remove('hidden');

    if (data.render === 'markdown' && window.marked) renderMarkdown(data.content);
    else contentEl.textContent = data.content;
  } catch (e) {
    console.error(e);
    statusEl.textContent = 'Error loading note.';
  }
})();
