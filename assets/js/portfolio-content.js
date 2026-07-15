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

	renderHeroBackgroundVideo("[data-portfolio-showreel]", content.video.showreelVideoURL);
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

	if (sizes.orangeHeading) root.style.setProperty("--portfolio-orange-heading-size", sizes.orangeHeading);
	if (sizes.whiteTitle) root.style.setProperty("--portfolio-white-title-size", sizes.whiteTitle);
	if (sizes.whiteBody) root.style.setProperty("--portfolio-white-body-size", sizes.whiteBody);
}