import {fetchUser} from "../UserFetchUtil.tsx";

export async function Logout() {
  localStorage.removeItem("username");
  localStorage.removeItem("token");
  window.location.href="/";
}
export function isLoggedIn() {
  const username = getUsername();
  const token = getToken();
  return !(username == null || token == null);
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
  return (await fetchUser())?.data;
}
