export enum MenuOptionType {
    Customer = 'CUSTOMER_MODULE',
    User = 'USER_MODULE',
    Wallet = 'WALLET_MODULE',
    Product = 'PRODUCT_MODULE',
}

export interface MenuResponse {
    menu?: Menu,
    error?: string
}

export interface Menu {
    totalResults: number,
    result?: MenuOption[]
}

export interface MenuOption {
    type: MenuOptionType,
    values: MenuOptionValue[]
}

export interface MenuOptionValue {
    uuid: string,
    value: string
}