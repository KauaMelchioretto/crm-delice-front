import {User} from "../../user/entities/entities.ts";
import {CrmCardStatusProps} from "../../../utils/entities/entities.ts";
import {valueToEnum} from "../../../utils/functions/ValueToEnum.ts";

import KeyboardDoubleArrowUpRoundedIcon from '@mui/icons-material/KeyboardDoubleArrowUpRounded';
import ExpandLessRoundedIcon from '@mui/icons-material/ExpandLessRounded';
import UnfoldLessRoundedIcon from '@mui/icons-material/UnfoldLessRounded';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import KeyboardDoubleArrowDownRoundedIcon from '@mui/icons-material/KeyboardDoubleArrowDownRounded';

import BookmarkRemoveRoundedIcon from '@mui/icons-material/BookmarkRemoveRounded';
import BookmarkBorderRoundedIcon from '@mui/icons-material/BookmarkBorderRounded';
import BookmarkAddedRoundedIcon from '@mui/icons-material/BookmarkAddedRounded';

import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import ManageHistoryRoundedIcon from '@mui/icons-material/ManageHistoryRounded';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';

export interface Task {
    uuid?: string
    title: string
    description?: string
    responsible: User | { uuid: string }
    status?: string
    priority?: string
    dueDate?: string
    history?: TaskHistory[]
    createdBy?: User
    createdAt?: string
    modifiedAt?: string
}

export interface TaskHistory {
    uuid?: string
    taskUUID: string
    description: string
    action?: string
    actionBy?: User
    actionAt?: string
}

export interface TaskByDate{
    day: string
    tasks: Task[]
}

export interface TaskByDateResponse{
    tasks?: TaskByDate[]
    error?: string
}

export interface TaskResponse {
    task?: Task,
    error?: string
}

export interface TaskListResponse {
    items?: Task[],
    page?: number,
    total?: number,
    error?: string
}

export enum TaskPriority {
    LOWEST = 0,
    LOW = 1,
    MEDIUM = 2,
    HIGH = 3,
    HIGHEST = 4,
}

export enum TaskStatus {
    PENDING = 0,
    RUNNING = 1,
    COMPLETED = 2
}

export enum TaskAction {
    CREATED = 0,
    UPDATED = 1,
    FINISHED = 2
}

export function getPriorityProps(priority?: string): CrmCardStatusProps {
    const value = valueToEnum(priority, TaskPriority)

    const priorityProps = {
        [TaskPriority.HIGHEST]: {
            color: "#ff543f",
            label: priority,
            icon: KeyboardDoubleArrowUpRoundedIcon,
        } as CrmCardStatusProps,
        [TaskPriority.HIGH]: {
            color: "#e28a26",
            label: priority,
            icon: ExpandLessRoundedIcon,
        } as CrmCardStatusProps,
        [TaskPriority.MEDIUM]: {
            color: "#118D57",
            label: priority,
            icon: UnfoldLessRoundedIcon,
        } as CrmCardStatusProps,
        [TaskPriority.LOW]: {
            color: "#2685E2",
            label: priority,
            icon: ExpandMoreRoundedIcon,
        } as CrmCardStatusProps,
        [TaskPriority.LOWEST]: {
            color: "#9823bf",
            label: priority,
            icon: KeyboardDoubleArrowDownRoundedIcon,
        } as CrmCardStatusProps,
    };

    return priorityProps[value] as CrmCardStatusProps
}

export function getTaskStatusProps(status?: string): CrmCardStatusProps {
    const value = valueToEnum(status, TaskStatus)

    const priorityProps = {
        [TaskStatus.PENDING]: {
            color: "#e28a26",
            label: status,
            icon: BookmarkRemoveRoundedIcon,
        } as CrmCardStatusProps,
        [TaskStatus.RUNNING]: {
            color: "#2685E2",
            label: status,
            icon: BookmarkBorderRoundedIcon,
        } as CrmCardStatusProps,
        [TaskStatus.COMPLETED]: {
            color: "#118D57",
            label: status,
            icon: BookmarkAddedRoundedIcon,
        } as CrmCardStatusProps,
    };

    return priorityProps[value] as CrmCardStatusProps
}

export function getTaskActionProps(action?: string): CrmCardStatusProps {
    const value = valueToEnum(action, TaskAction)

    const priorityProps = {
        [TaskAction.CREATED]: {
            color: "#e28a26",
            label: action,
            icon: AddCircleOutlineRoundedIcon,
        } as CrmCardStatusProps,
        [TaskAction.UPDATED]: {
            color: "#2685E2",
            label: action,
            icon: ManageHistoryRoundedIcon,
        } as CrmCardStatusProps,
        [TaskAction.FINISHED]: {
            color: "#118D57",
            label: action,
            icon: CheckCircleOutlineRoundedIcon,
        } as CrmCardStatusProps,
    };

    return priorityProps[value] as CrmCardStatusProps
}