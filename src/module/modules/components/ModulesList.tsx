import {CircularProgress, IconButton} from "@mui/joy";
import {Module, ModulesFormType} from "../enitites/entities.ts";
import {CrmTable} from "../../../utils/components/core/CrmTable.tsx";

import PlaylistAdd from '@mui/icons-material/PlaylistAdd';
import DeleteOutlineRounded from '@mui/icons-material/DeleteOutlineRounded';
import EditRounded from '@mui/icons-material/EditRounded';
import {CrmTableContainer} from "../../../utils/components/core/CrmTableContainer.tsx";
import {useAtom, useAtomValue, useSetAtom} from "jotai";
import ModulesState from "../state/ModulesState.ts";
import {CrmContainer} from "../../../utils/components/core/CrmContainer.tsx";
import {modulesUseCase} from "../usecase/ModulesUseCase.ts";
import {popup} from "../../../utils/alerts/Popup.ts";
import { useTranslation } from "react-i18next";
import { ChangeEvent } from "react";
import { CrmPagination } from "../../../utils/components/pagination/CrmPagination.tsx";
import { FilterComponent } from "../../../utils/components/filter/FilterComponent.tsx";
import { CrmTableHead } from "../../../utils/components/core/CrmTableHead.tsx";

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
        modules = modulesAtom.data.items ?? [];
    }

    const moduleFieldsFilter = [
        { value: "", label: t("filter_keys.none") },
        { value: "code", label: t("modules.fields.code") },
        { value: "label", label: t("modules.fields.label") },
        { value: "path", label: t("modules.fields.path")}
    ]

    const moduleFields = [
        ...moduleFieldsFilter,
        { value: t("actions.edit"), label: t("actions.edit") },
        { value: t("actions.roles"), label: t("actions.roles") },
        { value: t("actions.delete"), label: t("actions.delete") },
    ]

    return (
        <CrmContainer>
            <FilterComponent fields={moduleFieldsFilter} filterAtom={ModulesState.FilterAtom} />
            <CrmTableContainer sx={{height: 500, pt: 2}}>
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
                        <CrmTableHead
                        field={moduleFields.find((x) => x.value === "code")!}
                        orderByAtom={ModulesState.OrderByAtom}
                        />
                        <CrmTableHead
                        field={moduleFields.find((x) => x.value === "label")!}
                        orderByAtom={ModulesState.OrderByAtom}
                        />
                        <CrmTableHead 
                        field={moduleFields.find((x) => x.value === "path")!}
                        orderByAtom={ModulesState.OrderByAtom}
                        />
                        <CrmTableHead
                        field={moduleFields.find((x) => x.value === t("actions.edit"))!}
                        orderByAtom={null}
                        />
                        <CrmTableHead
                        field={moduleFields.find((x) => x.value === t("actions.roles"))!}
                        orderByAtom={null}
                        />
                        <CrmTableHead
                        field={moduleFields.find((x) => x.value === t("actions.delete"))!}
                        orderByAtom={null}
                        />
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
            <ModulesPagination />
        </CrmContainer>
    );
}

export const ModulesPagination = () => {
    const [page, setPage] = useAtom(ModulesState.PageAtom);
    const pageCount = useAtomValue(ModulesState.ModulesListTotalCountAtom);

    if (pageCount.state === "loading") return;

    const count = pageCount.state === "hasData" ? pageCount.data : 0;
    const handleChange = (_: ChangeEvent<unknown>, value: number) => {
        setPage(--value);
    }

    return (
        <CrmPagination page={page + 1} count={count} onChange={handleChange} />
    );

}