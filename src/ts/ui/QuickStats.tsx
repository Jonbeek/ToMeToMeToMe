import { State } from "~ts/types/State";
import { connect } from "react-redux";
import React from "react";

const mapStateToProps = (state: State) => {
	return {
		cash: state.player.cash,
		location: state.locations[state.player.location].name,
		fuel: state.player.goods["fuel"].quantity,
		currentWeight: state.player.currentWeight,
		maxWeight: state.player.maxWeight
	};
};

const UnconnectedQuickStats = ({
	cash,
	fuel,
	location,
	currentWeight,
	maxWeight
}) => {
	return (
		<div className="quick-stats">
			<div>Money: {cash}</div>
			<div>Fuel: {fuel}</div>
			<div>
				Capacity: {currentWeight}/{maxWeight}
			</div>
			<div>{location}</div>
		</div>
	);
};

const QuickStats = connect(mapStateToProps)(UnconnectedQuickStats);
export default QuickStats;
