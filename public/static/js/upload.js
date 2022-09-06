$('fileUpload').addEventListener('input', () => {
	$('hiddenFileInput').value = undefined;

	const file = $('fileUpload').files[0];
	if (file.size > 2147483648) {
		$('noImageText').innerText = 'Please upload a file below 2GB';
		$('noImageText').classList.remove('hidden');
		$('previewImage').classList.add('hidden');
		return;
	}

	$('noImageText').classList.add('hidden');
	$('previewImage').classList.add('hidden');
	$('loadingImage').classList.remove('hidden');

	// Get the files base64 url so we can display a preview
	const reader = new FileReader();
	reader.readAsDataURL(file);
	reader.onload = async () => {
		const image = await createImage(reader.result);
		const url = changeImageType(image, 'image/png');

		$('hiddenFileInput').value = url;
		$('previewImage').src = url;

		$('loadingImage').classList.add('hidden');
		$('previewImage').classList.remove('hidden');
		$('uploadFileButton').classList.remove('hidden');
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

async function uploadImage() {
	const image = $('hiddenFileInput').value;
	if (!image) return;

	await fetch('/api/upload', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({image})
	});

	window.location.reload();
}
