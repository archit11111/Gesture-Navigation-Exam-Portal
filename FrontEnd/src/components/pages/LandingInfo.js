import React from "react";

import { Col, Image, Row } from "react-bootstrap";

import "./Landing.css";

export default function LandingInfo() {
	return (
		<div className="landingInfo-container">
			<div className="landingInfo">
				<Row className="my-5 text-image-row">
					<Col>
						<Image
							fluid
							src="https://image.flaticon.com/icons/png/512/2818/2818159.png"
							alt="proctured exam"
							className="landingPage-img"
						/>
					</Col>
					<Col className="m-auto">
						<h3 className="text-success">Gesture Based Navigational Website</h3>
						<span>
							No need to use mouse all the time during your online examination. Relax and just use your
							head!
						</span>
					</Col>
				</Row>
				<Row className="my-5 text-image-row">
					<Col>
						<Image
							fluid
							src="https://image.flaticon.com/icons/svg/2876/2876480.svg"
							alt="home exam"
							className="landingPage-img"
						/>
					</Col>
					<Col className="m-auto">
						<h3 className="text-success">Give Exams from the comfort of your Home</h3>
						<span>
							The website makes it possible to take exams from anywhere. You just need a webcam and an
							internet connection.
						</span>
					</Col>
				</Row>
			</div>

			<h2 className="text-center">Other Features</h2>

			<div className="features-container">
				<div className="feature">
					<Image
						fluid
						src="https://www.flaticon.com/svg/static/icons/svg/1455/1455342.svg"
						alt="low-bandwidth"
						className="feature-img"
					/>
					<small className="feature-text">Low bandwidth Requirement</small>
				</div>
				<div className="feature">
					<Image
						fluid
						src="https://www.flaticon.com/svg/static/icons/svg/1055/1055660.svg"
						alt="secure"
						className="feature-img"
					/>
					<small className="feature-text">Secure Environment</small>
				</div>
				<div className="feature">
					<Image
						fluid
						src="https://www.flaticon.com/svg/static/icons/svg/2103/2103800.svg"
						alt="automated"
						className="feature-img"
					/>
					<small className="feature-text">automated evaluation</small>
				</div>
				<div className="feature">
					<Image
						fluid
						src="https://www.flaticon.com/svg/static/icons/svg/2635/2635146.svg"
						alt="light weight"
						className="feature-img"
					/>
					<small className="feature-text">Lightweight Application</small>
				</div>
			</div>
		</div>
	);
}

//<svg xmlns="http://www.w3.org/2000/svg" width="83" height="78"><g fill="none" fill-rule="evenodd"><path d="M2.476 53.466h71.117v-7.983H2.476v7.983zm49.237 11.977h3.943v3.529H20.413v-3.529h3.942c.656 0 1.185-.529 1.185-1.183v-8.427h24.988v8.427c0 .654.53 1.183 1.185 1.183zM2.476 43.116h71.117V2.95H2.476v40.165zM1.29.585C.635.585.105 1.114.105 1.768V54.65c0 .655.53 1.184 1.185 1.184h21.88v7.243h-3.943c-.655 0-1.185.532-1.185 1.184v5.895c0 .652.53 1.184 1.185 1.184h37.615c.654 0 1.185-.532 1.185-1.184V64.26c0-.652-.531-1.184-1.185-1.184h-3.944v-7.243h21.88c.655 0 1.186-.53 1.186-1.184V1.77c0-.655-.531-1.184-1.185-1.184H1.29z" fill="#62E0D9"/><path d="M36.412 47.92c-.654 0-1.185.53-1.185 1.184a1.185 1.185 0 0 0 2.37 0c0-.653-.531-1.184-1.185-1.184" fill="#62E0D9"/><g transform="translate(55.377 23.07)" stroke="#62E0D9"><rect stroke-width="1.641" fill="#181F2B" x=".821" y=".821" width="25.621" height="52.795" rx="2.462"/><path stroke-width="1.458" fill="#FFF" d="M.729 6.646h25.803v1H.729zM.729 44.515h25.803v1H.729z"/><ellipse stroke-width="1.01" cx="13.038" cy="48.519" rx="1.185" ry="1.183"/></g><g><path d="M45.4 15.969h-.197l-5.235 2.07-5.927-2.07-5.531 1.874c-.198.098-.395.197-.395.493v14.89c0 .297.197.494.494.494h.197l5.235-2.071 5.927 2.07 5.531-1.873c.198-.099.395-.296.395-.493V16.462c0-.296-.197-.493-.494-.493zM39.968 30.76l-5.927-1.997V17.448l5.927 1.997v11.316z" fill="#62E0D9"/><path d="M30.485 15.969c-1.32 0-2.37.917-2.37 2.07 0 1.54 2.37 3.847 2.37 3.847s2.371-2.308 2.371-3.846c0-1.154-1.05-2.071-2.37-2.071zm0 2.958c-.51 0-.911-.361-.911-.821 0-.46.4-.822.911-.822s.912.361.912.822c0 .46-.401.821-.912.821z" fill="#FFF"/></g></g></svg>
