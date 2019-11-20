import Telegraf from 'telegraf';

import IContext from './models/context';
import FloodService from './services/floodService';
import Logger from './services/logger';

import autoreplyFeature from './features/autoreply';
import floodFeature from './features/flood';
import { IRootState } from './models/state';

export default (bot: Telegraf<IContext>, state: IRootState, timeProvider: () => number) => {

	const logger = new Logger();

	bot.use((ctx, next) => {
		if (ctx.chat) {
			if (!state[ctx.chat.id]) {
				state[ctx.chat.id] = {};
			}
			ctx.floodService = new FloodService(state[ctx.chat.id], timeProvider);
		}

		ctx.log = logger;
		return next!();
	});

	bot.catch((err: Error) => {
		logger.error('Unexpected error', {
			err,
		});
	});

	floodFeature(bot);
	autoreplyFeature(bot);

};
