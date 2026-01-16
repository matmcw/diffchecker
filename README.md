# Diffchecker

A client-side text comparison tool designed for GitHub Pages deployment. Compare text differences with syntax highlighting and multiple diff modes.

## Features

- **Side-by-side diff view** with synchronized line numbers
- **Three diff modes**: Line, Word, and Character level comparison
- **Dark/Light theme** toggle with system preference detection
- **Real-time diffing** as you type (debounced for performance)
- **No data persistence** - all processing happens in the browser
- **No build step** - vanilla HTML, CSS, and JavaScript

## Usage

1. Open `index.html` in a browser or deploy to GitHub Pages
2. Paste original text in the left textarea
3. Paste modified text in the right textarea
4. View the diff output below with highlighted changes

### Diff Modes

- **Line**: Shows changed lines without inline highlighting
- **Word**: Highlights changed words within modified lines (default)
- **Char**: Highlights individual character changes

### Theme

Click the sun/moon icon in the header to toggle between light and dark themes. Your preference is saved to localStorage.

## File Structure

```
Diffchecker/
├── index.html          # Main HTML page
├── css/
│   └── styles.css      # Theme variables and styling
├── js/
│   └── app.js          # Diff computation and rendering
└── README.md
```

## Dependencies

- [jsdiff](https://github.com/kpdecker/jsdiff) v5.2.0 (loaded from CDN)

## Deployment

This project is static and requires no build step. Deploy by:

1. Pushing to a GitHub repository
2. Enabling GitHub Pages in repository settings
3. Selecting the branch to deploy from

Or simply open `index.html` directly in any modern browser.

## Privacy

All text comparison happens entirely in your browser. No data is sent to any server or stored persistently (except theme preference in localStorage).
