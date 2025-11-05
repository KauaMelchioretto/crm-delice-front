import {CrmCardStatusProps} from "../../../utils/entities/entities.ts";
import VerifiedRounded from "@mui/icons-material/VerifiedRounded";
import CancelRounded from "@mui/icons-material/CancelRounded";
import {valueToEnum} from "../../../utils/functions/ValueToEnum.ts";

export interface Product {
    uuid?: string,
    name?: string,
    code?: string,
    description?: string,
    images?: ProductMedia[],
    price?: number,
    weight?: number
    status?: ProductStatus,
    createdAt?: string
    modifiedAt?: string
}

export interface ProductResponse{
    product?: Product,
    error?: string
}

export interface ProductListResponse {
    items?: Product[],
    page?: number,
    total?: number,
    error?: string
}

export interface ProductMedia{
    uuid?: string,
    image: string,
    isPrincipal: boolean,
    createdAt?: string,
    modifiedAt?: string,
}

export interface ProductMediaResponse{
    media?: ProductMedia[],
    error?: string
}

export enum ProductStatus{
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE"
}

export interface SimpleProduct{
    uuid: string,
    name: string
}

export interface SimpleProductWithSales{
    uuid: string,
    name: string,
    quantity: number
}


export interface SimpleProductListResponse{
    products?: SimpleProduct[],
    error?: string
}

export function getProductStatusProps(status: string): CrmCardStatusProps {
    const value = valueToEnum(status, ProductStatus)

    const productStatus = {
        [ProductStatus.ACTIVE]: {
            color: "#118D57",
            label: "products.status.active",
            icon: VerifiedRounded,
        },
        [ProductStatus.INACTIVE]: {
            color: "#ff543f",
            label: "products.status.inactive",
            icon: CancelRounded,
        },
    };

    return productStatus[value]
}