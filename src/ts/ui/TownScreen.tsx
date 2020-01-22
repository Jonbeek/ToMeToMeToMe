import * as _ from "lodash";
import { connect } from "react-redux";
import * as React from "react";
import { MoveMenu } from "./MoveMenu";
import { MessageMenu } from "./MessageMenu";
import { __ } from "~ts/i18n/convert";
import { selectMenu } from "~ts/state/Main";

const mapStateToProps = state => {
	return {
		menu: state.current.menu
	};
};

const mapDispatch = { selectMenu };

const UnconnectedTownScreen = ({ menu, selectMenu }) => {
	const allMenus = {
		move: {
			name: __("MOVE_MENU_NAME"),
			ui: <MoveMenu></MoveMenu>
		},
		messages: {
			name: __("MESSAGE_MENU_NAME"),
			ui: <MessageMenu></MessageMenu>
		}
	};
	if (!(menu in allMenus)) {
		console.log("Menu not found in menu list");
		return <div className="error">Missing menu!</div>;
	}

	return (
		<div className="town">
			<div className="submenu">{allMenus[menu].ui}</div>
			<div className="container--menus">
				{_.map(allMenus, (menu, id) => (
					<button className="button--menu" onClick={() => selectMenu(id)}>
						{menu.name}
					</button>
				))}
			</div>
		</div>
	);
};

const TownScreen = connect(mapStateToProps, mapDispatch)(UnconnectedTownScreen);

export default TownScreen;
