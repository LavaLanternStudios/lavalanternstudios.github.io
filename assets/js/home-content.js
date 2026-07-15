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

	renderHeroBackgroundVideo("[data-home-showreel]", content.video.showreelVideoURL);
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

function renderHeroBackgroundVideo(selector, videoURL) {
	const container = document.querySelector(selector);
	if (!container || !videoURL) return;

	const video = document.createElement("video");
	const source = document.createElement("source");

	video.className = "hero-background-video";
	video.autoplay = true;
	video.loop = true;
	video.muted = true;
	video.defaultMuted = true;
	video.playsInline = true;
	video.preload = "auto";
	video.disablePictureInPicture = true;
	video.tabIndex = -1;

	video.setAttribute("autoplay", "");
	video.setAttribute("loop", "");
	video.setAttribute("muted", "");
	video.setAttribute("playsinline", "");
	video.setAttribute("webkit-playsinline", "");
	video.setAttribute("disablepictureinpicture", "");
	video.setAttribute("disableremoteplayback", "");
	video.setAttribute("aria-hidden", "true");

	source.src = videoURL;
	source.type = getHeroVideoMimeType(videoURL);

	video.appendChild(source);
	container.replaceChildren(video);
	container.classList.remove("hero-video-unavailable");

	function requestPlayback() {
		video.muted = true;
		video.defaultMuted = true;

		const playAttempt = video.play();

		if (playAttempt && typeof playAttempt.catch === "function") {
			playAttempt.catch(() => {
				/*
					A browser or device may still override autoplay.
					The video remains ready to resume after visibility/pageshow.
				*/
			});
		}
	}

	function showVideoError() {
		container.classList.add("hero-video-unavailable");
		console.error(`Hero video could not be loaded: ${videoURL}`);
	}

	source.addEventListener("error", showVideoError);
	video.addEventListener("loadedmetadata", requestPlayback, { once: true });
	video.addEventListener("loadeddata", requestPlayback, { once: true });
	video.addEventListener("canplay", requestPlayback, { once: true });

	window.addEventListener("pageshow", requestPlayback);

	document.addEventListener("visibilitychange", () => {
		if (!document.hidden) {
			requestPlayback();
		}
	});

	requestPlayback();
}

function getHeroVideoMimeType(source) {
	if (/\.webm(?:[?#].*)?$/i.test(source)) return "video/webm";
	if (/\.ogg(?:[?#].*)?$/i.test(source)) return "video/ogg";
	return "video/mp4";
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