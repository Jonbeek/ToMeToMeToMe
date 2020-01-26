import { move } from "../state/Main";
import * as React from "react";
import { connect, ConnectedProps } from "react-redux";
import * as _ from "lodash";
import { State, Location } from "~ts/types/State";

const mapStateToProps = (state: State) => {
	return {
		currentTown: state.locations[state.player.location],
		towns: _.transform(
			state.locations,
			(acc, v, k) => {
				if (k !== state.player.location) {
					acc[k] = v;
				}
			},
			{}
		) as Record<string, Location>,
		fuelConsumption: state.player.fuelConsumption,
		fuel: state.player.goods["fuel"].quantity
	};
};

function distance(src: Location, dst: Location) {
	let x = src.position.x - dst.position.x;
	let y = src.position.y - dst.position.y;
	return Math.round(Math.sqrt(x * x + y * y));
}

const mapDispatch = { move };

const connector = connect(mapStateToProps, mapDispatch);

type Props = ConnectedProps<typeof connector>;

const UnconnectedMoveMenu = ({
	currentTown,
	towns,
	fuelConsumption,
	fuel,
	move
}: Props) => {
	return (
		<div>
			<div className="greeting">Currently at {currentTown.name}</div>
			<div className="container--move">
				{_.map(towns, (town, id) => {
					let fuelRequired = distance(currentTown, town) * fuelConsumption;
					return (
						<button
							className="button--move"
							key={town.name}
							onClick={() => move(id)}
							disabled={fuelRequired > fuel}
						>
							{town.name} (Fuel: {fuelRequired})
						</button>
					);
				})}
			</div>
		</div>
	);
};

export const MoveMenu = connector(UnconnectedMoveMenu);
