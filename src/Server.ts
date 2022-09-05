import express from 'express';
import http from 'http';

import type {Express} from 'express';
import type {Server as HttpServer} from 'http';
import type Base from './base.js';
import type {UploadStatusMapping} from './types.d.js';

export default class Server {
	app: Express;
	base: Base;
	server: HttpServer;
	uploadStatusMapping: UploadStatusMapping;

	constructor(base: Base, uploadStatusMapping: UploadStatusMapping) {
		this.uploadStatusMapping = uploadStatusMapping;
		this.base = base;
		this.base.logger.info('Initializing server...');
		this.app = express();
		this.server = http.createServer(this.app);
		this.setUpRoutes();
		this.startServer();
	}

	setUpRoutes(): void {
		this.app.get('/', (req, res) => {
			const uploadState = this.base.getUploadStatus();

			if (this.uploadStatusMapping[uploadState]) {
				res.redirect(this.uploadStatusMapping[uploadState]);
			}
		});
	}

	startServer(): void {
		this.server.listen(process.env.PORT || 80, () => {
			this.base.logger.info(`Server started on port ${process.env.PORT || 80}`);
		});
	}
}
