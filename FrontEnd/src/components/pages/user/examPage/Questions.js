import React, { useState, useContext, useEffect } from "react";

import { Button, Form } from "react-bootstrap";
import UserContext from "../../../../context/UserContext";
import Axios from "axios";

function Questions({ examData }) {
	const { userData } = useContext(UserContext);
	const questionData = examData.questions;
	// console.log(examData);
	const user = userData.user.displayName;
	const examID = examData._id;
	const [questionNumber, setQuestionNumber] = useState(0);
	const [selectedAnswers, setSelectedAnswers] = useState({});
	const [markedQuestions, setMarkedQuestions] = useState({});

	useEffect(() => {
		Axios.post(
			"http://127.0.0.1:5000/getAnswers",
			{ user, examID },
			{
				headers: { "x-auth-token": userData.token },
			}
		).then((res) => {
			const data = res.data;
			console.log(data);
			setSelectedAnswers(data.answers);
		});
	}, [examID, user, userData.token]);

	const handleOptionClick = (e, qtype) => {
		let selectedOptions = null;
		if (qtype === 1) {
			selectedOptions = [false, false, false, false];
			selectedOptions[e.target.value] = true;
		} else if (qtype === 2) {
			selectedOptions = selectedAnswers[questionNumber] || [false, false, false, false];
			selectedOptions[e.target.value] = !selectedOptions[e.target.value];
		} else selectedOptions = e.target.value;

		const newSelectedAnswersObj = { ...selectedAnswers, [questionNumber]: selectedOptions };
		console.log(newSelectedAnswersObj);
		setSelectedAnswers(newSelectedAnswersObj);
		// console.log("post", user, examID, newSelectedAnswersObj);
		Axios.post(
			"http://127.0.0.1:5000/saveAnswers",
			{ user, examID, answers: newSelectedAnswersObj },
			{
				headers: { "x-auth-token": userData.token },
			}
		)
			.then((res) => /*console.log(res)*/ null)
			.catch((err) => console.log(err));
	};

	if (questionData.length === 0) return <h1>none</h1>;
	return (
		<>
			<div className="question-container">
				<span className="question">{questionData[questionNumber].question}</span>
			</div>
			<Form className="option-form">
				{questionData[questionNumber].questionType === "radio" ? (
					<div>
						{questionData[questionNumber].options.map((option, index) => (
							<div key={index}>
								<label id={`opt-${index}`} htmlFor={index}>
									<input
										id={index}
										type={"radio"}
										name={"radio"}
										value={index}
										checked={
											!!selectedAnswers[questionNumber] &&
											!!selectedAnswers[questionNumber][index]
										}
										onChange={(e) => handleOptionClick(e, 1)}
									/>
									&emsp;{option}
								</label>
							</div>
						))}
					</div>
				) : questionData[questionNumber].questionType === "checkbox" ? (
					<div>
						{questionData[questionNumber].options.map((option, index) => (
							<Form.Check
								key={index}
								id={`opt-${index}`}
								type={"checkbox"}
								name="checkbox"
								label={option}
								value={index}
								checked={!!selectedAnswers[questionNumber] && !!selectedAnswers[questionNumber][index]}
								onChange={(e) => handleOptionClick(e, 2)}
							/>
						))}
					</div>
				) : (
					<div>
						<Form.Label>Write Your Answer Here</Form.Label>
						<Form.Control
							type="number"
							placeholder="numeric answer"
							onChange={(e) => handleOptionClick(e, 3)}
							defaultValue={!!selectedAnswers[questionNumber] ? selectedAnswers[questionNumber] : ""}
						/>
					</div>
				)}
			</Form>
			<div className="exam-buttons">
				<Button
					id="prev-btn"
					className="prevQuestion"
					disabled={questionNumber === 0}
					onClick={() => {
						setQuestionNumber(questionNumber - 1);
					}}>
					Prev
				</Button>
				<Button
					id="clear-btn"
					className="clear bg-danger"
					onClick={() => {
						setSelectedAnswers({ ...selectedAnswers, [questionNumber]: null });
					}}>
					Clear Answer
				</Button>
				<Button
					id="bookmark-btn"
					className="clear bg-warning"
					onClick={() => {
						setMarkedQuestions({ ...markedQuestions, [questionNumber]: !markedQuestions[questionNumber] });
					}}>
					{!markedQuestions[questionNumber] ? "Bookmark" : "Clear Bookmark"}
				</Button>
				<Button
					id="next-btn"
					className="nextQuestion"
					disabled={questionNumber === questionData.length - 1}
					onClick={() => {
						setQuestionNumber(questionNumber + 1);
					}}>
					Next
				</Button>
			</div>
			<div className="question-navbar">
				{[...Array(questionData.length)].map((_, idx) => (
					<Button
						key={idx}
						className={`bg-${!!selectedAnswers[idx] ? "success" : "secondary"} text-${
							markedQuestions[idx] ? "warning" : questionNumber === idx ? "light" : "dark"
						}`}
						onClick={() => setQuestionNumber(idx)}>
						Question - {idx + 1}
					</Button>
				))}
			</div>
		</>
	);
}

export default Questions;

// <Form.Check
// 	key={index}
// 	id={`opt-${index}`}
// 	type={"radio"}
// 	name="radio"
// 	label={option}
// 	value={index}
// 	checked={!!selectedAnswers[questionNumber] && !!selectedAnswers[questionNumber][index]}
// 	onChange={(e) => handleOptionClick(e, 1)}
// />
