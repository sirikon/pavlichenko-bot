const Telegraf = require('telegraf');

const stateStorage = require('./infrastructure/stateStorage');
const FloodService = require('./services/floodService');

const floodFeature = require('./features/flood');
const autoreplyFeature = require('./features/autoreply');

module.exports = async () => {
  const state = {};
  await stateStorage(state);

  const bot = new Telegraf(process.env.BOT_TOKEN);

  bot.use((ctx, next) => {
    if (!state[ctx.chat.id]) {
      state[ctx.chat.id] = {};
    }
    ctx.floodService = FloodService(state[ctx.chat.id], () => new Date().getTime());
    return next();
  });

  bot.catch((err) => {
    console.log('Ooops', err);
  });

  bot.start(ctx => ctx.reply('Welcome'));
  bot.help(ctx => ctx.reply('You make me laugh. Go to gulag.'));

  floodFeature(bot);
  autoreplyFeature(bot);

  await bot.launch();
  console.log('Running');
};
