import {User} from "../../user/entities/entities.ts";
import {Customer} from "../../customer/entities/entities.ts";

export interface Wallet {
    uuid?: string,
    label?: string,
    accountable?: User,
    customers?: Customer[],
    observation?: string,
    status?: WalletStatus,
    createdAt?: string,
    modifiedAt?: string,
    createdBy?: string,
    modifiedBy?: string,
}

export enum WalletStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE"
}

export interface WalletListResponse {
    items?: Wallet[],
    page?: number,
    total?: number,
    error?: string
}

export interface WalletResponse {
    wallet?: Wallet,
    error?: string
}

export enum WalletFormType {
    EMPTY,
    REGISTER_WALLET,
    EDIT_WALLET
}