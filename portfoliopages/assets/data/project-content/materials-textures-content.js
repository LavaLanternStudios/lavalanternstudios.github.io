window.projectPageContent = window.projectPageContent || {};

window.projectPageContent["materials-textures"] = {
	fontSizes: {
		orangeHeading: "2rem",
		whiteTitle: "2.5rem",
		bodyText: "1.15rem"
	},

	sections: [
		{
			type: "intro",
			kicker: "Project Overview",
			title: "PBR Material Creation And Texture Studies",
			body: [
				"This project showcases a collection of PBR materials and texture studies created using a range of material-authoring workflows. Each material explores surface detail, tiling quality, roughness, height, normal information, and presentation across different 3D forms.",
				"The collection includes procedural materials, photo-based materials, and refined texture studies created using tools such as Substance Designer, Substance Sampler, Quixel Mixer, and Affinity Photo."
			],
			image: "assets/projects/materials-textures/Marble_4.png",
			imageAlt: "Materials and Textures preview"
		},

		{
			type: "materialGrid",
			kicker: "Material Library",
			title: "Material Studies",
			materials: [
				{
					title: "Chaimail",
					description: "A procedural chainmail material created in Substance Designer, using interlocking ring patterns, height detail, metallic values, edge wear, and surface scratches to create a worn steel finish.",
					images: [
						{ src: "assets/projects/materials-textures/ChainmailSubDesigner_3.PNG", alt: "Material One 01" },
						{ src: "assets/projects/materials-textures/ChainmailSubDesigner_2.PNG", alt: "Material One 02" },
						{ src: "assets/projects/materials-textures/ChainmailSubDesigner_1.PNG", alt: "Material One 03" },
						{ src: "assets/projects/materials-textures/ChainmailSubDesigner_4.PNG", alt: "Material One 04" },
						{ src: "assets/projects/materials-textures/ChainmailSubDesigner_5.PNG", alt: "Material One 05" }
					]
				},
				{
					title: "Knitted Wool",
					description: "A seamless knitted wool material created in Substance Sampler from a high-resolution fabric image, with adjusted height, roughness, and normal values to emphasise soft fibres and knit loops.",
					images: [
						{ src: "assets/projects/materials-textures/Wool3.PNG", alt: "Material Two 01" },
						{ src: "assets/projects/materials-textures/Wool2.PNG", alt: "Material Two 02" },
						{ src: "assets/projects/materials-textures/Wool1.PNG", alt: "Material Two 03" }
					]
				},
				{
					title: "Leather",
					description: "A fully procedural leather material created in Substance Designer, focusing on worn grain detail, creases, subtle scratches, roughness variation, and aged surface character.",
					images: [
						{ src: "assets/projects/materials-textures/LeatherSubDesigner_4.PNG", alt: "Material Two 01" },
						{ src: "assets/projects/materials-textures/LeatherSubDesigner_3.PNG", alt: "Material Two 02" },
						{ src: "assets/projects/materials-textures/LeatherSubDesigner_5.PNG", alt: "Material Two 03" },
						{ src: "assets/projects/materials-textures/LeatherSubDesigner_1.PNG", alt: "Material Two 04" },
						{ src: "assets/projects/materials-textures/LeatherSubDesigner_2.PNG", alt: "Material Two 05" }
					]
				},
				{
					title: "Old Wooden Floor",
					description: "A realistic wooden floor material created from a photographic source, processed into a seamless texture in Affinity Photo and developed in Quixel Mixer with grain, knots, wear, and surface variation.",
					images: [
						{ src: "assets/projects/materials-textures/WoodFloor1-2.png", alt: "Material Five 01" },
						{ src: "assets/projects/materials-textures/WoodFloor1-1.png", alt: "Material Five 02" },
						{ src: "assets/projects/materials-textures/WoodFloor1-3.png", alt: "Material Five 03" },
						{ src: "assets/projects/materials-textures/WoodFloor1-4.jpg", alt: "Material Five 04" }
					]
				},
				{
					title: "Blue Marble Tile",
					description: "A blue marble tile material created from a prepared seamless source image, then developed in Quixel Mixer with reflective surface detail, grout definition, and polished stone variation.",
					images: [
						{ src: "assets/projects/materials-textures/Marble_5.png", alt: "Material Three 01" },
						{ src: "assets/projects/materials-textures/Marble_4.png", alt: "Material Three 02" },
						{ src: "assets/projects/materials-textures/Marble_6.png", alt: "Material Three 03" },
						{ src: "assets/projects/materials-textures/Before After.jpg", alt: "Material Three 04" }
					]
				},
				{
					title: "White Marble Tile",
					description: "A white marble tile material created from a prepared seamless source image, then developed in Quixel Mixer with reflective surface detail, grout definition, and clean polished stone variation.",
					images: [
						{ src: "assets/projects/materials-textures/Marble_2.png", alt: "Material Four 01" },
						{ src: "assets/projects/materials-textures/Marble_1.png", alt: "Material Four 02" },
						{ src: "assets/projects/materials-textures/Marble_3.png", alt: "Material Four 03" },
						{ src: "assets/projects/materials-textures/Before After.jpg", alt: "Material Four 04" }
					]
				},
				{
					title: "Tree Bark",
					description: "A bark material created from real-world photo reference, processed into a seamless texture in Affinity Photo and developed in Quixel Mixer with depth, roughness, and surface fidelity.",
					images: [
						{ src: "assets/projects/materials-textures/Bark_2.png", alt: "Material Six 01" },
						{ src: "assets/projects/materials-textures/Bark_1.png", alt: "Material Six 02" },
						{ src: "assets/projects/materials-textures/Bark_3.png", alt: "Material Six 02" },
						{ src: "assets/projects/materials-textures/Bark_4.jpg", alt: "Material Six 02" }
					]
				}
			]
		}
	]
};