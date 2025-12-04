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
import {t} from "i18next";

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
            label: t('tasks.priority.highest'),
            icon: KeyboardDoubleArrowUpRoundedIcon,
        } as CrmCardStatusProps,
        [TaskPriority.HIGH]: {
            color: "#e28a26",
            label: t('tasks.priority.high'),
            icon: ExpandLessRoundedIcon,
        } as CrmCardStatusProps,
        [TaskPriority.MEDIUM]: {
            color: "#118D57",
            label: t('tasks.priority.medium'),
            icon: UnfoldLessRoundedIcon,
        } as CrmCardStatusProps,
        [TaskPriority.LOW]: {
            color: "#2685E2",
            label: t('tasks.priority.low'),
            icon: ExpandMoreRoundedIcon,
        } as CrmCardStatusProps,
        [TaskPriority.LOWEST]: {
            color: "#9823bf",
            label: t('tasks.priority.lowest'),
            icon: KeyboardDoubleArrowDownRoundedIcon,
        } as CrmCardStatusProps,
    };

    return priorityProps[value] as CrmCardStatusProps
}

export function getTaskStatusProps(status?: string): CrmCardStatusProps {
    const value = valueToEnum(status, TaskStatus)

    const statusProps = {
        [TaskStatus.PENDING]: {
            color: "#e28a26",
            label: t('tasks.status.pending'),
            icon: BookmarkRemoveRoundedIcon,
        } as CrmCardStatusProps,
        [TaskStatus.RUNNING]: {
            color: "#2685E2",
            label: t('tasks.status.in_progress'),
            icon: BookmarkBorderRoundedIcon,
        } as CrmCardStatusProps,
        [TaskStatus.COMPLETED]: {
            color: "#118D57",
            label: t('tasks.status.completed'),
            icon: BookmarkAddedRoundedIcon,
        } as CrmCardStatusProps,
    };

    return statusProps[value] as CrmCardStatusProps
}

export function getTaskActionProps(action?: string): CrmCardStatusProps {
    const value = valueToEnum(action, TaskAction)

    const actionProps = {
        [TaskAction.CREATED]: {
            color: "#e28a26",
            label: t('tasks.history_action.created'),
            icon: AddCircleOutlineRoundedIcon,
        } as CrmCardStatusProps,
        [TaskAction.UPDATED]: {
            color: "#2685E2",
            label: t('tasks.history_action.updated'),
            icon: ManageHistoryRoundedIcon,
        } as CrmCardStatusProps,
        [TaskAction.FINISHED]: {
            color: "#118D57",
            label: t('tasks.history_action.finished'),
            icon: CheckCircleOutlineRoundedIcon,
        } as CrmCardStatusProps,
    };

    return actionProps[value] as CrmCardStatusProps
}