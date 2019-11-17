import Telegraf from 'telegraf';

const stateStorage = require('./infrastructure/stateStorage');
const app = require('./app');

async function main() {
  const state = {};
  const bot = new Telegraf(process.env.BOT_TOKEN);
  await stateStorage(state);
  app(bot, state, () => new Date().getTime());
  await bot.launch();
}

main().then(() => {}, err => console.log(err));
