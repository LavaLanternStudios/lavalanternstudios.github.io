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

	const videoId = getYouTubeVideoId(url);
	if (!videoId) {
		console.error(`A valid YouTube video ID could not be read from: ${url}`);
		return;
	}

	createYouTubeBackgroundPlayer(container, videoId);
}

function getYouTubeVideoId(url) {
	const value = String(url || "").trim();

	const patterns = [
		/(?:youtube\.com\/watch\?.*?[?&]v=)([^&?/]+)/i,
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

function loadYouTubeIframeAPI() {
	if (window.YT?.Player) {
		return Promise.resolve(window.YT);
	}

	if (window.__lavaYouTubeAPIReadyPromise) {
		return window.__lavaYouTubeAPIReadyPromise;
	}

	window.__lavaYouTubeAPIReadyPromise = new Promise((resolve, reject) => {
		const previousReadyHandler = window.onYouTubeIframeAPIReady;

		window.onYouTubeIframeAPIReady = () => {
			if (typeof previousReadyHandler === "function") {
				previousReadyHandler();
			}

			resolve(window.YT);
		};

		let apiScript = document.querySelector(
			'script[src="https://www.youtube.com/iframe_api"]'
		);

		if (!apiScript) {
			apiScript = document.createElement("script");
			apiScript.src = "https://www.youtube.com/iframe_api";
			apiScript.async = true;
			apiScript.onerror = () => {
				reject(new Error("The YouTube IFrame Player API could not be loaded."));
			};

			document.head.appendChild(apiScript);
		}
	});

	return window.__lavaYouTubeAPIReadyPromise;
}

function createYouTubeBackgroundPlayer(container, videoId) {
	container.replaceChildren();
	container.classList.add("youtube-background-loading");
	container.classList.remove("youtube-background-error");

	const playerMount = document.createElement("div");
	const playerId = `youtube-background-${videoId}-${Math.random()
		.toString(36)
		.slice(2, 9)}`;

	playerMount.id = playerId;
	playerMount.className = "youtube-background-player";
	container.appendChild(playerMount);

	let player = null;
	let interactionFallbackAdded = false;

	function requestPlayback() {
		if (!player || typeof player.playVideo !== "function") return;

		try {
			player.mute();
			player.setVolume(0);
			player.playVideo();
		} catch (error) {
			/* The API may not be ready for commands until its next state event. */
		}
	}

	function addInteractionFallback() {
		if (interactionFallbackAdded) return;
		interactionFallbackAdded = true;

		const resumePlayback = () => {
			requestPlayback();

			["pointerdown", "touchstart", "keydown", "scroll"].forEach((eventName) => {
				window.removeEventListener(eventName, resumePlayback);
			});
		};

		["pointerdown", "touchstart", "keydown", "scroll"].forEach((eventName) => {
			window.addEventListener(eventName, resumePlayback, {
				once: true,
				passive: true
			});
		});
	}

	loadYouTubeIframeAPI()
		.then(() => {
			const origin =
				window.location.protocol === "http:" ||
				window.location.protocol === "https:"
					? window.location.origin
					: undefined;

			const playerVars = {
				autoplay: 1,
				controls: 0,
				disablekb: 1,
				enablejsapi: 1,
				fs: 0,
				iv_load_policy: 3,
				loop: 1,
				playlist: videoId,
				playsinline: 1,
				rel: 0
			};

			if (origin) {
				playerVars.origin = origin;
				playerVars.widget_referrer = window.location.href;
			}

			player = new window.YT.Player(playerId, {
				videoId,
				width: "100%",
				height: "100%",
				playerVars,
				events: {
					onReady(event) {
						event.target.mute();
						event.target.setVolume(0);
						event.target.playVideo();
					},

					onStateChange(event) {
						if (event.data === window.YT.PlayerState.PLAYING) {
							container.classList.remove("youtube-background-loading");
							container.classList.remove("youtube-background-error");
						}

						if (event.data === window.YT.PlayerState.ENDED) {
							event.target.seekTo(0, true);
							event.target.playVideo();
						}

						if (
							event.data === window.YT.PlayerState.PAUSED ||
							event.data === window.YT.PlayerState.CUED
						) {
							requestPlayback();
						}
					},

					onAutoplayBlocked() {
						addInteractionFallback();
					},

					onError(event) {
						container.classList.remove("youtube-background-loading");
						container.classList.add("youtube-background-error");

						console.error(
							`YouTube hero video ${videoId} returned player error ${event.data}.`
						);
					}
				}
			});

			const iframe = player.getIframe();

			if (iframe) {
				iframe.setAttribute("title", "Lava Lantern Studios background showreel");
				iframe.setAttribute(
					"referrerpolicy",
					"strict-origin-when-cross-origin"
				);
				iframe.setAttribute(
					"allow",
					"autoplay; encrypted-media; picture-in-picture"
				);
				iframe.setAttribute("tabindex", "-1");
				iframe.setAttribute("aria-hidden", "true");
			}

			window.addEventListener("pageshow", requestPlayback);

			document.addEventListener("visibilitychange", () => {
				if (!document.hidden) {
					requestPlayback();
				}
			});
		})
		.catch((error) => {
			container.classList.remove("youtube-background-loading");
			container.classList.add("youtube-background-error");
			console.error(error);
		});
}

function applyTextSizes(sizes) {
	if (!sizes) return;

	const root = document.documentElement;

	if (sizes.orangeHeading) root.style.setProperty("--portfolio-orange-heading-size", sizes.orangeHeading);
	if (sizes.whiteTitle) root.style.setProperty("--portfolio-white-title-size", sizes.whiteTitle);
	if (sizes.whiteBody) root.style.setProperty("--portfolio-white-body-size", sizes.whiteBody);
}