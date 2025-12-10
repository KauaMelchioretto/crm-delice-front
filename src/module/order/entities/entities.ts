import {User} from "../../user/entities/entities.ts";
import {Customer} from "../../customer/entities/entities.ts";
import {Product} from "../../product/entities/entities.ts";
import {CrmCardStatusProps} from "../../../utils/entities/entities.ts";
import VerifiedRounded from "@mui/icons-material/VerifiedRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import TurnedInRoundedIcon from "@mui/icons-material/TurnedInRounded";
import {valueToEnum} from "../../../utils/functions/ValueToEnum.ts";
import {t} from "i18next";

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
    OPEN = "OPEN",
    CLOSED = "CLOSED",
    CANCELED = "CANCELED"
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

export function getOrderStatusProps(status: string): CrmCardStatusProps {
    const value = valueToEnum(status, OrderStatus)

    const orderStatus = {
        [OrderStatus.OPEN]: {
            color: "#2685E2",
            label: t('orders.status.open'),
            icon: VerifiedRounded,
        },
        [OrderStatus.CANCELED]: {
            color: "#ff543f",
            label: t('orders.status.canceled'),
            icon: CancelRoundedIcon,
        },
        [OrderStatus.CLOSED]: {
            color: "#1f7a1f",
            label: t('orders.status.closed'),
            icon: TurnedInRoundedIcon,
        },
    };

    return orderStatus[value]
}