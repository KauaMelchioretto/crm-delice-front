export interface Login {
    login: string,
    password: string
}

export interface LoginResponse {
    token?: string,
    error?: string
}

export interface LogoutResponse {
    ok?: boolean,
    error?: string
}