import {Wallet} from "../../../../module/wallet/entities/entities.ts";
import {Customer} from "../../../../module/customer/entities/entities.ts";

export interface Board {
    title: string,
    description: string,
    code: string,
    uuid: string,
    columns?: Column[]
}

export interface Column {
    uuid: string,
    code: string,
    title: string,
    allowedColumns: string[]
}

export interface Card {
    uuid: string,
    title: string,
    description: string,
    columnUUID: string,
    movable: boolean,
    hidden?: boolean,
    metadata?: CardMetadata,
    tag?: TaggerComponent,
    status?: TaggerComponent,
}

export interface TaggerComponent {
    color: string,
    description: string
}

export interface CardMetadata {
    wallet?: Wallet,
    customer?: Customer
}