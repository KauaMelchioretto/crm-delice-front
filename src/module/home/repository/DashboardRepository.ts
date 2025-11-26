import {
    DashboardCustomerValues,
    DashboardMonthSoldResponse,
    DashboardOrderValues,
    DashboardRankValuesProducts,
    DashboardResponse,
} from "../entities/entities.ts";
import { http } from "../../../core/config/api/http.ts";
import { AxiosError } from "axios";
import { SimpleWallet } from "../../wallet/entities/entities.ts";
import { SimplesSalesUser } from "../../user/entities/entities.ts";

class DashboardRepository {
    DASHBOARD_UNEXPECTED_ERROR = "DASHBOARD_UNEXPECTED_ERROR";

    // Função para construir query string que força %20 em vez de +
    private buildQueryString(params?: Record<string, string>): string {
        if (!params || Object.keys(params).length === 0) {
            return '';
        }

        const searchParams = new URLSearchParams();
        
        Object.entries(params).forEach(([key, value]) => {
            // Usar encodeURIComponent que codifica espaços como %20
            searchParams.append(key, value);
        });

        // Converter para string e substituir + por %20
        return `?${searchParams.toString().replace(/\+/g, '%20')}`;
    }

    async getDashboardCustomer(params?: Record<string, string>): Promise<DashboardCustomerValues> {
        try {
            const queryString = this.buildQueryString(params);
            const url = `/dashboard/customer${queryString}`;
            const response = await http.get(url);
            return response.data.dashboardCustomerValues as DashboardCustomerValues;
        } catch (e) {
            if (e instanceof AxiosError) {
                return {
                    error:
                        e?.response?.data?.error?.code ??
                        this.DASHBOARD_UNEXPECTED_ERROR,
                };
            }

            return { error: this.DASHBOARD_UNEXPECTED_ERROR };
        }
    }

    async getDashboardOrder(params?: Record<string, string>): Promise<DashboardOrderValues> {
        try {
            const queryString = this.buildQueryString(params);
            const url = `/dashboard/order${queryString}`;
            const response = await http.get(url);
            return response.data.dashboardOrderValues as DashboardOrderValues;
        } catch (e) {
            if (e instanceof AxiosError) {
                return {
                    error:
                        e?.response?.data?.error?.code ??
                        this.DASHBOARD_UNEXPECTED_ERROR,
                };
            }

            return { error: this.DASHBOARD_UNEXPECTED_ERROR };
        }
    }

    async getDashboardRankBest(params?: Record<string, string>): Promise<DashboardRankValuesProducts> {
        try {
            const queryString = this.buildQueryString(params);
            const url = `/dashboard/rank/best/products${queryString}`;
            const response = await http.get(url);
            return response.data.dashboardRankValuesBest || [];
        } catch (e) {
            if (e instanceof AxiosError) {
                return {
                    error:
                        e?.response?.data?.error?.code ??
                        this.DASHBOARD_UNEXPECTED_ERROR,
                };
            }
            return { error: this.DASHBOARD_UNEXPECTED_ERROR };
        }
    }

    async getDashboardRankLess(params?: Record<string, string>): Promise<DashboardRankValuesProducts> {
        try {
            const queryString = this.buildQueryString(params);
            const url = `/dashboard/rank/less/products${queryString}`;
            const response = await http.get(url);
            return response.data.dashboardRankValuesLess || [];
        } catch (e) {
            if (e instanceof AxiosError) {
                return {
                    error:
                        e?.response?.data?.error?.code ??
                        this.DASHBOARD_UNEXPECTED_ERROR,
                };
            }
            return { error: this.DASHBOARD_UNEXPECTED_ERROR };
        }
    }

    async getDashboardTotalSold(params?: Record<string, string>): Promise<DashboardResponse<number>> {
        try {
            const queryString = this.buildQueryString(params);
            const url = `/dashboard/totalSold${queryString}`;
            const response = await http.get(url);
            const total = response.data.dashboardTotalSold as number;
            return { data: total };
        } catch (e) {
            if (e instanceof AxiosError) {
                return {
                    error:
                        e?.response?.data?.error?.code ??
                        this.DASHBOARD_UNEXPECTED_ERROR,
                };
            }
            return { error: this.DASHBOARD_UNEXPECTED_ERROR };
        }
    }

    async getDashboardMostWalletSold(params?: Record<string, string>): Promise<SimpleWallet | { error: string }> {
        try {
            const queryString = this.buildQueryString(params);
            const url = `/dashboard/mostWalletSold${queryString}`;
            const response = await http.get(url);
            return response.data.dashboardMostWalletSold as SimpleWallet;
        } catch (e) {
            if (e instanceof AxiosError) {
                return {
                    error:
                        e?.response?.data?.error?.code ??
                        this.DASHBOARD_UNEXPECTED_ERROR,
                };
            }

            return { error: this.DASHBOARD_UNEXPECTED_ERROR };
        }
    }

    async getDashboardMostOperatorSold(params?: Record<string, string>): Promise<SimplesSalesUser | { error: string }> {
        try {
            const queryString = this.buildQueryString(params);
            const url = `/dashboard/mostOperatorSold${queryString}`;
            const response = await http.get(url);
            return response.data.dashboardMostOperatorSold as SimplesSalesUser;

        } catch (e) {
            if (e instanceof AxiosError) {
                return {
                    error:
                        e?.response?.data?.error?.code ?? this.DASHBOARD_UNEXPECTED_ERROR,
                };
            }

            return { error: this.DASHBOARD_UNEXPECTED_ERROR };
        }
    }

    async getDashboardMonthSold(params?: Record<string, string>): Promise<DashboardMonthSoldResponse> {
    try {
        const queryString = this.buildQueryString(params);
        const url = `/dashboard/monthSold${queryString}`;
        const response = await http.get(url); 
        return {
            dashboardMonthSold: response.data.dashboardMonthSold
        } as DashboardMonthSoldResponse;
    } catch (e) {
        if (e instanceof AxiosError) {
            return {
                error:
                    e?.response?.data?.error?.code ??
                    this.DASHBOARD_UNEXPECTED_ERROR,
            };
        }
        return { error: this.DASHBOARD_UNEXPECTED_ERROR };
    }
}
}

export const dashboardRepository = new DashboardRepository();