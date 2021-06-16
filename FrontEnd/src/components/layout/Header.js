import React, { useEffect, useContext } from "react";
// import { Link } from "react-router-dom";
import AuthOptions from "../auth/AuthOptions";
import UserContext from "../../context/UserContext";
import Axios from "axios";

import "./Header.css";

export default function Header() {
	const { userData } = useContext(UserContext);
	var hidden, visibilityChange;
	if (typeof document.hidden !== "undefined") {
		// Opera 12.10 and Firefox 18 and later support
		hidden = "hidden";
		visibilityChange = "visibilitychange";
	} else if (typeof document.msHidden !== "undefined") {
		hidden = "msHidden";
		visibilityChange = "msvisibilitychange";
	} else if (typeof document.webkitHidden !== "undefined") {
		hidden = "webkitHidden";
		visibilityChange = "webkitvisibilitychange";
	}

	useEffect(() => {
		if (!userData || !userData.user || userData.user.admin) return;
		function handleVisibilityChange() {
			if (document[hidden] || !document.hasFocus()) {
				Axios.post("http://localhost:10000/users/logTabSwitchedAway", null, {
					headers: { "x-auth-token": userData.token },
				})
					.then(() => {
						alert("repeated offense would lead to ban");
						Axios.post("http://localhost:10000/users/logTabSwitchedBack", null, {
							headers: { "x-auth-token": userData.token },
						}).catch((err) => console.log(err));
					})
					.catch((err) => console.log(err));
			}
		}
		function checkFocus() {
			// console.log(document.hasFocus());
			if (false && !document.hasFocus()) {
				handleVisibilityChange();
			}
		}
		// document.addEventListener(visibilityChange, handleVisibilityChange, false);
		const id = setInterval(checkFocus, 500);

		return () => {
			// document.removeEventListener(visibilityChange, handleVisibilityChange, false);
			clearInterval(id);
		};
	}, [hidden, userData, visibilityChange]);

	return (
		<header id="header">
			<a href="/" className="m-auto">
				<h2 className="title">Gesture Navigation Exam Portal</h2>
			</a>
			<AuthOptions />
		</header>
	);
}
