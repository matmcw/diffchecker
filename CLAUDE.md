# CLAUDE.md - Diffchecker

Project context for Claude Code.

## Project Overview

A client-side text diff tool for GitHub Pages using Monaco Editor. Static site with no build process.

## Tech Stack

- Vanilla HTML/CSS/JavaScript (no framework)
- Monaco Editor (CDN) - diff viewing and syntax highlighting
- highlight.js (CDN) - language auto-detection
- CSS custom properties for theming

## File Structure

```
index.html       - Main page with header controls and editor container
css/styles.css   - Theme variables, layout, Monaco overrides
js/app.js        - Monaco diff editor setup, theme handling, language detection
```

## Key Implementation Details

### Monaco Diff Editor (js/app.js)

- `monaco.editor.createDiffEditor()` for side-by-side comparison
- Two editable models: `originalModel` and `modifiedModel`
- Real-time diff updates as user types
- Code mode toggle enables/disables syntax features

### Language Detection

- Uses `hljs.highlightAuto()` for language detection
- `hljsToMonaco` object maps highlight.js IDs to Monaco language IDs
- Relevance threshold (>5) prevents false positives
- Falls back to 'plaintext' for unrecognized content

### Theme System (css/styles.css)

- CSS variables in `:root` (light) and `[data-theme="dark"]`
- Theme preference stored in localStorage under key `theme`
- Falls back to `prefers-color-scheme` media query
- Monaco theme synced via `monaco.editor.setTheme()`

### Placeholder Overlays

- Custom placeholder text shown when editors are empty
- Positioned dynamically based on Monaco editor layout
- Hidden when content is entered

## Commands

No build or install commands. Open index.html in browser or serve with any static server.

```bash
npx serve .
# or
python -m http.server 8000
```

## Project Size

Small to Medium - static site with version control.
