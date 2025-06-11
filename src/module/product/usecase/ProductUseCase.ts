import {CrmFilter} from "../../../utils/entities/entities.ts";
import {Product, ProductListResponse, ProductResponse} from "../entities/entities.ts";
import {productRepository} from "../repository/ProductRepository.ts";

class ProductUseCase {
    PRODUCT_ID_INVALID = "Product id is invalid"
    PRODUCT_NAME_IS_EMPTY = "Product name is empty"
    PRODUCT_CODE_IS_EMPTY = "Product code is empty"
    PRODUCT_PRICE_IS_EMPTY = "Product price is empty"
    PRODUCT_WEIGHT_IS_EMPTY = "Product weight is empty"

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