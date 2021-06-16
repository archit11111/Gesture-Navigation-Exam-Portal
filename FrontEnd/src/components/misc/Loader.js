import React from "react";
import { Spinner } from "react-bootstrap";

import "./Loader.css";

export default function Loader() {
	return (
		<div className="loader_container">
			<Spinner animation="border" className="loader" variant="danger" role="status">
				<span className="sr-only">Loading...</span>
			</Spinner>
		</div>
	);
}
