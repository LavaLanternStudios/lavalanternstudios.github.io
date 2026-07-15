document.addEventListener("DOMContentLoaded", () => {
	const content = window.fabPageContent;

	if (!content) return;

	setImage("[data-fab-main-menu-logo]", content.images.mainMenuLogo);

	setText("[data-fab-hero-title]", content.text.heroTitle);
	setText("[data-fab-hero-body]", content.text.heroBody);

	setText("[data-fab-latest-heading]", content.text.latestHeading);
	setText("[data-fab-latest-title]", content.text.latestTitle);

	setText("[data-fab-more-heading]", content.text.moreHeading);
	setText("[data-fab-more-title]", content.text.moreTitle);

	renderYouTubeEmbed("[data-fab-showreel]", content.video.showreelYouTubeURL);
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
			title="Lava Lantern Studios Fab showreel"
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

	if (sizes.orangeHeading) root.style.setProperty("--fab-orange-heading-size", sizes.orangeHeading);
	if (sizes.whiteTitle) root.style.setProperty("--fab-white-title-size", sizes.whiteTitle);
	if (sizes.whiteBody) root.style.setProperty("--fab-white-body-size", sizes.whiteBody);
}