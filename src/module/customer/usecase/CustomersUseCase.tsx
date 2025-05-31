import { CrmFilter } from "../../../utils/entities/entities";
import { Customer, CustomerResponse, CustomersListResponse } from "../entities/entities";
import { customersRepository } from "../repository/CustomersRepository";


class CustomersUseCase {

    async getCustomers(page: number, filter: CrmFilter | null): Promise<CustomersListResponse> {
        return customersRepository.getCustomers(page, filter);
    }

    async getCustomerByUUID(customerUUID: string): Promise<CustomerResponse> {
        return customersRepository.getCustomerByUUID(customerUUID);
    }

    async createCustomer(customer: Customer): Promise<CustomerResponse> {
        //to do     
        return {};
    }

    async saveCustomer(customer: Customer): Promise<CustomerResponse> {
        //to do     
        return {};
    }
}

export const customersUseCase = new CustomersUseCase();