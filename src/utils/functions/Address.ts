import {http} from "../../core/config/api/http.ts";
import {AxiosError} from "axios";

export interface AddressResponse {
    address?: Address
    error?: string
}

export interface Address {
    zipCode: string
    address: string
    district: string
    city: string
    state: string
}

const UNEXPECTED_ADDRESS_ERROR = "An unexpected error has occurred"

export async function handleGetAddress(zipCode: string): Promise<AddressResponse> {
    try {
        const response = await http.get("/address/query?zipCode=" + zipCode)

        return response.data as AddressResponse
    } catch (e) {
        if (e instanceof AxiosError) {
            return {
                error:
                    e?.response?.data?.error?.message ??
                    UNEXPECTED_ADDRESS_ERROR,
            };
        }

        return {error: UNEXPECTED_ADDRESS_ERROR}
    }
}