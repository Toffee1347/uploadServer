export enum State {
	NotStarted,
	Setup,
	ImageSetup,
	ReadyToPrint,
	Drawing,
	Error,
}

export const stateStrings = [
	'Not Started',
	'Setup',
	'Image Setup',
	'Drawing',
	'Ready To Print',
	'Error',
];
