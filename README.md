# Diffchecker

A sleek, client-side text comparison tool built with Monaco Editor. Compare text or code with real-time diff highlighting, syntax highlighting, and a clean minimal interface.

**[Live Demo](https://matmcw.github.io/diffchecker)**

![Diffchecker Screenshot](https://img.shields.io/badge/Monaco-Editor-blue) ![GitHub Pages](https://img.shields.io/badge/GitHub-Pages-green) ![No Backend](https://img.shields.io/badge/100%25-Client--Side-orange)

## Features

- **Side-by-side diff view** - See original and modified text side by side with inline diff highlighting
- **Real-time comparison** - Changes are highlighted instantly as you type
- **Code mode toggle** - Enable syntax highlighting, bracket matching, and auto-detection for 7+ languages
- **Dark/Light theme** - Toggle between themes or auto-follow system preference
- **Privacy focused** - All processing happens in your browser, no data ever leaves your machine
- **No build step** - Pure vanilla HTML, CSS, and JavaScript

## Supported Languages (Code Mode)

When Code mode is enabled, the editor auto-detects:
- JavaScript / TypeScript
- Python
- HTML
- CSS
- PHP
- Java
- C / C++

## Usage

1. Open the [live demo](https://matmcw.github.io/diffchecker) or `index.html` locally
2. Paste or type your original text in the left pane
3. Paste or type your modified text in the right pane
4. Differences are highlighted automatically in red (deletions) and green (additions)

### Controls

| Control | Description |
|---------|-------------|
| **Code** toggle | Enable/disable code features (syntax highlighting, brackets) |
| **Theme** toggle | Switch between light and dark mode |
| **GitHub** icon | Link to this repository |

## Tech Stack

- **[Monaco Editor](https://microsoft.github.io/monaco-editor/)** - The code editor that powers VS Code
- **Vanilla CSS** - Custom theming with CSS variables
- **No framework** - Zero dependencies beyond Monaco

## Local Development

No build process required. Just serve the files:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve

# Or simply open index.html in your browser
```

## Deployment

This project is designed for GitHub Pages:

1. Fork or clone this repository
2. Push to your GitHub account
3. Enable GitHub Pages in Settings > Pages
4. Select your branch and save

Your diffchecker will be live at `https://yourusername.github.io/diffchecker`

## File Structure

```
diffchecker/
├── index.html          # Main HTML with Monaco loader
├── css/
│   └── styles.css      # Theme variables and custom styling
├── js/
│   └── app.js          # Editor initialization and diff logic
├── README.md           # This file
└── CLAUDE.md           # Development notes
```

## Privacy

All text comparison happens entirely in your browser:
- No data is sent to any server
- No analytics or tracking
- Theme preference stored in localStorage (optional)

## License

MIT License - feel free to use, modify, and distribute.

---

Made with Monaco Editor
