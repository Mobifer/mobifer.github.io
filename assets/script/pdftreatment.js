async function convertSVGtoPDF(svgId, linkId, legendId) {
	// Récupérer le contenu SVG
	const svgElement = document.getElementById(svgId);
	if (!svgElement) {
		console.error("SVG non trouvé !");
		return;
	}

	const { jsPDF } = window.jspdf;

	// Créer une instance jsPDF
	const pdf = new jsPDF({
		orientation: "portrait",
		unit: "pt",
		format: "a4"
	});

	// Convertir le SVG en PDF
	await pdf.svg(svgElement, { x: 0, y: 0, width: 595.28, height: 841.89 });

	// Générer le fichier PDF en tant que Blob
	const pdfBlob = pdf.output("blob");

	// Créer un lien de téléchargement
	const downloadLink = document.getElementById(linkId);
	if (downloadLink) {
		const pdfUrl = URL.createObjectURL(pdfBlob);
		downloadLink.href = pdfUrl;
		downloadLink.download = "plan_metro.pdf";
	}

	// Calculer la taille du fichier en Ko
	const fileSize = (pdfBlob.size / 1024).toFixed(2); // Convertir en Ko avec 2 décimales

	// Mettre à jour la légende avec la taille
	const legend = document.getElementById(legendId);
	if (legend) {
		legend.textContent = `Télécharger le plan (taille : ${fileSize} Ko)`;
	}
}

// Appeler la fonction lors du chargement de la page
window.onload = () => {
	convertSVGtoPDF("mySvg", "downloadLink", "legend");
};