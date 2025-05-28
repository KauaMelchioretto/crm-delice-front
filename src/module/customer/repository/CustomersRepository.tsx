import { CrmFilter } from "../../../utils/entities/entities";
import {
  Customer,
  CustomerResponse,
  CustomersListResponse,
  PreCustomer,
  PreCustomerReponse
} from "../entities/entities";
import { http } from "../../../core/config/api/http";
import { Axios, AxiosError } from "axios";

class CustomersRepository {
  CUSTOMERS_UNEXPECTED_ERROR = {
    code: "UNEXPECTED_ERROR",
  };

  async getPreCustomer(document: string): Promise<PreCustomerReponse> {
    try {
      const response = await http.get(
        `/preCustomer/query?document=${document}`
      );

      return response.data?.customer as PreCustomerReponse;
    } catch (e) {
      if (e instanceof AxiosError) {
        return {
          error:
            e?.response?.data?.error?.message ??
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
        economicActivities: customer.economicActivities,
        observation: customer.observation,
        status: customer.status,
        companyName: customer.companyName,
        tradingName: customer.tradingName,
        personName: customer.personName,
        document: customer.document,
        state: customer.state,
        city: customer.city,
        zipCode: customer.zipCode,
        address: customer.address,
        addressNumber: customer.addressNumber,
        economicActivitiesCodes: customer.economicActivitiesCodes,
      });

      return { customer: response.data?.customer };
    } catch (e) {
      if (e instanceof AxiosError) {
        return {
          error:
            e?.response?.data?.error?.message ??
            this.CUSTOMERS_UNEXPECTED_ERROR,
        };
      }

      return { error: this.CUSTOMERS_UNEXPECTED_ERROR.code };
    }
  }

  async getCustomerByUUID(customerUUID: string): Promise<CustomerResponse> {
    try {
      const response = await http.get(
        `customer/getCustomerByUIUD?uuid=${customerUUID}`
      );

      return { customer: response.data?.customer };
    } catch (e) {
      if (e instanceof AxiosError) {
        return {
          error:
            e?.response?.data?.error?.message ??
            this.CUSTOMERS_UNEXPECTED_ERROR,
        };
      }

      return { error: this.CUSTOMERS_UNEXPECTED_ERROR.code };
    }
  }

  async getCustomers(
    page: number,
    filter: CrmFilter | null
  ): Promise<CustomersListResponse> {
    try {
      let query = "";

      if (filter) {
        query += `${filter.field}=${filter.value}`;
      }

      const response = await http.get(
        `/customer/getPagination?count=10&page=${page}${query}`
      );

      return response.data?.customers as CustomersListResponse;
    } catch (e) {
      if (e instanceof AxiosError) {
        return {
          error:
            e?.response?.data?.error?.message ??
            this.CUSTOMERS_UNEXPECTED_ERROR,
        };
      }

      return { error: this.CUSTOMERS_UNEXPECTED_ERROR.code };
    }
  }
}

export const customersRepository = new CustomersRepository();
