import { State, Message, Commodity, Rarity } from "../types/State";
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
	playerGoods: Commodity[];
}) => {
	return (
		<div className="container--inventory">
			<div className="header">
				<div>Name</div>
				<div>Quantity</div>
				<div>Rarity</div>
			</div>
			{playerGoods.map(good => (
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
