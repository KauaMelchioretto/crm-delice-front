import {CircularProgress, IconButton} from "@mui/joy";
import {Module, ModulesFormType} from "../enitites/entities.ts";
import {CrmTable} from "../../../utils/components/core/CrmTable.tsx";

import PlaylistAdd from '@mui/icons-material/PlaylistAdd';
import DeleteOutlineRounded from '@mui/icons-material/DeleteOutlineRounded';
import EditRounded from '@mui/icons-material/EditRounded';
import {CrmTableContainer} from "../../../utils/components/core/CrmTableContainer.tsx";
import {useAtomValue, useSetAtom} from "jotai";
import ModulesState from "../state/ModulesState.ts";
import {CrmContainer} from "../../../utils/components/core/CrmContainer.tsx";
import {modulesUseCase} from "../usecase/ModulesUseCase.ts";
import {popup} from "../../../utils/alerts/Popup.ts";
import {useTranslation} from "react-i18next";
import {CrmPaginationAtom} from "../../../utils/components/pagination/CrmPagination.tsx";
import {FilterComponent} from "../../../utils/components/filter/FilterComponent.tsx";
import {CrmTableHead} from "../../../utils/components/core/CrmTableHead.tsx";
import {CrmError} from "../../../utils/components/core/CrmError.tsx";
import {CrmField, CrmModules} from "../../../utils/entities/entities.ts";

export const ModulesList = () => {
    const modifiedModule = useSetAtom(ModulesState.ModuleFormUUIDAtom);
    const modifiedModuleForm = useSetAtom(ModulesState.ModulesFormTypeAtom);
    const modulesAtom = useAtomValue(ModulesState.ModuleListAtom);
    const updateList = useSetAtom(ModulesState.ModuleUpdateAtom);
    const {t} = useTranslation();

    const deleteModule = (uuid: string) => {
        popup.confirm("question", t('modules.messages.question_delete_module'), t('modules.messages.question_confirmation_delete_module'), t('actions.yes'), t('actions.cancel')).then((r) => {
            if (r.isConfirmed) {
                modulesUseCase.deleteModuleByUUID(uuid).then((response) => {
                    if (response.error) {
                        popup.toast("error", t(`modules.errors.${response.error}`), 2000);
                    } else {
                        popup.toast("success", t(`modules.messages.${response.message}`), 2000);
                    }
                    updateList(prev => !prev);
                });
            }
        });
    }

    const moduleFields: CrmField[] = [
        {
            key: "code",
            label: t("modules.fields.code"),
            filterable: true,
            sortable: true
        },
        {
            key: "label",
            label: t("modules.fields.label"),
            filterable: true,
            sortable: true
        },
        {
            key: "path",
            label: t("modules.fields.path"),
            sortable: true
        },
        {
            key: "edit",
            label: t("actions.edit")
        },
        {
            key: "roles",
            label: t("actions.roles")
        },
        {
            key: "delete",
            label: t("actions.delete")
        },
    ]

    switch (modulesAtom.state) {
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
                        fields={moduleFields}
                        filterAtom={ModulesState.FilterAtom}
                    />
                    <CrmTableContainer>
                        <CrmTable
                            sx={{
                                "& thead th:nth-child(1)": {
                                    width: 200
                                },
                                "& thead th:nth-child(2)": {
                                    width: 500
                                },
                                "& thead th:nth-child(3)": {
                                    width: 200
                                },
                                "& thead th:nth-child(4)": {
                                    width: 50
                                },
                                "& thead th:nth-child(5)": {
                                    width: 50
                                },
                                "& thead th:nth-child(6)": {
                                    width: 50
                                },
                            }}
                        >
                            <CrmTableHead
                                fields={moduleFields}
                                orderByAtom={ModulesState.OrderByAtom}
                            />
                            <tbody>
                            {modulesAtom.data.items?.map((module: Module) => (
                                <tr key={`module_list_key_${module.uuid}`}>
                                    <td>{module.code}</td>
                                    <td>{module.label}</td>
                                    <td>{module.path}</td>
                                    <td>
                                        <IconButton
                                            size={"sm"}
                                            onClick={() => {
                                                modifiedModule(module?.uuid ?? '');
                                                modifiedModuleForm(ModulesFormType.EDIT_MODULE)
                                            }}
                                            disabled={module.code === CrmModules.System}
                                        >
                                            <EditRounded/>
                                        </IconButton>
                                    </td>
                                    <td>
                                        <IconButton
                                            size={"sm"}
                                            onClick={() => {
                                                modifiedModule(module?.uuid ?? '');
                                                modifiedModuleForm(ModulesFormType.REGISTER_ROLE)
                                            }}
                                        >
                                            <PlaylistAdd/>
                                        </IconButton>
                                    </td>
                                    <td>
                                        <IconButton
                                            size={"sm"}
                                            onClick={() => {
                                                deleteModule(module?.uuid ?? '');
                                            }}
                                            disabled={module.code === CrmModules.System}
                                        >
                                            <DeleteOutlineRounded/>
                                        </IconButton>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </CrmTable>
                    </CrmTableContainer>
                    <CrmPaginationAtom
                        page={ModulesState.PageAtom}
                        count={ModulesState.ModulesListTotalCountAtom}
                    />
                </CrmContainer>
            );
    }
}