const Telegraf = require('telegraf');

const floodFeature = require('./features/flood');
const autoreplyFeature = require('./features/autoreply');

module.exports = () => {
  const bot = new Telegraf(process.env.BOT_TOKEN);

  bot.catch((err) => {
    console.log('Ooops', err);
  });

  bot.start(ctx => ctx.reply('Welcome'));
  bot.help(ctx => ctx.reply('You make me laugh. Go to gulag.'));

  floodFeature(bot);
  autoreplyFeature(bot);

  bot.launch()
    .then(() => {
      console.log('Running');
    }, (err) => {
      console.log(err);
    });
};
