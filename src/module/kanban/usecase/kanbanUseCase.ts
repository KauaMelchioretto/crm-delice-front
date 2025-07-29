import {Board, BoardListResponse, BoardResponse} from "../entities/entities.ts";
import {kanbanRepository} from "../repository/kanbanRepository.ts";
import {CrmFilter} from "../../../utils/entities/entities.ts";

class KanbanUseCase {
    INVALID_KEY = "Invalid key"
    CODE_IS_EMPTY = "Code is empty"
    TITLE_IS_EMPTY = "Title is empty"

    async getBoardByKey(key: string): Promise<BoardResponse> {
        if (!key) {
            return {error: this.INVALID_KEY}
        }

        return kanbanRepository.getBoardByKey(key)
    }

    async getBoard(
        page: number,
        filter: CrmFilter | null
    ): Promise<BoardListResponse> {
        return kanbanRepository.getBoard(page, filter)
    }

    async getBoardByUUID(boardUUID: string): Promise<BoardResponse> {
        if (!boardUUID) {
            return {error: this.INVALID_KEY}
        }

        return kanbanRepository.getBoardByUUID(boardUUID)
    }

    async saveBoard(board: Board): Promise<BoardResponse> {
        if (!board.code) {
            return {error: this.CODE_IS_EMPTY}
        }

        if (!board.title) {
            return {error: this.TITLE_IS_EMPTY}
        }

        return kanbanRepository.saveBoard(board)
    }
}

export const kanbanUseCase = new KanbanUseCase()