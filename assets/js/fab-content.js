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

	const embedURL = createHeroYouTubeURL(url);
	if (!embedURL) return;

	container.innerHTML = `
		<iframe
			src="${embedURL}"
			title="${container.getAttribute("aria-label") || "Lava Lantern Studios showreel"}"
			allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
			allowfullscreen
		></iframe>
	`;
}

function createHeroYouTubeURL(url) {
	const videoId = getYouTubeVideoId(url);
	if (!videoId) return "";

	const embedURL = new URL(`https://www.youtube.com/embed/${videoId}`);

	try {
		const suppliedURL = new URL(url, window.location.href);
		const shareToken = suppliedURL.searchParams.get("si");

		if (shareToken) {
			embedURL.searchParams.set("si", shareToken);
		}
	} catch (error) {
		/* The video ID has already been validated, so playback can continue. */
	}

	/*
		Autoplay remains muted and looping for the hero design.
		Controls remain available as a fallback if the browser does not
		begin autoplay automatically.
	*/
	embedURL.searchParams.set("autoplay", "1");
	embedURL.searchParams.set("mute", "1");
	embedURL.searchParams.set("loop", "1");
	embedURL.searchParams.set("playlist", videoId);
	embedURL.searchParams.set("controls", "1");
	embedURL.searchParams.set("playsinline", "1");
	embedURL.searchParams.set("rel", "0");

	return embedURL.toString();
}

function getYouTubeVideoId(url) {
	const value = String(url || "").trim();

	const match = value.match(
		/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/|youtube\.com\/live\/)([^&?/]+)/
	);

	return match ? match[1] : "";
}

function applyTextSizes(sizes) {
	if (!sizes) return;

	const root = document.documentElement;

	if (sizes.orangeHeading) root.style.setProperty("--fab-orange-heading-size", sizes.orangeHeading);
	if (sizes.whiteTitle) root.style.setProperty("--fab-white-title-size", sizes.whiteTitle);
	if (sizes.whiteBody) root.style.setProperty("--fab-white-body-size", sizes.whiteBody);
}