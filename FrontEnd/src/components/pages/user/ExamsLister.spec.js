import React from "react";

import { render, screen, cleanup } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

import ExamsLister from "./ExamsLister";

describe("ExamLister", () => {
	describe("Empty Exam List is passed", () => {
		const stubEmptyExamList = [];
		beforeEach(() => {
			render(
				<BrowserRouter>
					<ExamsLister examsList={stubEmptyExamList} />
				</BrowserRouter>
			);
		});
		afterEach(() => {
			cleanup();
		});

		it("should render No Exams message", () => {
			const element = screen.getByText("No exams", { exact: false });

			expect(element).toBeInTheDocument();
		});
	});

	describe("Live Exam List is passed", () => {
		const stubExamList = [
			{
				examName: "stubExamName",
				creatorName: "stubCreatorName",
				_id: "stubId",
				examStartTime: new Date(),
				examEndTime: new Date(),
			},
		];
		beforeEach(() => {
			render(
				<BrowserRouter>
					<ExamsLister examsList={stubExamList} />
				</BrowserRouter>
			);
		});
		afterEach(() => {
			cleanup();
		});

		it.each`
			testcase          | element
			${"Exam name"}    | ${stubExamList[0].examName}
			${"Exam ID"}      | ${stubExamList[0]._id}
			${"Creator name"} | ${stubExamList[0].creatorName}
		`("should render $testcase on screen", ({ element }) => {
			const section = screen.getByText(element, { exact: false });

			expect(section).toBeInTheDocument();
		});

		it("should render start exam button", () => {
			const button = screen.getByTestId("start-exam-btn");

			expect(button).toBeEnabled();
		});
	});

	describe("Upcoming Exam List is passed", () => {
		const stubExamList = [
			{
				examName: "stubExamName",
				creatorName: "stubCreatorName",
				_id: "stubId",
				examStartTime: new Date(),
				examEndTime: new Date(),
			},
		];
		beforeEach(() => {
			render(
				<BrowserRouter>
					<ExamsLister examsList={stubExamList} disabled />
				</BrowserRouter>
			);
		});
		afterEach(() => {
			cleanup();
		});

		it.each`
			testcase          | element
			${"Exam name"}    | ${stubExamList[0].examName}
			${"Exam ID"}      | ${stubExamList[0]._id}
			${"Creator name"} | ${stubExamList[0].creatorName}
		`("should render $testcase on screen", ({ element }) => {
			const section = screen.getByText(element, { exact: false });

			expect(section).toBeInTheDocument();
		});

		it("should render disabled start exam button", () => {
			const button = screen.getByTestId("start-exam-btn");

			expect(button).toBeDisabled();
		});
	});
});
