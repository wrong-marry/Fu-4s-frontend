export async function isValidUser(username: string | null, id : string | undefined) {
    const url = "http://localhost:8080/api/v1/questionSet/isValidUser?username=" + username +"&id=" + id;
    return await fetch(url, {
        method: "GET",
    })
}