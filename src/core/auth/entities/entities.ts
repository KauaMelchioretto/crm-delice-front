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
    path?: string,
    label?: string,
    roles?: Role[]
}

export interface AuthenticatedResponse{
    user?: never,
    modules?: Module[],
    error?: string
}

export interface ForgotPasswordResponse{
    error?: string
}

export interface ResetPassword{
    token: string,
    newPassword: string,
    confirmPassword: string,
}

export interface ChangePassword{
    newPassword: string,
    confirmPassword: string,
}

export interface ResetPasswordResponse{
    ok?: boolean,
    error?: string
}

export interface ChangeAvatar{
    avatar: string
}

export interface ChangeAvatarResponse{
    ok?: boolean,
    error?: string
}