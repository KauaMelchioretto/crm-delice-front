import {CrmCardStatusProps, PaginatedResponse} from "../../../utils/entities/entities.ts";
import {valueToEnum} from "../../../utils/functions/ValueToEnum.ts";
import QueryBuilderRounded from "@mui/icons-material/QueryBuilderRounded";
import VerifiedRounded from "@mui/icons-material/VerifiedRounded";
import CancelRounded from "@mui/icons-material/CancelRounded";

export interface Lead {
    uuid?: string
    document: string
    companyName: string
    tradingName: string
    personName: string
    email: string
    phone: string
    state: string
    city: string
    zipCode: string
    address: string
    complement: string
    addressNumber: string
    economicActivity: string
    status?: LeadStatus
}

export enum LeadStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REPROVED = "REPROVED",
}

export interface LeadResponse {
    lead?: Lead
    error?: string
}

export interface LeadListResponse {
    leads?: PaginatedResponse<Lead>,
    error?: string
}

export function getLeadStatusProps(status: string): CrmCardStatusProps {
    const value = valueToEnum(status, LeadStatus)

    const customerStatus = {
        [LeadStatus.PENDING]: {
            color: "#2685E2",
            label: "Pendente",
            icon: QueryBuilderRounded,
        },
        [LeadStatus.APPROVED]: {
            color: "#118D57",
            label: "Aprovado",
            icon: VerifiedRounded,
        },
        [LeadStatus.REPROVED]: {
            color: "#ff543f",
            label: "Reprovado",
            icon: CancelRounded,
        },
    };

    return customerStatus[value]
}