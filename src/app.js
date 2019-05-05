const Telegraf = require('telegraf');

const stateStorage = require('./infrastructure/stateStorage');
const FloodService = require('./services/floodService');

const floodFeature = require('./features/flood');
const autoreplyFeature = require('./features/autoreply');

module.exports = async () => {
  const state = {};
  await stateStorage(state);
  const floodService = FloodService(state, () => new Date().getTime());

  const bot = new Telegraf(process.env.BOT_TOKEN);

  bot.catch((err) => {
    console.log('Ooops', err);
  });

  bot.start(ctx => ctx.reply('Welcome'));
  bot.help(ctx => ctx.reply('You make me laugh. Go to gulag.'));

  floodFeature(bot, floodService);
  autoreplyFeature(bot);

  await bot.launch();
  console.log('Running');
};
