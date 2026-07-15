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


function applyTextSizes(sizes) {
	if (!sizes) return;

	const root = document.documentElement;

	if (sizes.orangeHeading) root.style.setProperty("--fab-orange-heading-size", sizes.orangeHeading);
	if (sizes.whiteTitle) root.style.setProperty("--fab-white-title-size", sizes.whiteTitle);
	if (sizes.whiteBody) root.style.setProperty("--fab-white-body-size", sizes.whiteBody);
}