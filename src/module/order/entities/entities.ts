import {User} from "../../user/entities/entities.ts";
import {Customer} from "../../customer/entities/entities.ts";
import {Product} from "../../product/entities/entities.ts";

export interface Order {
    uuid?: string
    code?: number
    grossPrice?: number
    netPrice?: number
    discount?: number
    defaultDiscount: number
    totalItems?: number
    totalProducts?: number
    weight?: number
    items?: OrderItem[]
    customer?: Customer
    status?: OrderStatus
    createdAt?: string
    modifiedAt?: string
    operator?: User
}

export interface ManipulateOrderItem {
    products: string[]
    quantity: number
    discount: number
}

export interface ManipulateOrder {
    discount: number
    status: OrderStatus
}

export interface OrderItem {
    quantity: number
    grossPrice: number
    netPrice: number
    discount: number
    weight: number
    product: Product
    createdAt: string
    modifiedAt: string
}

export enum OrderStatus {
    OPEN = 'OPEN',
    CLOSED = 'CLOSED',
    CANCELED = 'CANCELED'
}

export interface OrderResponse {
    order?: Order,
    error?: string
}

export interface OrderListResponse {
    items?: Order[],
    page?: number,
    total?: number,
    error?: string
}