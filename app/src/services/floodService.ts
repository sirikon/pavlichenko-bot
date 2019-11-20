import { IFloodState, IState } from '../models/state';

export default class FloodService {
	constructor(
		private rootState: IState,
		private timeProvider: () => number) { }

	public getStatus(): { [userId: string]: string } {
		const state = this.getState();
		const result: { [userId: string]: string } = {};
		state.users.forEach((userId) => {
			this.deleteOutOfWindowMessagesFromUserStack(userId);
			result[userId] = `${this.getUserMessageStack(userId).length}/${state.config.limit}`;
		});
		return result;
	}

	public isUserFlooder(userId: number) {
		const state = this.getState();
		return state.users.indexOf(userId) >= 0;
	}

	public flagUserAsFlooder(userId: number, enable: boolean) {
		const state = this.getState();
		const userPositionInArray = state.users.indexOf(userId);
		if (enable) {
			if (userPositionInArray >= 0) { return; }
			state.users.push(userId);
		} else {
			if (userPositionInArray === -1) { return; }
			state.users.splice(userPositionInArray, 1);
		}
	}

	public addMessageAndCheck(userId: number) {
		const state = this.getState();
		this.deleteOutOfWindowMessagesFromUserStack(userId);
		const userStack = this.getUserMessageStack(userId);

		if (userStack.length >= state.config.limit) {
			return false;
		}

		userStack.push(this.timeProvider());
		return true;
	}

	private deleteOutOfWindowMessagesFromUserStack(userId: number) {
		const state = this.getState();
		const now = this.timeProvider();
		const userStack = this.getUserMessageStack(userId);

		let finished = false;
		let c = 0;
		while (!finished) {
			if (((now - userStack[c]) < state.config.window) || c === userStack.length) {
				finished = true;
				continue;
			}
			c++;
		}

		userStack.splice(0, c);
	}

	private getUserMessageStack(userId: number) {
		const state = this.getState();
		if (!state.messageStacks[userId]) {
			state.messageStacks[userId] = [];
		}
		return state.messageStacks[userId];
	}

	private getState(): IFloodState {
		if (!this.rootState.flood) {
			this.rootState.flood = {
				users: [],
				messageStacks: {},
				config: {
					limit: 10,
					window: 1 * 60 * 1000, // One minute
				},
			};
		}
		return this.rootState.flood;
	}
}
