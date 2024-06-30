import axios from "axios";

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
    const api = "http://3.27.235.175:8080/api/v1/user?username=" + username;
    try {
        return await axios.get(api, {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        });
    } catch (e) {
        console.log("Error fetching user information, try logging in again")
        return {"data": {...emptyUser, firstName: "Unknown"}};
    }
};
