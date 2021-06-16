import React, { useEffect, useState, useContext } from "react";

import { Col, Form, Button, Container, Jumbotron } from "react-bootstrap";
import Axios from "axios";

import UserContext from "../../../context/UserContext";
import { showErrorAlert, showSuccessAlert } from "../../../utils/alerts";
import Loader from "../../misc/Loader";

function CreateNotification() {
	const { userData } = useContext(UserContext);

	const [title, setTitle] = useState("");
	const [message, setMessage] = useState("");
	const [notificationStartDate, setNotificationStartDate] = useState("");
	const [notificationStartTime, setNotificationStartTime] = useState("");
	const [notificationEndDate, setNotificationEndDate] = useState("");
	const [notificationEndTime, setNotificationEndTime] = useState("");

	const [loading, setLoading] = useState(false);

	useEffect(() => {}, []);

	const getNotificationStartDateTime = () => {
		const startDateTime = `${notificationStartDate} ${notificationStartTime}:00.0+05:30`;
		return startDateTime;
	};

	const getNotificationEndDateTime = () => {
		const endDateTime = `${notificationEndDate} ${notificationEndTime}:00.0+05:30`;
		return endDateTime;
	};

	const handleFormSubmit = (e) => {
		e.preventDefault();
		setLoading(true);

		const msgDetails = {
			creator: userData.user,
			title: title,
			message: message,
			notificationStartTime: getNotificationStartDateTime(),
			notificationEndTime: getNotificationEndDateTime(),
		};
		// console.log(testDetails);

		Axios.post("http://localhost:10000/users/createMessage", msgDetails, {
			headers: { "x-auth-token": userData.token },
		})
			.then((_res) => {
				showSuccessAlert("Success", "The message has been sent successfully!");
			})
			.catch((_err) => showErrorAlert())
			.finally(() => {
				setTitle("");
				setMessage("");
				setNotificationStartDate();
				setNotificationStartTime();
				setNotificationEndDate();
				setNotificationEndTime();
				setLoading(false);
			});
	};

	if (loading) return <Loader />;

	return (
		<>
			<Jumbotron className="jbtron">
				<h1 className="text-success text-center">Send Notification</h1>
			</Jumbotron>
			<Container className="shadow-lg p-3 mb-5 bg-white rounded">
				<Form onSubmit={(e) => handleFormSubmit(e)} id="exam-creation-form">
					<fieldset className="border border-secondary p-2 mb-3">
						<legend className="w-auto text-dark">Notification Message</legend>

						<Form.Group controlId="msgtitle">
							<Form.Label>Title</Form.Label>
							<Form.Control
								type="text"
								placeholder="Enter title of message"
								onChange={(e) => {
									setTitle(e.target.value);
								}}
								required
							/>
						</Form.Group>

						<Form.Group controlId="msg">
							<Form.Label>Message</Form.Label>
							<Form.Control
								as="textarea"
								placeholder="Enter your message here..."
								onChange={(e) => {
									setMessage(e.target.value);
								}}
								rows="8"
							/>
						</Form.Group>

						<h3 className="text-center text-primary mb-0">Set Notification Timings</h3>
						<small className="text-center text-secondary d-block mb-4">
							You can set the timings below between which you want the notification to be visible to the
							students
						</small>

						<Form.Row className="align-items-center">
							<Col xs={12} sm={6}>
								<Form.Group controlId="msgstartdate">
									<Form.Label className="text-center d-block">Notification Start Date</Form.Label>
									<Form.Control
										type="date"
										placeholder="Message Start Date"
										onChange={(e) => {
											setNotificationStartDate(e.target.value);
										}}
										required
									/>
								</Form.Group>
							</Col>
							<Col xs={12} sm={6}>
								<Form.Group controlId="msgestarttime">
									<Form.Label className="text-center d-block">Notification Start Time</Form.Label>
									<Form.Control
										type="time"
										placeholder="Message Start Time"
										onChange={(e) => {
											console.log(e.target.value);
											setNotificationStartTime(e.target.value);
										}}
										required
									/>
								</Form.Group>
							</Col>
						</Form.Row>

						<Form.Row className="align-items-center">
							<Col xs="auto" sm={6}>
								<Form.Group controlId="msgenddate">
									<Form.Label className="text-center d-block">Notification End Date</Form.Label>
									<Form.Control
										type="date"
										placeholder="Message End Date"
										onChange={(e) => {
											setNotificationEndDate(e.target.value);
										}}
										required
									/>
								</Form.Group>
							</Col>
							<Col xs="auto" sm={6}>
								<Form.Group controlId="msgendtime">
									<Form.Label className="text-center d-block">Notification End Time</Form.Label>
									<Form.Control
										type="time"
										placeholder="Message End Time"
										onChange={(e) => {
											setNotificationEndTime(e.target.value);
										}}
										required
									/>
								</Form.Group>
							</Col>
						</Form.Row>
					</fieldset>

					<Button variant="primary" className="my-3" block size="lg" type="submit">
						Send Message
					</Button>
				</Form>
			</Container>
		</>
	);
}

export default CreateNotification;
