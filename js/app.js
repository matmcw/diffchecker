// Theme state
let isDark = false;
let diffEditor = null;

// Theme handling
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
	isDark = true;
} else if (savedTheme === 'light') {
	isDark = false;
} else {
	isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
}
applyTheme();

document.getElementById('theme-toggle').addEventListener('click', () => {
	isDark = !isDark;
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

// Load Monaco Editor
require.config({
	paths: {
		'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs'
	}
});

require(['vs/editor/editor.main'], function() {
	const container = document.getElementById('editor-container');

	// Create diff editor
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
		renderWhitespace: 'selection',
		wordWrap: 'on',
		diffWordWrap: 'on'
	});

	// Create models for original and modified
	const originalModel = monaco.editor.createModel(
		'// Paste or type your original text here...',
		'plaintext'
	);

	const modifiedModel = monaco.editor.createModel(
		'// Paste or type your modified text here...',
		'plaintext'
	);

	// Set the models
	diffEditor.setModel({
		original: originalModel,
		modified: modifiedModel
	});

	// Auto-detect language based on content
	function detectLanguage(text) {
		if (text.includes('function') || text.includes('const ') || text.includes('let ') || text.includes('=>')) {
			return 'javascript';
		}
		if (text.includes('def ') || text.includes('import ') && text.includes(':')) {
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

	// Update language on content change
	originalModel.onDidChangeContent(() => {
		const text = originalModel.getValue();
		if (text && !text.startsWith('//')) {
			const lang = detectLanguage(text);
			monaco.editor.setModelLanguage(originalModel, lang);
		}
	});

	modifiedModel.onDidChangeContent(() => {
		const text = modifiedModel.getValue();
		if (text && !text.startsWith('//')) {
			const lang = detectLanguage(text);
			monaco.editor.setModelLanguage(modifiedModel, lang);
		}
	});
});
