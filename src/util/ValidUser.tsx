
import {BASE_URL} from "../common/constant.tsx";

export async function isValidUser(username: string | null, id: string | undefined) {
    const url = `${BASE_URL}/api/v1/post/isValidUser?username=` + username + "&id=" + id;
    return await fetch(url, {
        method: "GET",
    })
}