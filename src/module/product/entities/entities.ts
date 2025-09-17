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

export interface SimpleProductListResponse{
    products?: SimpleProduct[],
    error?: string
}