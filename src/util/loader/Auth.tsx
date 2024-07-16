import {fetchUser} from "../UserFetchUtil.tsx";

type User = {
	status: string;
};

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

export async function getAuthCredentials(): Promise<User | null> {
	const authToken = getToken();
	const username = getUsername();

	if (!authToken || !username) {
		return null;
	}
	const user = await fetchUser();
	if (!user || !user.data) {
		return null;
	}

	return user?.data;
}
