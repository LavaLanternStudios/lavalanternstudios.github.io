window.projectPageContent = window.projectPageContent || {};

window.projectPageContent["tabletop-artwork"] = {
	fontSizes: {
		orangeHeading: "2rem",
		whiteTitle: "2.5rem",
		bodyText: "1.15rem"
	},

	sections: [
		{
			type: "intro",
			kicker: "Project Overview",
			title: "Tabletop Game Artwork",
			body: [
				"Add your description of the Tabletop Artwork project here.",
				"Use this section to explain the visual direction, intended tabletop use, card artwork style, and how the two artwork sets differ."
			],
			image: "assets/projects/tabletop-artwork/set-01-01.jpg",
			imageAlt: "Tabletop artwork preview"
		},

		{
			type: "gallery",
			kicker: "Artwork Set One",
			title: "First Set Of Artwork",
			images: [
				{ src: "assets/projects/tabletop-artwork/set-01-01.jpg", alt: "Tabletop artwork set one 01" },
				{ src: "assets/projects/tabletop-artwork/set-01-02.jpg", alt: "Tabletop artwork set one 02" },
				{ src: "assets/projects/tabletop-artwork/set-01-03.jpg", alt: "Tabletop artwork set one 03" }
			]
		},

		{
			type: "gallery",
			kicker: "Artwork Set Two",
			title: "Second Set Of Artwork",
			images: [
				{ src: "assets/projects/tabletop-artwork/set-02-01.jpg", alt: "Tabletop artwork set two 01" },
				{ src: "assets/projects/tabletop-artwork/set-02-02.jpg", alt: "Tabletop artwork set two 02" },
				{ src: "assets/projects/tabletop-artwork/set-02-03.jpg", alt: "Tabletop artwork set two 03" }
			]
		}
	]
};