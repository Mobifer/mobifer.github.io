import { genererLignesHTML } from "./genlineicons.js";

document.addEventListener("DOMContentLoaded", function () {
	const urlParams = new URLSearchParams(window.location.search);
	const stationId = urlParams.get("station");
	console.log(stationId);

	if (!stationId) {
		document.getElementById("station-content").innerHTML = "<h2>Station non trouvée.</h2>";
		return;
	}

	fetch("/data/stations.json")
		.then(response => response.json())
		.then(data => {
			const station = data[stationId];
			// Print station on browser console
			console.log(station);
			if (!station) {
				document.getElementById("station-content").innerHTML = "<h2>Station non trouvée.</h2>";
				return;
			}

			document.title = `${station.nom} - MobiFer`;

			let lignesHTML = genererLignesHTML(station.lignes);

			let html = `
				<p class="centered"><strong>Station</strong><br>
				<span style="font-size: 80px;" class="shadowed">${lignesHTML}</span><br>
				<span class="centered terminus-box">${station.nom}</span>`;

			if (station.pti) {
				html += `<br><span class="ptinteret" style="font-size: 30px;">${station.pti}</span>`;
			}

			if (station.rep) {
				html += `<br><span class="repere" style="font-size: 30px; border: 5px solid black !important; font-weight: bold; border-radius: 5px;">${station.rep}</span>`;
			}

			html += `</p>
				<img src="${station.img}" alt="Photo de la station" style="width: 100%; max-width: 800px; border-radius: 10px;" class="image-center">
				<div class="license">© ${station.imga} sur <a href="${station.imgp}">Wikimedia Commons</a></div>`;
			
			html += `<div class="box image-center">
				<h2 class="centered">Statistiques et données</h2>`;
			
			// Génération des statistiques
			station.stats.forEach(stats => {
				let lignesTable = genererLignesHTML(stats.lignes); // Génération des icônes des lignes

				html += `<table>`;

				// Affichage des lignes si elles existent
				if (stats.lignes) {
					html += `<tr><td class="title">Ligne(s)</td><td style="font-size: 1.4em;">${lignesTable}</td></tr>`;
				}

				// Affichage des autres données de la station
				const donnees = [
					{ label: "Ouverture", valeur: stats.ouv },
					// Add line "Nom inaugural" if the value stats.inaugural != "undefined", otherwise do not add the line
					...(stats.inaug !== undefined ? [{ label: "Nom inaugural", valeur: stats.inaug }] : []),
					{ label: "Voies", valeur: stats.voies },
					{ label: "Quais", valeur: stats.quais },
					{ label: "Zone tarifaire", valeur: stats.zt },
					{ label: "Accessible", valeur: stats.ufr },
					{ label: "Communes desservies", valeur: stats.communes.join(", ") },
					{ label: "Fréquentation", valeur: stats.freq }
				];

				donnees.forEach(row => {
					if (row.valeur) { // Vérifie que la valeur existe
						html += `<tr><td class="title">${row.label}</td><td>${row.valeur}</td></tr>`;
					}
				});

				html += `</table>`;
				// If it is NOT the last iteration, add <br>
				if (station.stats.indexOf(stats) < station.stats.length - 1) {
					html += `<br>`;
				}
			});

			html += `</div>`;

			// Génération des sorties
			html += `<div class="box image-center">
						<h2 class="centered">Accès</h2>
						<div class="centered"><span class="blue-box" style="padding: 10px !important; text-align: left;">`;
			var sortieNum = 0;
			station.sorties.forEach(sortie => {
				sortieNum += 1;
				html += `<span class="num-sortie">${sortie.num}</span>`;
				if (sortie.desc) {
					html += ` ${sortie.desc}`;
					html += `<span style="font-size: 1.25em">`
					if (sortie.acc) {
						html += ` <span class="integrated"><img src="/assets/icons/info.svg"></span> <span class="integrated"><img src="/assets/icons/tickets.svg"></span>`;
					}
					if (sortie.asc) {
						html += ` <span class="integrated"><img src="/assets/icons/ascenseur.svg"></span>`;
					}
					if (sortie.esc) {
						html += ` <span class="integrated"><img src="/assets/icons/escalator.svg"></span>`;
					}
					html += `</span><br>`;
					var hasDescription = "style='margin-top: 5px !important;'";
				}
				else {
					var hasDescription = "";
				}
				if (sortie.rep) {
					html += ` <span class="repere" ${hasDescription}>${sortie.rep}</span>`;
					if (!sortie.desc) {
						html += `<span style="font-size: 1.25em">`
						if (sortie.acc) {
							html += ` <span class="integrated"><img src="/assets/icons/info.svg"></span> <span class="integrated"><img src="/assets/icons/tickets.svg"></span>`;
						}
						if (sortie.asc) {
							html += ` <span class="integrated"><img src="/assets/icons/ascenseur.svg"></span>`;
						}
						if (sortie.esc) {
							html += ` <span class="integrated"><img src="/assets/icons/escalator.svg"></span>`;
						}
						html += `</span>`
					}
					html += `<br>`;
				}
				if (sortie.pti) {
					html += ` <span class="ptinteret" ${hasDescription}>${sortie.pti}</span>`;
					if (!sortie.desc) {
						html += `<span style="font-size: 1.25em">`
						if (sortie.acc) {
							html += ` <span class="integrated"><img src="/assets/icons/info.svg"></span> <span class="integrated"><img src="/assets/icons/tickets.svg"></span>`;
						}
						if (sortie.asc) {
							html += ` <span class="integrated"><img src="/assets/icons/ascenseur.svg"></span>`;
						}
						if (sortie.esc) {
							html += ` <span class="integrated"><img src="/assets/icons/escalator.svg"></span>`;
						}
						html += `</span>`
					}
					html += `<br>`;
				}
				if (sortieNum < station.sorties.length) {
					html += `<br>`
				}
			});
			html += `</span></div>\n`;
			html += `</div>`;

			// Ajout des liens Enrail uniquement pour le métro
			if (station.siv && station.siv.length > 0) {
				html += `<div class="box image-center">`;
				station.siv.forEach(link => {
					if (link.metro) {
						html += `<iframe src="${link.metro}" class="ratp" frameborder="0"></iframe>`;
					}
					if (link.train) {
						html += `<iframe src="${link.train}" class="sncf" frameborder="0" scrolling="no"></iframe>`;
					}
					if (link.tram) {
						html += `<iframe src="/addons/sieltram.html?stop=${link.tram}&line=${link.line}" class="tram"></iframe>`;
					}
				});
				html += `</div>
					<div class="license" style="margin-top: 2px !important; margin-bottom: 8px;">
						Reproduction du visuel officiel, proposée par <a href="https://enrail.org">enrail.org</a> (Métro, RER et Transilien), <a href="https://prochainstrains.arno.cl">Prochains Trains</a> (RER et Transilien) et MobiFer (Tramway)
					</div>`;
			}

			document.getElementById("station-content").innerHTML = html;
		})
		.catch(error => console.error("Erreur de chargement des données:", error));
});