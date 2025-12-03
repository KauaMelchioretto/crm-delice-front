import { mapRepository } from "../repository/MapRepository.ts";
import { CustomerByState, CustomersByStateResponse } from "../entities/entities";

class MapUseCase {
    MAP_UNEXPECTED_ERROR = "MAP_UNEXPECTED_ERROR";

    async getCustomersByState(params?: Record<string, string>): Promise<CustomersByStateResponse> {
        return mapRepository.getCustomersByState(params);
    }
}

export const mapUseCase = new MapUseCase();