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

const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');

// Set initial checkbox state
themeToggle.checked = isDark;
applyTheme();

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
	if (!userOverride) {
		isDark = e.matches;
		themeToggle.checked = isDark;
		applyTheme();
	}
});

themeToggle.addEventListener('change', (e) => {
	isDark = e.target.checked;
	userOverride = true;
	applyTheme();
	localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

function applyTheme() {
	document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
	themeIcon.innerHTML = isDark ? '&#9790;' : '&#9788;';

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

// Map highlight.js language names to Monaco language IDs
const hljsToMonaco = {
	'bash': 'shell',
	'sh': 'shell',
	'zsh': 'shell',
	'bat': 'bat',
	'c': 'c',
	'cpp': 'cpp',
	'c++': 'cpp',
	'csharp': 'csharp',
	'cs': 'csharp',
	'css': 'css',
	'dart': 'dart',
	'diff': 'plaintext',
	'dockerfile': 'dockerfile',
	'elixir': 'plaintext',
	'fsharp': 'fsharp',
	'go': 'go',
	'golang': 'go',
	'graphql': 'graphql',
	'groovy': 'plaintext',
	'handlebars': 'handlebars',
	'haskell': 'plaintext',
	'html': 'html',
	'xhtml': 'html',
	'ini': 'ini',
	'java': 'java',
	'javascript': 'javascript',
	'js': 'javascript',
	'json': 'json',
	'julia': 'julia',
	'kotlin': 'kotlin',
	'kt': 'kotlin',
	'latex': 'plaintext',
	'tex': 'plaintext',
	'less': 'less',
	'lua': 'lua',
	'makefile': 'plaintext',
	'markdown': 'markdown',
	'md': 'markdown',
	'nginx': 'plaintext',
	'objective-c': 'objective-c',
	'objectivec': 'objective-c',
	'pascal': 'pascal',
	'perl': 'perl',
	'php': 'php',
	'powershell': 'powershell',
	'ps': 'powershell',
	'ps1': 'powershell',
	'python': 'python',
	'py': 'python',
	'r': 'r',
	'ruby': 'ruby',
	'rb': 'ruby',
	'rust': 'rust',
	'rs': 'rust',
	'scala': 'scala',
	'scss': 'scss',
	'shell': 'shell',
	'sql': 'sql',
	'swift': 'swift',
	'toml': 'plaintext',
	'typescript': 'typescript',
	'ts': 'typescript',
	'vb': 'vb',
	'vbnet': 'vb',
	'xml': 'xml',
	'yaml': 'yaml',
	'yml': 'yaml'
};

function detectLanguage(text) {
	if (!text || text.trim().length === 0) {
		return 'plaintext';
	}

	try {
		const result = hljs.highlightAuto(text);
		if (result.language && result.relevance > 5) {
			return hljsToMonaco[result.language] || result.language;
		}
	} catch (e) {
		// Fallback if highlight.js fails
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
		enableSplitViewResizing: false,
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
			vertical: 'hidden',
			horizontal: 'hidden',
			useShadows: false
		},
		overviewRulerLanes: 3,
		hideCursorInOverviewRuler: true,
		bracketPairColorization: { enabled: false },
		matchBrackets: 'never',
		autoClosingBrackets: 'never',
		autoClosingQuotes: 'never',
		autoIndent: 'none',
		renderIndicators: false,
		renderMarginRevertIcon: false
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

	// Update placeholder positions based on Monaco layout
	function updatePlaceholderPositions() {
		const origEditor = diffEditor.getOriginalEditor();
		const modEditor = diffEditor.getModifiedEditor();

		if (origEditor && modEditor) {
			const origContainer = origEditor.getDomNode();
			const modContainer = modEditor.getDomNode();

			if (origContainer && modContainer) {
				const origRect = origContainer.getBoundingClientRect();
				const modRect = modContainer.getBoundingClientRect();
				const containerRect = container.getBoundingClientRect();

				placeholderLeft.style.left = (origRect.left - containerRect.left) + 'px';
				placeholderLeft.style.width = origRect.width + 'px';

				placeholderRight.style.left = (modRect.left - containerRect.left) + 'px';
				placeholderRight.style.width = modRect.width + 'px';
			}
		}
	}

	// Update placeholder visibility
	function updatePlaceholders() {
		const origEmpty = originalModel.getValue().length === 0;
		const modEmpty = modifiedModel.getValue().length === 0;

		placeholderLeft.classList.toggle('hidden', !origEmpty);
		placeholderRight.classList.toggle('hidden', !modEmpty);
		updatePlaceholderPositions();
	}

	// Listen for layout changes
	diffEditor.onDidUpdateDiff(() => {
		updatePlaceholderPositions();
	});

	// Also update on window resize
	window.addEventListener('resize', updatePlaceholderPositions);

	// Observe container for Monaco layout changes
	const resizeObserver = new ResizeObserver(() => {
		setTimeout(updatePlaceholderPositions, 50);
	});
	resizeObserver.observe(container);

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

	// Initial placeholder state (with delay for Monaco to fully render)
	updatePlaceholders();
	setTimeout(updatePlaceholderPositions, 100);
	setTimeout(updatePlaceholderPositions, 500);
});
