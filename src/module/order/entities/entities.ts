import {User} from "../../user/entities/entities.ts";
import {Customer} from "../../customer/entities/entities.ts";

export interface Order {
    uuid?: string
    code?: number
    grossPrice?: number
    netPrice?: number
    discount?: number
    defaultDiscount: number
    items?: OrderItem[]
    customer?: Customer
    status?: OrderStatus
    createdAt?: string
    modifiedAt?: string
    operator?: User
}

export enum OrderStatus{
    OPEN = 'OPEN',
    CLOSED = 'CLOSED',
    CANCELED = 'CANCELED'
}

export interface OrderItem {
    quantity: number
    grossPrice: number
    netPrice: number
    discount: number
    product: number
    createdAt: string
    modifiedAt: string
}

export interface OrderResponse{
    order?: Order,
    error?: string
}