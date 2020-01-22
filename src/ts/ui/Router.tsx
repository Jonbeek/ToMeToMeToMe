import { connect } from "react-redux";
import "./TownScreen";
import * as React from "react";
import TownScreen from "./TownScreen";

const mapStateToProps = state => {
	return {
		currentScreen: state.current.screen
	};
};

const UnconnectedRouter = ({ currentScreen }) => {
	return (
		<div className="router">
			{
				{
					town: <TownScreen></TownScreen>
				}[currentScreen]
			}
		</div>
	);
};

const Router = connect(mapStateToProps)(UnconnectedRouter);

export default Router;
