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
    createdAt?: string,
    modifiedAt?: string
}

export interface UserResponse {
    user?: User,
    error?: string
}

export interface UsersListResponse {
    users?: User[],
    error?: string
}

export enum UsersFormType {
    EMPTY,
    REGISTER_USER,
    EDIT_USER
}

export interface UserDeleteResponse {
    message?: string,
    error?: string
}

export interface UserWithRolesResponse {
    User?: User,
    roles?: Role[],
    error?: string
}

