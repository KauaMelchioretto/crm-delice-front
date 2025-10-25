import {CrmFilter, CrmOrderBy} from "../../../utils/entities/entities.ts";
import {
    Task,
    TaskByDateResponse,
    TaskHistory,
    TaskListResponse,
    TaskResponse,
    TaskStatus
} from "../entities/entities.ts";
import {taskRepository} from "../repository/TaskRepository.ts";

class TaskUseCase {
    TASK_TITLE_IS_EMPTY = "Title must be provided"
    TASK_DESCRIPTION_IS_EMPTY = "Description must be provided"
    TASK_RESPONSIBLE_IS_EMPTY = "Responsible is empty"

    async getTaskPagination(
        page: number,
        filter: CrmFilter | null,
        orderBy: CrmOrderBy | null
    ): Promise<TaskListResponse> {
        return taskRepository.getTaskPagination(page, filter, orderBy)
    }

    async createTask(task: Task): Promise<TaskResponse> {
        const validate = this.validateTask(task)

        if(validate){
            return validate
        }

        return taskRepository.createTask(task)
    }

    async saveTask(task: Task): Promise<TaskResponse>{
        const validate = this.validateTask(task)

        if(validate){
            return validate
        }

        return taskRepository.saveTask(task)
    }

    async getTaskByUUID(uuid: string): Promise<TaskResponse> {
        return taskRepository.getTaskByUUID(uuid)
    }

    async changeTaskStatus(uuid: string, status: TaskStatus): Promise<TaskResponse> {
        return taskRepository.changeTaskStatus(uuid, status)
    }

    async addHistory(history: TaskHistory): Promise<TaskResponse> {
        return taskRepository.addHistory(history)
    }

    async getTaskByMonth(year: number, month: number): Promise<TaskByDateResponse> {
        return taskRepository.getTaskByMonth(year, month)
    }

    async getMyNextTask(): Promise<TaskResponse> {
        return taskRepository.getMyNextTask()
    }

    private validateTask(task: Task): TaskResponse | undefined {
        if (!task.title) {
            return {error: this.TASK_TITLE_IS_EMPTY}
        }

        if (!task.description) {
            return {error: this.TASK_DESCRIPTION_IS_EMPTY}
        }

        if (!task.responsible.uuid) {
            return {error: this.TASK_RESPONSIBLE_IS_EMPTY}
        }

        return
    }
}

export const taskUseCase = new TaskUseCase()