import {Role} from "../../modules/enitites/entities"

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
    roles?: string[],
    createdAt?: string,
    modifiedAt?: string
}

export interface UserResponse {
    user?: User,
    error?: string
}

export interface UsersListResponse {
    items?: User[],
    page?: number,
    total?: number,
    error?: string
}

export interface UserRolesResponse {
    roles?: Role[],
    error?: string
}

export interface SimpleUser {
    uuid?: string,
    login?: string,
    userName?: string
}

export interface SimpleUserListResponse {
    users?: SimpleUser[],
    error?: string
}

export enum UserStatus {
    ACTIVE = 0,
    INACTIVE = 1,
    FIRST_ACCESS = 2
}

export enum UserType {
    DEV = "DEV",
    OWNER = "OWNER",
    EMPLOYEE = "EMPLOYEE"
}