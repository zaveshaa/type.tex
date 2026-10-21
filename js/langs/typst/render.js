const CDN = 'https://cdn.jsdelivr.net/npm/@myriaddreamin/typst-all-in-one.ts@0.7.0/dist/esm/index.js';

const WRAP = '#set page(width: auto, height: auto, margin: 5pt)\n#set text(size: 21pt)\n';

let modulePromise = null;
let engineReady = false;

function ensureEngine() {
  if (!modulePromise) {
    modulePromise = import(/* @vite-ignore */ CDN).catch((e) => {
      modulePromise = null;
      throw e;
    });
  }
  return modulePromise;
}

function showError(el, msg) {
  el.innerHTML = '';
  const err = document.createElement('span');
  err.className = 'preview-err';
  err.textContent = 'Typst error: ' + (msg || 'compile failed');
  el.appendChild(err);
}

async function doRender(el, src) {
  if (!engineReady) el.textContent = 'loading typst engine…';
  try {
    const mod = await ensureEngine();
    const $typst = mod.$typst || window.$typst;
    if (!$typst) throw new Error('typst.ts engine failed to initialize');
    engineReady = true;
    const svg = await $typst.svg({ mainContent: WRAP + src });
    el.innerHTML = svg || '<span class="preview-idle">empty document</span>';
    return null;
  } catch (e) {
    const msg = e && e.message ? String(e.message) : '';
    showError(el, msg);
    return msg || 'error';
  }
}

let queue = Promise.resolve();

export function render(el, src) {
  const p = queue.then(() => doRender(el, src));
  queue = p.catch(() => {});
  return p;
}
