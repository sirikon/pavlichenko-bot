import Telegraf from 'telegraf';

import stateStorage from './infrastructure/stateStorage';

import app from './app';
import IContext from './models/context';

async function main() {
	const state = {};
	const bot = new Telegraf<IContext>(getBotToken());
	await stateStorage(state);
	app(bot, state, () => new Date().getTime());
	await bot.launch();
}

function getBotToken(): string {
	const botToken = process.env.BOT_TOKEN;
	if (!botToken) {
		throw new Error('Environment variable BOT_TOKEN is required.');
	}
	return botToken;
}

// tslint:disable-next-line: no-console
main().then(() => { /**/ }, (err) => console.log(err));
