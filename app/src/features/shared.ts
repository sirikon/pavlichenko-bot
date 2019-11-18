import IContext from '../models/context';

export async function senderIsAdmin(ctx: IContext): Promise<boolean> {
	if (!ctx.chat) { return false; }
	if (ctx.chat.type === 'private') { return true; }

	const messageSenderId = getMessageSenderId(ctx);
	if (!messageSenderId) { return false; }

	const admins = await ctx.telegram.getChatAdministrators(ctx.chat.id);

	return admins
		.filter((a) => a.user.id === messageSenderId)
		.length > 0;
}

function getMessageSenderId(ctx: IContext): number | null {
	if (!ctx.message) { return null; }
	if (!ctx.message.from) { return null; }
	return ctx.message.from.id;
}
