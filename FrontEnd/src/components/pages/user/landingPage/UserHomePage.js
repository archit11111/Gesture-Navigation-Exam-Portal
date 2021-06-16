import React, { useState, useEffect, useContext } from "react";

import Axios from "axios";
import { Tabs, Tab, Jumbotron, Col, Container, Row } from "react-bootstrap";
import UserContext from "../../../../context/UserContext";
import ExamsLister from "../ExamsLister";
import Loader from "../../../misc/Loader";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import PageNotFound404 from "../../../misc/pageNotFound404";
import WebcamCapture from "../examPage/WebcamCapture";
import ShowProfile from "../ShowProfile";

export default function UserHomePage() {
	const { userData } = useContext(UserContext);
	const serverUrl = "http://127.0.0.1:10000/users";

	const [key, setKey] = useState("profile");
	const [ongoingExams, setOngoingExams] = useState([]);
	const [upcomingExams, setUpcomingExams] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		Axios.get(`${serverUrl}/fetchAllExams`, {
			headers: { "x-auth-token": userData.token },
		})
			.then((response) => {
				const data = response.data;
				setOngoingExams(data);
				console.log(data);
				let ongoingExamsList = [],
					upcomingExamsList = [];

				data.forEach((exam) => {
					if (new Date(exam.examEndTime).getTime() < Date.now()) return;
					if (new Date(exam.examStartTime).getTime() < Date.now()) ongoingExamsList.push(exam);
					else upcomingExamsList.push(exam);
				});

				setOngoingExams(ongoingExamsList);
				setUpcomingExams(upcomingExamsList);
			})
			.finally(() => setLoading(false));
	}, [userData.token]);

	if (loading) return <Loader />;

	return (
		<BrowserRouter>
			<Switch>
				<Route exact path="/">
					<Tabs id="controlled-tab-example" className="bg-black" activeKey={key} onSelect={(k) => setKey(k)}>
						<Tab eventKey="profile" title="Profile">
							<ShowProfile />
						</Tab>

						<Tab eventKey="ongoing" title="Live Exams">
							<Container>
								<Row className="mb-3">
									<Col>
										<Jumbotron className="jbtron">
											<h1 className="text-primary text-center">Live Exams</h1>
										</Jumbotron>
										{<ExamsLister examsList={ongoingExams} />}
									</Col>
								</Row>
							</Container>
						</Tab>
						<Tab eventKey="upcoming" title="Upcoming Exams">
							<Container>
								<Row>
									<Col>
										<Jumbotron className="jbtron">
											<h1 className="text-primary text-center">Upcoming Exams</h1>
										</Jumbotron>

										{<ExamsLister examsList={upcomingExams} disabled />}
									</Col>
								</Row>
							</Container>
						</Tab>
						<Tab eventKey="messages" title="Notifications and Messages">
							<Container>
								<Jumbotron className="jbtron">
									<h1 className="text-primary text-center">Messages</h1>
								</Jumbotron>
							</Container>
						</Tab>
					</Tabs>
				</Route>
				<Route exact path="/exam/:id" component={WebcamCapture} />
				<Route path="/" component={PageNotFound404} />
			</Switch>
		</BrowserRouter>
	);
}
// <WebcamCapture timelimit={1000 * 60 * 25} userName={userData.user.displayName} examID="1" />
