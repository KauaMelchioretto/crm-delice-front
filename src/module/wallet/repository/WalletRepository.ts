import { CrmFilter, CrmOrderBy } from "../../../utils/entities/entities.ts";
import {
  Wallet,
  WalletListResponse,
  WalletResponse,
} from "../entities/entities.ts";
import { http } from "../../../core/config/api/http.ts";
import { AxiosError } from "axios";
import { SimpleCustomerListResponse } from "../../customer/entities/entities.ts";

class WalletRepository {
  WALLET_UNEXPECTED_ERROR = "WALLET_UNEXPECTED_ERROR";

  async getWallets(
    page: number,
    filter: CrmFilter | null,
    orderBy: CrmOrderBy | null
  ): Promise<WalletListResponse> {
    try {
      let query = "";

      if (filter?.field) {
        query += `&${filter.field}=${filter.value}`;
      } else if (!filter?.field && filter?.value) {
        query += `&allFields=${filter?.value}`;
      }

      if (orderBy?.field) {
        query += `&orderBy=${orderBy?.field}:${orderBy?.ordenation}`;
      } else {
        query += `&orderBy=title`;
      }

      const response = await http.get(
        `/wallet/getPagination?count=10&page=${page}${query}`
      );

      return response.data?.wallet as WalletListResponse;
    } catch (e) {
      if (e instanceof AxiosError) {
        return {
          error:
            e?.response?.data?.error?.code ?? this.WALLET_UNEXPECTED_ERROR,
        };
      }

      return { error: this.WALLET_UNEXPECTED_ERROR };
    }
  }

  async createWallet(wallet: Wallet): Promise<WalletResponse> {
    try {
      const response = await http.post("/wallet/create", wallet);

      return response.data?.wallet as WalletResponse;
    } catch (e) {
      if (e instanceof AxiosError) {
        return {
          error:
            e?.response?.data?.error?.code ?? this.WALLET_UNEXPECTED_ERROR,
        };
      }

      return { error: this.WALLET_UNEXPECTED_ERROR };
    }
  }

  async updateWallet(wallet: Wallet): Promise<WalletResponse> {
    try {
      const response = await http.put("/wallet/update", wallet);
      
      return response.data?.wallet as WalletResponse;
    } catch (e) {
      if (e instanceof AxiosError) {
        return {
          error: 
            e?.response?.data?.error?.code ?? this.WALLET_UNEXPECTED_ERROR,
        };
      }

      return { error: this.WALLET_UNEXPECTED_ERROR };
    }
  }

  async getWalletUUID(uuid: string): Promise<WalletResponse> {
    try {
      const response = await http.get(`/wallet/getByUUID?uuid=${uuid}`);

      return response.data as WalletResponse;
    } catch (e) {
      if (e instanceof AxiosError) {
        return {
          error:
            e?.response?.data?.error?.code ?? this.WALLET_UNEXPECTED_ERROR,
        };
      }

      return { error: this.WALLET_UNEXPECTED_ERROR };
    }
  }

  async getFreeCustomers(): Promise<SimpleCustomerListResponse> {
    try {
      const response = await http.get(`/wallet/getFreeCustomers`);

      return response.data as SimpleCustomerListResponse;
    } catch (e) {
      if (e instanceof AxiosError) {
        return {
          error:
            e?.response?.data?.error?.code ?? this.WALLET_UNEXPECTED_ERROR,
        };
      }

      return { error: this.WALLET_UNEXPECTED_ERROR };
    }
  }
}

export const walletRepository = new WalletRepository();
