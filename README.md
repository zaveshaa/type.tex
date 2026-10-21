<div align="center">
  <img src="favicon.svg" width="64" height="64" alt="TeX logo">
  <h1>type.tex</h1>
  <p><em>Type LaTeX and Typst by hand — and watch them render.</em></p>

  [![live](https://img.shields.io/badge/live-demo-111111?style=flat-square)](https://zaveshaa.github.io/type.tex/)
  [![KaTeX](https://img.shields.io/badge/render-KaTeX-f4a2b9?style=flat-square&logo=katex&logoColor=d33682)](https://katex.org)
  [![Typst](https://img.shields.io/badge/render-typst.ts-111111?style=flat-square&logo=typst&logoColor=111111)](https://typst.app)
  [![repo size](https://img.shields.io/github/repo-size/zaveshaa/type.tex?style=flat-square)](https://github.com/zaveshaa/type.tex)

  <sub>practice · learn · progress in localStorage · zero build step</sub>
</div>

---

A Monkeytype-style trainer for markup languages. You see a typeset example — you type it character by character — a strict engine renders your result and catches errors.

## Practice

Two languages, 10 lessons each:

| LaTeX (40 tasks) | Typst (41 tasks) |
| --- | --- |
| `$...$` math mode | `$...$` math mode |
| `^` `_` scripts, `\frac`, `\sqrt` | `^` `_` with `(…)` groups, `frac`, `sqrt` |
| `\alpha \pi \theta`, `\sum \int \lim` | `alpha pi theta`, `sum integral lim` |
| `\left( \right)`, `pmatrix`, `\text` | `lr`, `mat`, `#functions[]` |

- LaTeX renders via **KaTeX** with `strict: "error"` — unsupported commands fail loudly, never silently
- Typst renders via **typst.ts** (WASM in the browser, wrapped in an auto-page so the SVG fits the content)
- typing is strict: no paste, input truncated to the target, wrong keys highlighted inverted

## Keys

| key | action |
| --- | --- |
| <kbd>tab</kbd> | show next expected character |
| <kbd>esc</kbd> | restart task |
| <kbd>enter</kbd> | next task (when done) |

Stats appear once, on completion: `done · 12.4s · 41 wpm`.

## Learn

Topic tabs per language — every task shows the source next to its rendered preview.

## Run

```bash
git clone https://github.com/zaveshaa/type.tex.git
cd type.tex
python3 -m http.server 8000
# http://localhost:8000
```

Internet needed: KaTeX CDN; typst.ts WASM (~30 MB, once per session).

## Structure

```
index.html
css/styles.css
js/main.js          UI, state, hotkeys
js/typer.js         completeness / mismatch / wpm
js/langs/latex/     lessons + KaTeX renderer
js/langs/typst/     lessons + typst.ts renderer
favicon.svg         TeX logo
```

Adding a language = one module in `js/langs/` exposing `lessons` and `render(el, src)`, plus an entry in `LANGS` in `main.js`.
