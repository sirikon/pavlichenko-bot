module.exports = (bot, floodService) => {
  const userMention = user => user.first_name || user.username || user.id;

  async function senderIsAdmin(ctx) {
    const admins = await ctx.telegram.getChatAdministrators(ctx.chat.id);
    return admins
      .filter(a => a.user.id === ctx.message.from.id)
      .length > 0;
  }

  function getRepliedUser(ctx) {
    if (!ctx.message.reply_to_message) return null;
    return ctx.message.reply_to_message.from;
  }

  async function floodCommandHandler(ctx) {
    if (!await senderIsAdmin(ctx)) return;

    const repliedUser = getRepliedUser(ctx);
    if (!repliedUser) return;

    floodService.flagUserAsFlooder(repliedUser.id, true);
    ctx.reply(`${userMention(repliedUser)}, se te ha enviado al Gulag por incumplimiento de las normas sobre el abuso de flood. Tienes restrigidos tus mensajes a 50 diarios. Úsalos bien.`);
  }

  async function unfloodCommandHandler(ctx) {
    if (!await senderIsAdmin(ctx)) return;

    const repliedUser = getRepliedUser(ctx);
    if (!repliedUser) return;

    floodService.flagUserAsFlooder(repliedUser.id, false);
    ctx.reply(`${userMention(repliedUser)}, enhorabuena, saliste del gulag.`);
  }

  async function messageHandler(ctx, next) {
    if (ctx.message.from.is_bot) return next(ctx);
    const userId = ctx.message.from.id;
    if (!floodService.isUserFlooder(userId)) return next(ctx);
    if (floodService.addMessageAndCheck(userId)) return next(ctx);
    return ctx.telegram.deleteMessage(ctx.chat.id, ctx.message.message_id);
  }

  bot.command('flood', floodCommandHandler);
  bot.command('unflood', unfloodCommandHandler);
  bot.on('message', messageHandler);
};
