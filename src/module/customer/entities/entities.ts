import {CrmCardStatusProps} from "../../../utils/entities/entities.ts";
import QueryBuilderRounded from "@mui/icons-material/QueryBuilderRounded";
import VerifiedRounded from "@mui/icons-material/VerifiedRounded";
import NewReleasesRounded from "@mui/icons-material/NewReleasesRounded";
import CancelRounded from "@mui/icons-material/CancelRounded";
import {valueToEnum} from "../../../utils/functions/ValueToEnum.ts";

export interface Customer extends PreCustomer {
    uuid?: string,
    economicActivities?: EconomicActivity[],
    observation?: string,
    status?: string,
    createdAt?: string,
    modifiedAt?: string,
    createdBy?: string,
    modifiedBy?: string,
    economicActivitiesCodesForm?: EconomicActivityCodeForm[],
}

export interface EconomicActivity {
    uuid?: string,
    code?: string,
    description?: string,
    division?: {
        code?: string,
        description?: string,
    },
    group?: {
        code?: string,
        description?: string,
    },
    section?: {
        code?: string,
        description?: string,
    }
}

export interface EconomicActivityCodeForm {
    value?: string
}

export interface PreCustomer {
    companyName?: string,
    tradingName?: string,
    personName?: string,
    document?: string,
    state?: string,
    city?: string,
    zipCode?: string,
    address?: string,
    addressNumber?: string,
    complement?: string,
    economicActivitiesCodes?: string[],
    contacts?: Contact[],
}

export interface Contact {
    uuid?: string,
    contactType?: ContactType,
    label?: string,
    isPrincipal?: boolean
}

export enum ContactType {
    EMAIL = "EMAIL",
    PHONE = "PHONE",
    MEDIA = "MEDIA",
    NONE = "NONE"
}

export enum CustomerStatus {
    PENDING = 0,
    FIT = 1,
    NOT_FIT = 2,
    INACTIVE = 3
}

export interface CustomerResponse {
    customer?: Customer,
    error?: string
}

export interface PreCustomerResponse {
    customer?: PreCustomer,
    error?: string
}

export interface CustomersListResponse {
    items?: Customer[],
    page?: number,
    total?: number,
    error?: string
}

export interface CustomerEconomicActivitiesResponse {
    activities?: EconomicActivity[],
    error?: string
}

export interface ApprovalCustomerResponse {
    ok?: boolean,
    error?: string
}

export interface SimpleCustomer {
    uuid?: string,
    companyName?: string,
    document?: string
}

export interface SimpleCustomerListResponse {
    customers?: SimpleCustomer[],
    error?: string
}

export function getCustomerStatusProps(status: string): CrmCardStatusProps {
    const value = valueToEnum(status, CustomerStatus)

    const customerStatus = {
        [CustomerStatus.PENDING]: {
            color: "#2685E2",
            label: "customers.page.customer_status.pending",
            icon: QueryBuilderRounded,
        },
        [CustomerStatus.FIT]: {
            color: "#118D57",
            label: "customers.page.customer_status.fit",
            icon: VerifiedRounded,
        },
        [CustomerStatus.NOT_FIT]: {
            color: "#e28a26",
            label: "customers.page.customer_status.not_fit",
            icon: NewReleasesRounded,
        },
        [CustomerStatus.INACTIVE]: {
            color: "#ff543f",
            label: "customers.page.customer_status.inactive",
            icon: CancelRounded,
        },
    };

    return customerStatus[value]
}