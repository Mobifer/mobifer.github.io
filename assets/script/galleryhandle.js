document.addEventListener('DOMContentLoaded', function () {
	const images = document.querySelectorAll('.gallery img');
	images.forEach(img => {
		img.addEventListener('click', () => {
			const modal = document.createElement('div');
			modal.style.position = 'fixed';
			modal.style.top = '0';
			modal.style.left = '0';
			modal.style.width = '100%';
			modal.style.height = '100%';
			modal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
			modal.style.display = 'flex';
			modal.style.justifyContent = 'center';
			modal.style.alignItems = 'center';
			modal.style.zIndex = '1000';

			const modalImg = document.createElement('img');
			modalImg.src = img.src;
			modalImg.style.maxWidth = '90%';
			modalImg.style.maxHeight = '90%';
			modalImg.style.borderRadius = '10px';

			modal.appendChild(modalImg);
			document.body.appendChild(modal);

			modal.addEventListener('click', () => {
				modal.remove();
			});
		});
	});
});