import React from "react";

import { Link } from "react-router-dom";
import { Card, Button } from "react-bootstrap";

export default function ExamsLister({ examsList, disabled }) {
	const getTimeLimit = (startTime, endTime) => {
		return `${(new Date(endTime).getTime() - new Date(startTime).getTime()) / (1000 * 60)} mins`;
	};

	const getReadableDate = (date) => {
		return new Date(date).toString();
	};

	if (!examsList.length)
		return (
			<div>
				<h3 className="text-success text-center">No exams found at this moment!</h3>
			</div>
		);
	// console.log(examsList);
	return (
		<div>
			{examsList.map((exam, index) => (
				<Card key={index} className="mb-3">
					<Card.Header className="bg-dark">
						<h3 data-testid="exam-name" className="text-primary">
							{exam.examName}
						</h3>
						<small className="text-light">Exam Created by : {exam.creatorName}</small>
						<small className="text-light float-right">Exam ID : {exam._id}</small>
					</Card.Header>
					<Card.Body className="bg-light">
						<div>
							<b className="text-success">Exam Start Time : </b>
							<span className="text-dark">{getReadableDate(exam.examStartTime)}</span>
						</div>
						<div>
							<b className="text-danger">Exam End Time : </b>
							<span className="text-dark">{getReadableDate(exam.examEndTime)}</span>
						</div>
						<div>
							<b className="text-secondary">Time Limit : </b>
							<span className="text-dark">{getTimeLimit(exam.examStartTime, exam.examEndTime)}</span>
						</div>
						{disabled ? (
							<Button
								variant="primary"
								data-testid="start-exam-btn"
								block
								disabled={disabled}
								style={{ cursor: "not-allowed" }}>
								Start This Exam
							</Button>
						) : (
							<Link to={`/exam/${exam._id}`}>
								<Button data-testid="start-exam-btn" variant="primary" block disabled={disabled}>
									Start This Exam
								</Button>
							</Link>
						)}
					</Card.Body>
				</Card>
			))}
		</div>
	);
}
