import {User, UserResponse, UsersListResponse, UserWithRolesResponse} from "../entities/entities.ts";
import {usersRepository} from "../repository/UsersRepository.ts";

class UsersUseCase {
    LOGIN_MUST_BE_PROVIDED = "The login must be provided"
    PASSWORD_MUST_BE_PROVIDED = "The password must be provided"
    NAME_MUST_BE_PROVIDED = "The name or surname must be provided"
    DOCUMENT_MUST_BE_PROVIDED = "The document must be provided"
    DATE_OF_BIRTH_MUST_BE_PROVIDED = "The date of birth must be provided"
    CITY_MUST_BE_PROVIDED = "The city of user must be provided"
    STATE_MUST_BE_PROVIDED = "The state of user must be provided"
    ZIP_CODE_MUST_BE_PROVIDED = "The zip code of user must be provided"

    async createUser(user: User): Promise<UserResponse> {
        if (!user.login) {
            return {error: this.LOGIN_MUST_BE_PROVIDED}
        }
        if (!user.password) {
            return {error: this.PASSWORD_MUST_BE_PROVIDED}
        }
        if (!user.name || !user.surname) {
            return {error: this.NAME_MUST_BE_PROVIDED}
        }
        if (!user.document) {
            return {error: this.DOCUMENT_MUST_BE_PROVIDED}
        }
        if (!user.dateOfBirth) {
            return {error: this.DATE_OF_BIRTH_MUST_BE_PROVIDED}
        }
        if (!user.city) {
            return {error: this.CITY_MUST_BE_PROVIDED}
        }
        if (!user.state) {
            return {error: this.STATE_MUST_BE_PROVIDED}
        }
        if (!user.zipCode) {
            return {error: this.ZIP_CODE_MUST_BE_PROVIDED}
        }
        return usersRepository.createUser(user);
    }

    async getUsers(): Promise<UsersListResponse> {
        return usersRepository.getUsers();
    }

    async getUserByUUID(userUUID: string): Promise<UserResponse> {
        return usersRepository.getUserByUUID(userUUID);
    }

    async getUserRoles(userUUID: string): Promise<UserWithRolesResponse> {
        return usersRepository.getUserRoles(userUUID);
    }
}

export const usersUseCase = new UsersUseCase();