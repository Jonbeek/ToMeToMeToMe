import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { Store } from "./state/Main";
import * as React from "react";
import Router from "./ui/Router";

ReactDOM.render(
	<Provider store={Store}>
		<Router></Router>
	</Provider>,
	document.getElementById("root")
);
