export async function isValidUser(username: string | null, id: string | undefined) {
    const url = "http://3.27.235.175:8080/api/v1/post/isValidUser?username=" + username + "&id=" + id;
    return await fetch(url, {
        method: "GET",
    })
}