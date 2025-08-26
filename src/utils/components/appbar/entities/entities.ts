import {CrmModules} from "../../../entities/entities.ts";
import {User} from "../../../../module/user/entities/entities.ts";

export interface MenuResponse {
    menu?: Menu,
    error?: string
}

export interface Menu {
    totalResults: number,
    result?: MenuOption[]
}

export interface MenuOption {
    type: CrmModules,
    values: MenuOptionValue[]
}

export interface MenuOptionValue {
    uuid: string,
    value: string
}

export interface Notification {
    uuid: string,
    message: string,
    title: string,
    sender: User,
    receivers?: User[],
}