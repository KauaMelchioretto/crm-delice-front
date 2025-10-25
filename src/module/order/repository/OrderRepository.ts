import {
    ManipulateOrder,
    ManipulateOrderItem,
    Order,
    OrderListResponse,
    OrderResponse
} from "../entities/entities.ts";
import {AxiosError} from "axios";
import {http} from "../../../core/config/api/http.ts";
import {CrmFilter, CrmOrderBy} from "../../../utils/entities/entities.ts";

class OrderRepository {
    ORDER_UNEXPECTED_ERROR = "An unexpected error has occurred";

    async registerOrder(order: Order): Promise<OrderResponse> {
        try {
            const response = await http.post(
                "/order/createOrder",
                order
            )

            return response.data as OrderResponse
        } catch (e) {
            if (e instanceof AxiosError) {
                return {
                    error:
                        e?.response?.data?.error?.message ??
                        this.ORDER_UNEXPECTED_ERROR,
                };
            }

            return {error: this.ORDER_UNEXPECTED_ERROR};
        }
    }

    async getOrderByUUID(orderUUID: string): Promise<OrderResponse> {
        try {
            const response = await http.get(`/order/getOrderByUUID/${orderUUID}`)

            return response.data as OrderResponse
        } catch (e) {
            if (e instanceof AxiosError) {
                return {
                    error:
                        e?.response?.data?.error?.message ??
                        this.ORDER_UNEXPECTED_ERROR,
                };
            }

            return {error: this.ORDER_UNEXPECTED_ERROR};
        }
    }

    async getPaginatedOrder(
        page: number,
        filter: CrmFilter | null,
        orderBy: CrmOrderBy | null
    ): Promise<OrderListResponse> {
        try {
            let query = "";

            if (filter?.field) {
                query += `&${filter.field}=${filter.value}`;
            } else if (!filter?.field && filter?.value) {
                query += `&allFields=${filter?.value}`;
            }

            if (orderBy?.field) {
                query += `&orderBy=${orderBy?.field}:${orderBy?.sortable}`;
            } else {
                query += `&orderBy=customer`;
            }

            const response = await http.get(
                `/order/getPaginatedOrder?count=10&page=${page}${query}`
            );

            return response.data?.orders as OrderListResponse;
        } catch (e) {
            if (e instanceof AxiosError) {
                return {
                    error:
                        e?.response?.data?.error?.message ??
                        this.ORDER_UNEXPECTED_ERROR,
                };
            }

            return {error: this.ORDER_UNEXPECTED_ERROR};
        }
    }

    async saveItemInOrder(orderUUID: string, item: ManipulateOrderItem): Promise<OrderResponse> {
        try {
            const response = await http.post(
                `/order/saveOrderItem/${orderUUID}`,
                item
            )

            return response.data as OrderResponse
        } catch (e) {
            if (e instanceof AxiosError) {
                return {
                    error:
                        e?.response?.data?.error?.message ??
                        this.ORDER_UNEXPECTED_ERROR,
                };
            }

            return {error: this.ORDER_UNEXPECTED_ERROR};
        }
    }

    async removeItemInOrder(orderUUID: string, item: ManipulateOrderItem): Promise<OrderResponse> {
        try {
            const response = await http.post(
                `/order/removeOrderItem/${orderUUID}`,
                item
            )

            return response.data as OrderResponse
        } catch (e) {
            if (e instanceof AxiosError) {
                return {
                    error:
                        e?.response?.data?.error?.message ??
                        this.ORDER_UNEXPECTED_ERROR,
                };
            }

            return {error: this.ORDER_UNEXPECTED_ERROR};
        }
    }

    async saveOrder(orderUUID: string, order: ManipulateOrder): Promise<OrderResponse> {
        try {
            const response = await http.post(
                `/order/saveOrder/${orderUUID}`,
                order
            )

            return response.data as OrderResponse
        } catch (e) {
            if (e instanceof AxiosError) {
                return {
                    error:
                        e?.response?.data?.error?.message ??
                        this.ORDER_UNEXPECTED_ERROR,
                };
            }

            return {error: this.ORDER_UNEXPECTED_ERROR};
        }
    }
}

export const orderRepository = new OrderRepository()