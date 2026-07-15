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

	renderYouTubeEmbed("[data-portfolio-showreel]", content.video.showreelYouTubeURL);
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

	const embedURL = createDirectYouTubeHeroURL(url);

	if (!embedURL) {
		console.error(`A valid YouTube video ID could not be read from: ${url}`);
		return;
	}

	const iframe = document.createElement("iframe");

	iframe.src = embedURL;
	iframe.title = "Lava Lantern Studios background showreel";
	iframe.loading = "eager";
	iframe.tabIndex = -1;

	iframe.setAttribute(
		"allow",
		"autoplay; encrypted-media; picture-in-picture"
	);
	iframe.setAttribute(
		"referrerpolicy",
		"origin-when-cross-origin"
	);
	iframe.setAttribute("aria-hidden", "true");
	iframe.setAttribute("frameborder", "0");

	container.replaceChildren(iframe);
}

function createDirectYouTubeHeroURL(url) {
	const videoId = getYouTubeVideoId(url);
	if (!videoId) return "";

	/*
		Use a direct iframe rather than the IFrame Player API.
		This prevents an API failure or extension block from leaving
		the entire hero hidden behind a permanent black loading state.
	*/
	const embedURL = new URL(`https://www.youtube.com/embed/${videoId}`);

	try {
		const suppliedURL = new URL(url, window.location.href);
		const shareToken = suppliedURL.searchParams.get("si");

		if (shareToken) {
			embedURL.searchParams.set("si", shareToken);
		}
	} catch (error) {
		/* The validated video ID is sufficient to build the embed. */
	}

	embedURL.searchParams.set("autoplay", "1");
	embedURL.searchParams.set("mute", "1");
	embedURL.searchParams.set("loop", "1");
	embedURL.searchParams.set("playlist", videoId);
	embedURL.searchParams.set("controls", "0");
	embedURL.searchParams.set("disablekb", "1");
	embedURL.searchParams.set("fs", "0");
	embedURL.searchParams.set("iv_load_policy", "3");
	embedURL.searchParams.set("playsinline", "1");
	embedURL.searchParams.set("rel", "0");
	embedURL.searchParams.set("start", "1");

	return embedURL.toString();
}

function getYouTubeVideoId(url) {
	const value = String(url || "").trim();

	const patterns = [
		/[?&]v=([^&?/]+)/i,
		/(?:youtu\.be\/)([^&?/]+)/i,
		/(?:youtube\.com\/embed\/)([^&?/]+)/i,
		/(?:youtube\.com\/shorts\/)([^&?/]+)/i,
		/(?:youtube\.com\/live\/)([^&?/]+)/i
	];

	for (const pattern of patterns) {
		const match = value.match(pattern);

		if (match) {
			return match[1];
		}
	}

	return "";
}

function applyTextSizes(sizes) {
	if (!sizes) return;

	const root = document.documentElement;

	if (sizes.orangeHeading) root.style.setProperty("--portfolio-orange-heading-size", sizes.orangeHeading);
	if (sizes.whiteTitle) root.style.setProperty("--portfolio-white-title-size", sizes.whiteTitle);
	if (sizes.whiteBody) root.style.setProperty("--portfolio-white-body-size", sizes.whiteBody);
}