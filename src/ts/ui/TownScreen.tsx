import * as _ from "lodash";
import { connect } from "react-redux";
import * as React from "react";
import { MoveMenu } from "./MoveMenu";

const mapStateToProps = state => {
	let [current, others] = _.partition(
		_.keys(state.locations),
		key => key === state.player.location
	);
	return {
		menu: state.current.menu,
		location: state.player.location,
		details: current
	};
};

const UnconnectedTownScreen = ({ location, menu, details }) => {
	const allMenus = {
		text: <div></div>,
		move: <MoveMenu></MoveMenu>
	};

	return (
		<div>
			<div className="submenu">{allMenus[menu]}</div>
		</div>
	);
};

const TownScreen = connect(mapStateToProps)(UnconnectedTownScreen);

export default TownScreen;
