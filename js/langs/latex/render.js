const MATH_RE = /\$\$([\s\S]+?)\$\$|\$([^$]+)\$/g;

function renderSegmentKatex(el, content, display) {
  if (!window.katex) throw new Error('katex-missing');
  const span = document.createElement(display ? 'div' : 'span');
  window.katex.render(content, span, {
    displayMode: display,
    throwOnError: true,
    strict: 'error',
    output: 'html',
  });
  el.appendChild(span);
}

export function render(el, src) {
  return Promise.resolve(renderMath(el, src));
}

export function renderMath(el, src) {
  el.innerHTML = '';
  if (!window.katex) {
    const s = document.createElement('span');
    s.className = 'preview-off';
    s.textContent = 'KaTeX failed to load (offline?)';
    el.appendChild(s);
    return 'katex-missing';
  }

  const trimmed = src.trim();
  if (trimmed === '') {
    const s = document.createElement('span');
    s.className = 'preview-idle';
    s.textContent = 'empty';
    el.appendChild(s);
    return null;
  }

  const hasDelims = /\$/.test(src);

  try {
    if (!hasDelims) {
      renderSegmentKatex(el, trimmed, true);
      return null;
    }
    let last = 0;
    let m;
    MATH_RE.lastIndex = 0;
    while ((m = MATH_RE.exec(src)) !== null) {
      if (m.index > last) {
        const text = document.createTextNode(src.slice(last, m.index));
        el.appendChild(text);
      }
      if (m[1] !== undefined) renderSegmentKatex(el, m[1], true);
      else renderSegmentKatex(el, m[2], false);
      last = m.index + m[0].length;
    }
    if (last < src.length) el.appendChild(document.createTextNode(src.slice(last)));
    return null;
  } catch (e) {
    const msg = String(e.message || e);
    if (msg === 'katex-missing') return 'katex-missing';
    el.innerHTML = '';
    const err = document.createElement('span');
    err.className = 'preview-err';
    err.textContent = 'LaTeX error: ' + msg.replace(/^KaTeX parse error:\s*/, '');
    el.appendChild(err);
    return msg;
  }
}
