import Telegraf from 'telegraf';

import IContext from './models/context';
import FloodService from './services/floodService';
import Logger from './services/logger';

import autoreplyFeature from './features/autoreply';
import floodFeature from './features/flood';
import { IRootState } from './models/state';

export default (bot: Telegraf<IContext>, state: IRootState, timeProvider: () => number) => {
	bot.use((ctx, next) => {
		if (ctx.chat) {
			if (!state[ctx.chat.id]) {
				// eslint-disable-next-line no-param-reassign
				state[ctx.chat.id] = {};
			}
			ctx.floodService = new FloodService(state[ctx.chat.id], timeProvider);
		}

		ctx.log = new Logger();
		return next!();
	});

	bot.catch((err: Error) => {
		// tslint:disable-next-line: no-console
		console.log('Ooops', err);
	});

	floodFeature(bot);
	autoreplyFeature(bot);
};
