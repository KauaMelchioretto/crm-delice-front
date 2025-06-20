import {CrmFilter} from "../../../utils/entities/entities.ts";
import {
    Product,
    ProductListResponse,
    ProductMedia,
    ProductMediaResponse,
    ProductResponse
} from "../entities/entities.ts";
import {productRepository} from "../repository/ProductRepository.ts";

class ProductUseCase {
    PRODUCT_ID_INVALID = "Product id is invalid"
    PRODUCT_NAME_IS_EMPTY = "Product name is empty"
    PRODUCT_CODE_IS_EMPTY = "Product code is empty"
    PRODUCT_PRICE_IS_EMPTY = "Product price is empty"
    PRODUCT_WEIGHT_IS_EMPTY = "Product weight is empty"
    PRODUCT_MEDIA_IS_EMPTY = "Product images is empty"

    async getProduct(
        page: number,
        filter: CrmFilter | null
    ): Promise<ProductListResponse> {
        return productRepository.getProduct(page, filter)
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
}

export const productUseCase = new ProductUseCase();