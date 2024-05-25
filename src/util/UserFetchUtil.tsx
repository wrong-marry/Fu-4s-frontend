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
  const api = "http://localhost:8080/api/v1/user?username=" + username;
  const user = await axios.get(api,{
      headers:{
    Authorization: "Bearer " + localStorage.getItem("token")
  }});
  return user;
};
