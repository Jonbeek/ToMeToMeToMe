export interface Message {
	id: string;
	params: any[];
}

export function __(locale: string, t: Message): string;
