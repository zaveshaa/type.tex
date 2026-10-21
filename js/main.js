import { lessons as latexLessons } from './langs/latex/lessons.js';
import * as latexRender from './langs/latex/render.js';
import { lessons as typstLessons } from './langs/typst/lessons.js';
import * as typstRender from './langs/typst/render.js';
import { isComplete, firstMismatch, wpm } from './typer.js';

const PROGRESS_KEY = 'latex-trainer-progress-v1';
const STATE_KEY = 'latex-trainer-lang-v1';

const LANGS = {
  latex: {
    name: 'LaTeX',
    lessons: latexLessons,
    render: latexRender.render,
    previewDelay: 250,
  },
  typst: {
    name: 'Typst',
    lessons: typstLessons,
    render: typstRender.render,
    previewDelay: 450,
  },
};

const $ = (id) => document.getElementById(id);

const els = {
  modeSwitch: $('mode-switch'),
  langSwitch: $('lang-switch'),
  themeBtn: $('theme-btn'),
  viewPractice: $('view-practice'),
  viewLearn: $('view-learn'),
  lessonSelect: $('lesson-select'),
  taskSelect: $('task-select'),
  progressBadge: $('progress-badge'),
  goalPreview: $('goal-preview'),
  typebox: $('typebox'),
  typed: $('typed'),
  input: $('input'),
  hintBox: $('hint-box'),
  doneRow: $('done-row'),
  doneMsg: $('done-msg'),
  doneStats: $('done-stats'),
  nextBtn: $('next-btn'),
  previewBlock: $('preview-block'),
  typedSrc: $('typed-src'),
  typedPreview: $('typed-preview'),
  strictError: $('strict-error'),
  learnList: $('learn-list'),
};

const state = {
  lang: 'latex',
  view: 'practice',
  lessonIdx: 0,
  learnTab: 0,
  taskIdx: 0,
  startedAt: null,
  okKeys: 0,
  totalKeys: 0,
  done: false,
  previewShown: false,
};

const currentLang = () => LANGS[state.lang];
const currentLesson = () => currentLang().lessons[state.lessonIdx];
const currentTask = () => currentLesson().tasks[state.taskIdx];

/* ---------- progress ---------- */

function loadProgress() {
  try {
    const raw = JSON.parse(localStorage.getItem(PROGRESS_KEY) || '[]');
    return new Set(
      raw.map((k) => (k.startsWith('latex:') || k.startsWith('typst:') ? k : `latex:${k}`)),
    );
  } catch {
    return new Set();
  }
}

let progress = loadProgress();

function saveProgress() {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify([...progress]));
}

function taskKey(lesson, i) {
  return `${state.lang}:${lesson.id}:${i}`;
}

function lessonDoneCount(lesson) {
  let n = 0;
  lesson.tasks.forEach((_, i) => {
    if (progress.has(taskKey(lesson, i))) n++;
  });
  return n;
}

/* ---------- rendering helpers ---------- */

function fadeRender(el, src) {
  el.classList.remove('in');
  Promise.resolve(currentLang().render(el, src)).then(() => {
    requestAnimationFrame(() => el.classList.add('in'));
  });
}

let previewObserver = null;

function observePreviews(root) {
  if (previewObserver) previewObserver.disconnect();
  previewObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        previewObserver.unobserve(el);
        fadeRender(el, el.dataset.src);
      });
    },
    { rootMargin: '80px' },
  );
  root.querySelectorAll('[data-src]').forEach((el) => previewObserver.observe(el));
}

/* ---------- selects ---------- */

function populateSelects() {
  const lessons = currentLang().lessons;
  els.lessonSelect.innerHTML = '';
  lessons.forEach((lesson, i) => {
    const opt = document.createElement('option');
    opt.value = String(i);
    opt.textContent = lesson.title;
    els.lessonSelect.appendChild(opt);
  });
  els.lessonSelect.value = String(state.lessonIdx);

  els.taskSelect.innerHTML = '';
  currentLesson().tasks.forEach((_, i) => {
    const opt = document.createElement('option');
    opt.value = String(i);
    opt.textContent = `task ${i + 1}${progress.has(taskKey(currentLesson(), i)) ? ' ·' : ''}`;
    els.taskSelect.appendChild(opt);
  });
  els.taskSelect.value = String(state.taskIdx);

  els.progressBadge.textContent = `${lessonDoneCount(currentLesson())} / ${currentLesson().tasks.length}`;
}

/* ---------- input mirror ---------- */

function renderMirror() {
  const target = currentTask().source;
  const v = els.input.value;
  els.typed.innerHTML = '';
  const frag = document.createDocumentFragment();
  [...v].forEach((ch, i) => {
    const sp = document.createElement('span');
    sp.className = ch === target[i] ? 'ok' : 'bad';
    sp.textContent = ch;
    frag.appendChild(sp);
  });
  for (let i = v.length; i < target.length; i++) {
    const sp = document.createElement('span');
    sp.textContent = target[i];
    frag.appendChild(sp);
  }
  els.typed.appendChild(frag);
  els.typed.scrollLeft = els.input.scrollLeft;
}

/* ---------- typed preview ---------- */

let typedTimer = null;

function runTypedPreview() {
  const v = els.input.value;
  els.typedSrc.textContent = v === '' ? ' ' : v;
  if (v === '') {
    els.typedPreview.classList.remove('in');
    els.typedPreview.innerHTML = '<span class="preview-idle">…</span>';
    requestAnimationFrame(() => els.typedPreview.classList.add('in'));
    return;
  }
  fadeRender(els.typedPreview, v);
}

function scheduleTypedPreview() {
  clearTimeout(typedTimer);
  typedTimer = setTimeout(runTypedPreview, currentLang().previewDelay);
}

function revealPreviewBlock() {
  if (state.previewShown) return;
  state.previewShown = true;
  els.previewBlock.hidden = false;
  els.typedPreview.classList.remove('in');
  els.typedPreview.innerHTML = '<span class="preview-idle">…</span>';
  requestAnimationFrame(() => els.typedPreview.classList.add('in'));
}

/* ---------- task lifecycle ---------- */

function loadTask() {
  const lesson = currentLesson();
  const task = currentTask();
  const lang = currentLang();

  state.startedAt = null;
  state.okKeys = 0;
  state.totalKeys = 0;
  state.done = false;
  state.previewShown = false;

  els.hintBox.classList.remove('open');
  els.hintBox.textContent = '';
  els.doneRow.hidden = true;
  els.previewBlock.hidden = true;
  els.nextBtn.hidden = false;
  els.input.value = '';
  els.input.readOnly = false;
  els.input.dataset.len = '0';
  els.strictError.textContent = '';
  els.typedSrc.textContent = '';

  renderMirror();
  populateSelects();

  els.goalPreview.classList.remove('in');
  Promise.resolve(lang.render(els.goalPreview, task.source)).then(() => {
    requestAnimationFrame(() => els.goalPreview.classList.add('in'));
  });

  els.input.focus();
}

function onInput(e) {
  if (state.done) {
    els.input.value = currentTask().source;
    return;
  }
  const target = currentTask().source;
  let v = els.input.value;
  if (v.length > target.length) {
    v = v.slice(0, target.length);
    els.input.value = v;
  }
  if (v.length > 0 && state.startedAt === null) {
    state.startedAt = Date.now();
    revealPreviewBlock();
  }
  const prevLen = Number(e.target.dataset.len || 0);
  if (v.length > prevLen) {
    for (let i = prevLen; i < v.length; i++) {
      state.totalKeys++;
      if (v[i] === target[i]) state.okKeys++;
    }
  }
  els.input.dataset.len = String(v.length);

  renderMirror();
  if (!state.done) scheduleTypedPreview();

  if (isComplete(v, target)) completeTask();
}

function completeTask() {
  state.done = true;
  els.input.readOnly = true;
  renderMirror();
  progress.add(taskKey(currentLesson(), state.taskIdx));
  saveProgress();

  const elapsed = state.startedAt ? Date.now() - state.startedAt : 0;
  const w = wpm(currentTask().source.length, elapsed);

  els.doneMsg.textContent = 'done';
  els.doneStats.textContent = `${(elapsed / 1000).toFixed(1)}s · ${w} wpm`;
  els.doneRow.hidden = false;
  els.strictError.textContent = '';

  clearTimeout(typedTimer);
  runTypedPreview();
  populateSelects();
}

function showHint() {
  if (state.done) return;
  const target = currentTask().source;
  const i = firstMismatch(els.input.value, target);
  if (i === -1) return;
  const expected = target[i];
  const shown = expected === ' ' ? 'space' : expected;
  els.hintBox.innerHTML = `next: <code></code>`;
  els.hintBox.querySelector('code').textContent = shown;
  els.hintBox.classList.add('open');
  els.input.focus();
}

function nextTask() {
  const lesson = currentLesson();
  const lessons = currentLang().lessons;
  if (state.taskIdx < lesson.tasks.length - 1) {
    state.taskIdx++;
  } else if (state.lessonIdx < lessons.length - 1) {
    state.lessonIdx++;
    state.taskIdx = 0;
  }
  loadTask();
}

/* ---------- language / view switching ---------- */

function switchLang(lang) {
  if (lang === state.lang || !LANGS[lang]) return;
  state.lang = lang;
  [...els.langSwitch.querySelectorAll('.lang-btn')].forEach((b) => {
    b.classList.toggle('active', b.dataset.lang === lang);
  });

  const lessons = LANGS[lang].lessons;
  state.lessonIdx = 0;
  state.taskIdx = 0;
  const unfinishedLesson = lessons.findIndex((l) =>
    l.tasks.some((_, ti) => progress.has(`${lang}:${l.id}:${ti}`)),
  );
  if (unfinishedLesson !== -1) {
    state.lessonIdx = unfinishedLesson;
    const lesson = lessons[unfinishedLesson];
    state.taskIdx = lesson.tasks.findIndex((_, ti) => !progress.has(`${lang}:${lesson.id}:${ti}`));
  }
  localStorage.setItem(STATE_KEY, lang);

  state.learnTab = state.lessonIdx;
  if (state.view === 'learn') buildLearn();
  else loadTask();
}

function switchView(view) {
  state.view = view;
  [...els.modeSwitch.querySelectorAll('.nav-link')].forEach((b) => {
    b.classList.toggle('active', b.dataset.view === view);
  });
  els.viewPractice.hidden = view !== 'practice';
  els.viewLearn.hidden = view !== 'learn';
  if (view === 'learn') buildLearn();
  else els.input.focus();
}

/* ---------- learn view ---------- */

function buildLearn() {
  const lang = currentLang();
  const total = lang.lessons.reduce((n, l) => n + l.tasks.length, 0);
  els.learnList.innerHTML = '';
  const head = document.createElement('div');
  head.className = 'learn-head';
  head.textContent = `${lang.name.toLowerCase()} · ${lang.lessons.length} lessons · ${total} tasks`;
  els.learnList.appendChild(head);

  const tabs = document.createElement('div');
  tabs.className = 'learn-tabs';
  lang.lessons.forEach((lesson, li) => {
    const t = document.createElement('button');
    t.className = 'learn-tab' + (li === state.learnTab ? ' active' : '');
    const no = document.createElement('span');
    no.className = 'ex-no';
    no.textContent = String(li + 1).padStart(2, '0');
    t.append(no, document.createTextNode(' ' + lesson.title.replace(/^\d+\.\s*/, '')));
    const done = lessonDoneCount(lesson);
    if (done > 0) {
      const frac = document.createElement('span');
      frac.className = 'tab-done';
      frac.textContent = `${done}/${lesson.tasks.length}`;
      t.appendChild(frac);
    }
    t.addEventListener('click', () => {
      state.learnTab = li;
      buildLearn();
    });
    tabs.appendChild(t);
  });
  els.learnList.appendChild(tabs);

  const li = Math.min(state.learnTab, lang.lessons.length - 1);
  const lesson = lang.lessons[li];

  const card = document.createElement('div');
  card.className = 'card lesson-block';

  const lhead = document.createElement('div');
  lhead.className = 'lesson-head';
  const left = document.createElement('div');
  left.className = 'lesson-title';
  const no = document.createElement('span');
  no.className = 'ex-no';
  no.textContent = String(li + 1).padStart(2, '0');
  const h2 = document.createElement('h2');
  h2.textContent = lesson.title.replace(/^\d+\.\s*/, '');
  left.append(no, h2);
  const count = document.createElement('span');
  count.className = 'progress';
  count.textContent = `${lessonDoneCount(lesson)} / ${lesson.tasks.length}`;
  lhead.append(left, count);

  const intro = document.createElement('p');
  intro.className = 'lesson-intro';
  intro.textContent = lesson.intro;

  card.append(lhead, intro);

  lesson.tasks.forEach((task, ti) => {
    const ex = document.createElement('div');
    ex.className = 'example';

    const top = document.createElement('div');
    top.className = 'ex-top';
    const no2 = document.createElement('span');
    no2.className = 'ex-no';
    no2.textContent = String(ti + 1).padStart(2, '0');
    const hint = document.createElement('span');
    hint.className = 'ex-hint';
    hint.textContent = task.hint || '';
    const btn = document.createElement('button');
    btn.className = 'link-btn';
    btn.textContent = 'start →';
    btn.addEventListener('click', () => {
      state.lessonIdx = li;
      state.taskIdx = ti;
      switchView('practice');
      loadTask();
    });
    top.append(no2, hint, btn);

    const body = document.createElement('div');
    body.className = 'ex-body';
    const code = document.createElement('pre');
    code.className = 'code';
    code.textContent = task.source;
    const prev = document.createElement('div');
    prev.className = 'example-preview fade';
    prev.dataset.src = task.source;
    body.append(code, prev);

    ex.append(top, body);
    card.appendChild(ex);
  });

  els.learnList.appendChild(card);
  observePreviews(els.learnList);
}

/* ---------- events ---------- */

els.langSwitch.addEventListener('click', (e) => {
  const btn = e.target.closest('.lang-btn');
  if (btn) switchLang(btn.dataset.lang);
});

els.modeSwitch.addEventListener('click', (e) => {
  const btn = e.target.closest('.nav-link');
  if (btn) switchView(btn.dataset.view);
});

els.lessonSelect.addEventListener('change', () => {
  state.lessonIdx = Number(els.lessonSelect.value);
  const lesson = currentLesson();
  const firstUnfinished = lesson.tasks.findIndex((_, i) => !progress.has(taskKey(lesson, i)));
  state.taskIdx = firstUnfinished === -1 ? 0 : firstUnfinished;
  loadTask();
});

els.taskSelect.addEventListener('change', () => {
  state.taskIdx = Number(els.taskSelect.value);
  loadTask();
});

els.input.addEventListener('input', onInput);
els.input.addEventListener('focus', () => els.typebox.classList.add('focus'));
els.input.addEventListener('blur', () => els.typebox.classList.remove('focus'));
els.input.addEventListener('scroll', () => {
  els.typed.scrollLeft = els.input.scrollLeft;
});
els.input.addEventListener('paste', (e) => e.preventDefault());
els.input.addEventListener('keydown', (e) => {
  if (e.key === 'Tab') {
    e.preventDefault();
    showHint();
  } else if (e.key === 'Enter') {
    e.preventDefault();
    if (state.done) nextTask();
  } else if (e.key === 'Escape') {
    e.preventDefault();
    loadTask();
  }
});

els.nextBtn.addEventListener('click', nextTask);

document.addEventListener('keydown', (e) => {
  if (e.target === els.input) return;
  if (e.key === 'Escape' && state.view === 'practice') loadTask();
  if (e.key === 'Enter' && state.view === 'practice' && state.done) nextTask();
});

/* ---------- theme ---------- */

const THEME_KEY = 'type-tex-theme-v1';

function effectiveTheme() {
  const t = document.documentElement.dataset.theme;
  if (t === 'dark' || t === 'light') return t;
  return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function syncThemeBtn() {
  els.themeBtn.textContent = effectiveTheme() === 'dark' ? 'light' : 'dark';
}

els.themeBtn.addEventListener('click', () => {
  const next = effectiveTheme() === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  localStorage.setItem(THEME_KEY, next);
  syncThemeBtn();
});

matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
  if (!document.documentElement.dataset.theme) syncThemeBtn();
});

syncThemeBtn();

/* ---------- init ---------- */

try {
  const saved = localStorage.getItem(STATE_KEY);
  if (saved && LANGS[saved]) {
    state.lang = saved;
    [...els.langSwitch.querySelectorAll('.lang-btn')].forEach((b) => {
      b.classList.toggle('active', b.dataset.lang === saved);
    });
  }
} catch {
  /* ignore */
}

loadTask();
