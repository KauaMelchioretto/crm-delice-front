// src/module/map/repository/MapRepository.ts
import { http } from "../../../core/config/api/http.ts";
import { AxiosError } from "axios";
import { CustomersByStateResponse } from "../entities/entities.ts";

class MapRepository {
    MAP_UNEXPECTED_ERROR = "MAP_UNEXPECTED_ERROR";

    private buildQueryString(params?: Record<string, string>): string {
        if (!params || Object.keys(params).length === 0) {
            return '';
        }

        const searchParams = new URLSearchParams();
        
        Object.entries(params).forEach(([key, value]) => {
            searchParams.append(key, value);
        });

        return `?${searchParams.toString().replace(/\+/g, '%20')}`;
    }

    async getCustomersByState(params?: Record<string, string>): Promise<CustomersByStateResponse> {
        try {
            const queryString = this.buildQueryString(params);
            const url = `/map/customer`;
            const response = await http.get(url);
            return {
                customersByState: response.data.customersByState
            } as CustomersByStateResponse;
        } catch (e) {
            if (e instanceof AxiosError) {
                return {
                    error: e?.response?.data?.error?.code ?? this.MAP_UNEXPECTED_ERROR,
                };
            }
            return { error: this.MAP_UNEXPECTED_ERROR };
        }
    }
}

export const mapRepository = new MapRepository();