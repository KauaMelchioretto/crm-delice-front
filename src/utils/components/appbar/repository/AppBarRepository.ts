import {MenuResponse, NotificationListResponse, NotificationResponse} from "../entities/entities.ts";
import {http} from "../../../../core/config/api/http.ts";
import {AxiosError} from "axios";

class AppBarRepository {
    MENU_UNEXPECTED_ERROR = "An unexpected error has occurred"

    async queryMenuOptions(query: string): Promise<MenuResponse> {
        try {
            if (query === "") {
                return {error: ""}
            }

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

    async getNotifications(isRead?: boolean): Promise<NotificationListResponse> {
        try {
            const query = isRead !== undefined ? `?isRead=${isRead}` : ""

            const response = await http.get(
                `/notification/list${query}`
            );

            return response.data as NotificationListResponse;
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

    async markAsReadByNotificationUUID(notificationUUID: string): Promise<NotificationResponse>{
        try {
            const response = await http.post(
                `/notification/mark/${notificationUUID}`
            );

            return response.data as NotificationResponse;
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

    async markAsReadNotificationAll(): Promise<NotificationListResponse>{
        try {
            const response = await http.post(
                `/notification/markAll`
            );

            return response.data as NotificationListResponse;
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