document.addEventListener("DOMContentLoaded", () => {
	const content = window.gamesPageContent;

	if (!content) return;

	setImage("[data-games-main-menu-logo]", content.images.mainMenuLogo);

	setText("[data-games-hero-heading]", content.text.heroHeading);
	setText("[data-games-hero-title]", content.text.heroTitle);
	setText("[data-games-hero-body]", content.text.heroBody);

	setText("[data-games-latest-heading]", content.text.latestHeading);
	setText("[data-games-latest-intro]", content.text.latestIntro);

	setText("[data-games-more-heading]", content.text.moreGamesHeading);
	setText("[data-games-more-title]", content.text.moreGamesTitle);
	setText("[data-games-more-body]", content.text.moreGamesBody);
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

	if (sizes.orangeHeading) root.style.setProperty("--games-orange-heading-size", sizes.orangeHeading);
	if (sizes.whiteTitle) root.style.setProperty("--games-white-title-size", sizes.whiteTitle);
	if (sizes.whiteBody) root.style.setProperty("--games-white-body-size", sizes.whiteBody);
}