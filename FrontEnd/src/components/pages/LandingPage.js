import React, { useContext } from "react";

import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";

import UserContext from "../../context/UserContext";
import AdminHomePage from "./admin/landingPage/AdminHomePage";
import UserHomePage from "./user/landingPage/UserHomePage";
import LandingInfo from "./LandingInfo";

import "./Landing.css";

export default function LandingPage() {
	const { userData } = useContext(UserContext);
	console.log(userData);

	return (
		<div className="page">
			{userData.user && userData.user.admin ? (
				<AdminHomePage />
			) : userData.user ? (
				<UserHomePage />
			) : (
				<>
					<Container className="text-center mb-0">
						<h2 className="text-danger">You are currently not logged in!</h2>
						<h2>
							Please <Link to="/login">Login</Link> / <Link to="/register">Register</Link> to continue
						</h2>
					</Container>
					<LandingInfo />
				</>
			)}
		</div>
	);
}
