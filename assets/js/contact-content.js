document.addEventListener("DOMContentLoaded", () => {
	const content = window.contactPageContent;

	if (!content) return;

	setImage("[data-contact-main-menu-logo]", content.images.mainMenuLogo);
	setImage("[data-contact-hero-image]", content.images.heroImage);

	setText("[data-contact-hero-heading]", content.text.heroHeading);
	setText("[data-contact-hero-title]", content.text.heroTitle);
	setText("[data-contact-hero-body]", content.text.heroBody);

	setText("[data-contact-socials-heading]", content.text.socialsHeading);
	setText("[data-contact-socials-title]", content.text.socialsTitle);

	setText("[data-contact-email-heading]", content.text.emailHeading);
	setText("[data-contact-email-title]", content.text.emailTitle);
	setText("[data-contact-email-body]", content.text.emailBody);
	setEmail("[data-contact-email-link]", content.text.emailAddress);

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

function setEmail(selector, emailAddress) {
	const link = document.querySelector(selector);

	if (link && emailAddress) {
		link.textContent = emailAddress;
		link.href = `mailto:${emailAddress}`;
	}
}

function applyTextSizes(sizes) {
	if (!sizes) return;

	const root = document.documentElement;

	if (sizes.orangeHeading) root.style.setProperty("--contact-orange-heading-size", sizes.orangeHeading);
	if (sizes.whiteTitle) root.style.setProperty("--contact-white-title-size", sizes.whiteTitle);
	if (sizes.whiteBody) root.style.setProperty("--contact-white-body-size", sizes.whiteBody);
}