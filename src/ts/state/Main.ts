import {
	State,
	Message,
	Commodity,
	Rarity,
	Need,
	Transaction,
	Location,
	ResourceType
} from "./../types/State";
import {
	createStore,
	createSlice,
	configureStore,
	PayloadAction
} from "@reduxjs/toolkit";
import _ from "lodash";

function distance(src: Location, dst: Location) {
	let x = src.position.x - dst.position.x;
	let y = src.position.y - dst.position.y;
	return Math.round(Math.sqrt(x * x + y * y));
}

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

const defaultGoods: Record<ResourceType, Commodity> = {
	fuel: {
		id: "fuel",
		name: "Fuel",
		quantity: 1000,
		rarity: Rarity.Fuel,
		weight: 1,
		recoverySpeed: 1000,
		value: 1
	},
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
		value: 75
	}
};

function buildPlayerGoods(): Record<ResourceType, Commodity> {
	return _.mapValues(defaultGoods, good => {
		let copy: Commodity = { ...good };
		copy.quantity = 0;
		copy.value = null;
		copy.recoverySpeed = null;
		return copy;
	});
}

function buildCityGoods(
	needs: Record<ResourceType, Need>
): Record<ResourceType, Commodity> {
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

function translateTransaction(
	setPrice: number,
	value: number,
	successAbove: boolean,
	finalTransaction: boolean
): string {
	let percentDiff = Math.abs((setPrice - value) / value) * 100;
	if (setPrice == value) {
		return "TRANSACTION_GOOD_PERFECT";
	} else if (
		(setPrice > value && successAbove) ||
		(setPrice < value && !successAbove)
	) {
		if (percentDiff < 10) {
			return "TRANSACTION_GOOD_10";
		} else if (percentDiff < 20) {
			return "TRANSACTION_GOOD_20";
		} else if (percentDiff < 30) {
			return "TRANSACTION_GOOD_30";
		} else if (percentDiff < 40) {
			return "TRANSACTION_GOOD_40";
		} else {
			return "TRANSACTION_GOOD_50";
		}
	} else {
		let suffix = finalTransaction ? "_FINAL" : "";
		if (percentDiff < 10) {
			return "TRANSACTION_BAD_10" + suffix;
		} else if (percentDiff < 20) {
			return "TRANSACTION_BAD_20" + suffix;
		} else if (percentDiff < 30) {
			return "TRANSACTION_BAD_30" + suffix;
		} else if (percentDiff < 40) {
			return "TRANSACTION_BAD_40" + suffix;
		} else {
			return "TRANSACTION_BAD_50" + suffix;
		}
	}
}

const MAX_TRANSACTIONS = 5;

function isMaxTransactions(state: State, id: ResourceType): boolean {
	if (id in state.current.transactionCount) {
		if (state.current.transactionCount[id] >= MAX_TRANSACTIONS) {
			return true;
		}
	}
	return false;
}
// Returns true if
function handleMaxTransactions(state: State, id: ResourceType): boolean {
	if (id === "fuel") {
		return false;
	}
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
			transactionCount: { fuel: 0, nacid: 0, nanites: 0 },
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
					fuel: Need.Neutral,
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
					fuel: Need.Neutral,
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
					fuel: Need.Neutral,
					nacid: Need.Satisfied,
					nanites: Need.Hungry
				})
			}
		},
		player: {
			location: "a",
			cash: 1000,
			currentWeight: 0,
			goods: buildPlayerGoods(),
			maxWeight: 1000,
			speed: 1,
			fuelConsumption: 10
		},
		messages: []
	} as State,
	reducers: {
		move: (state, action: PayloadAction<string>) => {
			let fuelRequired =
				state.player.fuelConsumption *
				distance(
					state.locations[state.player.location],
					state.locations[action.payload]
				);
			if (fuelRequired > state.player.goods["fuel"].quantity) {
				addMessage(state, "CANNOT_TRAVEL_MESSAGE");
				return;
			}
			state.player.goods["fuel"].quantity -= fuelRequired;
			state.player.currentWeight -= defaultGoods["fuel"].weight * fuelRequired;
			state.player.location = action.payload;
			state.current.completedTransactions = [];
			state.current.transactionCount = { fuel: 0, nanites: 0, nacid: 0 };
			addMessage(state, "MOVE_MESSAGE", state.locations[action.payload].name);
		},
		selectMenu: (state, action: PayloadAction<string>) => {
			state.current.menu = action.payload;
			state.current.message = null;
			if (action.payload === "buy") {
				addMessage(state, "ENTER_BUY");
			} else if (action.payload === "sell") {
				addMessage(state, "ENTER_SELL");
			}
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
			addMessage(
				state,
				translateTransaction(
					payload.price,
					cityGood.value,
					true,
					finalTransaction
				)
			);
			// The above checks are only as a backup. Seeing any of those messages should not be possible
			if (cityGood.value > payload.price) {
				return;
			}
			let playerGood = state.player.goods[payload.goodId];
			if (playerGood == null) {
				state.player.goods[cityGood.id] = {
					id: cityGood.id,
					name: cityGood.name,
					quantity: payload.quantity,
					rarity: cityGood.rarity,
					weight: cityGood.weight
				};
			} else {
				playerGood.quantity += payload.quantity;
			}
			cityGood.quantity -= payload.quantity;
			state.player.cash -= payload.price * payload.quantity;
			state.player.currentWeight += payload.quantity * cityGood.weight;
			if (payload.goodId !== "fuel") {
				state.current.completedTransactions.push(payload.goodId);
			}
		},
		sell: (state, action: PayloadAction<Transaction>) => {
			let payload = action.payload;
			let playerGood = state.player.goods[payload.goodId];
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
			addMessage(
				state,
				translateTransaction(
					payload.price,
					cityGood.value,
					false,
					finalTransaction
				)
			);
			if (cityGood.value < payload.price) {
				return;
			}
			// Fewer conditions, thank god
			state.player.currentWeight -= payload.quantity * playerGood.weight;
			playerGood.quantity -= payload.quantity;
			cityGood.quantity += payload.quantity;
			state.player.cash += payload.price * payload.quantity;
			if (payload.goodId !== "fuel") {
				state.current.completedTransactions.push(payload.goodId);
			}
		}
	}
});

export const Store = configureStore({
	reducer: slice.reducer
});

export const { move, selectMenu, buy, sell } = slice.actions;
