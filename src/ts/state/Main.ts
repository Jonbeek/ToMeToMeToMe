import {
	State,
	Message,
	Commodity,
	Rarity,
	Need,
	Transaction
} from "./../types/State";
import {
	createStore,
	createSlice,
	configureStore,
	PayloadAction
} from "@reduxjs/toolkit";
import _ from "lodash";

const maxMessageLength = 100;

function createMessage(msg: string, ...params: any[]): Message {
	return {
		id: msg,
		params: params
	};
}

function addMessage(state: State, msg: string, ...params: any[]) {
	let fullMessage = createMessage(msg, ...params);
	state.current.message = fullMessage;
	state.messages.unshift(fullMessage);
	if (state.messages.length > maxMessageLength) {
		state.messages.length = maxMessageLength;
	}
}

const defaultGoods: Record<string, Commodity> = {
	nacid: {
		id: "nacid",
		name: "Nitric Acid",
		quantity: 1000,
		rarity: Rarity.Common,
		weight: 25,
		recoverySpeed: 20,
		value: 50
	},
	nanites: {
		id: "nanites",
		name: "Nanites",
		quantity: 1000,
		rarity: Rarity.Common,
		weight: 10,
		recoverySpeed: 10,
		value: 100
	}
};

function buildCityGoods(
	needs: Record<string, Need>
): Record<string, Commodity> {
	return _.mapValues(defaultGoods, (good, key) => {
		if (!(key in needs)) {
			console.log("Missing need for good " + key);
			return;
		}
		let diffFactor = needs[key] - 4;
		let copy: Commodity = { ...good };
		switch (good.rarity) {
			case Rarity.Common:
				copy.value += diffFactor * 7;
				break;
			case Rarity.Uncommon:
				copy.value += diffFactor * 49;
				break;
			case Rarity.Rare:
				copy.value += diffFactor * 343;
				break;
			default:
				break;
		}
		return copy;
	});
}

const MAX_TRANSACTIONS = 5;

function isMaxTransactions(state: State, id: string): boolean {
	if (id in state.current.transactionCount) {
		if (state.current.transactionCount[id] >= MAX_TRANSACTIONS) {
			return true;
		}
	}
	return false;
}
// Returns true if
function handleMaxTransactions(state: State, id: string): boolean {
	if (id in state.current.transactionCount) {
		state.current.transactionCount[id]++;
	} else {
		state.current.transactionCount[id] = 1;
	}
	if (isMaxTransactions(state, id)) {
		state.current.completedTransactions.push(id);
		return true;
	}
	return false;
}

const slice = createSlice({
	name: "main",
	initialState: {
		current: {
			screen: "town",
			menu: "move",
			locale: "en_us",
			transactionCount: {},
			completedTransactions: []
		},
		locations: {
			a: {
				name: "New Spark",
				position: {
					x: 0,
					y: 0
				},
				goods: buildCityGoods({
					nacid: Need.Satisfied,
					nanites: Need.Peckish
				})
			},
			b: {
				name: "Port Land",
				position: {
					x: 4,
					y: 0
				},
				goods: buildCityGoods({
					nacid: Need.Peckish,
					nanites: Need.Satisfied
				})
			},
			c: {
				name: "Qubitia",
				position: {
					x: 4,
					y: 3
				},
				goods: buildCityGoods({
					nacid: Need.Satisfied,
					nanites: Need.Hungry
				})
			}
		},
		player: {
			location: "a",
			cash: 1000,
			currentWeight: 0,
			goods: [],
			maxWeight: 1000,
			speed: 1
		},
		messages: []
	} as State,
	reducers: {
		move: (state, action: PayloadAction<string>) => {
			state.player.location = action.payload;
			state.current.completedTransactions = [];
			state.current.transactionCount = {};
			addMessage(state, "MOVE_MESSAGE", state.locations[action.payload].name);
		},
		selectMenu: (state, action: PayloadAction<string>) => {
			state.current.menu = action.payload;
		},
		buy: (state, action: PayloadAction<Transaction>) => {
			let payload = action.payload;
			let cityGood =
				state.locations[state.player.location].goods[payload.goodId];
			if (cityGood == null) {
				console.log("Fuck");
				return;
			}
			if (payload.quantity > cityGood.quantity) {
				addMessage(state, "INSUFFICIENT_MESSAGE", cityGood.name);
				return;
			}
			if (
				payload.quantity * cityGood.weight + state.player.currentWeight >
				state.player.maxWeight
			) {
				addMessage(state, "TOO_HEAVY");
				return;
			}
			if (payload.quantity * payload.price > state.player.cash) {
				addMessage(state, "TOO_EXPENSIVE");
				return;
			}
			let finalTransaction = handleMaxTransactions(state, payload.goodId);
			// The above checks are only as a backup. Seeing any of those messages should not be possible
			if (cityGood.value > payload.price) {
				addMessage(state, finalTransaction ? "TOO_LOW_FINAL" : "TOO_LOW");
				return;
			}
			let playerGood = _.find(
				state.player.goods,
				good => good.id == payload.goodId
			);
			if (playerGood == null) {
				state.player.goods.push({
					id: cityGood.id,
					name: cityGood.name,
					quantity: payload.quantity,
					rarity: cityGood.rarity,
					weight: cityGood.weight
				});
			} else {
				playerGood.quantity += payload.quantity;
			}
			cityGood.quantity -= payload.quantity;
			state.player.cash -= payload.price * payload.quantity;
			state.player.currentWeight += payload.quantity * cityGood.weight;
			state.current.completedTransactions.push(payload.goodId);
			addMessage(state, "TRANSACTION_COMPLETE");
		},
		sell: (state, action: PayloadAction<Transaction>) => {
			let payload = action.payload;
			let playerGood = _.find(
				state.player.goods,
				good => good.id == payload.goodId
			);
			let cityGood =
				state.locations[state.player.location].goods[payload.goodId];
			if (playerGood == null) {
				addMessage(state, "NICE_JOB");
				return;
			}
			if (payload.quantity > playerGood.quantity) {
				addMessage(state, "INSUFFICIENT_MESSAGE");
				return;
			}
			const finalTransaction = handleMaxTransactions(state, payload.goodId);
			if (payload.price > cityGood.value) {
				addMessage(
					state,
					finalTransaction
						? "TOO_EXPENSIVE_FINAL_MESSAGE"
						: "TOO_EXPENSIVE_MESSAGE"
				);
				return;
			}
			// Fewer conditions, thank god
			playerGood.quantity -= payload.quantity;
			cityGood.quantity += payload.quantity;
			state.player.cash += payload.price * payload.quantity;
			state.current.completedTransactions.push(payload.goodId);
			addMessage(state, "TRANSACTION_COMPLETE");
		}
	}
});

export const Store = configureStore({
	reducer: slice.reducer
});

export const { move, selectMenu, buy, sell } = slice.actions;
