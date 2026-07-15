document.addEventListener("DOMContentLoaded", () => {
	const content = window.portfolioPageContent;

	if (!content) return;

	setImage("[data-portfolio-main-menu-logo]", content.images.mainMenuLogo);

	setText("[data-portfolio-hero-heading]", content.text.heroHeading);
	setText("[data-portfolio-hero-title]", content.text.heroTitle);
	setText("[data-portfolio-hero-body]", content.text.heroBody);

	setText("[data-portfolio-featured-heading]", content.text.featuredHeading);

	setText("[data-portfolio-collection-heading]", content.text.collectionHeading);
	setText("[data-portfolio-collection-title]", content.text.collectionTitle);
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

	if (sizes.orangeHeading) root.style.setProperty("--portfolio-orange-heading-size", sizes.orangeHeading);
	if (sizes.whiteTitle) root.style.setProperty("--portfolio-white-title-size", sizes.whiteTitle);
	if (sizes.whiteBody) root.style.setProperty("--portfolio-white-body-size", sizes.whiteBody);
}