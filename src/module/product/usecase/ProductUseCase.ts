import {CrmFilter, CrmOrderBy} from "../../../utils/entities/entities.ts";
import {
    Product,
    ProductListResponse,
    ProductMedia,
    ProductMediaResponse,
    ProductResponse, SimpleProductListResponse
} from "../entities/entities.ts";
import {productRepository} from "../repository/ProductRepository.ts";

class ProductUseCase {
    PRODUCT_ID_INVALID = "PRODUCT_ID_INVALID"
    PRODUCT_NAME_IS_EMPTY = "PRODUCT_NAME_IS_EMPTY"
    PRODUCT_CODE_IS_EMPTY = "PRODUCT_CODE_IS_EMPTY"
    PRODUCT_PRICE_IS_EMPTY = "PRODUCT_PRICE_IS_EMPTY"
    PRODUCT_WEIGHT_IS_EMPTY = "PRODUCT_WEIGHT_IS_EMPTY"
    PRODUCT_MEDIA_IS_EMPTY = "PRODUCT_MEDIA_IS_EMPTY"
    
    async getProduct(
        page: number,
        filter: CrmFilter | null,
        orderBy: CrmOrderBy | null
    ): Promise<ProductListResponse> {
        return productRepository.getProduct(page, filter, orderBy)
    }

    async createProduct(product: Product): Promise<ProductResponse> {
        const validate = this.validateProduct(product)

        if (validate.error) {
            return {error: validate.error}
        }

        return productRepository.createProduct(product)
    }

    async updateProduct(product: Product): Promise<ProductResponse> {
        const validate = this.validateProduct(product)

        if (validate.error) {
            return {error: validate.error}
        }

        if (!product.uuid) {
            return {error: this.PRODUCT_ID_INVALID}
        }

        return productRepository.updateProduct(product)
    }

    async getProductUUID(uuid: string): Promise<ProductResponse> {
        if (!uuid) {
            return {error: this.PRODUCT_ID_INVALID}
        }

        return productRepository.getProductUUID(uuid)
    }

    async saveProductMedia(media: ProductMedia[], productUUID: string): Promise<ProductMediaResponse> {
        if (!productUUID) {
            return {error: this.PRODUCT_ID_INVALID}
        }
        if (!media) {
            return {error: this.PRODUCT_MEDIA_IS_EMPTY}
        }

        media = media.map(x => ({...x, uuid: ""}))

        return productRepository.saveProductMedia(media, productUUID)
    }

    validateProduct(product: Product): ProductResponse {
        if (!product.name) {
            return {error: this.PRODUCT_NAME_IS_EMPTY}
        }
        if (!product.code) {
            return {error: this.PRODUCT_CODE_IS_EMPTY}
        }
        if (!product.price) {
            return {error: this.PRODUCT_PRICE_IS_EMPTY}
        }
        if (!product.weight) {
            return {error: this.PRODUCT_WEIGHT_IS_EMPTY}
        }
        return {}
    }

    async getSimpleProducts(): Promise<SimpleProductListResponse>{
        return productRepository.getSimpleProducts()
    }
}

export const productUseCase = new ProductUseCase();