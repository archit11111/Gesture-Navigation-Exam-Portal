import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Axios from "axios";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import LandingPage from "./components/pages/LandingPage";

// import Home from "./Home";
// import Admin from "./Admin";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import UserContext from "./context/UserContext";
import Loader from "./components/misc/Loader";

import "./style.css";

function App() {
	const [userData, setUserData] = useState({
		token: undefined,
		user: undefined,
	});
	const checkLoggedIn = async () => {
		let token = localStorage.getItem("auth-token");
		if (token === null) {
			localStorage.setItem("auth-token", "");
			token = "";
		}
		const tokenRes = await Axios.post("http://localhost:10000/users/tokenIsValid/", null, {
			headers: { "x-auth-token": token },
		}).catch((err) => console.log(err));
		if (tokenRes && tokenRes.data) {
			const userRes = await Axios.get("http://localhost:10000/users/", {
				headers: { "x-auth-token": token },
			}).catch((err) => console.log(err));

			setUserData({
				token,
				user: userRes.data,
			});
		} else {
			setUserData({
				token: undefined,
				user: null,
			});
		}
	};
	useEffect(() => {
		checkLoggedIn();
	}, []);

	return (
		<>
			<BrowserRouter>
				<UserContext.Provider value={{ userData, setUserData }}>
					<div className="main-container">
						<Header />
						{userData.user !== undefined ? (
							<Switch>
								<Route exact path="/login" component={Login} />
								<Route exact path="/register" component={Register} />
								<Route path="/" component={LandingPage} />
							</Switch>
						) : (
							<Loader />
						)}
					</div>
					<Footer />
				</UserContext.Provider>
			</BrowserRouter>
		</>
	);
}

export default App;
