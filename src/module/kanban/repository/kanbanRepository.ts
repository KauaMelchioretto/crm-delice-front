import {Board, BoardListResponse, BoardResponse} from "../entities/entities.ts";
import {http} from "../../../core/config/api/http.ts";
import {AxiosError} from "axios";
import {CrmFilter} from "../../../utils/entities/entities.ts";

class KanbanRepository {
    KANBAN_UNEXPECTED_ERROR = "An unexpected error has occurred";

    async getBoardByKey(key: string): Promise<BoardResponse> {
        try {
            const response = await http.get(
                `/kanban/board/code/${key}`
            );

            return response.data as BoardResponse;
        } catch (e) {
            if (e instanceof AxiosError) {
                return {
                    error:
                        e?.response?.data?.error?.message ??
                        this.KANBAN_UNEXPECTED_ERROR,
                };
            }

            return {error: this.KANBAN_UNEXPECTED_ERROR};
        }
    }

    async getBoard(
        page: number,
        filter: CrmFilter | null
    ): Promise<BoardListResponse> {
        try {
            let query = "";

            if (filter) {
                query += `&${filter.field}=${filter.value}`;
            }

            const response = await http.get(
                `/kanban/getPagination?count=10&page=${page}${query}`
            );

            return response.data?.boards as BoardListResponse;
        } catch (e) {
            if (e instanceof AxiosError) {
                return {
                    error:
                        e?.response?.data?.error?.message ??
                        this.KANBAN_UNEXPECTED_ERROR,
                };
            }

            return {error: this.KANBAN_UNEXPECTED_ERROR};
        }
    }

    async getBoardByUUID(boardUUID: string): Promise<BoardResponse> {
        try {
            const response = await http.get(
                `/kanban/board/${boardUUID}`
            );

            return response.data as BoardResponse;
        } catch (e) {
            if (e instanceof AxiosError) {
                return {
                    error:
                        e?.response?.data?.error?.message ??
                        this.KANBAN_UNEXPECTED_ERROR,
                };
            }

            return {error: this.KANBAN_UNEXPECTED_ERROR};
        }
    }

    async saveBoard(board: Board): Promise<BoardResponse> {
        try {
            const response = await http.post("/kanban/saveBoard",
                {
                    code: board.code,
                    status: board.status,
                    title: board.title,
                    description: board.description,
                    uuid: board.uuid
                }
            );

            return response.data as BoardResponse;
        } catch (e) {
            if (e instanceof AxiosError) {
                return {
                    error:
                        e?.response?.data?.error?.message ??
                        this.KANBAN_UNEXPECTED_ERROR,
                };
            }

            return {error: this.KANBAN_UNEXPECTED_ERROR};
        }
    }
}

export const kanbanRepository = new KanbanRepository()