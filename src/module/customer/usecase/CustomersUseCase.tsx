import {CrmFilter, CrmOrderBy} from "../../../utils/entities/entities";
import {
    ApprovalCustomerResponse,
    ContactType,
    Customer, CustomerEconomicActivitiesResponse,
    CustomerResponse,
    CustomersListResponse, CustomerStatus,
    PreCustomerResponse, SimpleCustomerListResponse
} from "../entities/entities.ts";
import {customersRepository} from "../repository/CustomersRepository";


class CustomersUseCase {
    INVALID_DOCUMENT = "Invalid document"
    INVALID_UUID = "Invalid customer ID"
    INVALID_APPROVAL_STATUS = "Customer status invalid"
    DOCUMENT_MUST_BE_PROVIDED = "The document must be provided"
    PERSON_NAME_MUST_BE_PROVIDED = "The person name must be provided"
    COMPANY_NAME_MUST_BE_PROVIDED = "The company name must be provided"
    TRADING_NAME_MUST_BE_PROVIDED = "The trading name must be provided"
    ZIP_CODE_MUST_BE_PROVIDED = "The zip code of user must be provided"
    CITY_MUST_BE_PROVIDED = "The city of user must be provided"
    STATE_MUST_BE_PROVIDED = "The state of user must be provided"
    COMPLEMENT_MUST_BE_PROVIDED = "The complement of user must be provided"
    ADDRESS_MUST_BE_PROVIDED = "The address of user must be provided"
    ADDRESS_NUMBER_MUST_BE_PROVIDED = "The address number of user must be provided"
    CONTACTS_IS_EMPTY = "At least one contact must be provided"
    ECONOMIC_ACTIVITY_IS_EMPTY = "At least one CNAE must be provided"

    async getPreCustomer(document: string): Promise<PreCustomerResponse> {
        const query = document.replace(/\D/g, '')

        if (!query || query.length < 14) {
            return {error: this.INVALID_DOCUMENT}
        }

        return customersRepository.getPreCustomer(query)
    }

    async getCustomers(page: number, filter: CrmFilter | null, orderBy: CrmOrderBy | null): Promise<CustomersListResponse> {
        return customersRepository.getCustomers(page, filter, orderBy);
    }

    async getCustomerByUUID(customerUUID: string): Promise<CustomerResponse> {
        if (!customerUUID) {
            return {error: this.INVALID_UUID}
        }

        return customersRepository.getCustomerByUUID(customerUUID);
    }

    async createCustomer(customer: Customer): Promise<CustomerResponse> {
        const validate = this.validateCustomer(customer)

        if (validate.error) {
            return {error: validate.error}
        }

        customer.contacts = customer.contacts?.map((c) => ({
            ...c,
            label: c.contactType === ContactType.PHONE ? c.label?.replace(/\D/g, "") : c.label,
        }))

        customer.document = customer.document?.replace(/\D/g, "")
        customer.zipCode = customer.zipCode?.replace("-", "");

        return customersRepository.createCustomer(customer);
    }

    async saveCustomer(customer: Customer): Promise<CustomerResponse> {
        const validate = this.validateCustomer(customer)

        if (!customer.uuid) {
            return {error: this.INVALID_UUID}
        }

        if (validate.error) {
            return {error: validate.error}
        }

        customer.contacts = customer.contacts?.map((c) => ({
            ...c,
            label: c.contactType === ContactType.PHONE ? c.label?.replace(/\D/g, "") : c.label,
        }))

        customer.document = customer.document?.replace(/\D/g, "")
        customer.zipCode = customer.zipCode?.replace("-", "");

        return customersRepository.saveCustomer(customer);
    }

    async listCustomerEconomicActivities(customerUUID: string): Promise<CustomerEconomicActivitiesResponse> {
        if (!customerUUID) {
            return {error: this.INVALID_UUID}
        }

        return customersRepository.listCustomerEconomicActivities(customerUUID)
    }

    async approvalCustomer(customerUUID: string, status: CustomerStatus): Promise<ApprovalCustomerResponse> {
        if (!customerUUID) {
            return {error: this.INVALID_UUID}
        }
        if (!status) {
            return {error: this.INVALID_APPROVAL_STATUS}
        }

        return customersRepository.approvalCustomer(customerUUID, status)
    }

    async listSimpleCustomers(): Promise<SimpleCustomerListResponse>{
        return customersRepository.listSimpleCustomers()
    }

    validateCustomer(customer: Customer): CustomerResponse {
        if (!customer.document) {
            return {error: this.DOCUMENT_MUST_BE_PROVIDED}
        }
        if (!customer.personName) {
            return {error: this.PERSON_NAME_MUST_BE_PROVIDED}
        }
        if (!customer.companyName) {
            return {error: this.COMPANY_NAME_MUST_BE_PROVIDED}
        }
        if (!customer.tradingName) {
            return {error: this.TRADING_NAME_MUST_BE_PROVIDED}
        }
        if (!customer.zipCode) {
            return {error: this.ZIP_CODE_MUST_BE_PROVIDED}
        }
        if (!customer.city) {
            return {error: this.CITY_MUST_BE_PROVIDED}
        }
        if (!customer.state) {
            return {error: this.STATE_MUST_BE_PROVIDED}
        }
        if (!customer.complement) {
            return {error: this.COMPLEMENT_MUST_BE_PROVIDED}
        }
        if (!customer.address) {
            return {error: this.ADDRESS_MUST_BE_PROVIDED}
        }
        if (!customer.addressNumber) {
            return {error: this.ADDRESS_NUMBER_MUST_BE_PROVIDED}
        }
        if (customer.contacts?.length === 0) {
            return {error: this.CONTACTS_IS_EMPTY}
        }
        if (customer.economicActivitiesCodes?.length === 0) {
            return {error: this.ECONOMIC_ACTIVITY_IS_EMPTY}
        }

        return {error: undefined}
    }
}

export const customersUseCase = new CustomersUseCase();