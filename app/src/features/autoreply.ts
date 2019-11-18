import Telegraf from 'telegraf';

import IContext from '../models/context';
import { senderIsAdmin } from './shared';

export default (bot: Telegraf<IContext>) => {

	bot.hears('OwO', async (ctx) => {
		if (!await senderIsAdmin(ctx)) { return; }
		ctx.reply('UwU');
	});

	bot.hears('shrug', async (ctx) => {
		if (!await senderIsAdmin(ctx)) { return; }
		ctx.reply('¯\\_(ツ)_/¯');
	});

	bot.hears(['Gora la URSS', 'gora la URSS', 'gora la urss', 'Gora la urss'], async (ctx) => {
		if (!await senderIsAdmin(ctx)) { return; }
		ctx.reply('https://www.youtube.com/watch?v=U06jlgpMtQs');
	});

	bot.help(async (ctx) => {
		if (!ctx.message) { return; }
		if (!ctx.message.from) { return; }

		const userId = ctx.message.from.id;
		if (ctx.floodService.isUserFlooder(userId)) { return; }
		ctx.reply('You make me laugh. Go to gulag.');
	});

};
