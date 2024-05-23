import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

export default function UserProfilePage() {
  const emptyUser = {
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    status: "",
  };
  const [queryParameters] = useSearchParams();
  const username = queryParameters.get("username");
  const api = "http://localhost:8080/api/v1/user?username="+username;
  const [user, setUser] = useState(emptyUser);
  useEffect(() => {
    const fetch = async () => {
      console.log(api);
      await axios.get(api).then((res) => {
        setUser(res.data);
      });
    };
    fetch();
  } ,[]);
  console.log("duoiu");
  return <>{user.firstName}</>;
}
