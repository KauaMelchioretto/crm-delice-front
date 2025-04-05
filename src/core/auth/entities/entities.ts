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

export interface Role{
    code?: string,
    label?: string
}

export interface Module{
    code?: string,
    roles?: Role[]
}

export interface AuthenticatedResponse{
    user?: never,
    modules?: Module[],
    error?: string
}