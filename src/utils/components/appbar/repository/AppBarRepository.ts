import {MenuResponse} from "../entities/entities.ts";
import {http} from "../../../../core/config/api/http.ts";
import {AxiosError} from "axios";

class AppBarRepository {
    MENU_UNEXPECTED_ERROR = "An unexpected error has occurred"

    async queryMenuOptions(query: string): Promise<MenuResponse> {
        try {
            const response = await http.get(
                `/menu?query=${query}`
            );

            return response.data as MenuResponse;
        } catch (e) {
            if (e instanceof AxiosError) {
                return {
                    error:
                        e?.response?.data?.error?.message ??
                        this.MENU_UNEXPECTED_ERROR,
                };
            }

            return {error: this.MENU_UNEXPECTED_ERROR};
        }
    }
}

export const appBarRepository = new AppBarRepository();