import { __ } from "../i18n/convert";
import { State, Message } from "../types/State";
import * as React from "react";
import _ from "lodash";

const mapStateToProps = (state: State) => {
	return {
		messageHistory: _.map(state.messages, (msg: Message) =>
			__(state.current.locale, msg)
		)
	};
};

const UnconnectedTextMenu = ({ messageHistory }) => {
	return (
		<div className="container--history">
			{messageHistory.map(msg => (
				<div className="">{msg}</div>
			))}
		</div>
	);
};
