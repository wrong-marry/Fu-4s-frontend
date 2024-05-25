import { redirect } from "react-router-dom";

export function Logout() {
  localStorage.removeItem("username");
  localStorage.removeItem("token");
  return redirect("/");
}
export function isLoggedIn() {
  const username = getUsername();
  const token = getToken();
  if (!username || !token) {
    return false;
  }
  return true;
}
export function getUsername() {
  return localStorage.getItem("username");
}

export function getToken() {
  return localStorage.getItem("token");
}
