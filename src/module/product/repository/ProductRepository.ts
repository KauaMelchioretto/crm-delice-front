import {
    Product,
    ProductListResponse,
    ProductMedia,
    ProductMediaResponse,
    ProductResponse
} from "../entities/entities.ts";
import {CrmFilter} from "../../../utils/entities/entities.ts";
import {http} from "../../../core/config/api/http.ts";
import {AxiosError} from "axios";

class ProductRepository {
    PRODUCT_UNEXPECTED_ERROR = "An unexpected error has occurred";

    async getProduct(
        page: number,
        filter: CrmFilter | null
    ): Promise<ProductListResponse> {
        try {
            let query = "";

            if (filter) {
                query += `&${filter.field}=${filter.value}`;
            }

            const response = await http.get(
                `/product/getPagination?count=10&page=${page}${query}`
            );

            return response.data?.products as ProductListResponse;
        } catch (e) {
            if (e instanceof AxiosError) {
                return {
                    error:
                        e?.response?.data?.error?.message ??
                        this.PRODUCT_UNEXPECTED_ERROR,
                };
            }

            return {error: this.PRODUCT_UNEXPECTED_ERROR};
        }
    }

    async createProduct(product: Product): Promise<ProductResponse> {
        try {
            const response = await http.post(
                "/product/create",
                product
            );

            return response.data as ProductResponse;
        } catch (e) {
            if (e instanceof AxiosError) {
                return {
                    error:
                        e?.response?.data?.error?.message ??
                        this.PRODUCT_UNEXPECTED_ERROR,
                };
            }

            return {error: this.PRODUCT_UNEXPECTED_ERROR};
        }
    }

    async updateProduct(product: Product): Promise<ProductResponse> {
        try {
            const response = await http.put(
                "/product/update",
                product
            );

            return response.data as ProductResponse;
        } catch (e) {
            if (e instanceof AxiosError) {
                return {
                    error:
                        e?.response?.data?.error?.message ??
                        this.PRODUCT_UNEXPECTED_ERROR,
                };
            }

            return {error: this.PRODUCT_UNEXPECTED_ERROR};
        }
    }

    async getProductUUID(uuid: string): Promise<ProductResponse> {
        try {
            const response = await http.get(
                `/product/getByUUID?uuid=${uuid}`
            );

            return response.data as ProductResponse;
        } catch (e) {
            if (e instanceof AxiosError) {
                return {
                    error:
                        e?.response?.data?.error?.message ??
                        this.PRODUCT_UNEXPECTED_ERROR,
                };
            }

            return {error: this.PRODUCT_UNEXPECTED_ERROR};
        }
    }

    async saveProductMedia(media: ProductMedia[], productUUID: string): Promise<ProductMediaResponse> {
        try {
            const response = await http.post(
                `/product/productMedia/save/${productUUID}`,
                media
            );

            return response.data as ProductMediaResponse;
        } catch (e) {
            if (e instanceof AxiosError) {
                return {
                    error:
                        e?.response?.data?.error?.message ??
                        this.PRODUCT_UNEXPECTED_ERROR,
                };
            }

            return {error: this.PRODUCT_UNEXPECTED_ERROR};
        }
    }
}

export const productRepository = new ProductRepository();