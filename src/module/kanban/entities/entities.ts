import {Wallet} from "../../wallet/entities/entities.ts";
import {Customer} from "../../customer/entities/entities.ts";

export interface Board {
    title: string,
    description: string,
    code: string,
    uuid?: string,
    status?: string,
    columns?: Column[],
    cards?: Card[],
    tags?: Tag[]
}

export interface Column {
    uuid?: string,
    boardUUID?: string,
    description?: string,
    title: string,
    type: ColumnType,
    code: string,
    index?: number,
    allowedColumns?: string[],
    isDefault?: boolean,
    rules?: ColumnRule[]
}

export interface ReorderColumn {
    uuid: string,
    index: number
}

export enum ColumnType {
    COUNTER = "COUNTER",
    VALUE = "VALUE",
    NONE = "NONE",
}

interface CardChangeEventValues {
    uuid: string,
    toColumnUUID: string
}

type CardOnChange = (event: Event, info: CardChangeEventValues) => void;

export interface Card {
    uuid: string,
    code: string,
    title: string,
    description: string,
    columnUUID: string,
    onChange?: CardOnChange,
    hidden?: boolean,
    metadata?: CardMetadata,
    tag?: Tag,
    modifiedAt: string
}

export interface Tag {
    uuid?: string,
    boardUUID: string,
    title: string,
    color: string,
    description: string,
    status?: TagStatus,
}

export interface CardMetadata {
    wallet?: Wallet,
    customer?: Customer
}

export enum KanbanKeys {
    LEADS = "LEADS"
}

export enum BoardStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE"
}

export enum TagStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE"
}

export interface BoardResponse {
    board?: Board
    error?: string
}

export interface BoardListResponse {
    items?: Board[],
    page?: number,
    total?: number,
    error?: string
}

export interface TagResponse {
    tag?: Tag,
    error?: string
}

export interface TagListResponse {
    tags?: Tag[],
    error?: string
}

export interface ColumnListResponse {
    columns?: Column[],
    error?: string
}

export interface MessageBoardResponse {
    message?: string,
    error?: string
}

export interface ColumnRuleForm {
    uuid?: string,
    columnUUID?: string,
    title: string,
    type: ColumnRuleType,
    emails?: { value: string }[],
    notifyUsers?: { uuid: string }[],
    tag?: string
}

export interface ColumnRule {
    uuid?: string,
    columnUUID: string,
    title: string,
    type: ColumnRuleType,
    metadata?: ColumnRuleMetadata
}

export interface ColumnRuleMetadata {
    emails?: string[],
    notifyUsers?: string[],
    tag?: string
}

export interface ColumnRuleResponse {
    columnRule?: ColumnRule,
    error?: string
}

export interface ColumnResponse {
    column?: Column,
    error?: string
}

export interface CardListResponse {
    cards?: Card[],
    error?: string
}

export interface CardResponse{
    card?: Card,
    error?: string
}

export enum ColumnRuleType {
    SEND_EMAIL = "SEND_EMAIL",
    NOTIFY_USER = "NOTIFY_USER",
    ADD_TAG = "ADD_TAG",
    REMOVE_TAG = "REMOVE_TAG",
    VALIDATE_CUSTOMER = "VALIDATE_CUSTOMER",
    VALIDATE_CUSTOMER_WALLET = "VALIDATE_CUSTOMER_WALLET",
    REVIEW_CUSTOMER = "REVIEW_CUSTOMER",
    REPROVE_CUSTOMER = "REPROVE_CUSTOMER",
    NOT_MOVABLE = "NOT_MOVABLE",
    APPROVE_CUSTOMER = "APPROVE_CUSTOMER",
}

export interface ColumnRuleTypeListResponse{
    rules?: ColumnRuleType,
    error?: string
}