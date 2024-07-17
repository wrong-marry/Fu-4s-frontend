import axios from "axios";
import { BASE_URL } from "../common/constant.tsx";

export const emptyUser = {
	username: "",
	firstName: "",
	lastName: "",
	email: "",
	role: "",
	status: "",
};

export const fetchUser = async () => {
	const username = localStorage.getItem("username");
	const api = `${BASE_URL}/api/v1/user?username=` + username;
	try {
		return await axios.get(api, {
			headers: {
				Authorization: "Bearer " + localStorage.getItem("token"),
			},
		});
	} catch (e) {
		console.log("Error fetching user information, try logging in again");
		return { data: { ...emptyUser, firstName: "Unknown" } };
	}
};

export const fetchUserByUsername = async (username: string) => {
	const api =
		`${BASE_URL}/api/v1/guest/get-user-by-username?username=` + username;
	try {
		return await axios.get(api, {});
	} catch (e) {
		console.log("Error fetching user information, try logging in again");
		return { data: { ...emptyUser, firstName: "Unknown" } };
	}
};
