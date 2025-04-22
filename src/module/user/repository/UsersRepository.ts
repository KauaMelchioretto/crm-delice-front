import {
    User,
    UserResponse,
} from "../entities/entities";
import { http } from "../../../core/config/api/http.ts";
import { AxiosError } from "axios";

class UsersRepository {
    MODULES_UNEXPECTED_ERROR = "An unexpected error has occurred";

    async createUser(user: User): Promise<UserResponse> {
        try {
            const response = await http.post(
                "/auth/register", {
                    login: user.login,
                    password: user.password,
                    name: user.name,
                    surname: user.surname,
                    email: user.email,
                    userType: user.userType,
                    status: user.status,
                    avatar: user.avatar,
                    document: user.document,
                    phone: user.phone,
                    dateOfBirth: user.dateOfBirth,
                    state: user.state,
                    city: user.city,
                    zipCode: user.zipCode,
                }
            );
            
            return { user: response.data?.user }
        } catch (e) {
            if (e instanceof AxiosError) {
                return {error: e?.response?.data?.error?.message ?? this.MODULES_UNEXPECTED_ERROR}
            }
            return {error: this.MODULES_UNEXPECTED_ERROR}
        }
    }
}

export const usersRepository = new UsersRepository();