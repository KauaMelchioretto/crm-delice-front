import {AuthenticatedResponse, Login, LoginResponse, LogoutResponse} from "../entities/entities.ts";
import {authRepository} from "../repository/AuthRepository.ts";

class AuthUseCase {
    LOGIN_MUST_BE_PROVIDED: string = "The login must be provided"
    PASSWORD_MUST_BE_PROVIDED: string = "The password must be provided"

    async login(login: Login): Promise<LoginResponse> {
        if (!login.login) {
            return {error: this.LOGIN_MUST_BE_PROVIDED}
        }

        if (!login.password) {
            return {error: this.PASSWORD_MUST_BE_PROVIDED}
        }

        return authRepository.login(login)
    }

    async logout(): Promise<LogoutResponse>{
        return authRepository.logout()
    }

    async authenticated(): Promise<AuthenticatedResponse>{
        return authRepository.authenticated()
    }
}

export const authUseCase = new AuthUseCase()