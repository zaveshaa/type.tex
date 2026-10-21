# type.tex

Typing trainer for LaTeX and Typst. See a typeset example, type it by hand, get a strict render and errors back.

- **practice** — type tasks: LaTeX (KaTeX, `strict: "error"`) and Typst (typst.ts WASM in the browser)
- **learn** — 10 topic tabs per language, source | rendered preview per task
- hotkeys: `tab` hint · `esc` restart · `enter` next
- progress in localStorage, per language

## Run

```bash
python3 -m http.server 8000
# http://localhost:8000
```

Needs internet: KaTeX CDN; typst.ts WASM (~30 MB, once per session).

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

New language = one module in `js/langs/` exposing `lessons` and `render(el, src)`, plus an entry in `LANGS` in `main.js`.
