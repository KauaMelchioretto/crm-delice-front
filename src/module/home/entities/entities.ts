import { SimpleProductWithSales } from "../../product/entities/entities"

export interface DashboardCustomerValues {
    pending?: number,
    inactive?: number,
    fit?: number,
    notFit?: number
}

export interface DashboardOrderValues {
    open?: number,
    closed?: number,
    canceled?: number
}

export interface  DashboardRankValues {
    bestProducts?: SimpleProductWithSales[],
    lessProducts?: SimpleProductWithSales[]
}

export interface DashboardResponse<T> {
  data?: T;
  error?: string;
}