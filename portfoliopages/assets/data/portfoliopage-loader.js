const projectId = document.body.dataset.projectId;
const project = portfolioPages[projectId];
const projectContent = window.projectPageContent?.[projectId];

function createImageButton(image) {
	return `
		<button class="project-lightbox-trigger" type="button" data-lightbox-image="${image.src}" data-lightbox-alt="${image.alt || ""}">
			<img src="${image.src}" alt="${image.alt || ""}" />
		</button>
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

function renderGallerySection(section) {
	return `
		<section class="project-section">
			<div class="section-inner">
				${renderHeading(section)}

				<div class="project-gallery">
					${(section.images || []).map(createImageButton).join("")}
				</div>
			</div>
		</section>
	`;
}

function renderReelSection(section) {
	return `
		<section class="project-section">
			<div class="section-inner">
				${renderHeading(section)}

				<div class="project-reel">
					${(section.images || []).map(createImageButton).join("")}
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
	return `
		<section class="project-section">
			<div class="section-inner">
				${renderHeading(section)}

				<div class="project-comparison-grid">
					<article class="project-comparison-card">
						<p>${section.leftLabel || "Left Side"}</p>

						<div class="project-comparison-gallery">
							${(section.leftImages || []).map(createImageButton).join("")}
						</div>
					</article>

					<article class="project-comparison-card">
						<p>${section.rightLabel || "Right Side"}</p>

						<div class="project-comparison-gallery">
							${(section.rightImages || []).map(createImageButton).join("")}
						</div>
					</article>
				</div>
			</div>
		</section>
	`;
}

function renderMaterialGridSection(section) {
	return `
		<section class="project-section">
			<div class="section-inner">
				${renderHeading(section)}

				<div class="project-material-grid">
					${(section.materials || []).map((material) => {
						return `
							<article class="project-material-card">
								<div class="project-material-copy">
									<h3>${material.title || ""}</h3>
									<p>${material.description || ""}</p>
								</div>

								<div class="project-material-images">
									${(material.images || []).map(createImageButton).join("")}
								</div>
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
		sectionsElement.innerHTML = projectContent.sections.map(renderSection).join("");
	}

	setupLightbox();
}