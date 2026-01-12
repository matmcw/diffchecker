document.addEventListener('DOMContentLoaded', () => {
	const leftInput = document.getElementById('left-input');
	const rightInput = document.getElementById('right-input');
	const diffOutput = document.getElementById('diff-output');
	const themeToggle = document.getElementById('theme-toggle');
	const diffButtons = document.querySelectorAll('[data-diff]');

	let diffMode = 'word';
	let isDark = false;
	let diffTimeout;

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

	themeToggle.addEventListener('click', () => {
		isDark = !isDark;
		applyTheme();
		localStorage.setItem('theme', isDark ? 'dark' : 'light');
	});

	function applyTheme() {
		document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
		themeToggle.innerHTML = isDark ? '&#9790;' : '&#9788;';
	}

	// Diff mode toggle
	diffButtons.forEach(btn => {
		btn.addEventListener('click', () => {
			diffButtons.forEach(b => b.classList.remove('active'));
			btn.classList.add('active');
			diffMode = btn.dataset.diff;
			scheduleDiff(true);
		});
	});

	// Input listeners
	leftInput.addEventListener('input', () => scheduleDiff());
	rightInput.addEventListener('input', () => scheduleDiff());

	function scheduleDiff(immediate = false) {
		clearTimeout(diffTimeout);
		if (immediate) {
			computeDiff();
		} else {
			diffTimeout = setTimeout(computeDiff, 150);
		}
	}

	function escapeHtml(text) {
		return text
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;');
	}

	function computeDiff() {
		const leftText = leftInput.value;
		const rightText = rightInput.value;

		// Empty state
		if (!leftText && !rightText) {
			diffOutput.innerHTML = '<div class="diff-empty">Enter text to compare</div>';
			return;
		}

		// Identical text
		if (leftText === rightText) {
			diffOutput.innerHTML = '<div class="diff-identical">Files are identical</div>';
			return;
		}

		const leftLines = leftText.split('\n');
		const rightLines = rightText.split('\n');

		// Line-level diff
		const lineDiff = Diff.diffArrays(leftLines, rightLines);

		let html = '<div class="diff-table">';
		let leftLineNum = 1;
		let rightLineNum = 1;

		let i = 0;
		while (i < lineDiff.length) {
			const part = lineDiff[i];

			if (!part.added && !part.removed) {
				// Unchanged lines
				for (const line of part.value) {
					html += createDiffRow(leftLineNum++, rightLineNum++, escapeHtml(line), escapeHtml(line), 'unchanged');
				}
				i++;
			} else if (part.removed) {
				const nextPart = lineDiff[i + 1];

				if (nextPart && nextPart.added) {
					// Pair removed and added for inline diff
					const removedLines = part.value;
					const addedLines = nextPart.value;
					const maxLen = Math.max(removedLines.length, addedLines.length);

					for (let j = 0; j < maxLen; j++) {
						const leftLine = removedLines[j];
						const rightLine = addedLines[j];

						if (leftLine !== undefined && rightLine !== undefined) {
							// Both exist - do inline diff based on mode
							const { leftHtml, rightHtml } = computeInlineDiff(leftLine, rightLine);
							html += createDiffRow(leftLineNum++, rightLineNum++, leftHtml, rightHtml, 'changed');
						} else if (leftLine !== undefined) {
							// Only left exists - deleted line
							html += createDiffRow(leftLineNum++, null, escapeHtml(leftLine), '', 'deleted');
						} else {
							// Only right exists - added line
							html += createDiffRow(null, rightLineNum++, '', escapeHtml(rightLine), 'added');
						}
					}
					i += 2;
				} else {
					// Only removed lines (no paired add)
					for (const line of part.value) {
						html += createDiffRow(leftLineNum++, null, escapeHtml(line), '', 'deleted');
					}
					i++;
				}
			} else if (part.added) {
				// Only added lines (no paired remove)
				for (const line of part.value) {
					html += createDiffRow(null, rightLineNum++, '', escapeHtml(line), 'added');
				}
				i++;
			}
		}

		html += '</div>';
		diffOutput.innerHTML = html;
	}

	function computeInlineDiff(leftLine, rightLine) {
		// Line mode - no inline highlighting
		if (diffMode === 'line') {
			return {
				leftHtml: escapeHtml(leftLine),
				rightHtml: escapeHtml(rightLine)
			};
		}

		// Word or char mode
		const inlineDiff = diffMode === 'char'
			? Diff.diffChars(leftLine, rightLine)
			: Diff.diffWords(leftLine, rightLine);

		let leftHtml = '';
		let rightHtml = '';

		for (const p of inlineDiff) {
			const escaped = escapeHtml(p.value);
			if (p.removed) {
				leftHtml += `<span class="hl-del">${escaped}</span>`;
			} else if (p.added) {
				rightHtml += `<span class="hl-add">${escaped}</span>`;
			} else {
				leftHtml += escaped;
				rightHtml += escaped;
			}
		}

		return { leftHtml, rightHtml };
	}

	function createDiffRow(leftNum, rightNum, leftContent, rightContent, type) {
		let leftClass = '';
		let rightClass = '';

		switch (type) {
			case 'changed':
				leftClass = 'diff-del';
				rightClass = 'diff-add';
				break;
			case 'deleted':
				leftClass = 'diff-del';
				rightClass = 'diff-empty-line';
				break;
			case 'added':
				leftClass = 'diff-empty-line';
				rightClass = 'diff-add';
				break;
		}

		const leftNumDisplay = leftNum !== null ? leftNum : '';
		const rightNumDisplay = rightNum !== null ? rightNum : '';
		const leftDisplay = leftContent || '&nbsp;';
		const rightDisplay = rightContent || '&nbsp;';

		return `
			<div class="diff-row">
				<div class="diff-side ${leftClass}">
					<div class="diff-num">${leftNumDisplay}</div>
					<div class="diff-content">${leftDisplay}</div>
				</div>
				<div class="diff-side ${rightClass}">
					<div class="diff-num">${rightNumDisplay}</div>
					<div class="diff-content">${rightDisplay}</div>
				</div>
			</div>`;
	}

	// Initial render
	computeDiff();
});
