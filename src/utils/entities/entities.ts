import {ReactElement} from "react";
import {SvgIconComponent} from "@mui/icons-material";

export interface CrmFilter {
    field?: string,
    value?: string
}

export interface CrmOrderBy {
    field?: string,
    ordenation?: "asc" | "desc";
}

export interface CrmModule {
    element?: ReactElement,
    path: string,
    sideBar: boolean,
    permissionRequired: boolean,
    form?: ReactElement,
    code: string,
    icon?: SvgIconComponent,
    label?: string,
    createLabel?: string,
    editFormType?: CrmFormType,
    createFormType?: CrmFormType,
}

export enum CrmModules {
    Home = "HOME",
    Wallet = 'WALLET',
    Customer = 'CUSTOMER',
    User = 'USER_MODULE',
    Product = 'PRODUCT',
    System = 'SYSTEM_ROLES',
    NoPermission = 'NO_PERMISSION',
    Me = 'ME',
    Kanban = 'KANBAN',
    KanbanRule = 'KANBAN_RULE',
}

export enum CrmFormType {
    EMPTY,
    REGISTER_CUSTOMER,
    EDIT_CUSTOMER,
    APPROVAL_CUSTOMER,
    REGISTER_PRODUCT,
    EDIT_PRODUCT,
    PRODUCT_MEDIA,
    REGISTER_USER,
    EDIT_USER,
    ATTACH_ROLE,
    REGISTER_WALLET,
    EDIT_WALLET,
    EDIT_MY_USER,
    REGISTER_BOARD,
    EDIT_BOARD,
    EDIT_TAGS,
    EDIT_COLUMNS,
    REGISTER_RULE,
    EDIT_RULE,
    REGISTER_ALLOWED_COLUMN,
    READ_CARD
}