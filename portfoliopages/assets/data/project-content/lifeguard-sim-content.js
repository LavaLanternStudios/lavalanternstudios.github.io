window.projectPageContent = window.projectPageContent || {};

window.projectPageContent["lifeguard-sim"] = {
	fontSizes: {
		orangeHeading: "2rem",
		whiteTitle: "2.5rem",
		bodyText: "1.15rem"
	},

	sections: [
		{
			type: "intro",
			kicker: "Project Overview",
			title: "A 2D Pixel Game With Alternative Input Mechanics",
			body: [
				"Lifeguard Simulator is a 2D pixel-art game I created, combining custom artwork, UI design, gameplay systems, and alternative input mechanics.",
				"The project used hand tracking, voice control, and eye tracking, so the visuals and interactions needed to be clear, readable, and easy to understand during gameplay."
			],
			image: "assets/projects/lifeguard-sim/GameplayImage.png",
			imageAlt: "Lifeguard Simulator preview"
		},

		{
			type: "video",
			kicker: "Final Game",
			title: "Final Game Video",
			youtubeEmbed: "https://www.youtube.com/embed/Rd9lI682Yjo?si=tGCBLuJnwoTdd4H_"
		},

		{
			type: "gallery",
			kicker: "Game Screens",
			title: "Separate Game Screens",
			images: [
				{ src: "assets/projects/lifeguard-sim/MainMenu.png", alt: "Lifeguard Simulator main menu screen" },
				{ src: "assets/projects/lifeguard-sim/GameScreen.png", alt: "Lifeguard Simulator game screen" },
				{ src: "assets/projects/lifeguard-sim/EndScreen.png", alt: "Lifeguard Simulator end screen 03" }
			]
		},

		{
			type: "gallery",
			kicker: "2D Artwork",
			title: "Separate 2D Artwork And Elements",
			images: [
				{ src: "assets/projects/lifeguard-sim/2D-Assets1.png", alt: "Lifeguard Simulator 2D artwork 01" },
				{ src: "assets/projects/lifeguard-sim/2D-Assets2.png", alt: "Lifeguard Simulator 2D artwork 02" },
				{ src: "assets/projects/lifeguard-sim/2D-Assets3.png", alt: "Lifeguard Simulator 2D artwork 03" }
			]
		}
	]
};