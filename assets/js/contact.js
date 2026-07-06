document.addEventListener("DOMContentLoaded", () => {
	const socialsList = document.querySelector("[data-socials-list]");
	const contactEmail = document.querySelector("[data-contact-email]");
	const contactEmailLink = document.querySelector("[data-contact-email-link]");

	if (!contactData) return;

	if (contactEmail && contactData.email) {
		contactEmail.textContent = contactData.email;
	}

	if (contactEmailLink && contactData.email) {
		contactEmailLink.href = `mailto:${contactData.email}`;
		contactEmailLink.textContent = contactData.email;
	}

	if (!socialsList || !Array.isArray(contactData.socials)) return;

	const orderedSocials = [...contactData.socials].sort((a, b) => a.order - b.order);

	socialsList.innerHTML = orderedSocials
		.map((social) => {
			return `
				<a class="contact-social-card" href="${social.socialURL}" target="_blank" rel="noopener noreferrer" aria-label="Visit Lava Lantern Studios on ${social.socialName}">
					<img src="${social.imageIcon}" alt="${social.socialName} icon" />
					<span>${social.socialName}</span>
				</a>
			`;
		})
		.join("");
});