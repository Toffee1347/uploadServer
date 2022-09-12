function createOptionSelector(parentEl) {
	const select = parentEl.querySelector('select');
	
	select.addEventListener('input', () => processOptionSelection(parentEl));
	processOptionSelection(parentEl);

	return generateOptionSelectorFetcher(parentEl);
}

function generateOptionSelectorFetcher(parentEl) {
	const select = parentEl.querySelector('select');
	const optionsGroup = parentEl.querySelector(`#${select.value}Options`);

	return () => {
		// If there aren't any options for the selected value, return an empty object
		if (!optionsGroup) return {};

		const outputData = {};

		const inputs = parentEl.querySelectorAll('input');
		inputs.forEach((input) => {
			if (!input.name) return;
			outputData[input.name] = input.value;
		});

		return outputData;
	};
}

function processOptionSelection(parentEl) {
	const select = parentEl.querySelector('select');
	const optionsEl = parentEl.querySelector(`#${select.value}Options`) || parentEl.querySelector('#typeNoOptions');

	if (!optionsEl) return;

	parentEl.querySelectorAll('.options-group').forEach((el) => {
		el.classList.add('hidden');
	});

	optionsEl.classList.remove('hidden');
}
