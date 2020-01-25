import {
	State,
	Message,
	Commodity,
	Rarity,
	ResourceType
} from "../types/State";
import * as React from "react";
import _ from "lodash";
import { connect } from "react-redux";

const mapStateToProps = (state: State) => {
	return {
		playerGoods: state.player.goods
	};
};

const UnconnectedInventoryMenu = ({
	playerGoods
}: {
	playerGoods: Record<ResourceType, Commodity>;
}) => {
	return (
		<div className="container--inventory">
			<div className="header">
				<div>Name</div>
				<div>Quantity</div>
				<div>Rarity</div>
			</div>
			{_.map(playerGoods, good => (
				<div key={good.id} className="inventory-item">
					<div>{good.name}</div>
					<div>{good.quantity}</div>
					<div>{Rarity[good.rarity]}</div>
				</div>
			))}
		</div>
	);
};

export const InventoryMenu = connect(mapStateToProps)(UnconnectedInventoryMenu);
