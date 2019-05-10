const FloodService = require('./services/floodService');

const floodFeature = require('./features/flood');
const autoreplyFeature = require('./features/autoreply');

module.exports = (bot, state, timeProvider) => {
  bot.use((ctx, next) => {
    if (!state[ctx.chat.id]) {
      // eslint-disable-next-line no-param-reassign
      state[ctx.chat.id] = {};
    }
    ctx.floodService = FloodService(state[ctx.chat.id], timeProvider);
    return next();
  });

  bot.catch((err) => {
    console.log('Ooops', err);
  });

  floodFeature(bot);
  autoreplyFeature(bot);
};
