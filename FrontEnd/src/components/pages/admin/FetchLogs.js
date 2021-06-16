import React, { useEffect, useState } from "react";

import { Link, useLocation } from "react-router-dom";
import { Card, Button, Container, Jumbotron } from "react-bootstrap";

import Axios from "axios";

function FetchLogs() {
	const serverUrl = "http://127.0.0.1:5000";
	const [logs, setLogs] = useState([]);
	const location = useLocation();

	useEffect(() => {
		Axios.get(`${serverUrl}/fetch`)
			.then((response) => {
				const data = response.data;
				console.log(data);
				let logsList = [];
				data.forEach((userLog) => {
					const userLogDetails = {
						name: userLog.name,
						examId: userLog.exam_id,
						creationTime: new Date(userLog.created_at).toLocaleString(),
						finishTime: new Date(userLog.finished_at).toLocaleString(),
						examTimeLimit: `${userLog.time_limit / (1000 * 60)} mins`,
						answers: userLog.answers,
						marksObtained: userLog.marks_obtained,
					};
					if (userLogDetails.finishTime === "Invalid Date") {
						const endTime = new Date(new Date(userLog.created_at).getTime() + userLog.time_limit);
						if (endTime < Date.now()) {
							Axios.post(`${serverUrl}/end`, {
								user: userLog.name,
								examID: userLog.exam_id,
								finishTime: endTime.toString().substring(0, 33).replace("+", "-"),
							})
								.then((res) => {
									userLogDetails.marksObtained = res.data.marks;
									userLogDetails.finishTime = endTime.toLocaleString();
									logsList.push(userLogDetails);
								})
								.catch((err) => {
									console.log(err);
								});
						} else {
							userLogDetails.marksObtained = "-";
							userLogDetails.finishTime = "not yet completed...";
							logsList.push(userLogDetails);
						}
					} else {
						logsList.push(userLogDetails);
					}

					console.log("fetchg", userLog.finished_at);
				});
				console.log(logsList);
				setLogs(logsList);
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);
	return (
		<>
			<Jumbotron className="jbtron">
				{location.pathname !== "/" ? (
					<Link to="/" className="back-button">
						<Button>Go Back</Button>
					</Link>
				) : null}
				<h1 className="text-success text-center">Student Results</h1>
			</Jumbotron>
			<Container className="shadow-lg p-3 mb-5 bg-white rounded">
				{logs.map((userLog, index) => (
					<Card key={index} className="my-4">
						<Card.Header className="bg-dark">
							<h2 className="text-primary">{userLog.name}</h2>
							<small className="text-light">Exam ID : {userLog.examId}</small>
						</Card.Header>
						<Card.Body className="bg-light">
							<div>
								<b className="text-success">Attempt Start Time : </b>
								<span className="text-dark">{userLog.creationTime}</span>
								<span className="text-dark float-right">{userLog.finishTime}</span>
								<b className="text-danger float-right">Attempt End Time : </b>
							</div>

							<div>
								<b className="text-secondary">Time Limit : </b>
								<span className="text-dark">{userLog.examTimeLimit}</span>
							</div>
							<div>
								<b className="text-secondary">Marks Obtained : </b>
								<span className="text-dark">{userLog.marksObtained}</span>
							</div>
							{/*<Link to={`/fetchlogs/${userLog.name}/${userLog.examId}`}>
								<Button variant="primary" block>
									Get more details
								</Button>
							</Link>*/}
						</Card.Body>
					</Card>
				))}
			</Container>
		</>
	);
}

export default FetchLogs;
