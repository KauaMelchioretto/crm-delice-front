import {Wallet} from "../../wallet/entities/entities.ts";
import {Customer} from "../../customer/entities/entities.ts";
import {MouseEventHandler} from "react";

export interface Board {
    title: string,
    description: string,
    code: string,
    uuid?: string,
    status?: string,
    columns?: Column[]
    cards?: Card[]
}

export interface Column {
    uuid: string,
    description?: string,
    title: string,
    allowedColumns: string[]
}

interface CardChangeEventValues {
    uuid: string,
    toColumnUUID: string
}

type CardOnChange = (event: Event, info: CardChangeEventValues) => void;

export interface Card {
    uuid: string,
    title: string,
    description: string,
    columnUUID: string,
    movable: boolean,
    onClick?: MouseEventHandler,
    onChange?: CardOnChange,
    validateMove?: () => Promise<boolean>,
    hidden?: boolean,
    metadata?: CardMetadata,
    tag?: TaggerComponent,
}

export interface TaggerComponent {
    color: string,
    description: string
}

export interface CardMetadata {
    wallet?: Wallet,
    customer?: Customer
}

export enum KanbanKeys {
    LEADS = "LEAD_BOARD"
}

export enum BoardStatus{
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE"
}

export interface BoardResponse{
    board?: Board
    error?: string
}

export interface BoardListResponse{
    items?: Board[],
    page?: number,
    total?: number,
    error?: string
}

