import React, { useState, useEffect, useContext } from "react";

import { Container } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import UserContext from "../../context/UserContext";
import axios from "axios";
import ErrorNotice from "../misc/ErrorNotice";

import "./auth.css";

export default function Login() {
	const [email, setEmail] = useState(null);
	const [password, setPassword] = useState(null);
	const [isAdmin, setIsAdmin] = useState(false);
	const [error, setError] = useState();

	// const [authorized, setAuthorized] = useState(false);

	const { userData, setUserData } = useContext(UserContext);
	const history = useHistory();

	useEffect(() => {
		// console.log(userData.user === true);
		if (userData.user) history.push("/");
	}, [history, userData.user]);

	const submit = async (e) => {
		e.preventDefault();
		let serverUrl = "http://localhost:10000/users/login";
		if (isAdmin) serverUrl = "http://localhost:10000/users/login/admin";
		try {
			const loginUser = { email, password };
			if (email === null || password === null) {
				setError("Email and Passwords fields can't be empty!");
				return;
			}
			// console.log(loginUser);
			const loginRes = await axios.post(serverUrl, loginUser); //await AuthApi.login(loginUser, isAdmin);
			setUserData({
				token: loginRes.data.token,
				user: loginRes.data.user,
			});
			localStorage.setItem("auth-token", loginRes.data.token);
			history.push("/");
		} catch (err) {
			err.response.data.msg && setError(err.response.data.msg);
		}
	};

	return (
		<Container>
			<h2 className="text-center text-primary display-4">Login Page</h2>
			{error && <ErrorNotice message={error} clearError={() => setError(undefined)} />}
			<form className="form" onSubmit={submit}>
				<label htmlFor="login-email">Email</label>
				<input
					id="login-email"
					placeholder="name@example.com"
					type="email"
					data-testid="email-field"
					className="form-control"
					onChange={(e) => setEmail(e.target.value)}
				/>

				<span style={{ position: "relative" }}>
					<label htmlFor="login-password">Password</label>
					<input
						id="login-password"
						placeholder="Enter password..."
						type="password"
						data-testid="password-field"
						className="form-control"
						onChange={(e) => setPassword(e.target.value)}
					/>
					<span
						data-testid="password-toggle-icon"
						className="fa fa-fw fa-eye"
						onClick={(e) => {
							let passwordInput = document.getElementById("login-password");
							if (passwordInput.type === "password") passwordInput.type = "text";
							else passwordInput.type = "password";
							if (e.currentTarget.className === "fa fa-fw fa-eye")
								e.currentTarget.className = "fa fa-eye fa-eye-slash";
							else e.currentTarget.className = "fa fa-fw fa-eye";
						}}
						style={{ position: "absolute", top: 40, left: 835 }}></span>
				</span>
				<label htmlFor="admin" id="admin-label">
					{" "}
					Login as Admin
				</label>
				<input
					type="checkbox"
					id="admin"
					name="admin"
					value="admin"
					onChange={(e) => {
						setIsAdmin(e.target.checked);
					}}
				/>

				<button
					className="btn btn-success btn-block btn-lg my-4"
					onClick={(e) => {
						submit(e);
					}}>
					{" "}
					Login{" "}
				</button>
			</form>
		</Container>
	);
}
