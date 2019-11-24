import Telegraf, { Extra } from 'telegraf';

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

		if (ctx.message.text.toLowerCase() === 'gracias pav') {
			ctx.reply('A mandar, Товарищ 😉');
		} else {
			next!();
		}
	});

	bot.on('message', (ctx, next) => {
		if (messageSenderIsFlooder(ctx)) { return next!(); }
		if (!ctx.message) { return next!(); }
		if (!ctx.message.text) { return next!(); }

		if (ctx.message.text.toLowerCase() === 'basta!') {
			ctx.reply(randomTableFlip());
		} else {
			next!();
		}
	});

	bot.on('message', (ctx, next) => {
		if (messageSenderIsFlooder(ctx)) { return next!(); }
		if (!ctx.message) { return next!(); }
		if (!ctx.message.text) { return next!(); }

		if (findBroKeywords(ctx.message.text)) {
			ctx.reply('di que si, bro');
		} else {
			next!();
		}
	});

	bot.help(async (ctx, next) => {
		if (!await senderIsAdmin(ctx)) { return next!(); }
		ctx.replyWithMarkdown([
			'Saludos Товарищ. Soy *Pavlichenko* y aceptaré las siguientes órdenes:',
			'',
			'*Flooders*',
			'/flood -> Responde con esto un mensaje, y marcaré como flooder a quien lo envió.',
			'/unflood -> Igual, pero para sacar del listado de flooders.',
			'/flood\\_status -> Un resumen del listado de flooders.',
			'',
			'*Configuración*',
			'/config\\_flood\\_limit -> Obtener el límite de mensajes actual para flooders.',
			'/config\\_flood\\_limit <número> -> Actualizar el límite de mensajes actual para flooders.',
		].join('\n'));
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
			'ノ┬─┬ノ ︵ ( \\o°o)\\',
		];
		const index = Math.round(Math.random() * (tableFlips.length - 1));
		return tableFlips[index];
	}

	function findBroKeywords(text: string) {
		let found = false;
		const broKeywords = [
			'imperio',
			'guateque',
			'4latas',
			'4 latas',
			'rulillas',
		];
		broKeywords.forEach((keyword) => {
			if (text.toLowerCase().indexOf(keyword) >= 0) {
				found = true;
			}
		});
		return found;
	}

};
