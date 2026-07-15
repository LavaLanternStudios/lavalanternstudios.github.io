const projectId = document.body.dataset.projectId;
const project = portfolioPages[projectId];
const projectContent = window.projectPageContent?.[projectId];

function getMediaSource(media, section = null) {
	let source = media?.src || "";

	if (
		projectId === "corgi-character-model" &&
		isCorgiAnimationSection(section) &&
		/\.gif(?:[?#].*)?$/i.test(source)
	) {
		source = source.replace(/\.gif(?=([?#].*)?$)/i, ".mp4");
	}

	return source;
}

function isVideoSource(source) {
	return /\.(mp4|webm|ogg)(?:[?#].*)?$/i.test(source || "");
}

function getVideoMimeType(source) {
	if (/\.webm(?:[?#].*)?$/i.test(source)) return "video/webm";
	if (/\.ogg(?:[?#].*)?$/i.test(source)) return "video/ogg";
	return "video/mp4";
}

function createImageButton(image) {
	return `
		<button class="project-lightbox-trigger" type="button" data-lightbox-image="${image.src}" data-lightbox-alt="${image.alt || ""}">
			<img src="${image.src}" alt="${image.alt || ""}" />
		</button>
	`;
}

function createProjectMedia(media, section = null) {
	const source = getMediaSource(media, section);

	if (isVideoSource(source)) {
		return `
			<div class="project-video-tile">
				<video
					autoplay
					loop
					muted
					playsinline
					preload="auto"
					aria-label="${media.alt || section?.title || "Project animation"}"
				>
					<source src="${source}" type="${getVideoMimeType(source)}" />
					Your browser does not support HTML5 video.
				</video>
			</div>
		`;
	}

	return createImageButton({
		...media,
		src: source
	});
}

function createSectionSlug(section) {
	const source = section.sectionClass || section.title || section.kicker || "gallery";

	return String(source)
		.trim()
		.toLowerCase()
		.replace(/&/g, "and")
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
}

function isCorgiAnimationSection(section) {
	const sectionSlug = createSectionSlug(section);

	return (
		projectId === "corgi-character-model" &&
		[
			"animation-tests",
			"animation-test",
			"animation"
		].includes(sectionSlug)
	);
}

function isDesktopGalleryCarousel(section) {
	const sectionSlug = createSectionSlug(section);

	const carouselSectionsByProject = {
		"steam-images-galatico": [
			"concepts-and-mockups"
		],
		"prison-level": [
			"images-of-the-final-level",
			"level-design-drawings",
			"blockout-phase"
		],
		"space-station-level": [
			"images-of-the-final-level",
			"level-design-drawings",
			"blockout-phase",
			"blueprinting"
		],
		"egyptian-level": [
			"images-of-the-final-level",
			"level-design-drawings",
			"blockout-phase"
		],
		"corgi-character-model": [
			"images-of-the-final-corgi-model",
			"images-of-the-final-model",
			"final-corgi-model",
			"final-model"
		],
		"viking-character-model": [
			"blockout-low-poly",
			"blockout-and-low-poly",
			"low-poly-vs-high-poly",
			"low-poly-and-high-poly-comparison",
			"model-breakdown"
		]
	};

	const automaticCarouselProjects = new Set([
		"textured-aston-martin",
		"ui-ux-design-game-interface",
		"egyptian-ui",
		"tabletop-artwork"
	]);

	const excludedAutomaticSections = new Set([
		"project-overview",
		"overview",
		"cinematic",
		"cinematic-showcase"
	]);

	if (projectId === "triceratops-model" && section.type === "gallery") {
		return true;
	}

	if (
		automaticCarouselProjects.has(projectId) &&
		!excludedAutomaticSections.has(sectionSlug)
	) {
		return true;
	}

	return (
		section.desktopCarousel === true ||
		(carouselSectionsByProject[projectId] || []).includes(sectionSlug)
	);
}

function isDesktopComparisonCarousel(section) {
	const sectionSlug = createSectionSlug(section);

	const comparisonSectionsByProject = {
		"corgi-character-model": [
			"low-poly-and-high-poly-comparison",
			"low-poly-vs-high-poly"
		],
		"viking-character-model": [
			"low-poly-and-high-poly-comparison",
			"low-poly-vs-high-poly"
		]
	};

	const automaticComparisonProjects = new Set([
		"textured-aston-martin",
		"ui-ux-design-game-interface",
		"egyptian-ui",
		"tabletop-artwork"
	]);

	const excludedAutomaticSections = new Set([
		"project-overview",
		"overview",
		"cinematic",
		"cinematic-showcase"
	]);

	return (
		section.desktopComparisonCarousel === true ||
		projectId === "triceratops-model" ||
		(
			automaticComparisonProjects.has(projectId) &&
			!excludedAutomaticSections.has(sectionSlug)
		) ||
		(comparisonSectionsByProject[projectId] || []).includes(sectionSlug)
	);
}

function renderGalleryCarousel(itemsHtml, options = {}) {
	const visibleItems = Number(options.visibleItems) || 4;
	const previousLabel = options.previousLabel || "Show previous images";
	const nextLabel = options.nextLabel || "Show next images";
	const trackClass = options.trackClass || "project-gallery";
	const extraClass = options.extraClass || "";

	return `
		<div
			class="project-gallery-carousel project-gallery-carousel--${visibleItems} ${extraClass}"
			data-gallery-carousel
			data-gallery-carousel-visible="${visibleItems}"
		>
			<button
				class="project-gallery-carousel-button previous"
				type="button"
				aria-label="${previousLabel}"
				data-gallery-carousel-previous
			>
				&#10094;
			</button>

			<div class="project-gallery-carousel-viewport">
				<div class="${trackClass} project-gallery-carousel-track" data-gallery-carousel-track>
					${itemsHtml}
				</div>
			</div>

			<button
				class="project-gallery-carousel-button next"
				type="button"
				aria-label="${nextLabel}"
				data-gallery-carousel-next
			>
				&#10095;
			</button>
		</div>
	`;
}

function renderHeading(section) {
	return `
		<div class="project-section-heading">
			<p class="section-label">${section.kicker || ""}</p>
			<h2>${section.title || ""}</h2>
		</div>
	`;
}

function renderIntroSection(section) {
	return `
		<section class="project-section">
			<div class="section-inner project-intro-card">
				<div class="project-intro-copy">
					${renderHeading(section)}
					${(section.body || []).map((paragraph) => `<p>${paragraph}</p>`).join("")}
				</div>

				<div class="project-intro-image">
					${createImageButton({
						src: section.image,
						alt: section.imageAlt || section.title
					})}
				</div>
			</div>
		</section>
	`;
}

function renderVideoSection(section) {
	return `
		<section class="project-section">
			<div class="section-inner">
				${renderHeading(section)}

				<div class="project-video-wrap">
					<iframe
						src="${section.youtubeEmbed}"
						title="${section.title || "Project video"}"
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
						allowfullscreen
					></iframe>
				</div>
			</div>
		</section>
	`;
}

function renderCorgiAnimationSection(section) {
	const sectionSlug = createSectionSlug(section);
	const mediaItems = (section.images || section.media || []).map((media) => createProjectMedia(media, section)).join("");

	return `
		<section class="project-section project-section--${sectionSlug} project-section--animation-tests">
			<div class="section-inner">
				${renderHeading(section)}

				<div class="project-animation-grid">
					${mediaItems}
				</div>
			</div>
		</section>
	`;
}

function renderGallerySection(section) {
	const sectionSlug = createSectionSlug(section);

	if (isCorgiAnimationSection(section)) {
		return renderCorgiAnimationSection(section);
	}

	const mediaItems = (section.images || []).map((media) => createProjectMedia(media, section)).join("");

	if (isDesktopGalleryCarousel(section)) {
		return `
			<section class="project-section project-section--${sectionSlug}">
				<div class="section-inner">
					${renderHeading(section)}

					${renderGalleryCarousel(mediaItems, {
						visibleItems: 4,
						previousLabel: `Show previous ${section.title || "project"} images`,
						nextLabel: `Show next ${section.title || "project"} images`
					})}
				</div>
			</section>
		`;
	}

	return `
		<section class="project-section project-section--${sectionSlug}">
			<div class="section-inner">
				${renderHeading(section)}

				<div class="project-gallery">
					${mediaItems}
				</div>
			</div>
		</section>
	`;
}

function renderReelSection(section) {
	if (isCorgiAnimationSection(section)) {
		return renderCorgiAnimationSection(section);
	}

	const sectionSlug = createSectionSlug(section);
	const mediaItems = (section.images || []).map((media) => createProjectMedia(media, section)).join("");

	if (isDesktopGalleryCarousel(section)) {
		return `
			<section class="project-section project-section--${sectionSlug}">
				<div class="section-inner">
					${renderHeading(section)}

					${renderGalleryCarousel(mediaItems, {
						visibleItems: 4,
						previousLabel: `Show previous ${section.title || "project"} images`,
						nextLabel: `Show next ${section.title || "project"} images`
					})}
				</div>
			</section>
		`;
	}

	return `
		<section class="project-section project-section--${sectionSlug}">
			<div class="section-inner">
				${renderHeading(section)}

				<div class="project-reel">
					${mediaItems}
				</div>
			</div>
		</section>
	`;
}

function renderComparisonSection(section) {
	return `
		<section class="project-section">
			<div class="section-inner">
				${renderHeading(section)}

				<div class="project-comparison-grid">
					<article class="project-comparison-card">
						<p>${section.leftLabel || "Left Image"}</p>
						${createImageButton({
							src: section.leftImage,
							alt: section.leftLabel || section.title
						})}
					</article>

					<article class="project-comparison-card">
						<p>${section.rightLabel || "Right Image"}</p>
						${createImageButton({
							src: section.rightImage,
							alt: section.rightLabel || section.title
						})}
					</article>
				</div>
			</div>
		</section>
	`;
}

function renderVideoPairSection(section) {
	return `
		<section class="project-section">
			<div class="section-inner">
				${renderHeading(section)}

				<div class="project-video-pair-grid">
					${(section.videos || []).map((video) => {
						return `
							<article class="project-video-card">
								<h3>${video.title || ""}</h3>

								<div class="project-video-wrap">
									<iframe
										src="${video.youtubeEmbed}"
										title="${video.title || "Project video"}"
										allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
										allowfullscreen
									></iframe>
								</div>
							</article>
						`;
					}).join("")}
				</div>
			</div>
		</section>
	`;
}

function renderComparisonGallerySection(section) {
	const sectionSlug = createSectionSlug(section);
	const useDesktopCarousels = isDesktopComparisonCarousel(section);

	const renderComparisonSide = (label, images, sideName) => {
		const mediaItems = (images || []).map((media) => createProjectMedia(media, section)).join("");

		if (useDesktopCarousels) {
			return `
				<article class="project-comparison-card project-comparison-card--carousel">
					<p>${label}</p>

					${renderGalleryCarousel(mediaItems, {
						visibleItems: 2,
						previousLabel: `Show previous ${label} images`,
						nextLabel: `Show next ${label} images`,
						trackClass: "project-comparison-gallery",
						extraClass: `project-comparison-side-carousel project-comparison-side-carousel--${sideName}`
					})}
				</article>
			`;
		}

		return `
			<article class="project-comparison-card">
				<p>${label}</p>

				<div class="project-comparison-gallery">
					${mediaItems}
				</div>
			</article>
		`;
	};

	return `
		<section class="project-section project-section--${sectionSlug}">
			<div class="section-inner">
				${renderHeading(section)}

				<div class="project-comparison-grid">
					${renderComparisonSide(
						section.leftLabel || "Left Side",
						section.leftImages,
						"left"
					)}

					${renderComparisonSide(
						section.rightLabel || "Right Side",
						section.rightImages,
						"right"
					)}
				</div>
			</div>
		</section>
	`;
}

function renderMaterialGridSection(section) {
	const sectionSlug = createSectionSlug(section);
	const useMaterialCarousels = projectId === "materials-textures";

	return `
		<section class="project-section project-section--${sectionSlug}">
			<div class="section-inner">
				${renderHeading(section)}

				<div class="project-material-grid">
					${(section.materials || []).map((material, materialIndex) => {
						const materialImages = (material.images || [])
							.map((media) => createProjectMedia(media, section))
							.join("");

						const imagesMarkup = useMaterialCarousels
							? renderGalleryCarousel(materialImages, {
								visibleItems: 2,
								previousLabel: `Show previous ${material.title || `material ${materialIndex + 1}`} images`,
								nextLabel: `Show next ${material.title || `material ${materialIndex + 1}`} images`,
								trackClass: "project-material-images",
								extraClass: "project-material-image-carousel"
							})
							: `
								<div class="project-material-images">
									${materialImages}
								</div>
							`;

						return `
							<article class="project-material-card">
								<div class="project-material-copy">
									<h3>${material.title || ""}</h3>
									<p>${material.description || ""}</p>
								</div>

								${imagesMarkup}
							</article>
						`;
					}).join("")}
				</div>
			</div>
		</section>
	`;
}

function renderSection(section) {
	if (section.type === "intro") return renderIntroSection(section);
	if (section.type === "video") return renderVideoSection(section);
	if (section.type === "videoPair") return renderVideoPairSection(section);
	if (section.type === "gallery") return renderGallerySection(section);
	if (section.type === "reel") return renderReelSection(section);
	if (section.type === "comparison") return renderComparisonSection(section);
	if (section.type === "comparisonGallery") return renderComparisonGallerySection(section);
	if (section.type === "materialGrid") return renderMaterialGridSection(section);

	return "";
}

function setupGalleryCarousels() {
	const desktopLayout = window.matchMedia("(min-width: 901px)");

	document.querySelectorAll("[data-gallery-carousel]").forEach((carousel) => {
		const track = carousel.querySelector("[data-gallery-carousel-track]");
		const previousButton = carousel.querySelector("[data-gallery-carousel-previous]");
		const nextButton = carousel.querySelector("[data-gallery-carousel-next]");
		const items = Array.from(track?.children || []);
		const visibleItemCount = Math.max(
			1,
			Number.parseInt(carousel.dataset.galleryCarouselVisible || "4", 10)
		);
		let currentIndex = 0;
		let resizeFrame = null;

		if (!track || !previousButton || !nextButton || items.length === 0) {
			return;
		}

		function getMaximumIndex() {
			return Math.max(0, items.length - visibleItemCount);
		}

		function updateStaticState() {
			carousel.classList.toggle("is-static", items.length <= visibleItemCount);
		}

		function updateCarousel() {
			updateStaticState();
			if (!desktopLayout.matches) {
				currentIndex = 0;
				track.style.transform = "";
				previousButton.disabled = true;
				nextButton.disabled = true;
				return;
			}

			currentIndex = Math.min(currentIndex, getMaximumIndex());

			const firstItem = items[0];
			const trackStyles = window.getComputedStyle(track);
			const gap = Number.parseFloat(trackStyles.columnGap || trackStyles.gap) || 0;
			const movement = firstItem.getBoundingClientRect().width + gap;

			track.style.transform = `translateX(-${currentIndex * movement}px)`;
			previousButton.disabled = currentIndex === 0;
			nextButton.disabled = currentIndex >= getMaximumIndex();
		}

		previousButton.addEventListener("click", () => {
			currentIndex = Math.max(0, currentIndex - 1);
			updateCarousel();
		});

		nextButton.addEventListener("click", () => {
			currentIndex = Math.min(getMaximumIndex(), currentIndex + 1);
			updateCarousel();
		});

		carousel.addEventListener("keydown", (event) => {
			if (!desktopLayout.matches) return;

			if (event.key === "ArrowLeft") {
				event.preventDefault();
				currentIndex = Math.max(0, currentIndex - 1);
				updateCarousel();
			}

			if (event.key === "ArrowRight") {
				event.preventDefault();
				currentIndex = Math.min(getMaximumIndex(), currentIndex + 1);
				updateCarousel();
			}
		});

		window.addEventListener("resize", () => {
			window.cancelAnimationFrame(resizeFrame);
			resizeFrame = window.requestAnimationFrame(updateCarousel);
		});

		if (typeof desktopLayout.addEventListener === "function") {
			desktopLayout.addEventListener("change", updateCarousel);
		} else {
			desktopLayout.addListener(updateCarousel);
		}

		updateCarousel();
	});
}

function setupLightbox() {
	const lightbox = document.createElement("div");
	lightbox.className = "project-lightbox";
	lightbox.innerHTML = `
		<button class="project-lightbox-close" type="button" aria-label="Close image">×</button>
		<img src="" alt="" />
	`;

	document.body.appendChild(lightbox);

	const lightboxImage = lightbox.querySelector("img");
	const closeButton = lightbox.querySelector(".project-lightbox-close");

	document.addEventListener("click", (event) => {
		const trigger = event.target.closest(".project-lightbox-trigger");

		if (!trigger) return;

		lightboxImage.src = trigger.dataset.lightboxImage;
		lightboxImage.alt = trigger.dataset.lightboxAlt || "";
		lightbox.classList.add("open");
		document.body.classList.add("lightbox-open");
	});

	function closeLightbox() {
		lightbox.classList.remove("open");
		document.body.classList.remove("lightbox-open");
		lightboxImage.src = "";
		lightboxImage.alt = "";
	}

	closeButton.addEventListener("click", closeLightbox);

	lightbox.addEventListener("click", (event) => {
		if (event.target === lightbox) {
			closeLightbox();
		}
	});

	document.addEventListener("keydown", (event) => {
		if (event.key === "Escape") {
			closeLightbox();
		}
	});
}

if (project) {
	document.title = `Lava Lantern Studios | ${project.title}`;

	const titleElements = document.querySelectorAll("[data-project-title]");
	const heroElement = document.querySelector("[data-project-hero]");
	const tagsElement = document.querySelector("[data-project-tags]");
	const sectionsElement = document.querySelector("[data-project-sections]");

	titleElements.forEach((element) => {
		element.textContent = project.title;
	});

	if (heroElement) {
		if (project.heroType === "video" && project.heroVideo) {
			heroElement.innerHTML = `
				<iframe
					src="${project.heroVideo}"
					title="${project.title}"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
					allowfullscreen
				></iframe>
			`;
		} else if (project.heroImage) {
			heroElement.innerHTML = `
				<img src="${project.heroImage}" alt="${project.title}" />
			`;
		}
	}

	if (tagsElement) {
		tagsElement.innerHTML = project.tags
			.map((tag) => `<span class="project-tag">${tag}</span>`)
			.join("");
	}

	if (projectContent?.fontSizes) {
		document.documentElement.style.setProperty("--portfolio-detail-orange-heading-size", projectContent.fontSizes.orangeHeading || "1rem");
		document.documentElement.style.setProperty("--portfolio-detail-white-title-size", projectContent.fontSizes.whiteTitle || "3rem");
		document.documentElement.style.setProperty("--portfolio-detail-body-size", projectContent.fontSizes.bodyText || "1.15rem");
	}

	if (sectionsElement && projectContent?.sections) {
		let renderedSections = projectContent.sections.map(renderSection).join("");

		if (projectContent.bottomNote) {
			renderedSections += `
				<section class="project-bottom-note-section">
					<div class="section-inner">
						<p class="project-bottom-note">${projectContent.bottomNote}</p>
					</div>
				</section>
			`;
		}

		sectionsElement.innerHTML = renderedSections;
	}

	document.querySelectorAll(".corgi-character-page .project-animation-grid video").forEach((video) => {
		video.muted = true;
		video.loop = true;

		const playAttempt = video.play();

		if (playAttempt && typeof playAttempt.catch === "function") {
			playAttempt.catch(() => {
				/* Autoplay may be blocked by an individual browser setting. */
			});
		}
	});

	setupGalleryCarousels();
	setupLightbox();
}