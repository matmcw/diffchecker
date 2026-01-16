// State
let isDark = false;
let diffEditor = null;
let userOverride = false;
let codeMode = false;
let originalModel = null;
let modifiedModel = null;

// Theme handling
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark' || savedTheme === 'light') {
	isDark = savedTheme === 'dark';
	userOverride = true;
} else {
	isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
}
applyTheme();

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
	if (!userOverride) {
		isDark = e.matches;
		applyTheme();
	}
});

document.getElementById('theme-toggle').addEventListener('click', () => {
	isDark = !isDark;
	userOverride = true;
	applyTheme();
	localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

function applyTheme() {
	document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
	document.getElementById('theme-toggle').innerHTML = isDark ? '&#9790;' : '&#9788;';

	// Update Monaco theme if editor exists
	if (diffEditor) {
		monaco.editor.setTheme(isDark ? 'vs-dark' : 'vs');
	}
}

// Code mode toggle
document.getElementById('code-toggle').addEventListener('change', (e) => {
	codeMode = e.target.checked;
	applyCodeMode();
});

function applyCodeMode() {
	if (!diffEditor || !originalModel || !modifiedModel) return;

	const origEditor = diffEditor.getOriginalEditor();
	const modEditor = diffEditor.getModifiedEditor();

	if (codeMode) {
		// Enable code features
		origEditor.updateOptions({
			bracketPairColorization: { enabled: true },
			matchBrackets: 'always',
			autoClosingBrackets: 'always',
			autoClosingQuotes: 'always',
			autoIndent: 'full'
		});
		modEditor.updateOptions({
			bracketPairColorization: { enabled: true },
			matchBrackets: 'always',
			autoClosingBrackets: 'always',
			autoClosingQuotes: 'always',
			autoIndent: 'full'
		});

		// Detect and apply language
		const origLang = detectLanguage(originalModel.getValue());
		const modLang = detectLanguage(modifiedModel.getValue());
		monaco.editor.setModelLanguage(originalModel, origLang);
		monaco.editor.setModelLanguage(modifiedModel, modLang);
	} else {
		// Disable code features
		origEditor.updateOptions({
			bracketPairColorization: { enabled: false },
			matchBrackets: 'never',
			autoClosingBrackets: 'never',
			autoClosingQuotes: 'never',
			autoIndent: 'none'
		});
		modEditor.updateOptions({
			bracketPairColorization: { enabled: false },
			matchBrackets: 'never',
			autoClosingBrackets: 'never',
			autoClosingQuotes: 'never',
			autoIndent: 'none'
		});

		// Set to plaintext
		monaco.editor.setModelLanguage(originalModel, 'plaintext');
		monaco.editor.setModelLanguage(modifiedModel, 'plaintext');
	}
}

function detectLanguage(text) {
	if (text.includes('function') || text.includes('const ') || text.includes('let ') || text.includes('=>')) {
		return 'javascript';
	}
	if (text.includes('def ') || (text.includes('import ') && text.includes(':'))) {
		return 'python';
	}
	if (text.includes('<!DOCTYPE') || text.includes('<html') || text.includes('<div')) {
		return 'html';
	}
	if (text.includes('{') && text.includes('}') && (text.includes('color:') || text.includes('background:'))) {
		return 'css';
	}
	if (text.includes('<?php')) {
		return 'php';
	}
	if (text.includes('package ') || text.includes('public class')) {
		return 'java';
	}
	if (text.includes('#include') || text.includes('int main')) {
		return 'cpp';
	}
	return 'plaintext';
}

// Load Monaco Editor
require.config({
	paths: {
		'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs'
	}
});

require(['vs/editor/editor.main'], function() {
	const container = document.getElementById('editor-container');

	// Create diff editor with code features disabled by default
	diffEditor = monaco.editor.createDiffEditor(container, {
		theme: isDark ? 'vs-dark' : 'vs',
		automaticLayout: true,
		renderSideBySide: true,
		enableSplitViewResizing: true,
		originalEditable: true,
		readOnly: false,
		minimap: { enabled: false },
		scrollBeyondLastLine: false,
		fontSize: 14,
		lineNumbers: 'on',
		renderWhitespace: 'none',
		wordWrap: 'on',
		diffWordWrap: 'on',
		scrollbar: {
			vertical: 'auto',
			horizontal: 'auto',
			verticalScrollbarSize: 8,
			horizontalScrollbarSize: 8,
			useShadows: false
		},
		hideCursorInOverviewRuler: true,
		bracketPairColorization: { enabled: false },
		matchBrackets: 'never',
		autoClosingBrackets: 'never',
		autoClosingQuotes: 'never',
		autoIndent: 'none'
	});

	// Placeholder elements
	const placeholderLeft = document.getElementById('placeholder-left');
	const placeholderRight = document.getElementById('placeholder-right');

	// Create models (empty by default)
	originalModel = monaco.editor.createModel('', 'plaintext');
	modifiedModel = monaco.editor.createModel('', 'plaintext');

	// Set the models
	diffEditor.setModel({
		original: originalModel,
		modified: modifiedModel
	});

	// Update placeholder visibility
	function updatePlaceholders() {
		const origEmpty = originalModel.getValue().length === 0;
		const modEmpty = modifiedModel.getValue().length === 0;

		placeholderLeft.classList.toggle('hidden', !origEmpty);
		placeholderRight.classList.toggle('hidden', !modEmpty);
	}

	// Update language and placeholders on content change
	originalModel.onDidChangeContent(() => {
		updatePlaceholders();
		if (codeMode) {
			const lang = detectLanguage(originalModel.getValue());
			monaco.editor.setModelLanguage(originalModel, lang);
		}
	});

	modifiedModel.onDidChangeContent(() => {
		updatePlaceholders();
		if (codeMode) {
			const lang = detectLanguage(modifiedModel.getValue());
			monaco.editor.setModelLanguage(modifiedModel, lang);
		}
	});

	// Initial placeholder state
	updatePlaceholders();
});
