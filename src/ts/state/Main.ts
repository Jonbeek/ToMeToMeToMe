import { createStore, createSlice, configureStore } from "@reduxjs/toolkit";

const slice = createSlice({
	name: "main",
	initialState: {
		current: {
			screen: "town",
			menu: "move"
		},
		locations: {
			a: {
				position: {
					x: 0,
					y: 0
				}
			},
			b: {
				position: {
					x: 4,
					y: 0
				}
			},
			c: {
				position: {
					x: 4,
					y: 3
				}
			}
		},
		player: {
			location: "a"
		}
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
