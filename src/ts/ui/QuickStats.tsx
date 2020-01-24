import { State } from "~ts/types/State";
import { connect } from "react-redux";
import React from "react";

const mapStateToProps = (state: State) => {
	return {
		cash: state.player.cash,
		location: state.locations[state.player.location].name
	};
};

const UnconnectedQuickStats = ({ cash, location }) => {
	return (
		<div className="quick-stats">
			<div>Money: {cash}</div>
			<div>{location}</div>
		</div>
	);
};

const QuickStats = connect(mapStateToProps)(UnconnectedQuickStats);
export default QuickStats;
