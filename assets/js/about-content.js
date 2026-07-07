document.addEventListener("DOMContentLoaded", () => {
	const content = window.aboutPageContent;

	if (!content) return;

	setImage("[data-about-main-menu-logo]", content.images.mainMenuLogo);
	setImage("[data-about-hero-image]", content.images.heroImage);
	setImage("[data-about-loki-image]", content.images.lokiImage);

	setText("[data-about-hero-heading]", content.text.heroHeading);
	setText("[data-about-hero-title]", content.text.heroTitle);
	setText("[data-about-hero-body]", content.text.heroBody);

	setText("[data-about-who-heading]", content.text.whoHeading);
	setText("[data-about-who-title]", content.text.whoTitle);
	setParagraphs("[data-about-who-body]", content.text.whoBody);

	setText("[data-about-loki-heading]", content.text.lokiHeading);
	setText("[data-about-loki-title]", content.text.lokiTitle);
	setText("[data-about-loki-body]", content.text.lokiBody);

	setText("[data-about-what-heading]", content.text.whatHeading);
	setText("[data-about-what-title]", content.text.whatTitle);

	setText("[data-about-direction-heading]", content.text.directionHeading);
	setText("[data-about-direction-title]", content.text.directionTitle);
	setParagraphs("[data-about-direction-body]", content.text.directionBody);

	setText("[data-about-values-heading]", content.text.valuesHeading);
	setText("[data-about-values-title]", content.text.valuesTitle);

	setText("[data-about-feedback-heading]", content.text.feedbackHeading);
	setText("[data-about-feedback-title]", content.text.feedbackTitle);

	renderSummaryPoints("[data-about-summary-points]", content.summaryPoints);
	renderCards("[data-about-work-cards]", content.workCards, "about-card");
	renderCards("[data-about-values]", content.values, "about-value", true);
	renderReviews("[data-about-reviews]", content.reviews);

	applyTextSizes(content.textSizes);
});

function setText(selector, value) {
	const element = document.querySelector(selector);
	if (element && value) element.textContent = value;
}

function setImage(selector, src) {
	const image = document.querySelector(selector);
	if (image && src) image.src = src;
}

function setParagraphs(selector, paragraphs) {
	const element = document.querySelector(selector);
	if (!element || !Array.isArray(paragraphs)) return;

	element.innerHTML = paragraphs
		.map((paragraph) => `<p>${escapeHTML(paragraph)}</p>`)
		.join("");
}

function renderSummaryPoints(selector, points) {
	const container = document.querySelector(selector);
	if (!container || !Array.isArray(points)) return;

	container.innerHTML = points
		.map((point, index) => `
			<div class="about-stat">
				<span>${String(index + 1).padStart(2, "0")}</span>
				<p>${escapeHTML(point)}</p>
			</div>
		`)
		.join("");
}

function renderCards(selector, cards, className, includeNumber = false) {
	const container = document.querySelector(selector);
	if (!container || !Array.isArray(cards)) return;

	container.innerHTML = cards
		.map((card, index) => `
			<article class="${className}">
				${includeNumber ? `<span>${String(index + 1).padStart(2, "0")}</span>` : ""}
				<h3>${escapeHTML(card.title)}</h3>
				<p>${escapeHTML(card.body)}</p>
			</article>
		`)
		.join("");
}

function renderReviews(selector, reviews) {
	const container = document.querySelector(selector);
	if (!container || !Array.isArray(reviews)) return;

	container.innerHTML = reviews
		.map((review) => `
			<article class="about-review-card">
				<img src="${escapeAttribute(review.image)}" alt="${escapeAttribute(review.name)}" />
				<h3>${escapeHTML(review.name)}</h3>
				<blockquote>${escapeHTML(review.quote)}</blockquote>
			</article>
		`)
		.join("");
}

function applyTextSizes(sizes) {
	if (!sizes) return;

	const root = document.documentElement;

	if (sizes.orangeHeading) root.style.setProperty("--about-orange-heading-size", sizes.orangeHeading);
	if (sizes.whiteTitle) root.style.setProperty("--about-white-title-size", sizes.whiteTitle);
	if (sizes.whiteBody) root.style.setProperty("--about-white-body-size", sizes.whiteBody);
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