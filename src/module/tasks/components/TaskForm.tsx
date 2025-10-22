import {useAtom, useAtomValue, useSetAtom} from "jotai";
import CrmState from "../../../utils/state/CrmState.ts";
import {CrmFormType} from "../../../utils/entities/entities.ts";
import {CrmModal} from "../../../utils/components/core/CrmModal.tsx";
import {CrmContainer} from "../../../utils/components/core/CrmContainer.tsx";
import {FieldValues, FormProvider, useForm} from "react-hook-form";
import {
    Accordion, AccordionDetails, AccordionGroup, AccordionSummary, accordionSummaryClasses,
    Avatar,
    Box,
    Button,
    CircularProgress, Divider,
    FormControl,
    FormHelperText,
    FormLabel,
    IconButton,
    Tab, TabList, TabPanel, Tabs,
    Typography
} from "@mui/joy";
import CloseRounded from "@mui/icons-material/CloseRounded";
import {useTranslation} from "react-i18next";
import {TextInput} from "../../../utils/components/core/TextInput.tsx";
import {CrmTextarea} from "../../../utils/components/core/CrmTextarea.tsx";
import {
    getPriorityProps,
    getTaskActionProps,
    getTaskStatusProps,
    Task, TaskHistory,
    TaskPriority,
    TaskStatus
} from "../entities/entities.ts";
import {NewCrmSelect, OptionType} from "../../../utils/components/core/SelectInput.tsx";
import UserState from "../../user/state/UserState.ts";
import {taskUseCase} from "../usecase/TaskUseCase.ts";
import {popup} from "../../../utils/alerts/Popup.ts";
import TaskState from "../state/TaskState.ts";
import {DateTimeInput} from "../../../utils/components/inputs/DateInput.tsx";
import {Fragment, useEffect, useState, useTransition} from "react";
import {valueToEnum} from "../../../utils/functions/ValueToEnum.ts";
import dayjs from "dayjs";
import TaskRoundedIcon from '@mui/icons-material/TaskRounded';
import {User} from "../../user/entities/entities.ts";
import {CrmCardStatus} from "../../../utils/components/core/CrmCardStatus.tsx";
import KeyboardArrowRightRounded from "@mui/icons-material/KeyboardArrowRightRounded";

export const TaskForm = () => {
    const [formType, setFormType] = useAtom(CrmState.FormType)
    const entityUUID = useAtomValue(CrmState.EntityFormUUID)

    switch (formType) {
        case CrmFormType.EMPTY:
            return <></>
        case CrmFormType.REGISTER_TASK:
            return (
                <CrmModal
                    open={true}
                    onClose={() => setFormType(CrmFormType.EMPTY)}
                >
                    <RegisterTaskForm/>
                </CrmModal>
            );
        case CrmFormType.EDIT_TASK:
            return (
                <CrmModal
                    open={true}
                    onClose={() => setFormType(CrmFormType.EMPTY)}
                >
                    <RegisterTaskForm uuid={entityUUID}/>
                </CrmModal>
            );
        case CrmFormType.DETAIL_TASK:
            return (
                <CrmModal
                    open={true}
                    onClose={() => setFormType(CrmFormType.EMPTY)}
                >
                    <DetailTask uuid={entityUUID}/>
                </CrmModal>
            );
    }
}

const RegisterTaskForm = ({uuid}: { uuid?: string }) => {
    const {t} = useTranslation()

    const setFormType = useSetAtom(CrmState.FormType)
    const updateList = useSetAtom(TaskState.UpdateAtom)

    const [isPending, startTransition] = useTransition()

    const formMethods = useForm()

    const {handleSubmit, register, formState: {errors}, setValue} = formMethods

    const handleSubmitTask = handleSubmit((data: FieldValues) => {
        if (!uuid) {
            taskUseCase.createTask({
                title: data.title,
                description: data.description,
                responsible: {
                    uuid: data.responsible,
                },
                priority: data.priority,
                dueDate: data.dueDate
            }).then((response) => {
                if (response.error) {
                    popup.toast("error", response.error, 2000);
                } else {
                    popup.toast("success", "Tarefa incluida com sucesso", 2000);
                    updateList(prev => !prev);
                    setFormType(CrmFormType.EMPTY);
                }
            })
        } else {
            taskUseCase.saveTask({
                uuid: uuid,
                title: data.title,
                description: data.description,
                responsible: {
                    uuid: data.responsible,
                },
                priority: data.priority,
                dueDate: data.dueDate
            }).then((response) => {
                if (response.error) {
                    popup.toast("error", response.error, 2000);
                } else {
                    popup.toast("success", "Tarefa salva com sucesso", 2000);
                    updateList(prev => !prev);
                    setFormType(CrmFormType.EMPTY);
                }
            })
        }
    })

    const priorityOptions: OptionType[] = [
        {
            value: TaskPriority.LOWEST.toString(),
            label: "Muito baixo"
        },
        {
            value: TaskPriority.LOW.toString(),
            label: "Baixo"
        },
        {
            value: TaskPriority.MEDIUM.toString(),
            label: "Medio"
        },
        {
            value: TaskPriority.HIGH.toString(),
            label: "Alto"
        },
        {
            value: TaskPriority.HIGHEST.toString(),
            label: "Muito alto"
        },
    ]

    const users = useAtomValue(UserState.SimpleUsersAtom)

    useEffect(() => {
        if (uuid) {
            startTransition(async () => {
                const response = await taskUseCase.getTaskByUUID(uuid)

                if (response.task) {
                    const task = response.task

                    setValue("title", task.title)
                    setValue("description", task.description)
                    setValue("priority", `${valueToEnum(task.priority, TaskPriority)}`)
                    setValue("dueDate", dayjs(task.dueDate).format("YYYY-MM-DDTHH:mm"))
                    setValue("responsible", task.responsible.uuid)
                }
            })
        }
    }, [uuid, setValue]);

    return (
        <CrmContainer sx={{minWidth: "400px"}}>
            <FormProvider {...formMethods}>
                <Box
                    display={"flex"}
                    justifyContent={"space-between"}
                    alignItems={"center"}
                >
                    <Typography level={"body-md"} fontWeight={"bold"}>
                        {uuid ? t("actions.edit") : t("actions.register")} {t("modules.tasks")}
                    </Typography>
                    <IconButton
                        size={"sm"}
                        onClick={() => setFormType(CrmFormType.EMPTY)}
                    >
                        <CloseRounded/>
                    </IconButton>
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                    }}
                    component={"form"}
                    onSubmit={handleSubmitTask}
                >
                    <FormControl sx={{flex: 1}}>
                        <FormLabel>Titulo</FormLabel>
                        <TextInput
                            {...register("title", {required: "Title must be informed"})}
                            size={"sm"}
                            variant={"soft"}
                            disabled={isPending}
                        />
                        <FormHelperText sx={{minHeight: "1rem"}}>
                            {errors?.title?.message as string}
                        </FormHelperText>
                    </FormControl>
                    <FormControl>
                        <FormLabel>Descrição</FormLabel>
                        <CrmTextarea
                            {...register("description")}
                            size={"sm"}
                            variant={"soft"}
                            minRows={2}
                            maxRows={3}
                            disabled={isPending}
                        />
                        <FormHelperText sx={{minHeight: "1rem"}}></FormHelperText>
                    </FormControl>
                    <Box
                        sx={{
                            width: "100%",
                            flex: 1,
                            display: "flex",
                            flexDirection: "row",
                            gap: 1
                        }}
                    >
                        <Box
                            sx={{
                                width: "100%",
                                flex: 1,
                            }}
                        >
                            <FormControl>
                                <FormLabel>Prioridade</FormLabel>
                                <NewCrmSelect
                                    {...register("priority", {required: "The priority is required"})}
                                    size={"sm"}
                                    variant={"soft"}
                                    options={priorityOptions}
                                    disabled={isPending}
                                />
                                <FormHelperText sx={{minHeight: "1rem"}}>
                                    {errors?.priority?.message as string}
                                </FormHelperText>
                            </FormControl>
                        </Box>
                        <Box
                            sx={{
                                width: "100%",
                                flex: 1,
                            }}
                        >
                            <FormControl>
                                <FormLabel>Reponsável</FormLabel>
                                <NewCrmSelect
                                    {...register("responsible", {required: "The responsible is required"})}
                                    size={"sm"}
                                    variant={"soft"}
                                    options={users}
                                    disabled={isPending}
                                />
                                <FormHelperText sx={{minHeight: "1rem"}}>
                                    {errors?.responsible?.message as string}
                                </FormHelperText>
                            </FormControl>
                        </Box>
                    </Box>
                    <FormControl sx={{flex: 1}}>
                        <FormLabel>Data limite</FormLabel>
                        <DateTimeInput
                            {...register("dueDate", {required: "Due date must be informed"})}
                            size={"sm"}
                            variant={"soft"}
                            disabled={isPending}
                        />
                        <FormHelperText sx={{minHeight: "1rem"}}>
                            {errors?.dueDate?.message as string}
                        </FormHelperText>
                    </FormControl>
                    <Button
                        type={"submit"}
                    >
                        Salvar
                    </Button>
                </Box>
            </FormProvider>
        </CrmContainer>
    )
}

const DetailTask = ({uuid}: { uuid: string }) => {
    const setFormType = useSetAtom(CrmState.FormType)
    const updateList = useSetAtom(TaskState.UpdateAtom)
    const [isPending, startTransition] = useTransition()

    const [task, setTask] = useState<Task>()

    useEffect(() => {
        if (uuid) {
            startTransition(async () => {
                const response = await taskUseCase.getTaskByUUID(uuid)

                if (response.task) {
                    setTask(response.task)
                }
            })
        }
    }, [uuid])

    const changeStatus = (status: TaskStatus) => {
        taskUseCase.changeTaskStatus(uuid, status).then((response) => {
            if (response.error) {
                popup.toast("error", response.error, 2000);
            } else {
                popup.toast("success", "Situação da tarefa alterado com sucesso", 2000);
                updateList(prev => !prev);
                setFormType(CrmFormType.EMPTY);
            }
        })
    }

    const taskStatus = valueToEnum(task?.status, TaskStatus)

    return (
        <CrmContainer sx={{minWidth: "600px"}}>
            <Box
                display={"flex"}
                justifyContent={"space-between"}
                alignItems={"center"}
            >
                <Typography level={"body-md"} fontWeight={"bold"}>
                    Detalhes tarefa
                </Typography>
                <IconButton
                    size={"sm"}
                    onClick={() => setFormType(CrmFormType.EMPTY)}
                >
                    <CloseRounded/>
                </IconButton>
            </Box>
            {
                isPending && (
                    <Box
                        sx={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "center"
                        }}
                    >
                        <CircularProgress/>
                    </Box>
                )
            }
            {
                task && (
                    <Fragment>
                        <Tabs defaultValue={0} sx={{pt: 0.5}}>
                            <TabList>
                                <Tab>Informações</Tab>
                                <Tab>Histórico</Tab>
                            </TabList>
                            <TabPanel value={0} sx={{pl: 0, pr: 0}}>
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 1,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexDirection: "row",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                        }}
                                    >
                                        <span
                                            style={{
                                                display: "flex",
                                                flexDirection: "row",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                                gap: 5
                                            }}
                                        >
                                            <TaskRoundedIcon sx={{fontSize: 25}}/>
                                            <Typography
                                                level={"body-md"}
                                                fontWeight={"bold"}
                                            >
                                                {task?.title ?? ""}
                                            </Typography>
                                        </span>
                                        <Typography
                                            level={"body-md"}
                                            fontWeight={"bold"}
                                        >
                                            {dayjs(task?.dueDate).format("DD/MM/YYYY HH:mm")}
                                        </Typography>
                                    </Box>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexDirection: "row",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                        }}
                                    >
                                        <Typography
                                            level={"body-sm"}
                                        >
                                            Responsável
                                        </Typography>
                                        <Typography
                                            level={"body-sm"}
                                        >
                                            {(task?.responsible as User)?.name} {(task?.responsible as User)?.surname}
                                        </Typography>
                                    </Box>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexDirection: "row",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                        }}
                                    >
                                        <Typography
                                            level={"body-sm"}
                                        >
                                            Criado por
                                        </Typography>
                                        <Typography
                                            level={"body-sm"}
                                        >
                                            {task?.createdBy?.name} {task?.createdBy?.surname}
                                        </Typography>
                                    </Box>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexDirection: "row",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                        }}
                                    >
                                        <Typography
                                            level={"body-sm"}
                                        >
                                            Prioridade
                                        </Typography>
                                        <Typography
                                            level={"body-sm"}
                                        >
                                            <CrmCardStatus {...getPriorityProps(task?.priority)} />
                                        </Typography>
                                    </Box>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexDirection: "row",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                        }}
                                    >
                                        <Typography
                                            level={"body-sm"}
                                        >
                                            Situação
                                        </Typography>
                                        <Typography
                                            level={"body-sm"}
                                        >
                                            <CrmCardStatus {...getTaskStatusProps(task?.status)} />
                                        </Typography>
                                    </Box>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexDirection: "row",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                        }}
                                    >
                                        <Typography
                                            level={"body-sm"}
                                        >
                                            Criação
                                        </Typography>
                                        <Typography
                                            level={"body-sm"}
                                        >
                                            {dayjs(task?.createdAt).format("DD/MM/YYYY HH:mm")}
                                        </Typography>
                                    </Box>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexDirection: "row",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                        }}
                                    >
                                        <Typography
                                            level={"body-sm"}
                                        >
                                            Última modificação
                                        </Typography>
                                        <Typography
                                            level={"body-sm"}
                                        >
                                            {dayjs(task?.modifiedAt).format("DD/MM/YYYY HH:mm")}
                                        </Typography>
                                    </Box>
                                </Box>
                            </TabPanel>
                            <TabPanel value={1} sx={{pl: 0, pr: 0}}>
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 1,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: 1,
                                            maxHeight: "300px",
                                            overflowY: "auto"
                                        }}
                                    >
                                        <AccordionGroup
                                            sx={{
                                                [`& .${accordionSummaryClasses.indicator}`]: {
                                                    display: "none"
                                                },
                                                [`& .${accordionSummaryClasses.button}`]: {
                                                    p: 0,
                                                    width: "100%"
                                                },
                                                [`& .${accordionSummaryClasses.root}`]: {
                                                    m: 0,
                                                    width: "-webkit-fill-available",
                                                    p: 0,
                                                    pt: 1
                                                },
                                                [`& .${accordionSummaryClasses.button}:hover`]: {
                                                    bgcolor: 'transparent',
                                                },
                                            }}
                                            disableDivider
                                        >
                                            {task.history?.map((h, i) => (
                                                <TaskHistoryItem
                                                    key={`task_history_${i}`}
                                                    {...h}
                                                />
                                            ))}
                                        </AccordionGroup>
                                    </Box>
                                    {
                                        taskStatus === TaskStatus.RUNNING && (
                                            <AddTaskHistory uuid={uuid}/>
                                        )
                                    }
                                </Box>
                            </TabPanel>
                        </Tabs>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                gap: 1
                            }}
                        >
                            {
                                taskStatus === TaskStatus.RUNNING && (
                                    <Fragment>
                                        <Button
                                            sx={{
                                                flex: 1
                                            }}
                                            onClick={() => {
                                                changeStatus(TaskStatus.PENDING)
                                            }}
                                        >
                                            Parar
                                        </Button>
                                        <Button
                                            sx={{
                                                flex: 1
                                            }}
                                            onClick={() => {
                                                changeStatus(TaskStatus.COMPLETED)
                                            }}
                                        >
                                            Finalizar
                                        </Button>
                                    </Fragment>
                                )
                            }
                            {
                                taskStatus === TaskStatus.PENDING && (
                                    <Button
                                        sx={{
                                            flex: 1
                                        }}
                                        onClick={() => {
                                            changeStatus(TaskStatus.RUNNING)
                                        }}
                                    >
                                        Iniciar
                                    </Button>
                                )
                            }
                        </Box>
                    </Fragment>
                )
            }
        </CrmContainer>
    )
}

const TaskHistoryItem = (props: TaskHistory) => {
    const [open, setOpen] = useState(false)

    return (
        <Accordion expanded={open}>
            <AccordionSummary
                indicator={<></>}
                onClick={() => setOpen(prev => !prev)}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        width: "100%"
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "start",
                            gap: 1,
                            width: "100%"
                        }}
                    >
                        <Avatar
                            variant="outlined"
                            size="sm"
                            alt={props.actionBy?.name.substring(0, 1)}
                            src={props.actionBy?.avatar}
                            sx={{
                                cursor: "pointer"
                            }}
                        />
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                            }}
                        >
                            <Typography
                                level={"body-xs"}
                                fontWeight={"bold"}
                            >
                                {props.actionBy?.name} {props.actionBy?.surname}
                            </Typography>
                            <Typography
                                level={"body-xs"}
                            >
                                {dayjs(props.actionAt).format("DD/MM/YYYY HH:mm")}
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                ml: "auto"
                            }}
                        >
                            <CrmCardStatus {...getTaskActionProps(props?.action)} />
                        </Box>
                    </Box>
                    <Divider
                        sx={{
                            mt: props.description ? undefined : "0.7rem !important",
                            mb: props.description ? undefined : "0.7rem !important",
                        }}
                    >
                        {
                            props.description && (
                                <IconButton
                                    variant={"plain"}
                                    size={"sm"}
                                    sx={{
                                        borderRadius: "50%",
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        minWidth: "1.4rem !important",
                                        minHeight: "1.4rem !important",
                                        transform: open ? "rotate(270deg)" : "rotate(90deg)",
                                        transition: "transform 100ms linear"
                                    }}
                                >
                                    {
                                        <KeyboardArrowRightRounded sx={{fontSize: "0.9rem"}}/>
                                    }
                                </IconButton>
                            )
                        }
                    </Divider>
                </Box>
            </AccordionSummary>
            {
                props.description && (
                    <AccordionDetails>
                        <Typography
                            level={"body-sm"}
                        >
                            {props.description}
                        </Typography>
                    </AccordionDetails>
                )
            }
        </Accordion>
    )
}

const AddTaskHistory = ({uuid}: { uuid: string }) => {
    const [form, setForm] = useState(false)

    const setFormType = useSetAtom(CrmState.FormType)
    const updateList = useSetAtom(TaskState.UpdateAtom)

    const {register, handleSubmit} = useForm()

    const submitHistory = handleSubmit((data: FieldValues) => {
        taskUseCase.addHistory({
            description: data.description,
            taskUUID: uuid
        }).then((response) => {
            if (response.error) {
                popup.toast("error", response.error, 2000);
            } else {
                popup.toast("success", "Historico adicionado com sucesso com sucesso", 2000);
                updateList(prev => !prev);
                setFormType(CrmFormType.EMPTY);
            }
        })
    })

    if (form) {
        return (
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                }}
                component={"form"}
                onSubmit={submitHistory}
            >
                <CrmTextarea
                    {...register("description")}
                    size={"sm"}
                    variant={"soft"}
                    minRows={4}
                    maxRows={5}
                    sx={{
                        flex: 1
                    }}
                />
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 1
                    }}
                >
                    <Button
                        sx={{
                            flex: 1
                        }}
                        onClick={() => {
                            setForm(false)
                        }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        sx={{
                            flex: 1
                        }}
                        type={"submit"}
                    >
                        Confirmar
                    </Button>
                </Box>
            </Box>
        )
    }

    return (
        <Button
            sx={{
                flex: 1
            }}
            onClick={() => {
                setForm(true)
            }}
        >
            Adicionar histórico
        </Button>
    )
}