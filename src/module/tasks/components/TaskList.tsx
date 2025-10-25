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
import {CrmField, CrmFieldType, CrmFormType} from "../../../utils/entities/entities.ts";
import {EditRounded} from "@mui/icons-material";
import CrmState from "../../../utils/state/CrmState.ts";
import {CrmCardStatus} from "../../../utils/components/core/CrmCardStatus.tsx";
import {CrmError} from "../../../utils/components/core/CrmError.tsx";
import PublishedWithChangesRoundedIcon from '@mui/icons-material/PublishedWithChangesRounded';

export const TaskList = () => {
    const taskAtom = useAtomValue(TaskState.ListAtom)

    const setEntity = useSetAtom(CrmState.EntityFormUUID)
    const setFormType = useSetAtom(CrmState.FormType)

    const taskFields: CrmField[] = [
        {
            key: "title",
            label: "Titulo",
            filterable: true,
            sortable: true,
        },
        {
            key: "responsible",
            label: "Responsável",
            filterable: true,
            sortable: true,
        },
        {
            key: "createdBy",
            label: "Criado por",
            filterable: true,
            sortable: true,
        },
        {
            key: "status",
            label: "Situação",
            filterable: true,
            sortable: true,
        },
        {
            key: "priority",
            label: "Prioridade",
            filterable: true,
            sortable: true,
        },
        {
            key: "dueDate",
            label: "Data limite",
            filterable: true,
            sortable: true,
            filterType: CrmFieldType.Date
        },
        {
            key: "edit",
            label: "Editar",
        },
        {
            key: "view",
            label: "Detalhar",
        },
    ];

    switch (taskAtom.state) {
        case "hasError":
            return (
                <CrmContainer
                    sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%"
                    }}
                >
                    <CrmError/>
                </CrmContainer>
            );
        case "loading":
            return (
                <CrmContainer
                    sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%"
                    }}
                >
                    <CircularProgress/>
                </CrmContainer>
            );
        case "hasData":
            return (
                <CrmContainer
                    sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        gap: 1
                    }}
                >
                    <FilterComponent
                        fields={taskFields}
                        filterAtom={TaskState.FilterAtom}
                    />
                    <CrmTableContainer>
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
                            <CrmTableHead
                                fields={taskFields}
                                orderByAtom={TaskState.OrderByAtom}
                            />
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