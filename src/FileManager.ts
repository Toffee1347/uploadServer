import fs from 'fs';

export default class FileManager {
    public static createDirectoies(folderPath: string): Promise<void> {
        return new Promise((resolve, reject) => {
            fs.mkdir(folderPath, {recursive: true}, (err) => {
                if (err) reject(err);
                resolve();
            });
        });
    }

    public static writeToFile(path: string, data: string, encoding: BufferEncoding = 'utf8'): Promise<void> {
        return new Promise((resolve, reject) => {
			fs.writeFile(path, data, encoding, (err) => {
				if (err) return reject(err);
				resolve();
			});
        });
    }
}
