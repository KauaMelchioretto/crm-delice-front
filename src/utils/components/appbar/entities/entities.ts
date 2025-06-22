import {CrmModules} from "../../../entities/entities.ts";

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