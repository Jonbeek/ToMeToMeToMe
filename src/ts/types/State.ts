import { Message } from "../i18n/convert";

export { Message } from "../i18n/convert";

export enum Rarity {
	Common,
	Uncommon,
	Rare
}

export enum Need {
	Starving,
	Hungry,
	Peckish,
	Neutral,
	Satisfied,
	Full,
	Stuffed
}

export interface Transaction {
	goodId: string;
	quantity: number;
	price: number;
}

export interface Commodity {
	id: string;
	name: string;
	value?: number;
	quantity: number;
	weight: number;
	rarity: Rarity;
	need?: Need;
	recoverySpeed?: number;
}

export interface Location {
	name: string;
	position: {
		x: number;
		y: number;
	};
	goods: Record<string, Commodity>;
}

export interface State {
	current: {
		screen: string;
		menu: string;
		locale: string;
		message?: Message;
		transactionCount: Record<string, number>;
		completedTransactions: string[];
	};
	locations: Record<string, Location>;
	player: {
		location: string;
		cash: number;
		goods: Commodity[];
		maxWeight: number;
		currentWeight: number;
		speed: number;
	};
	messages: Message[];
}
