const printTypeSelect = $('printTypeSelect');
printTypeSelect.addEventListener('input', () => {
    const optionsEl = $(`type${printTypeSelect.value}Options`) || $('typeNoOptions');
	hideAllOptions();
	optionsEl.classList.remove('hidden');
});

function hideAllOptions() {
	document.querySelectorAll('.options-group').forEach((el) => {
		el.classList.add('hidden');
	});
}
