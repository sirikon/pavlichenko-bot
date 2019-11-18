import fs from 'fs';
import path from 'path';
import { IRootState } from '../models/state';

export default async (state: IRootState) => {
	function setState(newState: IRootState) {
		Object.keys(newState)
			.forEach((key) => {
				const userId = parseInt(key, 10);
				state[userId] = newState[userId];
			});
	}

	function write() {
		return new Promise((resolve, reject) => {
			fs.writeFile(getPersistencePath(), JSON.stringify(state, null, 2), { encoding: 'utf8' }, (err) => {
				if (err) { return reject(err); }
				return resolve();
			});
		});
	}

	function read() {
		return new Promise((resolve, reject) => {
			if (!fs.existsSync(getPersistencePath())) { return resolve(); }
			return fs.readFile(getPersistencePath(), { encoding: 'utf8' }, (err, rawData) => {
				if (err) { return reject(err); }
				const data = JSON.parse(rawData);
				setState(data);
				return resolve();
			});
		});
	}

	setInterval(() => {
		write()
			// tslint:disable-next-line: no-console
			.then(() => { /**/ }, (err) => console.log(err));
	}, 1 * 60 * 1000 /* One minute */);

	await read();
};

function getPersistencePath() {
	return path.join(getDataFolder(), 'data.json');
}

function getDataFolder() {
	const dataFolder = process.env.DATA_FOLDER;
	if (!dataFolder) { throw new Error('DATA_FOLDER is required.'); }
	return dataFolder;
}
