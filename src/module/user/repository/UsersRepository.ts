import {
    User,
    UserResponse,
    UsersListResponse,
    UsersFormType,
    UserDeleteResponse,
    UserWithRolesResponse,
} from "../entities/entities";
import { Role, RoleResponse, RoleDeleteResponse } from "../../modules/enitites/entities";
import { http } from "../../../core/config/api/http.ts";
import { AxiosError } from "axios";

class UsersRepository {
    MODULES_UNEXPECTED_ERROR = "An unexpected erro has occurred";

    async createUser(user: User): Promise<UserResponse> {
        try {
            const response = await http.post(
                "...", {
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
                createdAt: user.createdAt,
                modifiedAt: user.modifiedAt
            }
            );

            return { user: response.data?.module }
        } catch (e) {
            if (e instanceof AxiosError) {
                return { error: e?.response?.data?.error?.message ?? this.MODULES_UNEXPECTED_ERROR }
            }
            return { error: this.MODULES_UNEXPECTED_ERROR }
        }
    }

    async getUsers(): Promise<UsersListResponse> {
        try {
            const response = await http.get(
                "/user/getPagination"
            );

            return { users: response.data?.modules }
        } catch (e) {
            if (e instanceof AxiosError) {
                return { error: e?.response?.data?.error?.message ?? this.MODULES_UNEXPECTED_ERROR }
            }

            return { error: this.MODULES_UNEXPECTED_ERROR }
        }
    }

    async getUserByUUID(userUUID: string): Promise<UserResponse> {
        try {
            const response = await http.get(`/user/getByUUID/${userUUID}`);

            return { user: response.data?.module }
        } catch (e) {
            if (e instanceof AxiosError) {
                return { error: e?.response?.data?.error?.message ?? this.MODULES_UNEXPECTED_ERROR }
            }

            return { error: this.MODULES_UNEXPECTED_ERROR }
        }
    }

    async getUserRoles(userUUID: string): Promise<UserWithRolesResponse> {
        try {
            const response = await http.get(`/roles/rolesPerUser/${userUUID}`);

            return response.data as UserWithRolesResponse;
        } catch (e) {
            if (e instanceof AxiosError) {
                return { error: e?.response?.data?.error?.message ?? this.MODULES_UNEXPECTED_ERROR }
            }

            return { error: this.MODULES_UNEXPECTED_ERROR };
        }
    }
}