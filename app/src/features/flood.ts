import Telegraf from 'telegraf';
import { User } from 'telegram-typings';

import IContext from '../models/context';
import { senderIsAdmin } from './shared';

export default (bot: Telegraf<IContext>) => {

	async function messageHandler(ctx: IContext, next?: () => any) {
		if (!ctx.message) { return next!(); }
		if (!ctx.message.from) { return next!(); }
		if (ctx.message.from.is_bot) { return next!(); }

		const userId = ctx.message.from.id;
		if (!ctx.floodService.isUserFlooder(userId)) { return next!(); }

		if (ctx.floodService.addMessageAndCheck(userId)) { return next!(); }

		if (!ctx.chat) { return next!(); }
		return ctx.telegram.deleteMessage(ctx.chat.id, ctx.message.message_id);
	}

	async function floodCommandHandler(ctx: IContext) {
		if (!await senderIsAdmin(ctx)) { return; }

		const repliedUser = getRepliedUser(ctx);
		if (!repliedUser) { return; }

		ctx.floodService.flagUserAsFlooder(repliedUser.id, true);
		ctx.reply(`${userMention(repliedUser)}, se te ha enviado al Gulag por incumplimiento de las normas sobre el abuso de flood. Tienes restrigidos tus mensajes a ${ctx.floodService.getMessageLimit()} diarios. Úsalos bien.`);
	}

	async function unfloodCommandHandler(ctx: IContext) {
		if (!await senderIsAdmin(ctx)) { return; }

		const repliedUser = getRepliedUser(ctx);
		if (!repliedUser) { return; }

		ctx.floodService.flagUserAsFlooder(repliedUser.id, false);
		ctx.reply(`${userMention(repliedUser)}, enhorabuena, saliste del gulag.`);
	}

	async function floodStatusCommandHandler(ctx: IContext) {
		if (!await senderIsAdmin(ctx)) { return; }
		const status = ctx.floodService.getStatus();
		if (Object.keys(status).length === 0) {
			ctx.reply('El gulag está vacío :(');
			return;
		}
		const userPromises: Array<Promise<User | null>> = [];
		Object.keys(status).forEach((userId) => {
			userPromises.push(getChatMember(ctx, parseInt(userId, 10)));
		});
		const userResults = await Promise.all(userPromises);
		const text: string[] = [];
		userResults.forEach((user) => {
			if (!user) { return; }
			text.push(`${userMention(user)}: ${status[user.id]}`);
		});
		ctx.reply(text.join('\n'));
	}

	async function configFloodLimitCommandHandler(ctx: IContext, next?: () => any) {
		if (!await senderIsAdmin(ctx)) { return next!(); }
		const param = getParameterAfterCommand(ctx);

		if (!param) {
			ctx.reply(`El límite de mensajes actual es ${ctx.floodService.getMessageLimit()}.`);
			return next!();
		}

		if (!/^[0-9]+$/.test(param)) {
			ctx.reply(`El parámetro "${param}" no es válido.`);
			return next!();
		}

		const newLimit = parseInt(param, 10);
		ctx.floodService.setMessageLimit(newLimit);
		ctx.reply(`El nuevo límite de mensajes es ${newLimit}.`);
	}

	bot.on('message', messageHandler);
	bot.command('flood', floodCommandHandler);
	bot.command('unflood', unfloodCommandHandler);
	bot.command('flood_status', floodStatusCommandHandler);
	bot.command('config_flood_limit', configFloodLimitCommandHandler);

	const userMention = (user: User) => user.first_name || user.username || user.id;

	function getRepliedUser(ctx: IContext): User | null {
		if (!ctx.message) { return null; }
		if (!ctx.message.reply_to_message) { return null; }
		return ctx.message.reply_to_message.from || null;
	}

	async function getChatMember(ctx: IContext, userId: number): Promise<User | null> {
		if (!ctx.chat) { return null; }
		try {
			return (await ctx.telegram.getChatMember(ctx.chat.id, userId)).user;
		} catch (err) {
			ctx.log.warn('Error while getting chat member', {
				errorMessage: err.message,
				userId,
			});
			return { id: userId, first_name: userId.toString(), is_bot: false };
		}
	}

	function getParameterAfterCommand(ctx: IContext): string | null {
		if (!ctx.message) { return null; }
		if (!ctx.message.entities) { return null; }

		const commands = ctx.message.entities.filter((e) => e.type === 'bot_command');
		if (commands.length === 0) { return null; }

		const firstCommand = commands[0];

		return ctx.message.text!
			.substr(firstCommand.offset + firstCommand.length)
			.trim()
			.split(' ')[0];
	}

};
