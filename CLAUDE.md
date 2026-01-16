# CLAUDE.md - Diffchecker

Project context for Claude Code.

## Project Overview

A client-side text diff tool for GitHub Pages. Static site with no build process.

## Tech Stack

- Vanilla HTML/CSS/JavaScript
- jsdiff library (CDN: https://cdnjs.cloudflare.com/ajax/libs/jsdiff/5.2.0/diff.min.js)
- CSS custom properties for theming

## File Structure

```
index.html       - Main page with header controls, input textareas, and diff output container
css/styles.css   - Theme variables (:root and [data-theme="dark"]), layout, and diff styling
js/app.js        - Diff logic using jsdiff library (Diff.diffArrays, Diff.diffWords, Diff.diffChars)
```

## Key Implementation Details

### Diff Computation (js/app.js)

- Uses `Diff.diffArrays()` for line-level comparison
- Pairs removed/added blocks for inline highlighting
- `computeInlineDiff()` applies word or char diff based on selected mode
- 150ms debounce on input for performance

### Theme System (css/styles.css)

- CSS variables defined in `:root` (light) and `[data-theme="dark"]`
- Theme preference stored in localStorage under key `theme`
- Falls back to `prefers-color-scheme` media query

### Diff Output Structure

```html
<div class="diff-table">
  <div class="diff-row">
    <div class="diff-side diff-del|diff-add|diff-empty-line">
      <div class="diff-num">1</div>
      <div class="diff-content">text with <span class="hl-del">highlights</span></div>
    </div>
    <!-- right side -->
  </div>
</div>
```

## Commands

No build or install commands. Open index.html in browser or serve with any static server.

```bash
# Local development (optional)
npx serve .
# or
python -m http.server 8000
```

## Project Size

Small to Medium - static site suitable for quick iteration. Version control is active.
