// This file manages the base connection between scripts, and allows the state between all systems to stay consistent

import {State, stateStrings} from './enums.js';

import type Main from './Main.js';

export default class StateManager {
	main: Main;
	state: State = State.Setup;

	constructor(main: Main) {
		this.main = main;

		// Check if we are running on a system that will allow programs to comunicate
		// If we aren't, we should use command line arguments to pick what state to start in
		if (!process.getuid) {
			this.main.logger.warn('No process ID found, not connecting to other processes');
			this.state = undefined;
			const stateArgs: {
				[arg: string]: State,
			} = {
				'-n': State.NotStarted,
				'-s': State.Setup,
				'-i': State.ImageSetup,
				'-r': State.ReadyToPrint,
				'-d': State.Drawing,
				'-e': State.Error,
			};

			const argKeys = Object.keys(stateArgs);
			argKeys.forEach((arg) => {
				if (!process.argv.includes(arg)) return;
				const state = stateArgs[arg];
				this.main.logger.info(`Argument ${arg} detected, starting in ${stateStrings[state]} mode`);
				this.state = state;
			});
		}
	}

	getState(): State {
		return this.state;
	}

	setState(state: State) {
		this.state = state;
	}
}
