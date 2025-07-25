import {CrmFilter} from "../../../utils/entities/entities.ts";
import {Wallet, WalletListResponse, WalletResponse} from "../entities/entities.ts";
import {walletRepository} from "../repository/WalletRepository.ts";
import {SimpleCustomerListResponse} from "../../customer/entities/entities.ts";

class WalletUseCase {
    UUID_INVALID = "Invalid wallet ID"
    TITLE_IS_EMPTY = "The title is empty"
    ACCOUNTABLE_IS_EMPTY = "The accountable user is empty"
    CUSTOMERS_IS_EMPTY = "The customers is empty"

    async getWallets(
        page: number,
        filter: CrmFilter | null
    ): Promise<WalletListResponse> {
        return walletRepository.getWallets(page, filter)
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
        if (!wallet.customers) {
            return {error: this.CUSTOMERS_IS_EMPTY}
        }

        return {error: undefined}
    }
}

export const walletUseCase = new WalletUseCase()