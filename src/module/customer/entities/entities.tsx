export interface Customer extends PreCustomer {
    uuid?: string,
    contacts?: Contact[],
    economicActivities?: string,
    observation?: string,
    status?: string,
    createdAt?: string,
    modifiedAt?: string,
    createdBy?: string,
    modifiedBy?: string
}

export interface PreCustomer {
    companyName?: string,
    tradingName?: string,
    personName?: string,
    document: string,
    state?: string,
    city?: string,
    zipCode?: string,
    address?: string,
    addressNumber?: string,
    economicActivitiesCodes?: string[],
}

export interface Contact {
    uuid?: string,
    contactType: ContactType,
    label: string,
    isPrincipal: boolean 
}

export enum ContactType {
    EMAIL,
    PHONE,
    MEDIA,
    NONE
}

export interface CustomerResponse {
    customer?: Customer,
    error?: string
}

export interface PreCustomerReponse {
    preCustomer?: PreCustomer,
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