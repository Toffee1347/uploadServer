import Logger from './Logger.js';
import Server from './Server.js';
import {UploadStatus} from './enums.js';

export default class Base {
	logger: Logger = new Logger();
	server: Server = new Server(this, {
		[UploadStatus.Accept]: '/upload.html',
		[UploadStatus.Reject]: '/reject.html',
		[UploadStatus.Processing]: '/processing.html',
	});

	public getUploadStatus(): UploadStatus {
		return UploadStatus.Accept;
	}
}
