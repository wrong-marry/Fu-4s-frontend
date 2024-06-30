export async function loginApi(data: object) {
    return await fetch('http://3.27.235.175:8080/api/v1/auth/login', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json' // Set content type to JSON
        },
        body: JSON.stringify(data)
    })
}

export async function registerApi(data: object) {
    return await fetch('http://3.27.235.175:8080/api/v1/auth/register', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json' // Set content type to JSON
        },
        body: JSON.stringify(data)
    })
}

