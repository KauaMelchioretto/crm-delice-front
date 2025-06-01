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

export interface CustomerResponse {
    customer?: Customer,
    error?: string
}

export interface PreCustomerReponse {
    customer?: PreCustomer,
    error?: string
}

export enum CustomerFormType {
    EMPTY,
    REGISTER_CUSTOMER,
    EDIT_CUSTOMER,
    APPROVAL_CUSTOMER
}

export interface CustomersListResponse {
    items?: Customer[],
    page?: number,
    total?: number,
    error?: string
}