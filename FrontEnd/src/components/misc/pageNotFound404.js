import React from "react";

import { Breadcrumb, Button, Col, Container, Image, Row, Card } from "react-bootstrap";

import { Link } from "react-router-dom";
// import SearchIcon from "@material-ui/icons/Search";
// import { Card, Divider } from "@material-ui/core";

export default function PageNotFound404() {
	return (
		<Container fluid>
			<Breadcrumb>
				<Breadcrumb.Item href="/">Home</Breadcrumb.Item>
				<Breadcrumb.Item active>Page Not Found</Breadcrumb.Item>
			</Breadcrumb>
			<Row>
				<Card className="py-4 text-center m-auto">
					<Row>
						<Col xs={12} md={6}>
							<h1>
								<Image
									src="https://cdn1.iconfinder.com/data/icons/university-indigo-vol-2/256/Online_Exam-512.png"
									alt="exam"
									height="50px"
									className="mr-2"
								/>
								<b>Exam Portal</b>
							</h1>
							<h6 className="text-muted">Page not found ...</h6>
							<h5 className="my-4">
								We're sorry, but it looks like you are lost&nbsp;
								<br />
								<br /> The Web address you entered is not a functioning page on our site.
							</h5>
							<Link to="/">
								<Button variant="success" size="lg">
									&nbsp;
									<strong>GO TO HOME</strong>
								</Button>
							</Link>
						</Col>

						<Col md={5} className="m-auto border-left border-dark">
							<Image
								src="https://blog.thomasnet.com/hs-fs/hubfs/shutterstock_774749455.jpg?width=600&name=shutterstock_774749455.jpg"
								alt="404"
								fluid
							/>
						</Col>
					</Row>
				</Card>
			</Row>
		</Container>
	);
}
