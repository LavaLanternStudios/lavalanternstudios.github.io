document.addEventListener("DOMContentLoaded", () => {
	const content = window.homePageContent;

	if (!content) return;

	setImage("[data-home-main-menu-logo]", content.images.mainMenuLogo);
	setImage("[data-home-central-logo]", content.images.centralLogo);
	setImage("[data-home-about-image]", content.images.aboutStudioImage);

	setText("[data-home-hero-tagline]", content.text.heroTagline);

	setText("[data-home-about-heading]", content.text.aboutStudioHeading);
	setText("[data-home-about-title]", content.text.aboutStudioTitle);
	setParagraphs("[data-home-about-body]", content.text.aboutStudioBody);

	setText("[data-home-featured-heading]", content.text.featuredWorkHeading);
	setText("[data-home-featured-title]", content.text.featuredWorkTitle);
	setText("[data-home-featured-body]", content.text.featuredWorkBody);

	setText("[data-home-fab-heading]", content.text.fabHeading);
	setText("[data-home-fab-title]", content.text.fabTitle);
	setText("[data-home-fab-body]", content.text.fabBody);

	setText("[data-home-portfolio-heading]", content.text.portfolioHeading);
	setText("[data-home-portfolio-title]", content.text.portfolioTitle);
	setText("[data-home-portfolio-body]", content.text.portfolioBody);

	setText("[data-home-bottom-title]", content.text.bottomTitle);
	setText("[data-home-bottom-body]", content.text.bottomBody);

	renderYouTubeEmbed("[data-home-showreel]", content.video.showreelYouTubeURL);
	applyTextSizes(content.textSizes);
});

function setText(selector, value) {
	const element = document.querySelector(selector);
	if (element && value) {
		element.textContent = value;
	}
}

function setImage(selector, src) {
	const image = document.querySelector(selector);
	if (image && src) {
		image.src = src;
	}
}

function setParagraphs(selector, paragraphs) {
	const element = document.querySelector(selector);
	if (!element || !Array.isArray(paragraphs)) return;

	element.innerHTML = paragraphs
		.map((paragraph) => `<p>${escapeHTML(paragraph)}</p>`)
		.join("");
}

function renderYouTubeEmbed(selector, url) {
	const container = document.querySelector(selector);
	if (!container || !url) return;

	const videoId = getYouTubeVideoId(url);
	if (!videoId) return;

	const origin = window.location.origin && window.location.origin !== "null"
		? `&origin=${encodeURIComponent(window.location.origin)}`
		: "";

	container.innerHTML = `
		<iframe
			src="https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&playsinline=1&rel=0${origin}"
			title="Lava Lantern Studios showreel"
			allow="autoplay; encrypted-media; picture-in-picture"
			referrerpolicy="strict-origin-when-cross-origin"
			allowfullscreen>
		</iframe>
	`;
}

function getYouTubeVideoId(url) {
	const match = String(url).match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/]+)/);
	return match ? match[1] : "";
}

function applyTextSizes(sizes) {
	if (!sizes) return;

	const root = document.documentElement;

	if (sizes.orangeHeading) root.style.setProperty("--home-orange-heading-size", sizes.orangeHeading);
	if (sizes.whiteTitle) root.style.setProperty("--home-white-title-size", sizes.whiteTitle);
	if (sizes.whiteBody) root.style.setProperty("--home-white-body-size", sizes.whiteBody);
}

function escapeHTML(value) {
	return String(value)
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
}