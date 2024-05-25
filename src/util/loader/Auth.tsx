import { redirect } from "react-router-dom";
import {fetchUser} from "../UserFetchUtil.tsx";

export function Logout() {
  localStorage.removeItem("username");
  localStorage.removeItem("token");
  window.location.href="/";
}
export function isLoggedIn() {
  const username = getUsername();
  const token = getToken();
    if (username == null || token == null) {
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

export async function getAuthCredentials() {
  const authToken = getToken();
  const username = getUsername();

  if (!authToken || !username) {
    return null;
  }
  return (await fetchUser()).data;
}
