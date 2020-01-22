import { State, Message } from "./../types/State";
import {
	createStore,
	createSlice,
	configureStore,
	PayloadAction
} from "@reduxjs/toolkit";

const maxMessageLength = 100;

function addMessage(messages: Message[], msg: string, ...params: any[]) {
	let fullMessage: Message = {
		id: msg,
		params: params
	};
	messages.unshift(fullMessage);
	if (messages.length > maxMessageLength) {
		messages.length = maxMessageLength;
	}
}

const slice = createSlice({
	name: "main",
	initialState: {
		current: {
			screen: "town",
			menu: "move",
			locale: "en_us"
		},
		locations: {
			a: {
				name: "New Spark",
				position: {
					x: 0,
					y: 0
				}
			},
			b: {
				name: "Port Land",
				position: {
					x: 4,
					y: 0
				}
			},
			c: {
				name: "Qubitia",
				position: {
					x: 4,
					y: 3
				}
			}
		},
		player: {
			location: "a"
		},
		messages: []
	} as State,
	reducers: {
		move: (state, action: PayloadAction<string>) => {
			state.player.location = action.payload;
			addMessage(
				state.messages,
				"MOVE_MESSAGE",
				state.locations[action.payload].name
			);
		},
		selectMenu: (state, action: PayloadAction<string>) => {
			state.current.menu = action.payload;
		}
	}
});

export const Store = configureStore({
	reducer: slice.reducer
});

export const { move, selectMenu } = slice.actions;
