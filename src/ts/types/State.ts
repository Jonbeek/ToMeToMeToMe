import { Message } from "../i18n/convert";

export { Message } from "../i18n/convert";

export enum Rarity {
	Fuel,
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

export type ResourceType = "fuel" | "nacid" | "nanites" | undefined;

export interface Transaction {
	goodId: ResourceType;
	quantity: number;
	price: number;
}

export interface Commodity {
	id: ResourceType;
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
	goods: Record<ResourceType, Commodity>;
}

export interface State {
	current: {
		screen: string;
		menu: string;
		locale: string;
		message?: Message;
		transactionCount: Record<ResourceType, number>;
		completedTransactions: ResourceType[];
	};
	locations: Record<string, Location>;
	player: {
		location: string;
		cash: number;
		goods: Record<ResourceType, Commodity>;
		maxWeight: number;
		currentWeight: number;
		speed: number;
	};
	messages: Message[];
}
