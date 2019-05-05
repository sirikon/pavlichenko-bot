const Telegraf = require('telegraf');

const floodFeature = require('./features/flood');
const autoreplyFeature = require('./features/autoreply');

const persistence = require('./database/persistence')();

module.exports = async () => {
  await persistence.read();

  const bot = new Telegraf(process.env.BOT_TOKEN);

  bot.catch((err) => {
    console.log('Ooops', err);
  });

  bot.start(ctx => ctx.reply('Welcome'));
  bot.help(ctx => ctx.reply('You make me laugh. Go to gulag.'));

  floodFeature(bot);
  autoreplyFeature(bot);

  await bot.launch();
  console.log('Running');

  setInterval(() => {
    persistence.write()
      .then(() => {}, (err) => {
        console.log(err);
      });
  }, 60 * 1000);
};
