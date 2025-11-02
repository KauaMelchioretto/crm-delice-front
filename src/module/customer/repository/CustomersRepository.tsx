import { CrmFilter, CrmOrderBy } from "../../../utils/entities/entities";
import {
  ApprovalCustomerResponse,
  Customer,
  CustomerEconomicActivitiesResponse,
  CustomerResponse,
  CustomersListResponse,
  CustomerStatus,
  PreCustomerResponse,
  SimpleCustomerListResponse,
} from "../entities/entities.ts";
import { http } from "../../../core/config/api/http";
import { AxiosError } from "axios";

class CustomersRepository {
  CUSTOMERS_UNEXPECTED_ERROR = {
    code: "CUSTOMER_UNEXPECTED",
  };

  async getPreCustomer(document: string): Promise<PreCustomerResponse> {
    try {
      const response = await http.get(
        `/preCustomer/query?document=${document}`
      );

      return response.data as PreCustomerResponse;
    } catch (e) {
      if (e instanceof AxiosError) {
        return {
          error:
            e?.response?.data?.error?.code ??
            this.CUSTOMERS_UNEXPECTED_ERROR,
        };
      }

      return { error: this.CUSTOMERS_UNEXPECTED_ERROR.code };
    }
  }

  async createCustomer(customer: Customer): Promise<CustomerResponse> {
    try {
      const response = await http.post("/customer/register", {
        contacts: customer.contacts,
        observation: customer.observation,
        companyName: customer.companyName,
        tradingName: customer.tradingName,
        personName: customer.personName,
        document: customer.document,
        state: customer.state,
        city: customer.city,
        zipCode: customer.zipCode,
        address: customer.address,
        addressNumber: customer.addressNumber,
        complement: customer.complement,
        economicActivitiesCodes: customer.economicActivitiesCodes,
      });

      return { customer: response.data?.customer };
    } catch (e) {
      if (e instanceof AxiosError) {
        return {
          error:
            e?.response?.data?.error?.code ??
            this.CUSTOMERS_UNEXPECTED_ERROR,
        };
      }

      return { error: this.CUSTOMERS_UNEXPECTED_ERROR.code };
    }
  }

  async saveCustomer(customer: Customer): Promise<CustomerResponse> {
    try {
      const response = await http.put("/customer/update", {
        uuid: customer.uuid,
        contacts: customer.contacts,
        observation: customer.observation,
        companyName: customer.companyName,
        tradingName: customer.tradingName,
        personName: customer.personName,
        document: customer.document,
        state: customer.state,
        city: customer.city,
        zipCode: customer.zipCode,
        address: customer.address,
        addressNumber: customer.addressNumber,
        complement: customer.complement,
        status: customer.status,
        economicActivitiesCodes: customer.economicActivitiesCodes,
      });

      return { customer: response.data?.customer };
    } catch (e) {
      if (e instanceof AxiosError) {
        return {
          error:
            e?.response?.data?.error?.code ??
            this.CUSTOMERS_UNEXPECTED_ERROR,
        };
      }

      return { error: this.CUSTOMERS_UNEXPECTED_ERROR.code };
    }
  }

  async getCustomerByUUID(customerUUID: string): Promise<CustomerResponse> {
    try {
      const response = await http.get(
        `/customer/getCustomerByUIUD?uuid=${customerUUID}`
      );

      return response.data as CustomerResponse;
    } catch (e) {
      if (e instanceof AxiosError) {
        return {
          error:
            e?.response?.data?.error?.code ??
            this.CUSTOMERS_UNEXPECTED_ERROR,
        };
      }

      return { error: this.CUSTOMERS_UNEXPECTED_ERROR.code };
    }
  }

  async getCustomers(
    page: number,
    filter: CrmFilter | null,
    orderBy: CrmOrderBy | null
  ): Promise<CustomersListResponse> {
    try {
      let query = "";

      if (filter?.field) {
        query += `&${filter.field}=${filter.value}`;
      } else if (!filter?.field && filter?.value) {
        query += `&allFields=${filter?.value}`;
      }

      if (orderBy?.field) {
        query += `&orderBy=${orderBy?.field}:${orderBy?.sortable}`;
      } else {
        query += `&orderBy=company_name`;
      }

      const response = await http.get(
        `/customer/getPagination?count=10&page=${page}${query}`
      );

      return response.data?.customers as CustomersListResponse;
    } catch (e) {
      if (e instanceof AxiosError) {
        return {
          error:
            e?.response?.data?.error?.code ??
            this.CUSTOMERS_UNEXPECTED_ERROR,
        };
      }

      return { error: this.CUSTOMERS_UNEXPECTED_ERROR.code };
    }
  }

  async listCustomerEconomicActivities(
    customerUUID: string
  ): Promise<CustomerEconomicActivitiesResponse> {
    try {
      const response = await http.get(
        `/customer/customerEconomicActivities/${customerUUID}`
      );

      return response.data as CustomerEconomicActivitiesResponse;
    } catch (e) {
      if (e instanceof AxiosError) {
        return {
          error:
            e?.response?.data?.error?.code ??
            this.CUSTOMERS_UNEXPECTED_ERROR,
        };
      }

      return { error: this.CUSTOMERS_UNEXPECTED_ERROR.code };
    }
  }

  async approvalCustomer(
    customerUUID: string,
    status: CustomerStatus
  ): Promise<ApprovalCustomerResponse> {
    try {
      const response = await http.post(
        `/customer/approval/${customerUUID}?status=${status}`
      );

      return response.data as ApprovalCustomerResponse;
    } catch (e) {
      if (e instanceof AxiosError) {
        return {
          error:
            e?.response?.data?.error?.code ??
            this.CUSTOMERS_UNEXPECTED_ERROR,
        };
      }

      return { error: this.CUSTOMERS_UNEXPECTED_ERROR.code };
    }
  }

  async listSimpleCustomers(): Promise<SimpleCustomerListResponse> {
    try {
      const response = await http.get("/customer/simple");

      return response.data as SimpleCustomerListResponse;
    } catch (e) {
      if (e instanceof AxiosError) {
        return {
          error:
            e?.response?.data?.error?.code ??
            this.CUSTOMERS_UNEXPECTED_ERROR,
        };
      }

      return { error: this.CUSTOMERS_UNEXPECTED_ERROR.code };
    }
  }
}

export const customersRepository = new CustomersRepository();
