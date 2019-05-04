const Telegraf = require('telegraf');

const floodFeature = require('./features/flood');

module.exports = () => {
  const bot = new Telegraf(process.env.BOT_TOKEN);

  bot.catch((err) => {
    console.log('Ooops', err);
  });

  bot.start(ctx => ctx.reply('Welcome'));
  bot.help(ctx => ctx.reply('You make me laugh. Go to gulag.'));

  floodFeature(bot);

  bot.hears('OwO', (ctx) => ctx.reply('UwU'));
  bot.hears('shrug', (ctx) => ctx.reply('¯\\_(ツ)_/¯'));

  bot.launch()
    .then(() => {
      console.log('Running');
    }, (err) => {
      console.log(err);
    });
};
