import { createStore, createSlice, configureStore } from "@reduxjs/toolkit";

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
		text: []
	},
	reducers: {
		move: (state, action) => {
			state.player.location = action.payload;
		}
	}
});

export const Store = configureStore({
	reducer: slice.reducer
});

export const { move } = slice.actions;
