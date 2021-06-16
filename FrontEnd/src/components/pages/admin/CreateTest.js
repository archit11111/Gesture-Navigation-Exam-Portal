import React, { useEffect, useState, useContext } from "react";

import Axios from "axios";

import UserContext from "../../../context/UserContext";
import { Jumbotron, Container, Col, Form, Button, Row } from "react-bootstrap";
import Loader from "../../misc/Loader";
import { showErrorAlert, showSuccessAlert } from "../../../utils/alerts";

export default function CreateTest() {
	const { userData } = useContext(UserContext);
	const defaultQuestionObj = {
		question: "",
		questionType: "",
		options: ["", "", "", ""],
		marks: "",
		correctOption: [false, false, false, false],
	};
	const [questions, setQuestions] = useState([defaultQuestionObj]);
	const [examName, setExamName] = useState();
	const [examDescription, setExamDescription] = useState();
	const [examDate, setExamDate] = useState();
	const [startTime, setStartTime] = useState();
	const [endTime, setEndTime] = useState();
	const [timeLimit, setTimeLimit] = useState();
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		console.log(questions);
	}, [questions]);

	const handleQuestionChange = (qidx, qval) => {
		const newQuestionObj = questions.map((question, idx) => {
			if (qidx !== idx) return question;
			return {
				...question,
				question: qval,
			};
		});

		setQuestions(newQuestionObj);
	};

	const handleQuestionTypeChange = (qidx, qtval) => {
		const newQuestionObj = questions.map((question, idx) => {
			if (qidx !== idx) return question;
			return {
				...question,
				questionType: qtval,
			};
		});

		setQuestions(newQuestionObj);
	};

	const handleQuestionOptionsChange = (qidx, optval, optnum) => {
		const newQuestionObj = questions.map((question, idx) => {
			if (qidx !== idx) return question;
			const newOptions = question.options.map((opt, optIdx) => (optIdx !== optnum ? opt : optval));
			return {
				...question,
				options: newOptions,
			};
		});

		setQuestions(newQuestionObj);
	};

	const handleQuestionMarksChange = (qidx, mval) => {
		const newQuestionObj = questions.map((question, idx) => {
			if (qidx !== idx) return question;
			return {
				...question,
				marks: mval,
			};
		});

		setQuestions(newQuestionObj);
	};

	const handleCorrectOptionChange = (qidx, optval, type) => {
		const newQuestionObj = questions.map((question, idx) => {
			if (qidx !== idx) return question;
			let correctOption = null;
			if (type === 1) {
				correctOption = [false, false, false, false];
				correctOption[optval] = true;
			} else if (type === 2) {
				correctOption = [...question.correctOption];
				correctOption[optval] = !correctOption[optval];
			} else {
				correctOption = optval;
			}
			return {
				...question,
				correctOption: correctOption,
			};
		});

		setQuestions(newQuestionObj);
	};

	const handleAddNewQuestion = () => {
		setQuestions(questions.concat(defaultQuestionObj));
	};

	const handleDeletePrevQuestion = () => {
		const newQuestionObj = questions.filter((_, idx) => idx !== questions.length - 1);
		setQuestions(newQuestionObj);
	};

	const getExamStartDateTime = () => {
		const startDateTime = `${examDate} ${startTime}:00.0+05:30`;
		return startDateTime;
	};

	const getExamEndDateTime = () => {
		const endDateTime = `${examDate} ${endTime}:00.0+05:30`;
		return endDateTime;
	};

	const handleFormSubmit = (e) => {
		e.preventDefault();
		setLoading(true);

		const testDetails = {
			creator: userData.user,
			examName: examName,
			examDescription: examDescription,
			examStartDateTime: getExamStartDateTime(),
			examEndDateTime: getExamEndDateTime(),
			timeLimit: Number(timeLimit) * 60 * 1000,
			questions: questions,
		};
		console.log(testDetails);

		Axios.post("http://localhost:10000/users/createTest", testDetails, {
			headers: { "x-auth-token": userData.token },
		})
			.then((res) => {
				// document.getElementById("exam-creation-form").reset();
				showSuccessAlert("Success", "The test has been created successfully!");
			})
			.catch((err) => showErrorAlert())
			.finally(() => {
				setQuestions([defaultQuestionObj]);
				setExamName();
				setExamDescription();
				setExamDate();
				setStartTime();
				setEndTime();
				setLoading(false);
			});
	};

	if (loading) return <Loader />;

	return (
		<>
			<Jumbotron className="jbtron">
				<h1 className="text-success text-center">Test Creation Form</h1>
			</Jumbotron>
			<Container className="shadow-lg p-3 mb-5 bg-white rounded">
				<Form onSubmit={(e) => handleFormSubmit(e)} id="exam-creation-form">
					<fieldset className="border border-secondary p-2 mb-3">
						<legend className="w-auto text-dark">General Test Details</legend>
						<Form.Row className="align-items-center">
							<Col xs="auto" sm={6}>
								<Form.Group controlId="examname">
									<Form.Label>Exam Name</Form.Label>
									<Form.Control
										type="text"
										placeholder="Enter Exam Name"
										onChange={(e) => {
											console.log(e.target.value);
											setExamName(e.target.value);
										}}
										required
									/>
								</Form.Group>
							</Col>
							<Col xs="auto" sm={6}>
								<Form.Group controlId="examdate">
									<Form.Label>Exam Date</Form.Label>
									<Form.Control
										type="date"
										placeholder="Enter Exam Date"
										onChange={(e) => {
											console.log(e.target.value);
											setExamDate(e.target.value);
										}}
										required
									/>
								</Form.Group>
							</Col>
						</Form.Row>

						<Form.Row className="align-items-center">
							<Col xs="auto" sm={4}>
								<Form.Group controlId="examstarttime">
									<Form.Label>Exam Start Time</Form.Label>
									<Form.Control
										type="time"
										placeholder="Exam Start Time"
										onChange={(e) => {
											console.log(e.target.value);
											setStartTime(e.target.value);
										}}
										required
									/>
								</Form.Group>
							</Col>
							<Col xs="auto" sm={4}>
								<Form.Group controlId="examendtime">
									<Form.Label>Exam End Time</Form.Label>
									<Form.Control
										type="time"
										placeholder="Exam End Time"
										onChange={(e) => {
											console.log(e.target.value);
											setEndTime(e.target.value);
										}}
										required
									/>
								</Form.Group>
							</Col>
							<Col xs="auto" sm={4}>
								<Form.Group controlId="examtimelimit">
									<Form.Label>Exam Time Limit (in minutes)</Form.Label>
									<Form.Control
										type="number"
										placeholder="Exam Time Limit"
										onChange={(e) => {
											console.log(e.target.value);
											setTimeLimit(e.target.value);
										}}
										required
									/>
								</Form.Group>
							</Col>
						</Form.Row>

						<Form.Group controlId="question">
							<Form.Label>
								Exam Description <span className="text-secondary">(leave blank if not applicable)</span>
							</Form.Label>
							<Form.Control
								as="textarea"
								placeholder="Enter Details or any Information related to Exam..."
								onChange={(e) => {
									console.log(e.target.value);
									setExamDescription(e.target.value);
								}}
							/>
						</Form.Group>
					</fieldset>
					{questions.map((question, idx) => (
						<fieldset className="question-form border border-secondary p-2 mb-2" key={idx}>
							<legend className="w-auto">Question {idx + 1}</legend>
							<Form.Group controlId="question">
								<Form.Label>Question Description</Form.Label>
								<Form.Control
									type="text"
									placeholder="Enter Question..."
									value={question.question}
									onChange={(e) => {
										handleQuestionChange(idx, e.target.value);
									}}
									required
								/>
							</Form.Group>

							<Form.Row className="align-items-center">
								<Col xs="auto" sm={6}>
									<Form.Group controlId="questiontype">
										<Form.Label>Question Type</Form.Label>
										<Form.Control
											as="select"
											onChange={(e) => handleQuestionTypeChange(idx, e.target.value)}
											required
											defaultValue="">
											<option disabled value="">
												Select Question Type
											</option>
											<option value="radio">Sinlge Correct Multiple Choice</option>
											<option value="checkbox">Multiple correct Multiple Choice</option>
											<option value="number">Numeric Type</option>
										</Form.Control>
									</Form.Group>
								</Col>
								<Col xs="auto" sm={6}>
									<Form.Group controlId="questionmarks">
										<Form.Label>Marks awarded</Form.Label>
										<Form.Control
											type="number"
											placeholder="Enter Marks"
											onChange={(e) => handleQuestionMarksChange(idx, e.target.value)}
											required
										/>
									</Form.Group>
								</Col>
							</Form.Row>
							<Form.Group>
								<Form.Label>
									Question Options{" "}
									<span className="text-secondary">(leave blank if doesn't apply)</span>
								</Form.Label>
								<Form.Control
									type="text"
									placeholder="Option 1"
									value={question.options[0]}
									className="mb-1"
									onChange={(e) => {
										handleQuestionOptionsChange(idx, e.target.value, 0);
									}}
								/>
								<Form.Control
									type="text"
									placeholder="Option 2"
									value={question.options[1]}
									className="mb-1"
									onChange={(e) => {
										handleQuestionOptionsChange(idx, e.target.value, 1);
									}}
								/>
								<Form.Control
									type="text"
									placeholder="Option 3"
									value={question.options[2]}
									className="mb-1"
									onChange={(e) => {
										handleQuestionOptionsChange(idx, e.target.value, 2);
									}}
								/>
								<Form.Control
									type="text"
									placeholder="Option 4"
									value={question.options[3]}
									className="mb-1"
									onChange={(e) => {
										handleQuestionOptionsChange(idx, e.target.value, 3);
									}}
								/>
							</Form.Group>
							{question.questionType === "radio" ? (
								<Form.Group controlId={`questionanswer${idx}`}>
									<Form.Label>Correct Answer / Option No. </Form.Label>
									<br />
									{[0, 1, 2, 3].map((optNum) => (
										<Form.Check
											key={optNum}
											type={"radio"}
											inline
											name={`radio-${idx}`}
											label={`Option - ${optNum + 1}`}
											id={`${idx}-${optNum}`}
											value={optNum}
											onChange={(e) => handleCorrectOptionChange(idx, e.target.value, 1)}
										/>
									))}
								</Form.Group>
							) : question.questionType === "checkbox" ? (
								<Form.Group controlId={`questionanswer${idx}`}>
									<Form.Label>Correct Answer / Option No. </Form.Label>
									<br />
									{[0, 1, 2, 3].map((optNum) => (
										<Form.Check
											key={optNum}
											type={"checkbox"}
											inline
											name={`checkbox-${idx}`}
											label={`Option - ${optNum + 1}`}
											id={`${idx}-${optNum}`}
											value={optNum}
											onChange={(e) => handleCorrectOptionChange(idx, e.target.value, 2)}
										/>
									))}
								</Form.Group>
							) : question.questionType === "number" ? (
								<Form.Group controlId={`questionanswer${idx}`}>
									<Form.Label>Correct Answer / Option No. </Form.Label>
									<Form.Control
										type="number"
										placeholder="Enter Correct Option Number"
										onChange={(e) => handleCorrectOptionChange(idx, e.target.value, 3)}
										step="0.001"
										required
									/>
								</Form.Group>
							) : null}
						</fieldset>
					))}
					<Row className="mt-4">
						<Col xs={6}>
							<Button variant="outline-success" block onClick={handleAddNewQuestion}>
								+Add
							</Button>
						</Col>
						<Col xs={6}>
							<Button
								variant="outline-danger"
								block
								onClick={handleDeletePrevQuestion}
								disabled={questions.length <= 1}
								style={{ cursor: questions.length <= 1 ? "not-allowed" : "pointer" }}>
								-Delete
							</Button>
						</Col>
					</Row>
					<Button variant="primary" className="my-3" block size="lg" type="submit">
						Submit
					</Button>
				</Form>
			</Container>
		</>
	);
}
