document.addEventListener("DOMContentLoaded", () => {
	const state = {
		allDevlogs: [],
		filteredDevlogs: [],
		currentPage: 1,
		itemsPerPage: 10,
		games: new Map()
	};

	const gameFilter = document.querySelector("[data-devlog-game-filter]");
	const dateFilter = document.querySelector("[data-devlog-date-filter]");
	const resetButton = document.querySelector("[data-devlog-reset]");
	const list = document.querySelector("[data-devlog-list]");
	const count = document.querySelector("[data-devlog-count]");
	const pagination = document.querySelector("[data-devlog-pagination]");
	const previousButton = document.querySelector("[data-devlog-previous]");
	const nextButton = document.querySelector("[data-devlog-next]");
	const pageLabel = document.querySelector("[data-devlog-page-label]");

	window.LavaLanternDevlogs = {
		registerGame(sourceFile, devlogs) {
			if (!Array.isArray(devlogs)) return;

			const gameKey = getGameKeyFromFileName(sourceFile);
			const gameName = formatGameName(gameKey);

			state.games.set(gameKey, gameName);

			const preparedDevlogs = devlogs.map((devlog) => {
				const parsedDate = parseDevlogDate(devlog.date);

				return {
					gameKey,
					gameName,
					date: devlog.date || "",
					parsedDate,
					title: devlog.title || "Untitled Devlog",
					image: devlog.image || "",
					description: devlog.description || "",
					devlogURL: devlog.devlogURL || "#"
				};
			});

			state.allDevlogs.push(...preparedDevlogs);
		}
	};

	loadAllDevlogSources()
		.then(() => {
			populateGameFilter();
			renderDevlogs();
			addEvents();
		})
		.catch((error) => {
			console.error(error);

			if (list) {
				list.innerHTML = `
					<div class="devlog-empty-state">
						<h3>Devlogs could not be loaded.</h3>
						<p>Please check that your devlog file paths are correct inside assets/data/devlogs/devlog-sources.js.</p>
					</div>
				`;
			}
		});

	async function loadAllDevlogSources() {
		const sources = window.lavaLanternDevlogSources || lavaLanternDevlogSources || [];

		if (!Array.isArray(sources) || sources.length === 0) {
			throw new Error("No devlog sources found.");
		}

		for (const source of sources) {
			await loadScript(source);
		}
	}

	function loadScript(source) {
		return new Promise((resolve, reject) => {
			const script = document.createElement("script");
			script.src = source;
			script.onload = resolve;
			script.onerror = () => reject(new Error(`Could not load devlog source: ${source}`));
			document.body.appendChild(script);
		});
	}

	function addEvents() {
		if (gameFilter) {
			gameFilter.addEventListener("change", () => {
				state.currentPage = 1;
				renderDevlogs();
			});
		}

		if (dateFilter) {
			dateFilter.addEventListener("change", () => {
				state.currentPage = 1;
				renderDevlogs();
			});
		}

		if (resetButton) {
			resetButton.addEventListener("click", () => {
				if (gameFilter) gameFilter.value = "all";
				if (dateFilter) dateFilter.value = "all";

				state.currentPage = 1;
				renderDevlogs();
			});
		}

		if (previousButton) {
			previousButton.addEventListener("click", () => {
				if (state.currentPage > 1) {
					state.currentPage -= 1;
					renderDevlogs();
				}
			});
		}

		if (nextButton) {
			nextButton.addEventListener("click", () => {
				const totalPages = getTotalPages();

				if (state.currentPage < totalPages) {
					state.currentPage += 1;
					renderDevlogs();
				}
			});
		}
	}

	function populateGameFilter() {
		if (!gameFilter) return;

		const options = Array.from(state.games.entries())
			.map(([gameKey, gameName]) => {
				return `<option value="${escapeHTML(gameKey)}">${escapeHTML(gameName)}</option>`;
			})
			.join("");

		gameFilter.innerHTML = `
			<option value="all">All games</option>
			${options}
		`;
	}

	function renderDevlogs() {
		const selectedGame = gameFilter ? gameFilter.value : "all";
		const selectedDateRange = dateFilter ? dateFilter.value : "all";
		const dateCutoff = getDateCutoff(selectedDateRange);

		state.filteredDevlogs = state.allDevlogs
			.filter((devlog) => {
				const matchesGame = selectedGame === "all" || devlog.gameKey === selectedGame;
				const matchesDate = !dateCutoff || devlog.parsedDate >= dateCutoff;

				return matchesGame && matchesDate;
			})
			.sort((a, b) => b.parsedDate - a.parsedDate);

		const totalPages = getTotalPages();

		if (state.currentPage > totalPages) {
			state.currentPage = totalPages;
		}

		renderCount();
		renderList();
		renderPagination();
	}

	function renderCount() {
		if (!count) return;

		const total = state.filteredDevlogs.length;

		if (total === 0) {
			count.textContent = "No devlogs found.";
			return;
		}

		const start = (state.currentPage - 1) * state.itemsPerPage + 1;
		const end = Math.min(start + state.itemsPerPage - 1, total);

		count.textContent = `Showing ${start}-${end} of ${total} devlog${total === 1 ? "" : "s"}.`;
	}

	function renderList() {
		if (!list) return;

		if (state.filteredDevlogs.length === 0) {
			list.innerHTML = `
				<div class="devlog-empty-state">
					<h3>No devlogs match those filters.</h3>
					<p>Try changing the selected game or date range.</p>
				</div>
			`;

			return;
		}

		const startIndex = (state.currentPage - 1) * state.itemsPerPage;
		const currentPageDevlogs = state.filteredDevlogs.slice(startIndex, startIndex + state.itemsPerPage);

		list.innerHTML = currentPageDevlogs.map(createDevlogCard).join("");
	}

	function createDevlogCard(devlog) {
		const formattedDate = formatDate(devlog.parsedDate);
		const hasValidLink = devlog.devlogURL && devlog.devlogURL !== "#";

		return `
			<article class="devlog-card">
				<div class="devlog-card-image-wrap">
					${devlog.image
						? `<img src="${escapeAttribute(devlog.image)}" alt="${escapeAttribute(devlog.title)}" />`
						: `<div class="devlog-image-placeholder">No image</div>`
					}
				</div>

				<div class="devlog-card-content">
					<div class="devlog-card-meta">
						<span>${escapeHTML(devlog.gameName)}</span>
						<span>${escapeHTML(formattedDate)}</span>
					</div>

					<h2>${escapeHTML(devlog.title)}</h2>
					<p>${escapeHTML(devlog.description)}</p>

					${hasValidLink
						? `<a class="devlog-read-link" href="${escapeAttribute(devlog.devlogURL)}" target="_blank" rel="noopener noreferrer">Read full devlog</a>`
						: `<span class="devlog-read-link disabled">Full devlog coming soon</span>`
					}
				</div>
			</article>
		`;
	}

	function renderPagination() {
		if (!pagination || !previousButton || !nextButton || !pageLabel) return;

		const totalPages = getTotalPages();

		pagination.hidden = state.filteredDevlogs.length <= state.itemsPerPage;

		previousButton.disabled = state.currentPage <= 1;
		nextButton.disabled = state.currentPage >= totalPages;

		pageLabel.textContent = `Page ${state.currentPage} of ${totalPages}`;
	}

	function getTotalPages() {
		return Math.max(1, Math.ceil(state.filteredDevlogs.length / state.itemsPerPage));
	}

	function getDateCutoff(range) {
		const now = new Date();
		const cutoff = new Date(now);

		switch (range) {
			case "24h":
				cutoff.setHours(cutoff.getHours() - 24);
				return cutoff;

			case "week":
				cutoff.setDate(cutoff.getDate() - 7);
				return cutoff;

			case "month":
				cutoff.setMonth(cutoff.getMonth() - 1);
				return cutoff;

			case "year":
				cutoff.setFullYear(cutoff.getFullYear() - 1);
				return cutoff;

			default:
				return null;
		}
	}

	function getGameKeyFromFileName(fileName) {
		return fileName
			.split("/")
			.pop()
			.replace(/\.js$/i, "")
			.replace(/-devlogs$/i, "")
			.replace(/_devlogs$/i, "");
	}

	function formatGameName(gameKey) {
		return gameKey
			.replace(/[-_]+/g, " ")
			.replace(/([a-z0-9])([A-Z])/g, "$1 $2")
			.trim()
			.replace(/\b\w/g, (letter) => letter.toUpperCase());
	}

	function parseDevlogDate(dateValue) {
		if (!dateValue) return new Date(0);

		if (/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
			const [year, month, day] = dateValue.split("-").map(Number);
			return new Date(year, month - 1, day);
		}

		const parsed = new Date(dateValue);

		if (Number.isNaN(parsed.getTime())) {
			return new Date(0);
		}

		return parsed;
	}

	function formatDate(date) {
		if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
			return "Unknown date";
		}

		return date.toLocaleDateString("en-GB", {
			day: "2-digit",
			month: "short",
			year: "numeric"
		});
	}

	function escapeHTML(value) {
		return String(value)
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&#039;");
	}

	function escapeAttribute(value) {
		return escapeHTML(value);
	}
});