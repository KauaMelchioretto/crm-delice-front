import { CrmFilter, CrmOrderBy } from "../../../utils/entities/entities.ts";
import {
    SimpleUserListResponse,
    User,
    UserResponse,
    UserRolesResponse,
    UsersListResponse
} from "../entities/entities.ts";
import {usersRepository} from "../repository/UsersRepository.ts";

class UsersUseCase {
    LOGIN_MUST_BE_PROVIDED = "LOGIN_MUST_BE_PROVIDED"
    PASSWORD_MUST_BE_PROVIDED = "PASSWORD_MUST_BE_PROVIDED"
    NAME_MUST_BE_PROVIDED = "NAME_MUST_BE_PROVIDED"
    EMAIL_MUST_BE_PROVIDED = "EMAIL_MUST_BE_PROVIDED"
    DOCUMENT_MUST_BE_PROVIDED = "DOCUMENT_MUST_BE_PROVIDED"
    DATE_OF_BIRTH_MUST_BE_PROVIDED = "DATE_OF_BIRTH_MUST_BE_PROVIDED"
    CITY_MUST_BE_PROVIDED = "CITY_MUST_BE_PROVIDED"
    STATE_MUST_BE_PROVIDED = "STATE_MUST_BE_PROVIDED"
    ADDRESS_MUST_BE_PROVIDED = "ADDRESS_MUST_BE_PROVIDED"
    ZIP_CODE_MUST_BE_PROVIDED = "ZIP_CODE_MUST_BE_PROVIDED"

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

    async getUsers(page: number, filter: CrmFilter | null, orderBy: CrmOrderBy | null): Promise<UsersListResponse> {
        return usersRepository.getUsers(page, filter, orderBy);
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

    async listSimpleUsers(): Promise<SimpleUserListResponse> {
        return usersRepository.listSimpleUsers()
    }
}

export const usersUseCase = new UsersUseCase();