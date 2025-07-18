currentURL = window.location.href;
currentLine = currentURL.substring(currentURL.lastIndexOf('/') + 1).replace(".html", "");

fetch(`https://apitrafic.share.zrok.io/trafic/${currentLine}`, {
	headers: {
		'skip_zrok_interstitial': '0'
	}
})
.then(response => response.json())
.then(data => {
	const infoDiv = document.getElementById('infotrafic');
	infoDiv.innerHTML = '';
	const results = data.disruptions;
	let resultCount = 0;
	if (results && results.length > 0) {
		const newResults = [];
		results.forEach(element => {
			if (element.status === "active") {
				newResults.unshift(element);
			}
			else if (element.status === "future") {
				newResults.push(element);
			}
		})
		newResults.forEach((element, index) => {
			if (Array.isArray(element.tags) && element.tags.includes('Actualité')) {
				resultCount++;
				let messages = element.messages;
				let titre = '';
				let contenu = '';
				messages.forEach(message => {
					if (message.channel.name === "titre") {
						titre = message.text;
					}
					if (message.channel.name === "moteur") {
						contenu = message.text;	
					}
				});
				if (titre && contenu) {
					if (element.cause === "travaux") {
						if (element.status === "active") {
							infoDiv.innerHTML += `<h3><span class="integrated perturbation"><img src="/assets/icons/Perturbation_travaux_couleur_RVB.svg" alt="Travaux"></span> ${titre}</h3><br>${contenu}`;
						}
						else {
							infoDiv.innerHTML += `<h3><span class="integrated"><img src="/assets/icons/Perturbation_travaux_NB_RVB.svg" alt="Travaux"></span> ${titre}</h3><br>${contenu}`;
						}
					}
					else if (element.cause === "perturbation") {
						if (element.status === "active") {
							infoDiv.innerHTML += `<h3><span class="integrated perturbation"><img src="/assets/icons/Perturbation_trafic_couleur_RVB.svg" alt="Perturbation"></span> ${titre}</h3><br>${contenu}`;
						}
						else {
							infoDiv.innerHTML += `<h3><span class="integrated"><img src="/assets/icons/Perturbation_trafic_NB_RVB.svg" alt="Perturbation"></span> ${titre}</h3><br>${contenu}`;
						}
					}
					if (!(index === newResults.length - 1)) {
						infoDiv.innerHTML += '<hr>';
					}
				}
			}
		});
	}
	if (resultCount === 0) {
		infoDiv.innerHTML += '<p><span class="integrated"><img src="/assets/icons/Trafic_normal_RVB.svg" alt="Trafic normal"></span> Aucune perturbation sur votre ligne !</p>';
	}
})