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
