# Diffchecker

A sleek text comparison tool built with Monaco Editor. Compare and edit text or code with real-time diff highlighting.

> **[Project Page](https://matmcw.github.io/diffchecker)**

## Features

- **Editable** - Modify text directly in the panes. Changes are highlighted as you type.
- **Code mode** - Enable syntax highlighting, bracket matching, and language auto-detection
- **Dark/Light mode** - Toggle between themes, defaults to system preference
- **Private** - No data ever leaves your browser

## Supported Languages (Code Mode)

When Code mode is enabled, the editor auto-detects and highlights syntax for 40+ languages:

| | | | |
|---|---|---|---|
| Python | Rust | R | Markdown |
| JavaScript* | Swift | PowerShell | Dockerfile |
| Java | Kotlin | Dart | GraphQL |
| TypeScript* | Ruby | Scala | F# |
| C / C++ | SQL | Lua | Objective-C |
| C# | Shell / Bash | Perl | Julia |
| Go | HTML* | YAML | Pascal |
| PHP | CSS / SCSS* | JSON* | VB.NET |

<sub>*These languages also include some type of error checking</sub>

## Technologies Used

- **[Monaco Editor](https://microsoft.github.io/monaco-editor/)** - The code editor that powers VS Code
- **[highlight.js](https://highlightjs.org/)** - Language auto-detection

## Privacy

All text comparison happens entirely in your browser. No data is ever sent to any server.
