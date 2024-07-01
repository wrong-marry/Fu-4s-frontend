export async function loginApi(data: object) {
    return await fetch('https://api.fu4s.online/api/v1/auth/login', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json' // Set content type to JSON
        },
        body: JSON.stringify(data)
    })
}

export async function registerApi(data: object) {
    return await fetch('https://api.fu4s.online/api/v1/auth/register', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json' // Set content type to JSON
        },
        body: JSON.stringify(data)
    })
}

