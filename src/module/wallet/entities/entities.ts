import {User} from "../../user/entities/entities.ts";
import {Customer} from "../../customer/entities/entities.ts";
import {CrmCardStatusProps} from "../../../utils/entities/entities.ts";
import VerifiedRounded from "@mui/icons-material/VerifiedRounded";
import CancelRounded from "@mui/icons-material/CancelRounded";
import {valueToEnum} from "../../../utils/functions/ValueToEnum.ts";

export interface Wallet {
    uuid?: string,
    label?: string,
    accountable?: User,
    customers?: Customer[],
    observation?: string,
    status?: WalletStatus,
    createdAt?: string,
    modifiedAt?: string,
    createdBy?: string,
    modifiedBy?: string,
}

export enum WalletStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE"
}

export interface WalletListResponse {
    items?: Wallet[],
    page?: number,
    total?: number,
    error?: string
}

export interface SimpleWallet{
    uuid?: string, 
    label?: string,
    sold?: number,
    error?: string
}

export interface WalletResponse {
    wallet?: Wallet,
    error?: string
}

export function getWalletStatusProps(status: string): CrmCardStatusProps {
    const value = valueToEnum(status, WalletStatus)

    const walletStatus = {
        [WalletStatus.ACTIVE]: {
            color: "#118D57",
            label: "Ativo",
            icon: VerifiedRounded,
        },
        [WalletStatus.INACTIVE]: {
            color: "#ff543f",
            label: "Inativo",
            icon: CancelRounded,
        },
    };

    return walletStatus[value]
}