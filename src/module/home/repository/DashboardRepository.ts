import {
    DashboardCustomerValues,
    DashboardOrderValues,
    DashboardRankValues,
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
            return response.data as DashboardCustomerValues;
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
            return response.data as DashboardOrderValues;
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

    async getDashboardRank(): Promise<DashboardRankValues> {
        try {
            const response = await http.get("/dashboard/rank");
            return response.data as DashboardRankValues;
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

    async getDashboardTotalSold(): Promise<{ total: number } | { error: string }> {
        try {
            const response = await http.get("/dashboard/totalSold");
            return { total: response.data as number };
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

    async getDashboardMostWalletSold(): Promise<SimpleWallet> {
        try {
            const response = await http.get("/dashboard/mostWalletSold");
            return response.data as SimpleWallet;
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

    async getDashboardMostOperatorSold(): Promise<SimplesSalesUser> {
        try {
            const response = await http.get("/dashboard/mostOperatorSold");
            return response.data as SimplesSalesUser;
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
