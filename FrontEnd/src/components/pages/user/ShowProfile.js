import React, { useEffect, useState, useContext } from "react";

import { Jumbotron, Table, Container, Accordion, Card } from "react-bootstrap";
import UserContext from "../../../context/UserContext";

import Axios from "axios";
import Loader from "../../misc/Loader";

function ShowProfile() {
	const { userData } = useContext(UserContext);
	const [prevExams, setPrevExams] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		Axios.get(`http://localhost:5000/fetch/${userData.user.displayName}`, {
			headers: { "x-auth-token": userData.token },
		})
			.then((res) => {
				const data = res.data;
				setPrevExams(data);
				console.log(data);
			})
			.catch((err) => console.log(err))
			.finally(() => {
				setLoading(false);
			});
	}, [userData.token, userData.user.displayName]);

	if (loading) return <Loader />;

	return (
		<>
			<Jumbotron className="jbtron">
				<h1 className="text-success text-center">Student Profile Dashboard</h1>
			</Jumbotron>
			<Container className="py-5">
				<Table striped bordered hover variant="light">
					<tbody className="text-center">
						<tr>
							<th>Name of Student</th>
							<td>{userData.user.displayName}</td>
						</tr>
						<tr>
							<th>Student Exam ID</th>
							<td>{userData.user.id}</td>
						</tr>
						<tr>
							<th>Registered Email</th>
							<td>{userData.user.email}</td>
						</tr>
						<tr>
							<th>No. of Exams attended previously</th>
							<td>{prevExams.length}</td>
						</tr>
						<tr>
							<th>
								Exams
								<br />
								<small style={{ display: "contents" }} className="text-secondary">
									Click on any exam to view more
								</small>
							</th>

							<td className="p-0">
								<Accordion defaultActiveKey="1">
									{prevExams.map((exam, idx) => (
										<Card key={idx}>
											<Accordion.Toggle
												as={Card.Header}
												eventKey={`${idx + 1}`}
												className="text-info bg-dark">
												Exam - {idx + 1}
											</Accordion.Toggle>
											<Accordion.Collapse eventKey={`${idx + 1}`}>
												<Table bordered striped variant="success" className="m-0">
													<tbody className="text-center">
														<tr>
															<th>Exam ID</th>
															<td>{exam.exam_id}</td>
														</tr>
														<tr>
															<th>Date</th>
															<td>{new Date(exam.created_at).toLocaleDateString()}</td>
														</tr>
														<tr>
															<th>Time Limit</th>
															<td>{exam.time_limit / (1000 * 60)} mins</td>
														</tr>
														<tr>
															<th>Marks Obtained</th>
															<td>{exam.marks_obtained}</td>
														</tr>
													</tbody>
												</Table>
											</Accordion.Collapse>
										</Card>
									))}
								</Accordion>
							</td>
						</tr>
					</tbody>
				</Table>
			</Container>
		</>
	);
}

export default ShowProfile;
