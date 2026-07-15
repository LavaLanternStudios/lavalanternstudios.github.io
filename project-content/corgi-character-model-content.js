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
				"This corgi character model is a stylised 3D character created as part of an ongoing personal project. The model was built from a low-poly base mesh in Blender, then UV unwrapped, refined into a high-poly sculpt, and textured in Substance Painter using a PBR workflow.",
				"The character was later rigged and animated in Blender, with several short animation cycles created to demonstrate movement, deformation, and personality. The project follows a full character pipeline from modelling and texturing through to rigging and animation."
			],
			image: "assets/projects/corgi-character-model/final1.png",
			imageAlt: "Final Corgi Character Model"
		},

		{
			type: "gallery",
			kicker: "Final Model",
			title: "Images Of The Final Corgi Model",
			images: [
				{ src: "assets/projects/corgi-character-model/final1.png", alt: "Final Corgi Model 01" },
				{ src: "assets/projects/corgi-character-model/final2.png", alt: "Final Corgi Model 02" },
				{ src: "assets/projects/corgi-character-model/final3.png", alt: "Final Corgi Model 03" },
				{ src: "assets/projects/corgi-character-model/final4.png", alt: "Final Corgi Model 04" },
				{ src: "assets/projects/corgi-character-model/final5.png", alt: "Final Corgi Model 05" },
				{ src: "assets/projects/corgi-character-model/final6.png", alt: "Final Corgi Model 06" },
				{ src: "assets/projects/corgi-character-model/final7.png", alt: "Final Corgi Model 07" }
			]
		},

		{
			type: "reel",
			kicker: "Animation",
			title: "Animation Tests",
			images: [
				{ src: "assets/projects/corgi-character-model/corgi-animation-walk.mp4", alt: "Corgi Animation 01" },
				{ src: "assets/projects/corgi-character-model/corgi-animation-bark.mp4", alt: "Corgi Animation 02" },
				{ src: "assets/projects/corgi-character-model/corgi-animation-crawl.mp4", alt: "Corgi Animation 02" },
				{ src: "assets/projects/corgi-character-model/corgi-animation-sniff.mp4", alt: "Corgi Animation 02" },
				{ src: "assets/projects/corgi-character-model/corgi-animation-buttonpress.mp4", alt: "Corgi Animation 02" }
			]
		},

		{
			type: "comparison",
			kicker: "Model Development",
			title: "Low Poly And High Poly Comparison",
			leftLabel: "Low Poly Model",
			leftImage: "assets/projects/corgi-character-model/lp1.png",
			rightLabel: "High Poly Model",
			rightImage: "assets/projects/corgi-character-model/hp1.png"
		}
	]
};