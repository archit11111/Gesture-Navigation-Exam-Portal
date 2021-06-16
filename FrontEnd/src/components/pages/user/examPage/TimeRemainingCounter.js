import React, { useState, useEffect } from "react";

function TimeRemainingCounter({ startTime, timeLimit, endTestHandler }) {
	const [remainingTime, setRemainingTime] = useState("");
	// console.log(startTime, timeLimit);
	useEffect(() => {
		const id = setInterval(() => {
			const timeRemainingInMilliseconds =
				startTime === -1 ? 1000 : Math.max(0, startTime + Number(timeLimit) - Date.now());
			// console.log("Tremain - ", startTime, timeLimit, Date.now());
			// console.log(timeRemainingInMilliseconds);
			const minutes = Math.floor(timeRemainingInMilliseconds / (60 * 1000));
			const seconds = Math.floor((timeRemainingInMilliseconds / 1000) % 60);
			setRemainingTime(`${minutes} : ${seconds} mins`);
			if (timeRemainingInMilliseconds === 0) {
				// setTimeExpired(true);
				endTestHandler(false);
				clearInterval(id);
			}
		}, 1000);

		return () => {
			clearInterval(id);
		};
	});

	return <span>{remainingTime}</span>;
}

export default TimeRemainingCounter;
