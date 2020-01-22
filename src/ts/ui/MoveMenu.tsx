import { move } from "../state/Main";
import * as React from "react";
import { connect } from "react-redux";
import * as _ from "lodash";

const mapStateToProps = state => {
	return {
		currentTown: state.locations[state.player.location],
		towns: _.omit(state.locations, state.player.location)
	};
};

const mapDispatch = { move };

const UnconnectedMoveMenu = ({ currentTown, towns, move }) => {
	return (
		<div>
			<div className="greeting">Currently at {currentTown.name}</div>
			<div className="container--move">
				{_.map(towns, (town, id) => {
					return (
						<button
							className="button--move"
							key={town.name}
							onClick={() => move(id)}
						>
							{town.name}
						</button>
					);
				})}
			</div>
		</div>
	);
};

export const MoveMenu = connect(
	mapStateToProps,
	mapDispatch
)(UnconnectedMoveMenu);
