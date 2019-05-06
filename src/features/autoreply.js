const shared = require('./shared');

module.exports = (bot) => {
  bot.hears('OwO', async (ctx) => {
    if (!await shared.senderIsAdmin(ctx)) return;
    ctx.reply('UwU');
  });

  bot.hears('shrug', async (ctx) => {
    if (!await shared.senderIsAdmin(ctx)) return;
    ctx.reply('¯\\_(ツ)_/¯');
  });

  bot.hears(['Gora la URSS', 'gora la URSS', 'gora la urss', 'Gora la urss'], async (ctx) => {
    if (!await shared.senderIsAdmin(ctx)) return;
    ctx.reply('https://www.youtube.com/watch?v=U06jlgpMtQs');
  });

  bot.help(async (ctx) => {
    const userId = ctx.message.from.id;
    if (ctx.floodService.isUserFlooder(userId)) return;
    ctx.reply('You make me laugh. Go to gulag.');
  });
};
