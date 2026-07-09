window.projectPageContent = window.projectPageContent || {};

window.projectPageContent["corgi-character-model"] = {
	fontSizes: {
		orangeHeading: "2rem",
		whiteTitle: "2.5rem",
		bodyText: "1.15rem"
	},

	sections: [
		{
			type: "intro",
			kicker: "Project Overview",
			title: "Stylised 3D Character Model",
			body: [
				"Add your brief description of the Corgi Character Model project here.",
				"Use this space to explain the purpose of the project, software used, and what the final model was designed to demonstrate."
			],
			image: "assets/projects/corgi-character-model/final-01.jpg",
			imageAlt: "Final Corgi Character Model"
		},

		{
			type: "gallery",
			kicker: "Final Model",
			title: "Images Of The Final Corgi Model",
			images: [
				{ src: "assets/projects/corgi-character-model/final-01.jpg", alt: "Final Corgi Model 01" },
				{ src: "assets/projects/corgi-character-model/final-02.jpg", alt: "Final Corgi Model 02" },
				{ src: "assets/projects/corgi-character-model/final-03.jpg", alt: "Final Corgi Model 03" }
			]
		},

		{
			type: "reel",
			kicker: "Animation",
			title: "Animation Tests",
			images: [
				{ src: "assets/projects/corgi-character-model/animation-01.gif", alt: "Corgi Animation 01" },
				{ src: "assets/projects/corgi-character-model/animation-02.gif", alt: "Corgi Animation 02" }
			]
		},

		{
			type: "comparison",
			kicker: "Model Development",
			title: "Low Poly And High Poly Comparison",
			leftLabel: "Low Poly Model",
			leftImage: "assets/projects/corgi-character-model/low-poly.jpg",
			rightLabel: "High Poly Model",
			rightImage: "assets/projects/corgi-character-model/high-poly.jpg"
		}
	]
};