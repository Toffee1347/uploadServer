import express from 'express';
import http from 'http';
import path from 'path';

import type {Express} from 'express';
import type {Server as HttpServer} from 'http';
import type Base from './base.js';
import type {UploadStatusMapping} from './types.d.js';

function getPath(url: string): string {
	return path.join(process.cwd(), url);
}

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
		// Silently redirect the root to the relevent page for the current status
		this.app.use('/', (req, res, next) => {
			const uploadState = this.base.getUploadStatus();
			if (this.uploadStatusMapping[uploadState]) {
				req.url = this.uploadStatusMapping[uploadState];
			}
			next();
		});
		this.app.use(
			Object.values(this.uploadStatusMapping),
			express.static(getPath('public')),
		);
	}

	startServer(): void {
		this.server.listen(process.env.PORT || 80, () => {
			this.base.logger.info(`Server started on port ${process.env.PORT || 80}`);
		});
	}
}
