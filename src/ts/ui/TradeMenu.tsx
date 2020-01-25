import { buy, sell } from "../state/Main";
import * as React from "react";
import { connect, ConnectedProps } from "react-redux";
import * as _ from "lodash";
import {
	Commodity,
	Transaction,
	State,
	Rarity,
	ResourceType
} from "~ts/types/State";
import { PayloadAction } from "@reduxjs/toolkit";
import { __ } from "~ts/i18n/convert";

interface TradeProps extends PropsFromRedux {
	// Provided by parent
	isSelling: boolean;
}

interface TradeState {
	selection?: ResourceType;
	price?: number;
	quantity?: number;
}
const mapStateToProps = (state: State) => {
	return {
		completedTransactions: state.current.completedTransactions || [],
		currentWeight: state.player.currentWeight,
		maxWeight: state.player.maxWeight,
		playerCash: state.player.cash,
		playerGoods: state.player.goods,
		townGoods: state.locations[state.player.location].goods,
		msg: __(state.current.message)
	};
};

const mapDispatch = { buy, sell };

class UnconnectedTradeMenu extends React.Component<TradeProps, TradeState> {
	state = {
		price: null,
		quantity: null,
		selection: null
	};

	selectGood(id: ResourceType) {
		this.setState({
			selection: id
		});
	}

	render() {
		let { selection, price, quantity } = this.state;
		let {
			townGoods,
			completedTransactions,
			isSelling,
			playerGoods,
			currentWeight,
			maxWeight,
			playerCash,
			msg,
			buy,
			sell
		} = this.props;
		let playerVersion = _.find(playerGoods, good => good.id === selection);
		let townVersion = townGoods[selection];
		let goodQuantity = isSelling
			? (playerVersion && playerVersion.quantity) || 0
			: (townVersion && townVersion.quantity) || 0;
		let goodWeight =
			(quantity || 0) * ((townVersion && townVersion.weight) || 0);
		let goodTotalPrice = (quantity || 0) * (price || 0);
		let goodList = _.map(townGoods, (good, id: ResourceType) => {
			let tv = townGoods[id];
			let pv = _.find(playerGoods, good => good.id === id);
			let disabled =
				_.some(completedTransactions, t => t === id) ||
				(isSelling
					? pv == null || pv.quantity <= 0
					: tv == null || tv.quantity <= 0);
			let checked = !disabled && id === selection;
			return (
				<label className="input-row" key={id}>
					<input
						type="radio"
						name="goodlist"
						value={id}
						checked={checked}
						disabled={disabled}
						onChange={ev => {
							ev.stopPropagation();
							this.selectGood(ev.target.value as ResourceType);
						}}
					/>
					<div>{good.name}</div>
					<div>{isSelling ? (pv && pv.quantity) || 0 : tv.quantity}</div>
					<div>{Rarity[good.rarity]}</div>
				</label>
			);
		});
		let purchaseDisabled =
			_.some(completedTransactions, t => t === selection) ||
			goodWeight + currentWeight > maxWeight ||
			(goodTotalPrice > playerCash && !isSelling) ||
			goodQuantity == 0;
		let purchaseFunc = isSelling ? sell : buy;
		let buttonName = isSelling ? "SELL_BUTTON" : "BUY_BUTTON";
		return (
			<div className="container--trade">
				<div>
					<form className="input-table">
						<div className="input-row">
							<div>Name</div>
							<div>Available</div>
							<div>Rarity</div>
						</div>
						{goodList}
					</form>
					<div>
						<label htmlFor="price">Price:</label>
						<input
							id="price"
							type="number"
							min="0"
							step="1"
							value={price || ""}
							onChange={ev => this.setState({ price: ev.target.valueAsNumber })}
						/>
						<label htmlFor="quantity">Amount:</label>
						<input
							id="quantity"
							type="number"
							min="1"
							step="1"
							value={quantity || ""}
							onChange={ev =>
								this.setState({ quantity: ev.target.valueAsNumber })
							}
						/>
					</div>
					<div className="warnings"></div>
					<button
						disabled={purchaseDisabled}
						onClick={() =>
							purchaseFunc({
								goodId: selection,
								price: price,
								quantity: quantity
							})
						}
					>
						{__(buttonName)}
					</button>
				</div>
				<div>{msg}</div>
			</div>
		);
	}
}

const connector = connect(mapStateToProps, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

export const TradeMenu = connector(UnconnectedTradeMenu);
