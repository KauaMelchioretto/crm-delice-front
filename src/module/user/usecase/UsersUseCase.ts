import {User, UserResponse, UserRolesResponse, UsersListResponse} from "../entities/entities.ts";
import {usersRepository} from "../repository/UsersRepository.ts";

class UsersUseCase {
    LOGIN_MUST_BE_PROVIDED = "The login must be provided"
    PASSWORD_MUST_BE_PROVIDED = "The password must be provided"
    NAME_MUST_BE_PROVIDED = "The name or surname must be provided"
    EMAIL_MUST_BE_PROVIDED = "The email must be provided"
    DOCUMENT_MUST_BE_PROVIDED = "The document must be provided"
    DATE_OF_BIRTH_MUST_BE_PROVIDED = "The date of birth must be provided"
    CITY_MUST_BE_PROVIDED = "The city of user must be provided"
    STATE_MUST_BE_PROVIDED = "The state of user must be provided"
    ADDRESS_MUST_BE_PROVIDED = "The address of user must be provided"
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
        if (!user.email) {
            return {error: this.EMAIL_MUST_BE_PROVIDED}
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
        if (!user.address) {
            return {error: this.ADDRESS_MUST_BE_PROVIDED}
        }
        if (!user.zipCode) {
            return {error: this.ZIP_CODE_MUST_BE_PROVIDED}
        }
        if (user.phone) {
            user.phone = user.phone.replace(/\D/g, '');
        }

        user.zipCode = user.zipCode.replace("-", "");
        user.document = user.document.replace(/\D/g, '');

        return usersRepository.createUser(user);
    }

    async getUsers(page: number): Promise<UsersListResponse> {
        return usersRepository.getUsers(page);
    }

    async getUserByUUID(userUUID: string): Promise<UserResponse> {
        return usersRepository.getUserByUUID(userUUID);
    }

    async getUserRolesByUUID(userUUID: string): Promise<UserRolesResponse> {
        return usersRepository.getUserRolesByUUID(userUUID);
    }

    async attachRolePerUser(userUUID: string, rolesUUID: string[]): Promise<UserRolesResponse> {
        return usersRepository.attachRolePerUser(userUUID, rolesUUID);
    }

    async saveUser(user: User): Promise<UserResponse> {
        if (!user.name || !user.surname) {
            return {error: this.NAME_MUST_BE_PROVIDED}
        }
        if (!user.email) {
            return {error: this.EMAIL_MUST_BE_PROVIDED}
        }
        if (!user.city) {
            return {error: this.CITY_MUST_BE_PROVIDED}
        }
        if (!user.state) {
            return {error: this.STATE_MUST_BE_PROVIDED}
        }
        if (!user.address) {
            return {error: this.ADDRESS_MUST_BE_PROVIDED}
        }
        if (!user.zipCode) {
            return {error: this.ZIP_CODE_MUST_BE_PROVIDED}
        }
        if (!user.address) {
            return {error: this.ADDRESS_MUST_BE_PROVIDED}
        }
        if (user.phone) {
            user.phone = user.phone.replace(/\D/g, '');
        }

        user.zipCode = user.zipCode.replace("-", "");

        return usersRepository.saveUser(user);
    }
}

export const usersUseCase = new UsersUseCase();