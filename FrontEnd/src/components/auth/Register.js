import React, { useState, useEffect, useContext } from "react";

import { Container } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import UserContext from "../../context/UserContext";
import Axios from "axios";
import ErrorNotice from "../misc/ErrorNotice";

import "./auth.css";

export default function Register() {
	const [email, setEmail] = useState();
	const [password, setPassword] = useState();
	const [passwordCheck, setPasswordCheck] = useState();
	const [displayName, setDisplayName] = useState();
	const [error, setError] = useState();
	const [isAdmin, setIsAdmin] = useState(false);
	const [adminKey, setAdminKey] = useState();

	const { userData, setUserData } = useContext(UserContext);
	const history = useHistory();

	useEffect(() => {
		if (userData.user) history.push("/");
	}, [history, userData.user]);

	const submit = async (e) => {
		e.preventDefault();
		let serverUrl = "http://localhost:10000/users/register";
		if (isAdmin) serverUrl = "http://localhost:10000/users/register/admin";
		try {
			if (!email || !password || !passwordCheck || !displayName) {
				setError("All fields must be filled!");
				return;
			}
			if (password !== passwordCheck) {
				setError("Passwords don't match");
				return;
			}
			const newUser = { email, password, passwordCheck, displayName, adminKey };

			await Axios.post(serverUrl, newUser);
			const loginRes = await Axios.post(`http://localhost:10000/users/login/${isAdmin ? "admin" : ""}`, {
				email,
				password,
			});
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
			<h2 className="text-center text-primary display-4">Register Page</h2>
			{error && <ErrorNotice message={error} clearError={() => setError(undefined)} />}
			<form className="form" onSubmit={submit}>
				<label htmlFor="register-email">Email</label>
				<input
					id="register-email"
					type="email"
					className="form-control"
					placeholder="name@example.com"
					onChange={(e) => setEmail(e.target.value)}
				/>

				<span style={{ position: "relative" }}>
					<label htmlFor="register-password">Password</label>
					<input
						id="register-password"
						type="password"
						className="form-control"
						placeholder="Enter your password..."
						onChange={(e) => setPassword(e.target.value)}
					/>
					<span
						data-testid="password-toggle-icon"
						className="fa fa-fw fa-eye"
						onClick={(e) => {
							let passwordInput = document.getElementById("register-password");
							if (passwordInput.type === "password") passwordInput.type = "text";
							else passwordInput.type = "password";
							if (e.currentTarget.className === "fa fa-fw fa-eye")
								e.currentTarget.className = "fa fa-eye fa-eye-slash";
							else e.currentTarget.className = "fa fa-fw fa-eye";
						}}
						style={{ position: "absolute", top: 40, left: 835 }}></span>
				</span>
				<span style={{ position: "relative" }}>
					<input
						id="verify-password"
						type="password"
						placeholder="Verify password"
						onChange={(e) => setPasswordCheck(e.target.value)}
					/>
					<span
						data-testid="password-toggle-icon"
						className="fa fa-fw fa-eye"
						onClick={(e) => {
							let passwordInput = document.getElementById("verify-password");
							if (passwordInput.type === "password") passwordInput.type = "text";
							else passwordInput.type = "password";
							if (e.currentTarget.className === "fa fa-fw fa-eye")
								e.currentTarget.className = "fa fa-eye fa-eye-slash";
							else e.currentTarget.className = "fa fa-fw fa-eye";
						}}
						style={{ position: "absolute", top: 13, left: 835 }}></span>
				</span>
				<label htmlFor="register-display-name">Display name</label>
				<input id="register-display-name" type="text" onChange={(e) => setDisplayName(e.target.value)} />

				<label htmlFor="admin" id="admin-label">
					{" "}
					Register as Admin
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

				{isAdmin && (
					<div>
						<label htmlFor="admin-key">Admin Key</label>
						<input
							id="admin-key"
							type="password"
							className="form-control"
							placeholder="Enter the secret admin key..."
							onChange={(e) => setAdminKey(e.target.value)}
						/>
					</div>
				)}
				<button
					id="register-btn"
					className="btn btn-success btn-block btn-lg my-4"
					onClick={(e) => {
						submit(e);
					}}>
					{" "}
					Register{" "}
				</button>
			</form>
		</Container>
	);
}
