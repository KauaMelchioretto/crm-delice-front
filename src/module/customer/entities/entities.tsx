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