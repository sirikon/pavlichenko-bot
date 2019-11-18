export interface IRootState {
	[userId: number]: IState;
}

export interface IState {
	flood?: IFloodState;
}

export interface IFloodState {
	users: number[];
	messageStacks: { [key: number]: number[] };
	config: {
		limit: number;
		window: number;
	};
}
