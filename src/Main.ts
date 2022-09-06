import Logger from './Logger.js';
import Server from './Server.js';
import {State} from './enums.js';
import StateManager from './StateManager.js';

export default class Main {
	logger: Logger = new Logger();
	server: Server = new Server(this, {
		[State.NotStarted]: '/reject.html',
		[State.Upload]: '/upload.html',
		[State.Config]: '/config.html',
		[State.ReadyToPrint]: '/ready.html',
		[State.Drawing]: '/drawing.html',
		[State.Error]: '/error.html',
	});
	stateManager: StateManager = new StateManager(this);
}
