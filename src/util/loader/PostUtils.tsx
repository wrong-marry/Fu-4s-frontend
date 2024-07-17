import { BASE_URL } from "../../common/constant";

export async function fetchAuthorUsername(id: string): Promise<string> {
	const response = await fetch(
		`${BASE_URL}/api/v1/post/getUsernameByPostId?id=${id}`,
		{
			method: "GET",
		}
	);
	const data = await response.json();
	return data;
}
