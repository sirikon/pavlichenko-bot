const floodDatabase = require('../database/flood')(() => new Date().getTime(), {
  limit: 10,
  window: 1 * 60 * 1000,
});

const configDatabase = require('../database/config')();

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
  configDatabase.floodControlUser(repliedUser.id, true);
  ctx.reply(`${(repliedUser.first_name || repliedUser.username || repliedUser.id)}, se te ha enviado al Gulag por incumplimiento de las normas sobre el abuso de flood. Tienes restrigidos tus mensajes a 50 diarios. Úsalos bien.`);
}

async function unfloodCommandHandler(ctx) {
  if (!await senderIsAdmin(ctx)) return;
  const repliedUser = getRepliedUser(ctx);
  if (!repliedUser) return;
  configDatabase.floodControlUser(repliedUser.id, false);
  ctx.reply(`${(repliedUser.first_name || repliedUser.username || repliedUser.id)}, enhorabuena, saliste del gulag.`);
}

async function messageHandler(ctx, next) {
  if (ctx.message.from.is_bot) return next(ctx);
  const userId = ctx.message.from.id;
  if (!configDatabase.isUserInFloodControl(userId)) return next(ctx);
  if (floodDatabase.addMessageAndCheck(userId)) return next(ctx);
  return ctx.telegram.deleteMessage(ctx.chat.id, ctx.message.message_id);
}

module.exports = (bot) => {
  bot.command('flood', floodCommandHandler);
  bot.command('unflood', unfloodCommandHandler);
  bot.on('message', messageHandler);
};
