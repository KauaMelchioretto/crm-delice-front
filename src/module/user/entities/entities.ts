import { Role } from "../../modules/enitites/entities"

export interface User {
    uuid?: string,
    login: string,
    password: string,
    name: string,
    surname: string,
    email: string,
    userType: string,
    status?: string,
    avatar?: string,
    document: string,
    phone?: string,
    dateOfBirth: string,
    state?: string,
    city?: string,
    zipCode?: string,
    address?: string,
    createdAt?: string,
    modifiedAt?: string
}

export interface UserResponse {
    user?: User,
    error?: string
}

export interface UsersListResponse {
    users?: User[],
    page?: number,
    total?: number,
    error?: string
}

export enum UsersFormType {
    EMPTY,
    REGISTER_USER,
    EDIT_USER,
    ATTACH_ROLE
}

export interface UserRolesResponse {
    roles?: Role[],
    error?: string
}

