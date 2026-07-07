document.addEventListener("DOMContentLoaded", () => {
	const content = window.devlogsPageContent || devlogsPageContent;
	if (!content) return;

	setImage("[data-devlogs-main-menu-logo]", content.mainMenuLogo, "Lava Lantern Studios logo");

	setImage("[data-devlogs-hero-image]", content.heroImage, content.heroImageAlt);

	setText("[data-devlogs-hero-heading]", content.heroOrangeHeading);
	setText("[data-devlogs-hero-title]", content.heroWhiteTitle);
	setText("[data-devlogs-hero-body]", content.heroWhiteBody);

	setText("[data-devlogs-browser-heading]", content.browseOrangeHeading);
	setText("[data-devlogs-browser-title]", content.browseWhiteTitle);

	document.documentElement.style.setProperty(
		"--devlogs-orange-heading-size",
		content.orangeHeadingTextSize || "1rem"
	);

	document.documentElement.style.setProperty(
		"--devlogs-white-title-size",
		content.whiteTitleTextSize || "4.2rem"
	);

	document.documentElement.style.setProperty(
		"--devlogs-white-body-size",
		content.whiteBodyTextSize || "1.25rem"
	);
});

function setText(selector, value) {
	const element = document.querySelector(selector);
	if (!element || value === undefined || value === null) return;

	element.textContent = value;
}

function setImage(selector, src, alt) {
	const image = document.querySelector(selector);
	if (!image || !src) return;

	image.src = src;

	if (alt !== undefined && alt !== null) {
		image.alt = alt;
	}
}