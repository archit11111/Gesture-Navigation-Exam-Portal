import React, { useEffect, useContext } from "react";

import { Container, Button, Row, Col } from "react-bootstrap";
import { Link, useHistory, useLocation } from "react-router-dom";
import Bottleneck from "bottleneck";
import Axios from "axios";
// import Webcam from "react-webcam";

import AuthOptions from "../../../auth/AuthOptions";
import UserContext from "../../../../context/UserContext";
import Loader from "../../../misc/Loader";
import Questions from "./Questions";
import TimeRemainingCounter from "./TimeRemainingCounter";
import { showConfirmAlert, showErrorAlert, showSuccessAlert } from "../../../../utils/alerts";

import "./WebcamCapture.css";

function WebcamCapture(/*{ userName, examID, timelimit }*/) {
	const { userData } = useContext(UserContext);
	const serverUrl = "http://127.0.0.1:5000";
	const limiter = new Bottleneck({
		maxConcurrent: 1,
		minTime: 1000,
	});

	const location = useLocation();
	const history = useHistory();
	const examId = location.pathname.substring(6);
	const userName = userData.user.displayName;

	const [examData, setExamData] = React.useState();
	const [timelimit, setTimelimit] = React.useState();
	const [loading, setLoading] = React.useState(true);
	let [loading2, setLoading2] = React.useState(false);
	const [startTime, setStartTime] = React.useState(-1);
	const [timeExpired, setTimeExpired] = React.useState(false);
	const [captureStarted, setCaptureStarted] = React.useState(false);
	// let c = [1, 0];

	let classes = [
		["opt-0", "end-test"],
		["opt-1", "end-test"],
		["opt-2", "end-test"],
		["opt-3", "end-test"],
		["prev-btn", "clear-btn", "bookmark-btn", "next-btn", "end-test"],
	];

	useEffect(() => {
		// setTimeExpired(true);
		Axios.post(
			"http://127.0.0.1:10000/users/fetchExam",
			{ examId },
			{
				headers: { "x-auth-token": userData.token },
			}
		)
			.then((res) => {
				const data = res.data;
				if (new Date(data.examStartTime).getTime() > Date.now()) {
					showErrorAlert("Oops...", "Exam not started yet! Please try again later");
					history.push("/");
				}
				setExamData(data);

				setTimelimit(data.timelimit);
			})
			.catch(() => {
				showErrorAlert();
				history.push("/");
			});
	}, [examId, history, userData.token]);

	// get all values on reload -- case if test already started
	useEffect(() => {
		Axios.post(`${serverUrl}/time`, { user: userName, examID: examId })
			.then((res) => {
				const createdAt = res.data.created_at;
				const finishedAt = res.data.finished_at;

				if (finishedAt !== "-") {
					// finished_at is only logged once user ends test or time expires
					console.log(finishedAt);
					setTimeExpired(true);
					return;
				}

				const timestamp = new Date(createdAt).getTime();
				setStartTime(timestamp);
			})
			.catch((err) => console.log(err))
			.finally(() => setLoading(false));
	}, [examId, userName]);

	const postImageFrames = () => {
		return new Promise((resolve, reject) => {
			const imageSrc = null;
			Axios.post(serverUrl, {
				imageSrc,
				user: userName,
				examID: examId,
				timeLimit: timelimit,
			})
				.then((res) => {
					resolve(res);
				})
				.catch((err) => {
					console.log(err);
					reject();
				});
		});
	};

	const captureHandler = () => {
		if (document.getElementById("exam-container") === null) return;
		limiter
			.schedule(() => postImageFrames())
			// postImageFrames()
			.then((res) => {
				if (loading2) {
					setLoading2(loading2);
				}
				// console.log(res.data);
				const { success, data } = res.data;
				const dir = res.data.direction;
				let row = c[0],
					col = c[1];
				console.log(classes[row][col]);
				if (dir === "left") {
					document.getElementById(classes[row][col]).style.border = null;
					if (col !== 0) col = col - 1;
					document.getElementById(classes[row][col]).style.border = "solid 3px green";
				} else if (dir === "right") {
					document.getElementById(classes[row][col]).style.border = null;
					col = (col + 1) % classes[row].length;
					document.getElementById(classes[row][col]).style.border = "solid 3px green";
				} else if (dir === "up") {
					document.getElementById(classes[row][col]).style.border = null;
					if (row !== 0) row = row - 1;
					document.getElementById(classes[row][col]).style.border = "solid 3px green";
				} else if (dir === "down") {
					document.getElementById(classes[row][col]).style.border = null;
					row = (row + 1) % classes.length;
					document.getElementById(classes[row][col]).style.border = "solid 3px green";
				} else if (dir === "click") {
					document.getElementById(classes[row][col]).click();
				}
				console.log(classes[row][col]);
				c = [row, col];
			})
			.catch((err) => {
				console.log("err", err);
			})
			.finally(() => {
				if (timeExpired) return false;
				else startCaptureHandler();
			});
	};

	const startCaptureHandler = () => {
		setCaptureStarted(true);
		if (startTime === -1) setStartTime(Date.now());
		captureHandler();
	};

	const endTestHandler = (showConfirmation = true) => {
		const endTest = () => {
			Axios.post(`${serverUrl}/end`, { user: userName, examID: examId })
				.then((response) => {
					const data = response.data;
					console.log(data.success === true ? "test ended" : "err");
					setTimeExpired(true);
					showSuccessAlert("Success", "The test was submitted successfully!");
				})
				.catch((err) => console.log(err));
		};
		if (showConfirmation) showConfirmAlert(endTest);
		else endTest();
	};

	if (loading) return <Loader />;

	if (timeExpired) {
		return (
			<Container className="m-auto text-center">
				<h1>Your test has ended!</h1>
				<div className="test-end-logout btn btn-danger btn-lg mr-3">
					<AuthOptions />
				</div>
				<Link to="/">
					<Button variant="success" size="lg">
						Go Home
					</Button>
				</Link>
			</Container>
		);
	}

	return (
		<Container id="exam-container" fluid>
			<Row>
				{startTime === -1 || !captureStarted ? (
					<Col className="question-col m-auto">
						<h1 className="text-success text-center">Important Instructions:</h1>
						<ol className="instructions">
							<li>
								Before start, please ensure you are in a comfortable environment and available for the
								duration of the examination
							</li>
							<li>Ensure that you have selected the correct exam.</li>
						</ol>
					</Col>
				) : loading2 === true ? (
					<Loader />
				) : (
					examData && (
						<Col className="question-col">
							<Questions examData={examData} />
						</Col>
					)
				)}
				{captureStarted ? (
					<Col className="webcam-col">
						<div className="webcam">
							<div className="details-container">
								<Button
									id="end-test-btn"
									className="btn-block btn-lg mb-5"
									variant="danger"
									onClick={endTestHandler}>
									<span>END TEST</span>
								</Button>

								<div id="time-remaining">
									<span className="text-danger">Time Left : </span>
									<TimeRemainingCounter
										startTime={startTime}
										timeLimit={timelimit}
										// setTimeExpired={setTimeExpired}
										endTestHandler={endTestHandler}
									/>
								</div>
							</div>
						</div>
					</Col>
				) : null}
			</Row>
			{startTime === -1 || !captureStarted ? (
				<Button onClick={startCaptureHandler} className="start-button">
					Start
				</Button>
			) : null}
		</Container>
	);
}

export default WebcamCapture;
