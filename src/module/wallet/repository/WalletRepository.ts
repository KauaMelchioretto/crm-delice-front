import {CrmFilter} from "../../../utils/entities/entities.ts";
import {Wallet, WalletListResponse, WalletResponse} from "../entities/entities.ts";
import {http} from "../../../core/config/api/http.ts";
import {AxiosError} from "axios";

class WalletRepository {
    WALLET_UNEXPECTED_ERROR = "An unexpected error has occurred";

    async getWallets(
        page: number,
        filter: CrmFilter | null
    ): Promise<WalletListResponse> {
        try {
            let query = "";

            if (filter) {
                query += `${filter.field}=${filter.value}`;
            }

            const response = await http.get(
                `/wallet/getPagination?count=10&page=${page}${query}`
            );

            return response.data?.wallet as WalletListResponse;
        } catch (e) {
            if (e instanceof AxiosError) {
                return {
                    error:
                        e?.response?.data?.error?.message ??
                        this.WALLET_UNEXPECTED_ERROR,
                };
            }

            return {error: this.WALLET_UNEXPECTED_ERROR};
        }
    }

    async createWallet(wallet: Wallet): Promise<WalletResponse> {
        try {
            const response = await http.post(
                "/wallet/create",
                wallet
            );

            return response.data?.wallet as WalletResponse;
        } catch (e) {
            if (e instanceof AxiosError) {
                return {
                    error:
                        e?.response?.data?.error?.message ??
                        this.WALLET_UNEXPECTED_ERROR,
                };
            }

            return {error: this.WALLET_UNEXPECTED_ERROR};
        }
    }

    async updateWallet(wallet: Wallet): Promise<WalletResponse> {
        try {
            const response = await http.put(
                "/wallet/update",
                wallet
            );

            return response.data?.wallet as WalletResponse;
        } catch (e) {
            if (e instanceof AxiosError) {
                return {
                    error:
                        e?.response?.data?.error?.message ??
                        this.WALLET_UNEXPECTED_ERROR,
                };
            }

            return {error: this.WALLET_UNEXPECTED_ERROR};
        }
    }

    async getWalletUUID(uuid: string): Promise<WalletResponse>{
        try {
            const response = await http.get(
                `/wallet/getByUUID?uuid=${uuid}`
            );

            return response.data as WalletResponse;
        } catch (e) {
            if (e instanceof AxiosError) {
                return {
                    error:
                        e?.response?.data?.error?.message ??
                        this.WALLET_UNEXPECTED_ERROR,
                };
            }

            return {error: this.WALLET_UNEXPECTED_ERROR};
        }
    }
}

export const walletRepository = new WalletRepository();