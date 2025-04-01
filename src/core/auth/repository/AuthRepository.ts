import {Login, LoginResponse, LogoutResponse} from "../entities/entities.ts";
import {http} from "../../config/api/http.ts";
import {HttpStatusCode} from "axios";

class AuthRepository {
    async login(login: Login): Promise<LoginResponse> {
        const response = await http.post(
            "/auth/login",
            login
        )
        if (response.status === HttpStatusCode.Ok) {
            return {token: response.data?.token ?? ""}
        } else {
            return {error: response.data?.error ?? ""}
        }
    }

    async logout(): Promise<LogoutResponse> {
        const response = await http.post("/auth/logout")
        if (response.status === HttpStatusCode.Found) {
            return {ok: true}
        }
        return {ok: false}
    }
}

export const authRepository = new AuthRepository();