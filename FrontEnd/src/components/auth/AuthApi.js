import axios from "axios";

const AuthApi = {
	login: async (user, isAdmin) => {
		let serverUrl = "http://localhost:10000/users/login";
		if (isAdmin) serverUrl = "http://localhost:10000/users/login/admin";

		return axios.post(serverUrl, user);
	},

	register: async (user, isAdmin) => {
		let serverUrl = "http://localhost:10000/users/register";
		if (isAdmin) serverUrl = "http://localhost:10000/users/register/admin";

		return axios.post(serverUrl, user);
	},
};

export default AuthApi;
