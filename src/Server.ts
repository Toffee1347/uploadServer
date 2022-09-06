import express from 'express';
import http from 'http';
import path from 'path';

import {State} from './enums.js';
import FileManager from './FileManager.js';

import type {Express} from 'express';
import type {Server as HttpServer} from 'http';
import type Main from './Main.js';
import type {UploadStatusMapping} from './types.d.js';

function getPath(url: string): string {
	return path.join(process.cwd(), url);
}

export default class Server {
	app: Express;
	main: Main;
	server: HttpServer;
	uploadStatusMapping: UploadStatusMapping;
	uploadImgPath: string;
	uploadImgFile: string;

	constructor(main: Main, uploadStatusMapping: UploadStatusMapping) {
		this.uploadStatusMapping = uploadStatusMapping;
		this.main = main;

		this.main.logger.info('Initializing server...');
		if (!process.env.UPLOAD_IMAGE_PATH) {
			this.main.logger.warn('UPLOAD_IMAGE_PATH not set, using .cache in current directory instead');
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
			const state = this.main.stateManager.getState();
			if (this.uploadStatusMapping[state]) {
				req.url = this.uploadStatusMapping[state];
			}
			next();
		});

		// Listen for file uploads
		this.app.use(express.json({limit: '2gb'}));
		this.app.post('/api/upload', async (req, res) => {
			const systemState = this.main.stateManager.getState();
			if (systemState !== State.Upload) return res.sendStatus(403);

			if (!req.body?.image) return res.sendStatus(400);
			if (!req.body.image.startsWith('data:image/png;base64,')) return res.sendStatus(400);
			const rawBase64 = req.body.image.replace(/^data:image\/png;base64,/, '');

			try {
				// Create the directories if needed
				await FileManager.createDirectoies(this.uploadImgPath);
				await FileManager.writeToFile(this.uploadImgFile, rawBase64, 'base64');

				this.main.logger.info('Image sucesfully uploaded');

				this.main.stateManager.setState(State.Config);
				res.redirect('/');
			} catch (err) {
				this.main.logger.error('Failed to save image', err);
				res.sendStatus(500);
			}
		});

		// Serve the uploaded image when requested
		this.app.get('/api/uploaded', (req, res) => {
			if (this.main.stateManager.getState() === State.Upload) return res.sendStatus(403);
			res.sendFile(this.uploadImgFile);
		});

		// Make the public file accessible from a GET request
		this.app.use(express.static(getPath('public')));
	}

	startServer(): void {
		this.server.listen(process.env.PORT || 80, () => {
			this.main.logger.info(`Server started on port ${process.env.PORT || 80}`);
		});
	}
}
