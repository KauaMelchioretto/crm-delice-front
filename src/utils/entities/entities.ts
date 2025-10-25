import {ReactElement} from "react";
import {SvgIconComponent} from "@mui/icons-material";
import {OptionType} from "../components/core/SelectInput.tsx";

export interface CrmFilter {
    field?: string,
    value?: string
}

export interface CrmOrderBy {
    field?: string,
    sortable?: "asc" | "desc";
}

export enum CrmFieldType {
    Text,
    Date,
}

export interface CrmField {
    label: string
    key: string
    sortable?: boolean
    filterable?: boolean
    filterType?: CrmFieldType
    filterOptions?: OptionType[]
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

export interface CrmCardStatusProps {
    color: string,
    label: string,
    icon: SvgIconComponent
}

export enum CrmModules {
    Home = "HOME",
    Wallet = 'WALLET',
    Customer = 'CUSTOMER',
    CustomerBoard = "CUSTOMER_BOARD",
    User = 'USER_MODULE',
    Product = 'PRODUCT',
    System = 'SYSTEM_ROLES',
    NoPermission = 'NO_PERMISSION',
    Me = 'ME',
    Kanban = 'KANBAN',
    KanbanRule = 'KANBAN_RULE',
    Order = 'ORDER',
    OrderItems = 'ORDER_ITEMS',
    Task = "TASK",
    Calendar = "CALENDAR",
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
    READ_CARD,
    REGISTER_ORDER,
    UPDATE_ORDER,
    REGISTER_ORDER_ITEM,
    REGISTER_TASK,
    EDIT_TASK,
    DETAIL_TASK
}

export enum CrmDefaultRoles {
    CREATE_USER = "CREATE_USER",
    ALL_USER = "ALL_USER",
    ATTACH_ROLES = "ATTACH_ROLES",
    CREATE_CUSTOMER = "CREATE_CUSTOMER",
    ALL_CUSTOMER = "ALL_CUSTOMER",
    APPROVAL_CUSTOMER = "APPROVAL_CUSTOMER",
    CREATE_WALLET = "CREATE_WALLET",
    ALL_WALLET = "ALL_WALLET",
    CREATE_ORDER = "CREATE_ORDER",
    ALL_ORDER = "ALL_ORDER",
    CREATE_PRODUCT = "CREATE_PRODUCT",
    ALL_PRODUCT = "ALL_PRODUCT",
    CREATE_KANBAN = "CREATE_KANBAN",
    ALL_KANBAN = "ALL_KANBAN"
}