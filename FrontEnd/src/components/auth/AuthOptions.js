import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import UserContext from "../../context/UserContext";
import { showConfirmAlert, showSuccessAlert } from "../../utils/alerts";

export default function AuthOptions() {
	const { userData, setUserData } = useContext(UserContext);

	const history = useHistory();

	const register = () => history.push("/register");
	const login = () => history.push("/login");
	const logout = () => {
		const logoutHandler = () => {
			setUserData({
				token: undefined,
				user: null,
			});
			localStorage.setItem("auth-token", "");
			showSuccessAlert("Success", "Logged out successfully!");
		};
		showConfirmAlert(logoutHandler);
	};

	return (
		<nav className="auth-options">
			{userData.user ? (
				<button onClick={logout}>Log out</button>
			) : (
				<>
					<button onClick={register}>Register</button>
					<button onClick={login}>Log in</button>
				</>
			)}
		</nav>
	);
}
