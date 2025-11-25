import { SimpleProductWithSales } from "../../product/entities/entities"

export interface DashboardCustomerValues {
    pending?: number,
    inactive?: number,
    fit?: number,
    notFit?: number,
    error?: string
}

export interface DashboardOrderValues {
    open?: number,
    closed?: number,
    canceled?: number,
    error?: string
}

export interface  DashboardRankValuesProducts {
    products?: SimpleProductWithSales[],
    error?: string
}

export interface DashboardMonthSold {
    monthYear: string;
    total: number;
}

export interface DashboardMonthSoldResponse {
    dashboardMonthSold?: DashboardMonthSold[];
    error?: string;
}

export interface DashboardResponse<T> {
  data?: T;
  error?: string;
}