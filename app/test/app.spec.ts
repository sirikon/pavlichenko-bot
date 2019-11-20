/* eslint-disable no-use-before-define */
import { expect } from 'chai';
import 'mocha';

import Telegraf from 'telegraf';
import { Message } from 'telegram-typings';

import app from '../src/app';
import IContext from '../src/models/context';

import messageBuilder from './utils/messageBuilder';

describe('Flood Feature', () => {
	it('should be able to flag a user as a flooder', async () => {
		const state: any = {};

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
		const state: any = {};

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
		const state: any = {};

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

	it('should reply a correct summary when asking for flood status', async () => {
		const state = {
			chat1: {
				flood: {
					config: {
						limit: 10,
						window: 60000,
					},
					messageStacks: {
						10: [1, 2, 3, 4, 5, 6],
						20: [1],
					},
					users: [10, 20],
				},
			},
		};

		expect(await sendMessage(state, messageBuilder()
			.from(1)
			.command('/flood_status')
			.group('chat1')
			.build()))
			.to.deep.equal(['10_name: 6/10\n20_name: 1/10']);
	});

	it('should resist a failing user when asking for flood status', async () => {
		const state = {
			chat1: {
				flood: {
					config: {
						limit: 10,
						window: 60000,
					},
					messageStacks: {
						0: [1, 2, 3, 4, 5, 6],
						10: [1, 2, 3, 4, 5, 6],
						20: [1],
					},
					users: [0, 10, 20],
				},
			},
		};

		expect(await sendMessage(state, messageBuilder()
			.from(1)
			.command('/flood_status')
			.group('chat1')
			.build()))
			.to.deep.equal(['0: 6/10\n10_name: 6/10\n20_name: 1/10']);
	});

	it('should reply an empty summary when no user is flagged as flooder', async () => {
		const state = {
			chat1: {
				flood: {
					config: {
						limit: 10,
						window: 60000,
					},
					messageStacks: {},
					users: [],
				},
			},
		};

		expect(await sendMessage(state, messageBuilder()
			.from(1)
			.command('/flood_status')
			.group('chat1')
			.build()))
			.to.deep.equal(['El gulag está vacío :(']);
	});
});

describe('Autoreply Feature', () => {
	it('should reply to some messages when the sender is admin', async () => {
		const state = {};

		expect(await sendMessage(state, messageBuilder()
			.from(1)
			.text('OwO')
			.group('chat1')
			.build()))
			.to.deep.equal(['UwU']);

		expect(await sendMessage(state, messageBuilder()
			.from(1)
			.text('shrug')
			.group('chat1')
			.build()))
			.to.deep.equal(['¯\\_(ツ)_/¯']);

		expect(await sendMessage(state, messageBuilder()
			.from(1)
			.text('gora la urss')
			.group('chat1')
			.build()))
			.to.deep.equal(['https://www.youtube.com/watch?v=U06jlgpMtQs']);
	});

	it('should reply to messages in private chats', async () => {
		const state = {};

		expect(await sendMessage(state, messageBuilder()
			.from(10)
			.text('OwO')
			.privateChat('private1')
			.build()))
			.to.deep.equal(['UwU']);
	});

	it('should not reply to some messages when the sender is not admin', async () => {
		const state = {};

		expect(await sendMessage(state, messageBuilder()
			.from(2)
			.text('OwO')
			.group('chat1')
			.build()))
			.to.deep.equal([]);

		expect(await sendMessage(state, messageBuilder()
			.from(2)
			.text('shrug')
			.group('chat1')
			.build()))
			.to.deep.equal([]);

		expect(await sendMessage(state, messageBuilder()
			.from(2)
			.text('gora la urss')
			.group('chat1')
			.build()))
			.to.deep.equal([]);
	});

	it('should reply help to no flooders', async () => {
		const state = {};

		expect(await sendMessage(state, messageBuilder()
			.from(1)
			.command('/help')
			.group('chat1')
			.build()))
			.to.deep.equal(['You make me laugh. Go to gulag.']);
	});

	it('should not reply help to flooders', async () => {
		const state = {
			chat1: {
				flood: {
					config: {
						limit: 10,
						window: 60000,
					},
					messageStacks: {
						10: [],
					},
					users: [10],
				},
			},
		};

		expect(await sendMessage(state, messageBuilder()
			.from(10)
			.command('/help')
			.group('chat1')
			.build()))
			.to.deep.equal([]);
	});
});

async function buildSUT(state: any) {
	const replies: any[] = [];
	let resolve: any = null;
	const endCallback = new Promise((r) => {
		resolve = r;
	});
	const bot = new Telegraf<IContext>('', {});
	bot.use(async (ctx, next) => {
		ctx.telegram.getChatAdministrators = () =>
			new Promise((r) => r([{ user: { id: 1, first_name: '', is_bot: false }, status: '' }]));
		ctx.telegram.getChatMember = (_, userId: any) => new Promise((res, rej) => {
			if (userId.toString() === '0') {
				return rej(new Error('Failed getting username'));
			}
			return res({ user: { id: userId, first_name: `${userId}_name`, is_bot: false }, status: '' });
		});
		ctx.reply = (text) => {
			replies.push(text);
			return new Promise<Message>((res, _) => { res(); });
		};
		await next!();
		resolve(replies);
	});
	app(bot, state, () => 60);
	return { bot, end: endCallback };
}

async function sendMessage(state: any, message: any) {
	const { bot, end } = await buildSUT(state);
	bot.handleUpdate({ message, update_id: 1 });
	const result = await end;
	return result;
}
