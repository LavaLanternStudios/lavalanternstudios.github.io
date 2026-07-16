document.addEventListener("DOMContentLoaded", () => {
	renderHomeGames();
	renderHomeFabProducts();
	renderHomePortfolioPicks();
	renderHomeLatestDevlog();
});

/* ================================
   Home: Games Preview
================================ */

function renderHomeGames() {
	const container = document.querySelector("#home-games-preview");
	if (!container) return;

	const gameData = getGamesData();

	if (!Array.isArray(gameData) || gameData.length === 0) {
		container.innerHTML = createHomeEmptyMessage("No games have been added yet.");
		return;
	}

	const latestGame = getLatestGame(gameData);
	const nextGames = gameData
		.filter((game) => game !== latestGame)
		.sort(sortGamesForHome)
		.slice(0, 2);

	const previewGames = [latestGame, ...nextGames].filter(Boolean);

	container.innerHTML = previewGames.map(createHomeGameCard).join("");
}

function getGamesData() {
	if (Array.isArray(window.games)) return window.games;

	try {
		if (Array.isArray(games)) return games;
	} catch (error) {
		return [];
	}

	return [];
}

function getLatestGame(gameData) {
	const releasedGames = gameData
		.filter(isHomeGameReleased)
		.sort((a, b) => getDateValue(b.releaseDate) - getDateValue(a.releaseDate));

	if (releasedGames.length > 0) {
		return releasedGames[0];
	}

	return [...gameData].sort((a, b) => getDateValue(b.releaseDate) - getDateValue(a.releaseDate))[0];
}

function sortGamesForHome(a, b) {
	const aReleased = isHomeGameReleased(a);
	const bReleased = isHomeGameReleased(b);

	if (aReleased !== bReleased) {
		return aReleased ? 1 : -1;
	}

	if (!aReleased && !bReleased) {
		return getDateValue(a.releaseDate) - getDateValue(b.releaseDate);
	}

	return getDateValue(b.releaseDate) - getDateValue(a.releaseDate);
}

function isHomeGameReleased(game) {
	if (typeof game.released === "boolean") {
		return game.released;
	}

	return String(game.released).toLowerCase() === "yes";
}

function createHomeGameCard(game) {
	const title = game.title || "Untitled Game";
	const image = game.image || "";
	const statusClass = isHomeGameReleased(game) ? "status-available" : "status-upcoming";
	const statusText = isHomeGameReleased(game) ? "Available" : "Upcoming";
	const linkAttributes = createLinkAttributes(game.gameURL, "games.html");

	return `
		<article class="feature-card game-preview-card home-data-card">
			<a class="home-card-media-link" ${linkAttributes} aria-label="View ${escapeAttribute(title)}">
				<div class="status-ribbon ${statusClass}">${statusText}</div>

				${image
					? `<img class="square-preview-image" src="${escapeAttribute(image)}" alt="${escapeAttribute(title)} game preview" />`
					: `<div class="square-image-placeholder">${escapeHTML(title)}</div>`
				}
			</a>
		</article>
	`;
}

/* ================================
   Home: Fab Preview
================================ */

function renderHomeFabProducts() {
	const container = document.querySelector("#home-fab-preview");
	if (!container) return;

	const products = getFabProductsData();

	if (!Array.isArray(products) || products.length === 0) {
		container.innerHTML = createHomeEmptyMessage("No Fab products have been added yet.");
		return;
	}

	const latestProducts = [...products]
		.sort((a, b) => getDateValue(b.releaseDate) - getDateValue(a.releaseDate))
		.slice(0, 2);

	container.innerHTML = latestProducts.map(createHomeFabCard).join("");
}

function getFabProductsData() {
	if (Array.isArray(window.fabProducts)) return window.fabProducts;

	try {
		if (Array.isArray(fabProducts)) return fabProducts;
	} catch (error) {
		return [];
	}

	return [];
}

function createHomeFabCard(product) {
	const title = product.title || "Untitled Fab Product";
	const image = product.image || "";
	const linkAttributes = createLinkAttributes(product.fabURL, "fab.html");

	return `
		<article class="mini-card home-mini-card">
			<a class="home-mini-card-link" ${linkAttributes} aria-label="View ${escapeAttribute(title)}">
				${image
					? `<img class="mini-preview-image" src="${escapeAttribute(image)}" alt="${escapeAttribute(title)} preview" />`
					: `<div class="home-16-9-placeholder">${escapeHTML(title)}</div>`
				}

				<h3>${escapeHTML(title)}</h3>
			</a>
		</article>
	`;
}

/* ================================
   Home: Portfolio Preview
================================ */

function renderHomePortfolioPicks() {
	const container = document.querySelector("#home-portfolio-preview");
	if (!container) return;

	const portfolioItems = getPortfolioData();

	if (!Array.isArray(portfolioItems) || portfolioItems.length === 0) {
		container.innerHTML = createHomeEmptyMessage("No portfolio pieces have been added yet.");
		return;
	}

	const topPicks = portfolioItems
		.filter(isTopPick)
		.sort(sortPortfolioItems)
		.slice(0, 2);

	const fallbackPicks = [...portfolioItems]
		.sort(sortPortfolioItems)
		.slice(0, 2);

	const itemsToShow = topPicks.length > 0 ? topPicks : fallbackPicks;

	container.innerHTML = itemsToShow.map(createHomePortfolioCard).join("");
}

function getPortfolioData() {
	if (Array.isArray(window.portfolioProjects)) return window.portfolioProjects;
	if (Array.isArray(window.portfolioItems)) return window.portfolioItems;
	if (Array.isArray(window.portfolioData)) return window.portfolioData;

	try {
		if (Array.isArray(portfolioProjects)) return portfolioProjects;
	} catch (error) {}

	try {
		if (Array.isArray(portfolioItems)) return portfolioItems;
	} catch (error) {}

	try {
		if (Array.isArray(portfolioData)) return portfolioData;
	} catch (error) {}

	return [];
}

function isTopPick(item) {
	return (
		item.topPick === true ||
		item.isTopPick === true ||
		item.featured === true ||
		String(item.topPick).toLowerCase() === "yes" ||
		String(item.isTopPick).toLowerCase() === "yes" ||
		String(item.featured).toLowerCase() === "yes"
	);
}

function sortPortfolioItems(a, b) {
	const aOrder = Number(a.order ?? a.topPickOrder ?? 9999);
	const bOrder = Number(b.order ?? b.topPickOrder ?? 9999);

	if (aOrder !== bOrder) {
		return aOrder - bOrder;
	}

	return getDateValue(b.date || b.releaseDate || b.createdDate) - getDateValue(a.date || a.releaseDate || a.createdDate);
}

function createHomePortfolioCard(item) {
	const title = item.title || "Untitled Portfolio Piece";

	/*
		Use the same featured image as the Portfolio page.
		Fall back to the thumbnail or older property names if needed.
	*/
	const image =
		item.topPickImage ||
		item.thumbnailImage ||
		item.image ||
		item.thumbnail ||
		item.coverImage ||
		"";

	/*
		The current portfolio data stores each detail-page link in `page`.
		Older link property names remain as fallbacks.
	*/
	const link =
		item.page ||
		item.projectURL ||
		item.portfolioURL ||
		item.url ||
		item.link ||
		"portfolio.html";

	const linkAttributes = createLinkAttributes(link, "portfolio.html");

	return `
		<article class="mini-card home-mini-card">
			<a class="home-mini-card-link" ${linkAttributes} aria-label="View ${escapeAttribute(title)}">
				${image
					? `<img class="mini-preview-image" src="${escapeAttribute(image)}" alt="${escapeAttribute(title)} preview" />`
					: `<div class="home-16-9-placeholder">${escapeHTML(title)}</div>`
				}

				<h3>${escapeHTML(title)}</h3>
			</a>
		</article>
	`;
}

/* ================================
   Home: Latest Devlog
================================ */

async function renderHomeLatestDevlog() {
	const panel = document.querySelector("[data-home-latest-devlog]");
	if (!panel) return;

	try {
		const devlogs = await collectHomeDevlogs();

		if (!Array.isArray(devlogs) || devlogs.length === 0) {
			renderFallbackDevlog(panel);
			return;
		}

		const latestDevlog = devlogs.sort((a, b) => b.parsedDate - a.parsedDate)[0];
		renderLatestDevlogPanel(panel, latestDevlog);
	} catch (error) {
		console.error(error);
		renderFallbackDevlog(panel);
	}
}

async function collectHomeDevlogs() {
	const collectedDevlogs = [];
	const previousRegistry = window.LavaLanternDevlogs;

	window.LavaLanternDevlogs = {
		registerGame(sourceFile, devlogs) {
			if (!Array.isArray(devlogs)) return;

			const gameKey = getGameKeyFromFileName(sourceFile);
			const gameName = formatGameName(gameKey);

			devlogs.forEach((devlog) => {
				collectedDevlogs.push({
					gameKey,
					gameName,
					date: devlog.date || "",
					parsedDate: parseDevlogDate(devlog.date),
					title: devlog.title || "Untitled Devlog",
					image: devlog.image || "",
					description: devlog.description || "",
					devlogURL: devlog.devlogURL || "devlogs.html"
				});
			});
		}
	};

	const sources = getDevlogSources();

	for (const source of sources) {
		await loadScript(source);
	}

	if (previousRegistry) {
		window.LavaLanternDevlogs = previousRegistry;
	}

	return collectedDevlogs;
}

function getDevlogSources() {
	if (Array.isArray(window.lavaLanternDevlogSources)) {
		return window.lavaLanternDevlogSources;
	}

	try {
		if (Array.isArray(lavaLanternDevlogSources)) {
			return lavaLanternDevlogSources;
		}
	} catch (error) {
		return [];
	}

	return [];
}

function loadScript(source) {
	return new Promise((resolve, reject) => {
		const script = document.createElement("script");
		script.src = source;
		script.onload = resolve;
		script.onerror = () => reject(new Error(`Could not load script: ${source}`));
		document.body.appendChild(script);
	});
}

function renderLatestDevlogPanel(panel, devlog) {
	const displayDate = formatDate(devlog.parsedDate);

	panel.innerHTML = `
		<div>
			<p class="section-kicker">Latest From The Studio</p>
			<p class="home-devlog-meta">${escapeHTML(devlog.gameName)} · ${escapeHTML(displayDate)}</p>
			<h2>${escapeHTML(devlog.title)}</h2>
			<p>${escapeHTML(devlog.description)}</p>
		</div>

		<a class="button" href="/devlogs">View Devlogs</a>
	`;
}

function renderFallbackDevlog(panel) {
	panel.innerHTML = `
		<div>
			<p class="section-kicker">Latest From The Studio</p>
			<h2>Development updates coming soon</h2>
			<p>
				Follow Lava Lantern Studios devlogs for game progress, project updates,
				release notes, and behind-the-scenes development.
			</p>
		</div>

		<a class="button" href="devlogs.html">View Devlogs</a>
	`;
}

/* ================================
   Shared Helpers
================================ */

function getGameKeyFromFileName(fileName) {
	return String(fileName)
		.split("/")
		.pop()
		.replace(/\.js$/i, "")
		.replace(/-devlogs$/i, "")
		.replace(/_devlogs$/i, "");
}

function formatGameName(gameKey) {
	return String(gameKey)
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

function getDateValue(dateValue) {
	const parsed = new Date(dateValue || 0).getTime();
	return Number.isNaN(parsed) ? 0 : parsed;
}

function createLinkAttributes(url, fallbackURL) {
	const finalURL = url && url !== "#" ? url : fallbackURL;
	const isExternal = /^https?:\/\//i.test(finalURL);

	return `
		href="${escapeAttribute(finalURL)}"
		${isExternal ? 'target="_blank" rel="noopener noreferrer"' : ""}
	`;
}

function createHomeEmptyMessage(message) {
	return `
		<div class="home-preview-empty">
			<p>${escapeHTML(message)}</p>
		</div>
	`;
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