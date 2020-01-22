export interface Message {
	id: string;
	params: any[];
}

export function __(t: string | Message): string;
