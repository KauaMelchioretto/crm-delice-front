export interface CrmFilter {
    field?: string,
    value?: string
}

export enum CrmFormType {
    EMPTY,
    REGISTER_CUSTOMER,
    EDIT_CUSTOMER,
    APPROVAL_CUSTOMER,
    REGISTER_PRODUCT,
    EDIT_PRODUCT,
    PRODUCT_MEDIA,
    REGISTER_USER,
    EDIT_USER,
    ATTACH_ROLE,
    REGISTER_WALLET,
    EDIT_WALLET,
    EDIT_MY_USER
}