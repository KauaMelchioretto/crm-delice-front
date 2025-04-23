import {
    User,
    UserResponse,
    UsersListResponse,
    UserWithRolesResponse
} from "../entities/entities";
import { http } from "../../../core/config/api/http.ts";
import { AxiosError } from "axios";

class UsersRepository {
    USERS_UNEXPECTED_ERROR = "An unexpected error has occurred";

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
                return { error: e?.response?.data?.error?.message ?? this.USERS_UNEXPECTED_ERROR }
            }
            return { error: this.USERS_UNEXPECTED_ERROR }
        }
    }

    async getUsers(): Promise<UsersListResponse> {
        try {
            const response = await http.get(
                "/user/getPagination?count=10&page=0"
            );
            console.log(response);
            return { users: response.data?.users.items }
        } catch (e) {
            if (e instanceof AxiosError) {
                return { error: e?.response?.data?.error?.message ?? this.USERS_UNEXPECTED_ERROR }
            }

            return { error: this.USERS_UNEXPECTED_ERROR }
        }
    }

    async getUserByUUID(userUUID: string): Promise<UserResponse> {
        try {
            const response = await http.get(`/user/getByUUID/${userUUID}`);

            return { user: response.data?.module }
        } catch (e) {
            if (e instanceof AxiosError) {
                return { error: e?.response?.data?.error?.message ?? this.USERS_UNEXPECTED_ERROR }
            }

            return { error: this.USERS_UNEXPECTED_ERROR }
        }
    }

    async getUserRoles(userUUID: string): Promise<UserWithRolesResponse> {
        try {
            const response = await http.get(`/roles/rolesPerUser/${userUUID}`);

            return response.data as UserWithRolesResponse;
        } catch (e) {
            if (e instanceof AxiosError) {
                return { error: e?.response?.data?.error?.message ?? this.USERS_UNEXPECTED_ERROR }
            }

            return { error: this.USERS_UNEXPECTED_ERROR };
        }
    }
}

export const usersRepository = new UsersRepository();