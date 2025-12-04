import {
    ManipulateOrder,
    ManipulateOrderItem,
    Order,
    OrderListResponse,
    OrderResponse
} from "../entities/entities.ts";
import {orderRepository} from "../repository/OrderRepository.ts";
import {CrmFilter, CrmOrderBy} from "../../../utils/entities/entities.ts";

class OrderUseCase {
    ORDER_CUSTOMER_MUST_BE_INFORMED = "ORDER_CUSTOMER_MUST_BE_INFORMED"
    ORDER_PRODUCTS_IS_EMPTY = "ORDER_PRODUCTS_IS_EMPTY"

    async registerOrder(order: Order): Promise<OrderResponse> {
        if (!order.customer?.uuid) {
            return {error: this.ORDER_CUSTOMER_MUST_BE_INFORMED}
        }

        return orderRepository.registerOrder(order)
    }

    async getOrderByUUID(orderUUID: string): Promise<OrderResponse> {
        return orderRepository.getOrderByUUID(orderUUID)
    }

    async getPaginatedOrder(
        page: number,
        filter: CrmFilter | null,
        orderBy: CrmOrderBy | null
    ): Promise<OrderListResponse> {
        return orderRepository.getPaginatedOrder(page, filter, orderBy)
    }

    async saveItemInOrder(orderUUID: string, item: ManipulateOrderItem): Promise<OrderResponse> {
        if (item.products.length === 0) {
            return {error: this.ORDER_PRODUCTS_IS_EMPTY}
        }

        return orderRepository.saveItemInOrder(orderUUID, item)
    }

    async removeItemInOrder(orderUUID: string, item: ManipulateOrderItem): Promise<OrderResponse> {
        if (item.products.length === 0) {
            return {error: this.ORDER_PRODUCTS_IS_EMPTY}
        }

        return orderRepository.removeItemInOrder(orderUUID, item)
    }

    async saveOrder(orderUUID: string, order: ManipulateOrder): Promise<OrderResponse> {
        return orderRepository.saveOrder(orderUUID, order)
    }
}

export const orderUseCase = new OrderUseCase()