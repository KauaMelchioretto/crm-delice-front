import {Box, Button, Tooltip, Typography} from "@mui/joy";
import {CrmTitleContainer} from "../../../utils/components/core/CrmTitleContainer.tsx";
import {Calendar, CalendarProps} from "antd";
import {CrmContainer} from "../../../utils/components/core/CrmContainer.tsx";
import {CrmFormType} from "../../../utils/entities/entities.ts";
import {useSetAtom} from "jotai/index";
import CrmState from "../../../utils/state/CrmState.ts";
import dayjs, {Dayjs} from "dayjs";
import {useEffect, useState} from "react";
import {getPriorityProps, getTaskStatusProps, TaskByDate} from "../entities/entities.ts";
import {taskUseCase} from "../usecase/TaskUseCase.ts";
import {User} from "../../user/entities/entities.ts";
import TaskState from "../state/TaskState.ts";
import {useAtomValue} from "jotai";

export const CrmCalendar = () => {
    const modifiedTaskFormType = useSetAtom(CrmState.FormType)
    const setTaskEntity = useSetAtom(CrmState.EntityFormUUID)

    const [tasks, setTasks] = useState<TaskByDate[]>([])

    const update = useAtomValue(TaskState.UpdateAtom)

    const getListData = (value: Dayjs) => {
        return tasks.find(
            x => dayjs(x.day).date() === value.date() && dayjs(x.day).month() === value.month()
        )?.tasks ?? [];
    };

    const dateCellRender = (value: Dayjs) => {
        const listTask = getListData(value);
        return (
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 0.5
                }}
            >
                {
                    listTask.map((t, i) => {
                        const priorityProps = getPriorityProps(t.priority)
                        const statusProps = getTaskStatusProps(t.status)

                        const StatusIcon = statusProps.icon

                        return (
                            <Box
                                key={`task_${i}`}
                                sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    '&:hover': {
                                        backgroundColor: 'primary.softBg',
                                        color: 'primary.solidColor',
                                        cursor: 'pointer',
                                        borderRadius: "8px",
                                    },
                                    transition: "all 0.5s ease"
                                }}
                                onClick={() => {
                                    modifiedTaskFormType(CrmFormType.DETAIL_TASK)
                                    setTaskEntity(t.uuid!)
                                }}
                            >
                                <Tooltip title={priorityProps.label}>
                                    <Box
                                        sx={{
                                            height: "2.2rem",
                                            width: "5px",
                                            backgroundColor: priorityProps.color,
                                            borderRadius: "8px"
                                        }}
                                    />
                                </Tooltip>
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        ml: "2px",
                                        alignItems: "start"
                                    }}
                                >
                                    <Typography level={"body-xs"} fontWeight={"bold"}>
                                        {t.title}
                                    </Typography>
                                    <Typography level={"body-xs"}>
                                        {(t.responsible as User)?.name} {(t.responsible as User)?.surname}
                                    </Typography>
                                </Box>
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        ml: "auto",
                                        alignItems: "end"
                                    }}
                                >
                                    <Typography
                                        level={"body-xs"}
                                        color={"neutral"}
                                        sx={{
                                            opacity: 0.8
                                        }}
                                    >
                                        {dayjs(t.dueDate).format("HH:mm")}
                                    </Typography>
                                    <Tooltip title={statusProps.label}>
                                        <StatusIcon
                                            sx={{
                                                color: statusProps.color,
                                                fontSize: "12pt"
                                            }}
                                        />
                                    </Tooltip>
                                </Box>
                            </Box>
                        )
                    })
                }
            </Box>
        );
    };

    const cellRender: CalendarProps<Dayjs>['cellRender'] = (current, info) => {
        if (info.type === "date") {
            return dateCellRender(current)
        }

        return info.originNode
    }

    const onCalendarChange: CalendarProps<Dayjs>['onPanelChange'] = (date: Dayjs) => {
        setTasks([])
        taskUseCase.getTaskByMonth(date.year(), date.month() + 1).then((response) => {
            if (response.tasks) {
                setTasks(response.tasks)
            }
        })
    }

    useEffect(() => {
        taskUseCase.getTaskByMonth(dayjs().year(), dayjs().month() + 1).then((response) => {
            if (response.tasks) {
                setTasks(response.tasks)
            }
        })
    }, [update]);

    return (
        <Box
            sx={{
                height: "100%",
                width: "100%",
                gap: 2,
                display: "flex",
                flexDirection: "column",
            }}
        >
            <CrmTitleContainer
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <Typography
                    level={"body-lg"}
                    fontWeight={"bold"}
                >
                    Calendário
                </Typography>
                <Button
                    size="sm"
                    onClick={() => modifiedTaskFormType(CrmFormType.REGISTER_TASK)}
                >
                    Cadastrar tarefa
                </Button>
            </CrmTitleContainer>
            <CrmContainer sx={{height: 550}}>
                <Calendar
                    onPanelChange={onCalendarChange}
                    cellRender={cellRender}
                />
            </CrmContainer>
        </Box>
    )
}