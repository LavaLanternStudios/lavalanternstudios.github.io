/* ================================
   Teams We've Worked With
================================ */

const teams = [
	/*
		ADD TEAMS HERE.

		Example:

		{
			name: "Team Name",
			logo: "assets/images/teams/team-name.png",
			website: "https://example.com/"
		},
	*/
	{
		name: "Galatico Studios",
		logo: "assets/images/teams/Galatico_Logo.png",
		website: "https://galaticostudios.co.uk/"
	},
	{
		name: "Snackbox Games",
		logo: "assets/images/teams/Snackbox_Logo.png",
		website: "https://snackbox.games/"
	},
];

const teamsSection = document.getElementById("teams-we-worked-with");
const teamsList = document.getElementById("home-teams-list");

if (teamsSection && teamsList && teams.length > 0) {
	teamsList.innerHTML = "";

	teams.forEach((team) => {
		if (!team.name || !team.logo) {
			return;
		}

		const teamItem = team.website
			? document.createElement("a")
			: document.createElement("div");

		teamItem.className = team.website
			? "home-team-link"
			: "home-team-item";

		if (team.website) {
			teamItem.href = team.website;
			teamItem.target = "_blank";
			teamItem.rel = "noopener noreferrer";
			teamItem.setAttribute(
				"aria-label",
				`Visit ${team.name} website`
			);
		}

		const logo = document.createElement("img");

		logo.className = "home-team-logo";
		logo.src = team.logo;
		logo.alt = `${team.name} logo`;
		logo.loading = "lazy";
		logo.decoding = "async";

		teamItem.appendChild(logo);
		teamsList.appendChild(teamItem);
	});

	if (teamsList.children.length > 0) {
		teamsSection.hidden = false;
	}
}