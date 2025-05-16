import {
    AuthenticatedResponse, ChangePassword,
    ForgotPasswordResponse,
    Login,
    LoginResponse,
    LogoutResponse, ResetPassword, ResetPasswordResponse
} from "../entities/entities.ts";
import {authRepository} from "../repository/AuthRepository.ts";

class AuthUseCase {
    LOGIN_MUST_BE_PROVIDED: string = "The login must be provided"
    PASSWORD_MUST_BE_PROVIDED: string = "The password must be provided"
    CONFIRM_PASSWORD_MUST_BE_PROVIDED: string = "The password must be provided"
    EMAIL_MUST_BE_PROVIDED: string = "The e-mail must be provided"

    async login(login: Login): Promise<LoginResponse> {
        if (!login.login) {
            return {error: this.LOGIN_MUST_BE_PROVIDED}
        }

        if (!login.password) {
            return {error: this.PASSWORD_MUST_BE_PROVIDED}
        }

        return authRepository.login(login)
    }

    async logout(): Promise<LogoutResponse> {
        return authRepository.logout()
    }

    async authenticated(): Promise<AuthenticatedResponse> {
        return authRepository.authenticated()
    }

    async forgotPassword(email: string): Promise<ForgotPasswordResponse> {
        if (!email) {
            return {error: this.EMAIL_MUST_BE_PROVIDED}
        }

        return authRepository.forgotPassword(email);
    }

    async resetPassword(resetPassword: ResetPassword): Promise<ResetPasswordResponse> {
        if (!resetPassword.newPassword) {
            return {error: this.PASSWORD_MUST_BE_PROVIDED}
        }
        if (!resetPassword.confirmPassword) {
            return {error: this.CONFIRM_PASSWORD_MUST_BE_PROVIDED}
        }

        return authRepository.resetPassword(resetPassword)
    }

    async changePassword(changePassword: ChangePassword): Promise<ResetPasswordResponse> {
        if (!changePassword.newPassword) {
            return {error: this.PASSWORD_MUST_BE_PROVIDED}
        }
        if (!changePassword.confirmPassword) {
            return {error: this.CONFIRM_PASSWORD_MUST_BE_PROVIDED}
        }

        return authRepository.changePassword(changePassword)
    }
}

export const authUseCase = new AuthUseCase()