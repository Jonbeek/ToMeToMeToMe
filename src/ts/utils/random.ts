export const randomInt = (lower: number, upper: number) => {
	return Math.floor(Math.random() * (upper - lower) + lower);
};
