/* eslint-disable no-use-before-define */
const { expect } = require('chai');
const sinon = require('sinon');
const Telegraf = require('telegraf');

const app = require('../src/app');
const messageBuilder = require('./utils/messageBuilder');

describe('Flood Feature', () => {
  it('should be able to flag a user as a flooder', async () => {
    const state = {};

    await sendMessage(state, messageBuilder()
      .from(1)
      .replyToUser(10)
      .command('/flood')
      .group('chat1')
      .build());

    expect(state.chat1.flood).to.deep.equal({
      config: {
        limit: 10,
        window: 60000,
      },
      messageStacks: {},
      users: [
        10,
      ],
    });
  });

  it('should be able to un-flag a user as a flooder', async () => {
    const state = {};

    await sendMessage(state, messageBuilder()
      .from(1)
      .replyToUser(10)
      .command('/unflood')
      .group('chat1')
      .build());

    expect(state.chat1.flood).to.deep.equal({
      config: {
        limit: 10,
        window: 60000,
      },
      messageStacks: {},
      users: [],
    });
  });

  it('should store a flooders message when sended', async () => {
    const state = {};

    await sendMessage(state, messageBuilder()
      .from(1)
      .replyToUser(10)
      .command('/flood')
      .group('chat1')
      .build());

    await sendMessage(state, messageBuilder()
      .from(10)
      .text('Hey')
      .group('chat1')
      .build());

    expect(state.chat1.flood).to.deep.equal({
      config: {
        limit: 10,
        window: 60000,
      },
      messageStacks: {
        10: [
          60,
        ],
      },
      users: [
        10,
      ],
    });
  });
});

async function buildSUT(state) {
  let resolve = null;
  const endCallback = new Promise((r) => {
    resolve = r;
  });
  const bot = new Telegraf();
  bot.use(async (ctx, next) => {
    ctx.telegram.getChatAdministrators = () => new Promise(r => r([{ user: { id: 1 } }]));
    ctx.reply = sinon.fake();
    await next();
    resolve();
  });
  app(bot, state, () => 60);
  return { bot, end: endCallback };
}

async function sendMessage(state, message) {
  const { bot, end } = await buildSUT(state);
  bot.handleUpdate({ message });
  await end;
}
