import {Role} from "../../modules/enitites/entities"
import {CrmCardStatusProps} from "../../../utils/entities/entities.ts";
import VerifiedRounded from "@mui/icons-material/VerifiedRounded";
import QueryBuilderRounded from "@mui/icons-material/QueryBuilderRounded";
import CancelRounded from "@mui/icons-material/CancelRounded";
import {valueToEnum} from "../../../utils/functions/ValueToEnum.ts";

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

export function getUserStatusProps(status: string): CrmCardStatusProps {
    const value = valueToEnum(status, UserStatus)

    const userStatus = {
        [UserStatus.ACTIVE]: {
            color: "#118D57",
            label: "users.fields.status.active",
            icon: VerifiedRounded,
        },
        [UserStatus.FIRST_ACCESS]: {
            color: "#2685E2",
            label: "users.fields.status.first_access",
            icon: QueryBuilderRounded,
        },
        [UserStatus.INACTIVE]: {
            color: "#ff543f",
            label: "users.fields.status.inactive",
            icon: CancelRounded,
        },
    };

    return userStatus[value] as CrmCardStatusProps
}