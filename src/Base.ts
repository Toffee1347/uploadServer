import Logger from './Logger.js';
import Server from './Server.js';
import {UploadStatus} from './enums.js';

export default class Base {
	logger: Logger = new Logger();
	server: Server = new Server(this, {
		[UploadStatus.Accept]: '/upload.html',
		[UploadStatus.Processing]: '/processing.html',
		[UploadStatus.Drawing]: '/drawing.html',
	});
	currentState: UploadStatus = UploadStatus.Accept;

	public getUploadStatus(): UploadStatus {
		return this.currentState;
	}

	public setState(state: UploadStatus): void {
		this.currentState = state;
	}
}
