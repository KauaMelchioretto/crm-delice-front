import {CrmContainer} from "../../../utils/components/core/CrmContainer.tsx";
import {FilterComponent} from "../../../utils/components/filter/FilterComponent.tsx";
import {CrmTableContainer} from "../../../utils/components/core/CrmTableContainer.tsx";
import KanbanState from "../state/KanbanState.ts";
import {useTranslation} from "react-i18next";
import {CrmTable} from "../../../utils/components/core/CrmTable.tsx";
import {
    CrmDefaultRoles,
    CrmField,
    CrmFormType,
    CrmModules,
} from "../../../utils/entities/entities.ts";
import {useAuth} from "../../../core/auth/provider/AuthProvider.tsx";
import {Board, getBoardStatusProps} from "../entities/entities.ts";
import {CircularProgress, IconButton} from "@mui/joy";
import {useAtomValue} from "jotai/index";
import {EditRounded} from "@mui/icons-material";
import {CrmPaginationAtom} from "../../../utils/components/pagination/CrmPagination.tsx";
import LeaderboardRoundedIcon from "@mui/icons-material/LeaderboardRounded";
import LanRoundedIcon from "@mui/icons-material/LanRounded";
import LayersRoundedIcon from "@mui/icons-material/LayersRounded";
import CrmState from "../../../utils/state/CrmState.ts";
import {useSetAtom} from "jotai";
import {useNavigate} from "react-router-dom";
import {useApp} from "../../../core/config/app/AppProvider.tsx";
import {CrmTableHead} from "../../../utils/components/core/CrmTableHead.tsx";
import {CrmError} from "../../../utils/components/core/CrmError.tsx";
import {CrmCardStatus} from "../../../utils/components/core/CrmCardStatus.tsx";

export const BoardList = () => {
    const setFormType = useSetAtom(CrmState.FormType);
    const setEntityUUID = useSetAtom(CrmState.EntityFormUUID);

    const {t} = useTranslation();
    const {getRolesByModule} = useAuth();
    const {getModuleByCode} = useApp();

    const kanbanRuleModule = getModuleByCode(CrmModules.KanbanRule);

    const navigate = useNavigate();

    const boardAtom = useAtomValue(KanbanState.ListAtom);

    const roles = getRolesByModule(CrmModules.Kanban);

    const canCreate = roles.filter(
        (x) => x.code === CrmDefaultRoles.CREATE_KANBAN || x.code === CrmDefaultRoles.ALL_KANBAN
    ).length > 0;

    const boardFields: CrmField[] = [
        {
            key: "title",
            sortable: true,
            label: t("kanbans.fields.title")
        },
        {
            key: "description",
            sortable: true,
            label: t("kanbans.fields.description")
        },
        {
            key: "status",
            sortable: true,
            label: t("kanbans.fields.status")
        },
        {
            key: "edit",
            label: t("actions.edit")
        },
        {
            key: "edit_tags",
            label: t("kanbans.fields.edit_tags"),
        },
        {
            key: "edit_columns",
            label: t("kanbans.fields.edit_columns"),
        },
        {
            key: "edit_rules",
            label: t("kanbans.fields.edit_rules"),
        },
    ];

    switch (boardAtom.state) {
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
                        fields={boardFields}
                        filterAtom={KanbanState.FilterAtom}
                    />
                    <CrmTableContainer>
                        <CrmTable
                            sx={{
                                "& thead th:nth-child(1)": {
                                    width: 200,
                                },
                                "& thead th:nth-child(2)": {
                                    width: 350,
                                },
                                "& thead th:nth-child(3)": {
                                    width: 100,
                                },
                                "& thead th:nth-child(4)": {
                                    width: 50,
                                },
                                "& thead th:nth-child(5)": {
                                    width: 50,
                                },
                                "& thead th:nth-child(6)": {
                                    width: 50,
                                },
                                "& thead th:nth-child(7)": {
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
                                fields={boardFields}
                                orderByAtom={KanbanState.OrderByAtom}
                            />
                            <tbody>
                            {boardAtom.data.items?.map((board: Board) => (
                                <tr key={`board_list_key_${board.uuid}`}>
                                    <td>{board.title}</td>
                                    <td>{board.description}</td>
                                    <td>
                                        <CrmCardStatus {...getBoardStatusProps(board.status!)}/>
                                    </td>
                                    {canCreate && (
                                        <td>
                                            <IconButton
                                                size={"sm"}
                                                onClick={() => {
                                                    setFormType(CrmFormType.EDIT_BOARD);
                                                    setEntityUUID(board.uuid ?? "");
                                                }}
                                            >
                                                <EditRounded/>
                                            </IconButton>
                                        </td>
                                    )}
                                    {canCreate && (
                                        <td>
                                            <IconButton
                                                size={"sm"}
                                                onClick={() => {
                                                    setFormType(CrmFormType.EDIT_TAGS);
                                                    setEntityUUID(board.uuid ?? "");
                                                }}
                                            >
                                                <LayersRoundedIcon/>
                                            </IconButton>
                                        </td>
                                    )}
                                    {canCreate && (
                                        <td>
                                            <IconButton
                                                size={"sm"}
                                                onClick={() => {
                                                    setFormType(CrmFormType.EDIT_COLUMNS);
                                                    setEntityUUID(board.uuid ?? "");
                                                }}
                                            >
                                                <LeaderboardRoundedIcon/>
                                            </IconButton>
                                        </td>
                                    )}
                                    {canCreate && (
                                        <td>
                                            <IconButton
                                                size={"sm"}
                                                onClick={() => {
                                                    const url = kanbanRuleModule.path.replace(
                                                        ":uuid",
                                                        board.uuid ?? ""
                                                    );
                                                    navigate(url);
                                                }}
                                            >
                                                <LanRoundedIcon/>
                                            </IconButton>
                                        </td>
                                    )}
                                </tr>
                            ))}
                            </tbody>
                        </CrmTable>
                    </CrmTableContainer>
                    <CrmPaginationAtom
                        page={KanbanState.PageAtom}
                        count={KanbanState.ListTotalCountAtom}
                    />
                </CrmContainer>
            )
    }
};
