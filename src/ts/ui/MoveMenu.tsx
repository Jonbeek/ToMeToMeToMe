import { move } from "../state/Main";
import * as React from "react";
import { connect } from "react-redux";
import * as _ from "lodash";

const mapStateToProps = state => {
	return {
		towns: _.omit(state.locations, state.player.location)
	};
};

const mapDispatch = { move };

const UnconnectedMoveMenu = ({ towns, move }) => {
	return (
		<div>
			{_.map(towns, (town, name) => {
				return (
					<button key={name} onClick={() => move(name)}>
						{name}
					</button>
				);
			})}
		</div>
	);
};

export const MoveMenu = connect(
	mapStateToProps,
	mapDispatch
)(UnconnectedMoveMenu);
