import Telegraf from 'telegraf';

import IContext from '../models/context';
import { senderIsAdmin } from './shared';

export default (bot: Telegraf<IContext>) => {

	bot.hears('OwO', async (ctx, next) => {
		if (!await senderIsAdmin(ctx)) { return next!(); }
		ctx.reply('UwU');
	});

	bot.hears('shrug', async (ctx, next) => {
		if (!await senderIsAdmin(ctx)) { return next!(); }
		ctx.reply('¯\\_(ツ)_/¯');
	});

	bot.hears(['Gora la URSS', 'gora la URSS', 'gora la urss', 'Gora la urss'], async (ctx, next) => {
		if (!await senderIsAdmin(ctx)) { return next!(); }
		ctx.reply('https://www.youtube.com/watch?v=U06jlgpMtQs');
	});

	bot.on('message', (ctx, next) => {
		if (messageSenderIsFlooder(ctx)) { return next!(); }
		if (!ctx.message) { return next!(); }
		if (!ctx.message.text) { return next!(); }

		if (ctx.message.text.toLowerCase() === 'basta!') {
			ctx.reply(randomTableFlip());
		}
	})

	bot.help(async (ctx, next) => {
		if (messageSenderIsFlooder(ctx)) { return next!(); }
		ctx.reply('You make me laugh. Go to gulag.');
	});

	function messageSenderIsFlooder(ctx: IContext) {
		if (!ctx.message) { return false; }
		if (!ctx.message.from) { return false; }

		const userId = ctx.message.from.id;
		return ctx.floodService.isUserFlooder(userId);
	}

	function randomTableFlip(): string {
		const tableFlips = [
			'(╯°д°）╯︵/(.□ . \\)',
			'┻━┻ ︵ヽ(`Д´)ﾉ︵ ┻━┻',
			'(ノ°Д°）ノ︵ ┻━┻',
			'┻━┻ ︵ ლ(⌒-⌒ლ)',
			'ノ┬─┬ノ ︵ ( \\o°o)\\'
		];
		const index = Math.round(Math.random() * (tableFlips.length - 1));
		return tableFlips[index];
	}

};
