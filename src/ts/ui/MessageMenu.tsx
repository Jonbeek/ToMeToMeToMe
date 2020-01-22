import { __ } from "../i18n/convert";
import { State, Message } from "../types/State";
import * as React from "react";
import _ from "lodash";
import { connect } from "react-redux";

const mapStateToProps = (state: State) => {
	return {
		messageHistory: _.map(state.messages, (msg: Message) => __(msg))
	};
};

const UnconnectedMessageMenu = ({ messageHistory }) => {
	return (
		<div className="container--history">
			{messageHistory.map(msg => (
				<div className="message">{msg}</div>
			))}
		</div>
	);
};

export const MessageMenu = connect(mapStateToProps)(UnconnectedMessageMenu);
