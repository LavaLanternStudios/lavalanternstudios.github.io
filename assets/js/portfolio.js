/* ================================
   Portfolio
================================ */

document.addEventListener("DOMContentLoaded", () => {
	const topPickSlider = document.querySelector("#topPickSlider");
	const topPickDots = document.querySelector("#topPickDots");
	const portfolioGrid = document.querySelector("#portfolioGrid");

	// Only run this code on the Portfolio page.
	if (!topPickSlider || !portfolioGrid) {
		return;
	}

	loadPortfolio(topPickSlider, topPickDots, portfolioGrid);
});

function loadPortfolio(topPickSlider, topPickDots, portfolioGrid) {
	const portfolioItems = window.portfolioItems;

	if (!Array.isArray(portfolioItems) || portfolioItems.length === 0) {
		topPickSlider.innerHTML = `
			<p class="empty-message">No featured portfolio pieces have been added yet.</p>
		`;

		portfolioGrid.innerHTML = `
			<p class="empty-message">No portfolio pieces have been added yet.</p>
		`;

		return;
	}

	const sortedPortfolioItems = [...portfolioItems].sort((a, b) => a.order - b.order);

	const topPicks = sortedPortfolioItems
		.filter((item) => item.topPick)
		.slice(0, 5);

	displayPortfolioGrid(sortedPortfolioItems, portfolioGrid);
	startTopPickSlider(topPicks, topPickSlider, topPickDots);
}

function startTopPickSlider(topPicks, topPickSlider, topPickDots) {
	if (!Array.isArray(topPicks) || topPicks.length === 0) {
		topPickSlider.innerHTML = `
			<p class="empty-message">No top picks have been selected yet.</p>
		`;

		if (topPickDots) {
			topPickDots.innerHTML = "";
		}

		return;
	}

	let currentTopPickIndex = 0;

	topPickSlider.innerHTML = `
		<div class="top-pick-track">
			${topPicks.map((item) => createTopPickSlide(item)).join("")}
		</div>
	`;

	const topPickTrack = topPickSlider.querySelector(".top-pick-track");

	function showTopPick(index) {
		currentTopPickIndex = index;

		topPickTrack.style.transform = `translateX(-${currentTopPickIndex * 100}%)`;

		displayTopPickDots(topPicks, currentTopPickIndex, topPickDots, showTopPick);
	}

	function showNextTopPick() {
		const nextIndex = currentTopPickIndex + 1 >= topPicks.length
			? 0
			: currentTopPickIndex + 1;

		showTopPick(nextIndex);
	}

	showTopPick(0);

	if (topPicks.length > 1) {
		setInterval(showNextTopPick, 5000);
	}
}

function createTopPickSlide(item) {
	const topPickImage = item.topPickImage || item.thumbnailImage;

	return `
		<div class="top-pick-slide">
			<a href="${item.page}" class="top-pick-card">
				<div class="top-pick-image-wrap">
					<img 
						src="${topPickImage}" 
						alt="${item.title}" 
						class="top-pick-image"
					/>
				</div>

				<div class="top-pick-content">
					<span class="top-pick-label">Top Pick</span>

					<h3>${item.title}</h3>

					<p>
						${item.description}
					</p>
				</div>
			</a>
		</div>
	`;
}

function displayTopPickDots(topPicks, activeIndex, topPickDots, onDotClick) {
	if (!topPickDots || topPicks.length <= 1) {
		if (topPickDots) {
			topPickDots.innerHTML = "";
		}

		return;
	}

	topPickDots.innerHTML = "";

	topPicks.forEach((item, index) => {
		const dotButton = document.createElement("button");

		dotButton.classList.add("top-pick-dot");
		dotButton.setAttribute("type", "button");
		dotButton.setAttribute("aria-label", `Show ${item.title}`);

		if (index === activeIndex) {
			dotButton.classList.add("active");
		}

		dotButton.addEventListener("click", () => {
			onDotClick(index);
		});

		topPickDots.appendChild(dotButton);
	});
}

function displayPortfolioGrid(portfolioItems, portfolioGrid) {
	portfolioGrid.innerHTML = portfolioItems
		.map((item) => `
			<a href="${item.page}" class="portfolio-thumbnail-card">
				<img 
					src="${item.thumbnailImage}" 
					alt="${item.title}" 
					class="portfolio-thumbnail-image"
				/>

				<div class="portfolio-thumbnail-overlay">
					<h3>${item.title}</h3>
				</div>
			</a>
		`)
		.join("");
}