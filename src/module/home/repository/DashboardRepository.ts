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

    async getDashboardCustomer(): Promise<DashboardCustomerValues> {
        try {
            const response = await http.get("/dashboard/customer");
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

    async getDashboardOrder(): Promise<DashboardOrderValues> {
        try {
            const response = await http.get("/dashboard/order");
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

    async getDashboardRankBest(): Promise<DashboardRankValuesProducts> {
        try {
            const response = await http.get("/dashboard/rank/best/products");
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

    async getDashboardRankLess(): Promise<DashboardRankValuesProducts> {
        try {
            const response = await http.get("/dashboard/rank/less/products");
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

    async getDashboardTotalSold(): Promise<DashboardResponse<number>> {
        try {
            const response = await http.get("/dashboard/totalSold");
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

    async getDashboardMostWalletSold(): Promise<SimpleWallet | { error: string }> {
        try {
            const response = await http.get("/dashboard/mostWalletSold");
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

    async getDashboardMostOperatorSold(): Promise<SimplesSalesUser | { error: string }> {
        try {
            const response = await http.get("/dashboard/mostOperatorSold");
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

    async getDashboardMonthSold(): Promise<DashboardMonthSoldResponse> {
    try {
        const response = await http.get("/dashboard/monthSold"); 
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