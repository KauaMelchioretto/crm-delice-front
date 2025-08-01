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
import { useTranslation } from "react-i18next";

export const ModulesList = () => {
    const modifiedModule = useSetAtom(ModulesState.ModuleFormUUIDAtom);
    const modifiedModuleForm = useSetAtom(ModulesState.ModulesFormTypeAtom);
    const modulesAtom = useAtomValue(ModulesState.ModuleListAtom);
    const updateList = useSetAtom(ModulesState.ModuleUpdateAtom);
    const { t } = useTranslation();

    let modules: Module[] = [];

    const deleteModule = (uuid: string) => {
        popup.confirm("question", "Delete module?", "Are sure that want delete this module?", "Yes").then((r) => {
            if (r.isConfirmed) {
                modulesUseCase.deleteModuleByUUID(uuid).then((response) => {
                    if (response.error) {
                        popup.toast("error", response.error, 2000);
                    } else {
                        popup.toast("success", response.message as string, 2000);
                    }
                    updateList(prev => !prev);
                });
            }
        });
    }

    if (modulesAtom.state === "loading") {
        return (
            <CrmContainer>
                <CrmTableContainer sx={{height: 500}}>
                    <CircularProgress/>
                </CrmTableContainer>
            </CrmContainer>
        )
    }

    if (modulesAtom.state === "hasData") {
        modules = modulesAtom.data.modules ?? [];
    }

    return (
        <CrmContainer>
            <CrmTableContainer sx={{height: 500}}>
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
                    <thead>
                    <tr>
                        <th>{t("modules.fields.code")}</th>
                        <th>{t("modules.fields.label")}</th>
                        <th>{t("modules.fields.path")}</th>
                        <th>{t("actions.edit")}</th>
                        <th>{t("actions.roles")}</th>
                        <th>{t("actions.delete")}</th>
                    </tr>
                    </thead>
                    <tbody>
                    {modules.map((module: Module) => (
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
                                    disabled={module.code === "SYSTEM_ROLES"}
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
                                    disabled={module.code === "SYSTEM_ROLES"}
                                >
                                    <DeleteOutlineRounded/>
                                </IconButton>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </CrmTable>
            </CrmTableContainer>
        </CrmContainer>
    );
}