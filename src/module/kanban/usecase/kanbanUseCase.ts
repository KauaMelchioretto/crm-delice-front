import {
    Board,
    BoardListResponse,
    BoardResponse,
    CardListResponse, CardResponse,
    Column,
    ColumnListResponse,
    ColumnResponse,
    ColumnRule,
    ColumnRuleResponse,
    ColumnRuleType,
    MessageBoardResponse,
    ReorderColumn,
    Tag,
    TagListResponse,
    TagResponse
} from "../entities/entities.ts";
import {kanbanRepository} from "../repository/kanbanRepository.ts";
import {CrmFilter} from "../../../utils/entities/entities.ts";

class KanbanUseCase {
    INVALID_KEY = "Invalid key"
    CODE_IS_EMPTY = "Code is empty"
    TITLE_IS_EMPTY = "Title is empty"
    DESCRIPTION_IS_EMPTY = "Description is empty"
    COLOR_IS_EMPTY = "Color is empty"
    COLUMNS_IS_EMPTY = "Columns is empty"
    TYPE_IS_EMPTY = "Type is empty"
    COLUMN_UUID_IS_EMPTY = "Column is not attached"

    TAG_IS_EMPTY = "Tag is empty"
    EMAIL_IS_EMPTY = "Email is empty"
    USER_IS_EMPTY = "User is empty"

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

    async getTagsByBoardUUID(boardUUID: string): Promise<TagListResponse> {
        return kanbanRepository.getTagsByBoardUUID(boardUUID)
    }

    async saveTag(tag: Tag): Promise<TagResponse> {
        if (!tag.title) {
            return {error: this.TITLE_IS_EMPTY}
        }

        if (!tag.description) {
            return {error: this.DESCRIPTION_IS_EMPTY}
        }

        if (!tag.color) {
            return {error: this.COLOR_IS_EMPTY}
        }

        return kanbanRepository.saveTag(tag)
    }

    async deleteTagByUUID(tagUUID: string): Promise<MessageBoardResponse> {
        return kanbanRepository.deleteTagByUUID(tagUUID)
    }

    async getColumnsByBoardUUID(boardUUID: string): Promise<ColumnListResponse> {
        return kanbanRepository.getColumnsByBoardUUID(boardUUID)
    }

    async saveColumn(column: Column): Promise<ColumnResponse> {
        if (!column.title) {
            return {error: this.TITLE_IS_EMPTY}
        }

        if (!column.description) {
            return {error: this.DESCRIPTION_IS_EMPTY}
        }

        return kanbanRepository.saveColumn(column)
    }

    async deleteColumnByUUID(columnUUID: string): Promise<MessageBoardResponse> {
        return kanbanRepository.deleteColumnByUUID(columnUUID)
    }

    async reorderColumns(columns: ReorderColumn[]): Promise<ColumnListResponse> {
        if (columns.length == 0) {
            return {error: this.COLUMNS_IS_EMPTY}
        }

        return kanbanRepository.reorderColumns(columns)
    }

    async saveColumnRule(rule: ColumnRule): Promise<ColumnRuleResponse> {
        if (!rule.title) {
            return {error: this.TITLE_IS_EMPTY}
        }

        if (!rule.type) {
            return {error: this.TYPE_IS_EMPTY}
        }

        if (!rule.columnUUID) {
            return {error: this.COLUMN_UUID_IS_EMPTY}
        }

        switch (rule.type) {
            case ColumnRuleType.ADD_TAG:
                if (!rule.metadata?.tag) {
                    return {error: this.TAG_IS_EMPTY}
                }
                break;
            case ColumnRuleType.SEND_EMAIL:
                if (!rule.metadata?.emails) {
                    return {error: this.EMAIL_IS_EMPTY}
                }
                break;
            case ColumnRuleType.NOTIFY_USER:
                if (!rule.metadata?.notifyUsers) {
                    return {error: this.USER_IS_EMPTY}
                }
                break;
        }

        return kanbanRepository.saveColumnRule(rule)
    }

    async saveAllowedColumns(columnUUID: string, allowed: string[]): Promise<MessageBoardResponse> {
        if (!columnUUID) {
            return {error: this.COLUMN_UUID_IS_EMPTY}
        }

        if (!allowed) {
            return {error: this.COLUMNS_IS_EMPTY}
        }

        return kanbanRepository.saveAllowedColumns(columnUUID, allowed)
    }

    async getColumnRuleByUUID(uuid: string): Promise<ColumnRuleResponse> {
        return kanbanRepository.getColumnRuleByUUID(uuid)
    }

    async deleteAllowedColumnUUID(column: string, allowed: string): Promise<MessageBoardResponse> {
        return kanbanRepository.deleteAllowedColumnUUID(column, allowed)
    }

    async deleteColumnRuleByUUID(columnRule: string): Promise<MessageBoardResponse> {
        return kanbanRepository.deleteColumnRuleByUUID(columnRule)
    }

    async getColumnByUUID(uuid: string): Promise<ColumnResponse> {
        return kanbanRepository.getColumnByUUID(uuid)
    }

    async moveCardToColumn(cardUUID: string, columnUUID: string): Promise<CardListResponse>{
        return kanbanRepository.moveCardToColumn(cardUUID, columnUUID)
    }

    async getCardByUUID(cardUUID: string): Promise<CardResponse> {
        return kanbanRepository.getCardByUUID(cardUUID)
    }

    async setDefaultColumn(boardUUID: string, columnUUID: string): Promise<ColumnListResponse> {
        return kanbanRepository.setDefaultColumn(boardUUID, columnUUID)
    }
}

export const kanbanUseCase = new KanbanUseCase()