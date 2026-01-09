document.addEventListener('DOMContentLoaded', () => {
	const originalTextarea = document.getElementById('original');
	const modifiedTextarea = document.getElementById('modified');
	const compareBtn = document.getElementById('compare-btn');
	const backBtn = document.getElementById('back-btn');
	const diffOutput = document.getElementById('diff-output');
	const inputView = document.getElementById('input-view');
	const diffView = document.getElementById('diff-view');
	const themeToggle = document.getElementById('theme-toggle');

	// Theme handling
	const themes = ['light', 'dark'];
	let currentThemeIndex = 0;

	// Check for saved theme or system preference
	const savedTheme = localStorage.getItem('theme');
	if (savedTheme) {
		currentThemeIndex = themes.indexOf(savedTheme);
		if (currentThemeIndex === -1) currentThemeIndex = 0;
		applyTheme(savedTheme);
	} else {
		// Use system preference as default
		const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
		currentThemeIndex = prefersDark ? 1 : 0;
		applyTheme(themes[currentThemeIndex]);
	}

	themeToggle.addEventListener('click', toggleTheme);
	compareBtn.addEventListener('click', performDiff);
	backBtn.addEventListener('click', goBack);

	document.addEventListener('keydown', (e) => {
		if (e.ctrlKey && e.key === 'Enter') {
			if (inputView.classList.contains('active')) {
				performDiff();
			}
		}
		if (e.key === 'Escape' && diffView.classList.contains('active')) {
			goBack();
		}
	});

	function toggleTheme() {
		currentThemeIndex = (currentThemeIndex + 1) % themes.length;
		const theme = themes[currentThemeIndex];
		applyTheme(theme);
		localStorage.setItem('theme', theme);
	}

	function applyTheme(theme) {
		document.documentElement.setAttribute('data-theme', theme);
		themeToggle.innerHTML = theme === 'dark' ? '&#9790;' : '&#9788;';
	}

	function performDiff() {
		const original = originalTextarea.value;
		const modified = modifiedTextarea.value;

		if (!original && !modified) {
			return;
		}

		if (original === modified) {
			diffOutput.innerHTML = '<div class="message">No differences found</div>';
			switchView('diff');
			return;
		}

		const diff = Diff.createPatch(
			'file',
			original,
			modified,
			'Original',
			'Modified'
		);

		const configuration = {
			drawFileList: false,
			matching: 'words',
			diffStyle: 'word',
			outputFormat: 'side-by-side',
			highlight: true,
			synchronisedScroll: true,
			renderNothingWhenEmpty: false
		};

		const diff2htmlUi = new Diff2HtmlUI(diffOutput, diff, configuration);
		diff2htmlUi.draw();
		diff2htmlUi.highlightCode();

		switchView('diff');
	}

	function goBack() {
		switchView('input');
	}

	function switchView(view) {
		if (view === 'diff') {
			inputView.classList.remove('active');
			diffView.classList.add('active');
		} else {
			diffView.classList.remove('active');
			inputView.classList.add('active');
			originalTextarea.focus();
		}
	}
});
