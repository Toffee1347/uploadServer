import chalk from 'chalk';

import type {ChalkInstance} from 'chalk';

export default class Logger {
	private getTimestamp(): string {
		const date = new Date();
		return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
	}

	private log(message: string, level: string, colorFunc: ChalkInstance): void {
		console.log(`[${colorFunc(level)}][${chalk.yellow(this.getTimestamp())}] ${message}`);
	}

	public info(message: string): void {
		this.log(message, 'info', chalk.blue);
	}

	public warn(message: string): void {
		this.log(message, 'warn', chalk.rgb(189, 183, 107));
	}

	public error(message: string, error?: Error): void {
		this.log(error ? `${message}\n${error}` : message, 'error', chalk.red);
	}
}
