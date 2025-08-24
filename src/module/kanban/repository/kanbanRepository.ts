import {
    Board,
    BoardListResponse,
    BoardResponse,
    CardListResponse,
    CardResponse,
    Column,
    ColumnListResponse,
    ColumnResponse,
    ColumnRule,
    ColumnRuleResponse, ColumnRuleTypeListResponse,
    MessageBoardResponse,
    ReorderColumn,
    Tag,
    TagListResponse,
    TagResponse
} from "../entities/entities.ts";
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

    async getTagsByBoardUUID(boardUUID: string): Promise<TagListResponse> {
        try {
            const response = await http.get(
                `/kanban/tagByBoardUUID/${boardUUID}`
            );

            return response.data as TagListResponse;
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

    async saveTag(tag: Tag): Promise<TagResponse> {
        try {
            const response = await http.post("/kanban/saveTag",
                {
                    title: tag.title,
                    boardUUID: tag.boardUUID,
                    description: tag.description,
                    color: tag.color
                }
            );

            return response.data as TagResponse;
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

    async deleteTagByUUID(tagUUID: string): Promise<MessageBoardResponse> {
        try {
            const response = await http.delete(`/kanban/deleteTagByUUID/${tagUUID}`);

            return response.data as MessageBoardResponse;
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

    async getColumnsByBoardUUID(boardUUID: string): Promise<ColumnListResponse> {
        try {
            const response = await http.get(
                `/kanban/columnByBoardUUID/${boardUUID}`
            );

            return response.data as ColumnListResponse;
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

    async saveColumn(column: Column): Promise<ColumnResponse> {
        try {
            const response = await http.post("/kanban/saveColumn",
                {
                    title: column.title,
                    boardUUID: column.boardUUID,
                    description: column.description,
                    code: column.code,
                    type: column.type,
                }
            );

            return response.data as TagResponse;
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

    async deleteColumnByUUID(columnUUID: string): Promise<MessageBoardResponse> {
        try {
            const response = await http.delete(`/kanban/deleteColumnByUUID/${columnUUID}`);

            return response.data as MessageBoardResponse;
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

    async reorderColumns(columns: ReorderColumn[]): Promise<ColumnListResponse> {
        try {
            const response = await http.post(
                "/kanban/reorderColumns",
                columns
            );

            return response.data as ColumnListResponse;
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

    async saveColumnRule(rule: ColumnRule): Promise<ColumnRuleResponse> {
        try {
            const response = await http.post(
                "/kanban/saveColumnRule",
                rule
            );

            return response.data as ColumnRuleResponse;
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

    async saveAllowedColumns(columnUUID: string, allowed: string[]): Promise<MessageBoardResponse> {
        try {
            const response = await http.post(
                `/kanban/saveAllowedColumns/${columnUUID}`,
                allowed
            );

            return response.data as MessageBoardResponse;
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

    async getColumnRuleByUUID(uuid: string): Promise<ColumnRuleResponse> {
        try {
            const response = await http.get(
                `/kanban/getColumnRuleByUUID/${uuid}`
            );

            return response.data as ColumnRuleResponse;
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

    async deleteAllowedColumnUUID(column: string, allowed: string): Promise<MessageBoardResponse> {
        try {
            const response = await http.delete(`/kanban/deleteAllowedColumnUUID/${column}/${allowed}`);

            return response.data as MessageBoardResponse;
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

    async deleteColumnRuleByUUID(columnRule: string): Promise<MessageBoardResponse> {
        try {
            const response = await http.delete(`/kanban/deleteColumnRuleByUUID/${columnRule}`);

            return response.data as MessageBoardResponse;
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

    async getColumnByUUID(uuid: string): Promise<ColumnResponse> {
        try {
            const response = await http.get(
                `/kanban/column/${uuid}`
            );

            return response.data as ColumnResponse;
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

    async moveCardToColumn(cardUUID: string, columnUUID: string): Promise<CardListResponse> {
        try {
            const response = await http.post(
                `/kanban/moveCardToColumn/${cardUUID}/${columnUUID}`
            );

            return response.data as CardListResponse;
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

    async getCardByUUID(cardUUID: string): Promise<CardResponse> {
        try {
            const response = await http.get(
                `/kanban/card/${cardUUID}`
            );

            return response.data as CardResponse;
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

    async setDefaultColumn(boardUUID: string, columnUUID: string): Promise<ColumnListResponse> {
        try {
            const response = await http.post(
                `/kanban/setDefaultColumn/${boardUUID}/${columnUUID}`
            );

            return response.data as ColumnListResponse;
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

    async getColumnRuleTypes(): Promise<ColumnRuleTypeListResponse> {
        try {
            const response = await http.get(
                "/kanban/getColumnRuleTypes"
            );

            return response.data as ColumnRuleTypeListResponse;
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