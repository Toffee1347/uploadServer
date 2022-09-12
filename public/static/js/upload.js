if (currentState === State.Setup) {
	$('fileUpload').addEventListener('input', () => {
		const file = $('fileUpload').files[0];
		if (file.size > 2147483648) {
			$('warningText').innerText = 'Please upload a file below 2GB';
			$('warningText').classList.remove('hidden');
			return;
		}

		$('warningText').classList.add('hidden');
		$('loadingImage').classList.remove('hidden');

		// Get the files base64 url
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = async () => {
			const image = await createImage(reader.result);
			const url = changeImageType(image, 'image/png');

			uploadImage(url);
		};
	});

	function createImage(src) {
		return new Promise((res) => {
			const img = new Image();
			img.onload = () => res(img);
			img.src = src;
		});
	}

	function changeImageType(image, type) {
		const canvas = document.createElement('canvas');
		canvas.width = image.width;
		canvas.height = image.height;
		canvas.getContext('2d').drawImage(image, 0, 0);

		return canvas.toDataURL(type);
	}

	async function uploadImage(image) {
		await fetch('/api/upload', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({image})
		});

		window.location.reload();
	}
} else {
	// An image has been uploaded
	$('previewImage').classList.remove('hidden');
	$('uploadButton').classList.add('hidden');
	$('typeSelect').setAttribute('disabled', true);
}
