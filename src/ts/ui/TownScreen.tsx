import * as _ from "lodash";
import { connect } from "react-redux";
import * as React from "react";
import { MoveMenu } from "./MoveMenu";
import { MessageMenu } from "./MessageMenu";
import { __ } from "~ts/i18n/convert";
import { selectMenu } from "~ts/state/Main";
import { TradeMenu } from "./TradeMenu";
import QuickStats from "./QuickStats";
import { InventoryMenu } from "./InventoryMenu";

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
		buy: {
			name: __("BUY_MENU_NAME"),
			ui: <TradeMenu isSelling={false}></TradeMenu>
		},
		sell: {
			name: __("SELL_MENU_NAME"),
			ui: <TradeMenu isSelling={true}></TradeMenu>
		},
		inventory: {
			name: __("INVENTORY_MENU_NAME"),
			ui: <InventoryMenu></InventoryMenu>
		}
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
				<QuickStats></QuickStats>
				{_.map(allMenus, (menu, id) => (
					<button key={id} className="button--menu" onClick={() => selectMenu(id)}>
						{menu.name}
					</button>
				))}
			</div>
		</div>
	);
};

const TownScreen = connect(mapStateToProps, mapDispatch)(UnconnectedTownScreen);

export default TownScreen;
