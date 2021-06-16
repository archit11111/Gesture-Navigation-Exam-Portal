import "@testing-library/jest-dom/extend-expect";

// Mock useHistory hook -> history.push()
jest.mock("react-router-dom", () => ({
	...jest.requireActual("react-router-dom"),
	useHistory: () => ({
		push: jest.fn(),
	}),
}));
