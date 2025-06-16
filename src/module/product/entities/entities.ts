export interface Product {
    uuid?: string,
    name?: string,
    code?: string,
    description?: string,
    image?: string,
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

export enum ProductStatus{
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE"
}