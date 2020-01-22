import { Message } from "../i18n/convert";

export { Message } from "../i18n/convert";

export interface Location {
	name: string;
	position: {
		x: number;
		y: number;
	};
}

export interface State {
	current: {
		screen: string;
		menu: string;
		locale: string;
	};
	locations: Record<string, Location>;
	player: {
		location: string;
	};
	messages: Message[];
}
