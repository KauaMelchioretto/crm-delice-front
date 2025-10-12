import {useAtomValue, useSetAtom} from "jotai";
import TaskState from "../state/TaskState.ts";
import {CrmContainer} from "../../../utils/components/core/CrmContainer.tsx";
import {CrmTableContainer} from "../../../utils/components/core/CrmTableContainer.tsx";
import {CircularProgress, IconButton} from "@mui/joy";
import {getPriorityProps, getTaskStatusProps, Task} from "../entities/entities.ts";
import {FilterComponent} from "../../../utils/components/filter/FilterComponent.tsx";
import {CrmTable} from "../../../utils/components/core/CrmTable.tsx";
import {CrmTableHead} from "../../../utils/components/core/CrmTableHead.tsx";
import {CrmPaginationAtom} from "../../../utils/components/pagination/CrmPagination.tsx";
import dayjs from "dayjs";
import {User} from "../../user/entities/entities.ts";
import {CrmFormType} from "../../../utils/entities/entities.ts";
import {EditRounded} from "@mui/icons-material";
import CrmState from "../../../utils/state/CrmState.ts";
import {CrmCardStatus} from "../../../utils/components/core/CrmCardStatus.tsx";
import {CrmError} from "../../../utils/components/core/CrmError.tsx";
import PublishedWithChangesRoundedIcon from '@mui/icons-material/PublishedWithChangesRounded';

export const TaskList = () => {
    const taskAtom = useAtomValue(TaskState.ListAtom);

    const setEntity = useSetAtom(CrmState.EntityFormUUID)
    const setFormType = useSetAtom(CrmState.FormType)

    const taskFields = [
        {value: "title", label: "Titulo"},
        {value: "responsible", label: "Responsável"},
        {value: "createdBy", label: "Criado por"},
        {value: "status", label: "Situação"},
        {value: "priority", label: "Prioridade"},
        {value: "dueDate", label: "Data limite"},
        {value: "edit", label: "Editar"},
        {value: "view", label: "Detalhar"},
    ];

    switch (taskAtom.state) {
        case "hasError":
            return (
                <CrmContainer sx={{width: "100%"}}>
                    <CrmTableContainer
                        sx={{
                            height: 500,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <CrmError/>
                    </CrmTableContainer>
                </CrmContainer>
            );
        case "loading":
            return (
                <CrmContainer sx={{width: "100%"}}>
                    <CrmTableContainer
                        sx={{
                            height: 500,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <CircularProgress/>
                    </CrmTableContainer>
                </CrmContainer>
            );
        case "hasData":
            return (
                <CrmContainer>
                    <FilterComponent
                        fields={taskFields}
                        filterAtom={TaskState.FilterAtom}
                    />
                    <CrmTableContainer sx={{height: 450, pt: 2}}>
                        <CrmTable
                            sx={{
                                "& thead th:nth-child(1)": {
                                    width: 200,
                                },
                                "& thead th:nth-child(2)": {
                                    width: 200,
                                },
                                "& thead th:nth-child(3)": {
                                    width: 100,
                                },
                                "& thead th:nth-child(4)": {
                                    width: 100,
                                },
                                "& thead th:nth-child(5)": {
                                    width: 100,
                                },
                                "& thead th:nth-child(6)": {
                                    width: 100,
                                },
                                "& thead th:nth-child(7)": {
                                    width: 50,
                                },
                                "& thead th:nth-child(8)": {
                                    width: 50,
                                },
                                "& td": {
                                    textWrap: "nowrap",
                                    textOverflow: "ellipsis",
                                    overflow: "hidden",
                                },
                            }}
                        >
                            <thead>
                            <tr>
                                {
                                    taskFields.map((t, i) => (
                                        <CrmTableHead
                                            key={`task_field_${i}`}
                                            field={taskFields.find((x) => x.value === t.value)!}
                                            orderByAtom={TaskState.OrderByAtom}
                                        />
                                    ))
                                }
                            </tr>
                            </thead>
                            <tbody>
                            {taskAtom.data.items?.map((task: Task) => (
                                <tr key={`wallet_list_key_${task.uuid}`}>
                                    <td>{task.title}</td>
                                    <td>{`${(task.responsible as User)?.name} ${(task.responsible as User)?.surname}`}</td>
                                    <td>{`${task.createdBy?.name} ${task.createdBy?.surname}`}</td>
                                    <td>
                                        <CrmCardStatus {...getTaskStatusProps(task.status)} />
                                    </td>
                                    <td>
                                        <CrmCardStatus {...getPriorityProps(task.priority)} />
                                    </td>
                                    <td>{dayjs(task.dueDate).format("DD/MM/YYYY HH:mm")}</td>
                                    <td>
                                        <IconButton
                                            size={"sm"}
                                            onClick={() => {
                                                setEntity(task?.uuid ?? "");
                                                setFormType(CrmFormType.EDIT_TASK);
                                            }}
                                        >
                                            <EditRounded/>
                                        </IconButton>
                                    </td>
                                    <td>
                                        <IconButton
                                            size={"sm"}
                                            onClick={() => {
                                                setEntity(task?.uuid ?? "");
                                                setFormType(CrmFormType.DETAIL_TASK);
                                            }}
                                        >
                                            <PublishedWithChangesRoundedIcon/>
                                        </IconButton>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </CrmTable>
                    </CrmTableContainer>
                    <CrmPaginationAtom
                        page={TaskState.PageAtom}
                        count={TaskState.ListTotalCountAtom}
                    />
                </CrmContainer>
            );
    }
}