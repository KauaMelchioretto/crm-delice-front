import {CrmFilter, CrmOrderBy} from "../../../utils/entities/entities.ts";
import {http} from "../../../core/config/api/http.ts";
import {AxiosError} from "axios";
import {Task, TaskHistory, TaskListResponse, TaskResponse, TaskStatus} from "../entities/entities.ts";
import {handleRequest} from "../../../utils/functions/HandleAxios.ts";

class TaskRepository {
    PRODUCT_UNEXPECTED_ERROR = "An unexpected error has occurred";

    async getTaskPagination(
        page: number,
        filter: CrmFilter | null,
        orderBy: CrmOrderBy | null
    ): Promise<TaskListResponse> {
        try {
            let query = "";

            if (filter?.field) {
                query += `&${filter.field}=${filter.value}`;
            } else if (!filter?.field && filter?.value) {
                query += `&allFields=${filter?.value}`
            }

            if (orderBy?.field) {
                query += `&orderBy=${orderBy?.field}:${orderBy?.ordenation}`
            } else {
                query += `&orderBy=code`
            }

            const response = await http.get(
                `/task/getPagination?count=10&page=${page}${query}`
            );

            return response.data?.tasks as TaskListResponse;
        } catch (e) {
            if (e instanceof AxiosError) {
                return {
                    error:
                        e?.response?.data?.error?.message ??
                        this.PRODUCT_UNEXPECTED_ERROR,
                };
            }

            return {error: this.PRODUCT_UNEXPECTED_ERROR};
        }
    }

    async createTask(task: Task): Promise<TaskResponse> {
        return handleRequest(
            http.post("/task/create", task)
        )
    }

    async saveTask(task: Task): Promise<TaskResponse> {
        return handleRequest(
            http.post("/task/update", task)
        )
    }

    async getTaskByUUID(uuid: string): Promise<TaskResponse> {
        return handleRequest(
            http.get(`/task/getByUUID?uuid=${uuid}`)
        )
    }

    async changeTaskStatus(uuid: string, status: TaskStatus): Promise<TaskResponse> {
        return handleRequest(
            http.post(`/task/changeStatus/${uuid}?status=${status}`)
        )
    }

    async addHistory(history: TaskHistory): Promise<TaskResponse> {
        return handleRequest(
            http.post("/task/addHistory", history)
        )
    }
}

export const taskRepository = new TaskRepository()