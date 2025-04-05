import {AuthenticatedResponse, Login, LoginResponse, LogoutResponse} from "../entities/entities.ts";
import {http} from "../../config/api/http.ts";
import {AxiosError, HttpStatusCode} from "axios";

class AuthRepository {
    UNEXPECTED_ERROR: string = "Ocorre um erro inesperado"

    async login(login: Login): Promise<LoginResponse> {
        try {
            const response = await http.post(
                "/auth/login",
                login
            )
            return {token: response.data?.token ?? ""}
        } catch (e) {
            if (e instanceof AxiosError) {
                return {error: e?.response?.data?.error?.message ?? this.UNEXPECTED_ERROR}
            }
            return {error: this.UNEXPECTED_ERROR}
        }
    }

    async logout(): Promise<LogoutResponse> {
        try {
            const response = await http.post("/auth/logout")
            if ([HttpStatusCode.Found, HttpStatusCode.Ok].includes(response.status)) {
                return {ok: true}
            }
            return {ok: false}
        } catch (e) {
            if (e instanceof AxiosError) {
                if (e.status === HttpStatusCode.Found) {
                    return {ok: true}
                }
                return {error: e?.response?.data?.error?.message ?? this.UNEXPECTED_ERROR}
            }
            return {error: this.UNEXPECTED_ERROR}
        }
    }

    async authenticated(): Promise<AuthenticatedResponse> {
        try {
            const response = await http.get("/auth/authenticated")

            return {user: response?.data?.user, modules: response?.data?.modules}
        } catch (e) {
            if (e instanceof AxiosError) {
                return {error: e?.response?.data?.error?.message ?? this.UNEXPECTED_ERROR}
            }
            return {error: this.UNEXPECTED_ERROR}
        }
    }
}

export const authRepository = new AuthRepository();