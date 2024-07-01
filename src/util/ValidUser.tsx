export async function isValidUser(username: string | null, id: string | undefined) {
    const url = "https://api.fu4s.online.175:8080/api/v1/post/isValidUser?username=" + username + "&id=" + id;
    return await fetch(url, {
        method: "GET",
    })
}