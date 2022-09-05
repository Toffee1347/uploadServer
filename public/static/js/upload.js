$('fileUpload').addEventListener('input', () => {
	$('noImageText').classList.add('hidden');
	$('loadingImage').classList.remove('hidden');

	// Get the files base64 url so we can display a preview
	const file = $('fileUpload').files[0];
	const reader = new FileReader();
	reader.readAsDataURL(file);
	reader.onload = async () => {
		const image = await createImage(reader.result);
		const url = changeImageType(image, 'image/png');

		$('hiddenFileInput').setAttribute('value', url);
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
