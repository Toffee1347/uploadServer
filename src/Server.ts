import express from 'express';
import http from 'http';
import path from 'path';
import fs from 'fs';

import {UploadStatus} from './enums.js';

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
	uploadImgPath: string;
	uploadImgFile: string;

	constructor(base: Base, uploadStatusMapping: UploadStatusMapping) {
		this.uploadStatusMapping = uploadStatusMapping;
		this.base = base;

		this.base.logger.info('Initializing server...');
		if (!process.env.UPLOAD_IMAGE_PATH) {
			this.base.logger.warn('UPLOAD_IMAGE_PATH not set, using .cache in current directory instead');
		}
		this.uploadImgPath = getPath(process.env.UPLOAD_IMAGE_PATH || '.cache');
		this.uploadImgFile = `${this.uploadImgPath}/upload.png`;

		this.app = express();
		this.server = http.createServer(this.app);
		this.setUpRoutes();
		this.startServer();
	}

	setUpRoutes(): void {
		// Don't allow the user to access files that require certain states
		this.app.get(Object.values(this.uploadStatusMapping), (req, res) => {
			res.redirect(302, '/');
		});

		// Silently redirect the root to the relevent page for the current status
		this.app.get('/', (req, res, next) => {
			const uploadState = this.base.getUploadStatus();
			if (this.uploadStatusMapping[uploadState]) {
				req.url = this.uploadStatusMapping[uploadState];
			}
			next();
		});

		// Listen for file uploads
		this.app.use(express.urlencoded({extended: true}));
		this.app.post('/api/upload', (req, res) => {
			const uploadState = this.base.getUploadStatus();
			if (uploadState !== UploadStatus.Accept) return res.sendStatus(403);

			if (!req.body?.image) return res.sendStatus(400);
			if (!req.body.image.startsWith('data:image/png;base64,')) return res.sendStatus(400);

			this.base.setState(UploadStatus.Processing);

			res.redirect('/');
		});

		// Serve the uploaded image when requested
		this.app.get('/api/uploaded', (req, res) => {
			if (this.base.getUploadStatus() === UploadStatus.Accept) return res.sendStatus(403);
			res.sendFile(this.uploadImgFile);
		});

		// Make the public file accessible from a GET request
		this.app.use(express.static(getPath('public')));
	}

	startServer(): void {
		this.server.listen(process.env.PORT || 80, () => {
			this.base.logger.info(`Server started on port ${process.env.PORT || 80}`);
		});
	}
}
