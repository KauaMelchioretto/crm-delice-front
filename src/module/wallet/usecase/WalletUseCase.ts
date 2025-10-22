import {CrmFilter, CrmOrderBy} from "../../../utils/entities/entities.ts";
import {Wallet, WalletListResponse, WalletResponse} from "../entities/entities.ts";
import {walletRepository} from "../repository/WalletRepository.ts";
import {SimpleCustomerListResponse} from "../../customer/entities/entities.ts";

class WalletUseCase {
    UUID_INVALID = "UUID_INVALID"
    TITLE_IS_EMPTY = "TITLE_IS_EMPTY"
    ACCOUNTABLE_IS_EMPTY = "ACCOUNTABLE_IS_EMPTY"
    CUSTOMERS_IS_EMPTY = "CUSTOMERS_IS_EMPTY"

    async getWallets(
        page: number,
        filter: CrmFilter | null,
        orderBy: CrmOrderBy | null,
    ): Promise<WalletListResponse> {
        return walletRepository.getWallets(page, filter, orderBy)
    }

    async createWallet(wallet: Wallet): Promise<WalletResponse> {
        const validate = this.validateWallet(wallet)

        if (validate.error) {
            return {error: validate.error}
        }

        return walletRepository.createWallet(wallet)
    }

    async updateWallet(wallet: Wallet): Promise<WalletResponse> {
        const validate = this.validateWallet(wallet)

        if (validate.error) {
            return {error: validate.error}
        }

        if (!wallet.uuid) {
            return {error: this.UUID_INVALID}
        }
        return walletRepository.updateWallet(wallet)
    }

    async getWalletUUID(uuid: string): Promise<WalletResponse>{
        if(!uuid){
            return {error: this.UUID_INVALID}
        }

        return walletRepository.getWalletUUID(uuid)
    }

    async getFreeCustomers(): Promise<SimpleCustomerListResponse>{
        return walletRepository.getFreeCustomers()
    }

    validateWallet(wallet: Wallet): WalletResponse {
        if (!wallet.label) {
            return {error: this.TITLE_IS_EMPTY}
        }
        if (!wallet.accountable?.uuid) {
            return {error: this.ACCOUNTABLE_IS_EMPTY}
        }
        if (!wallet.customers || wallet.customers.length === 0) {
            return {error: this.CUSTOMERS_IS_EMPTY}
        }

        return {error: undefined}
    }
}

export const walletUseCase = new WalletUseCase()