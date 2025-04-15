import {
    Box,
    Button,
    FormControl,
    FormHelperText,
    FormLabel,
    IconButton,
    Modal,
    ModalDialog,
    Typography
} from "@mui/joy";
import {TextInput} from "../../../utils/components/core/TextInput.tsx";
import {FieldValues, FormProvider, useForm} from "react-hook-form";
import {modulesUseCase} from "../usecase/ModulesUseCase.ts";
import {popup} from "../../../utils/alerts/Popup.ts";
import {useAtomValue, useSetAtom} from "jotai";
import ModulesState from "../state/ModulesState.ts";
import {ModulesFormType, ModuleWithRolesResponse, Role} from "../enitites/entities.ts";
import {ReactElement, useEffect, useState} from "react";
import CloseRounded from '@mui/icons-material/CloseRounded';
import {CrmContainer} from "../../../utils/components/core/CrmContainer.tsx";
import {CrmTableContainer} from "../../../utils/components/core/CrmTableContainer.tsx";
import {CrmTable} from "../../../utils/components/core/CrmTable.tsx";
import DeleteOutlineRounded from "@mui/icons-material/DeleteOutlineRounded";
import {CrmSelect} from "../../../utils/components/core/SelectInput.tsx";
import {useAuth} from "../../../core/auth/provider/AuthProvider.tsx";

export const ModulesForm = () => {
    const formType = useAtomValue(ModulesState.ModulesFormTypeAtom)

    const moduleUUID = useAtomValue(ModulesState.ModuleFormUUIDAtom);

    switch (formType) {
        case ModulesFormType.EMPTY:
            return <></>
        case ModulesFormType.REGISTER_MODULE:
            return (
                <ModulesFormModal>
                    <RegisterModule/>
                </ModulesFormModal>
            )
        case ModulesFormType.EDIT_MODULE:
            return (
                <ModulesFormModal>
                    <RegisterModule moduleUUID={moduleUUID}/>
                </ModulesFormModal>
            )
        case ModulesFormType.REGISTER_ROLE:
            return (
                <ModulesFormModal>
                    <RegisterRole moduleUUID={moduleUUID}/>
                </ModulesFormModal>
            )
    }
}

const ModulesFormModal = (
    {children}: { children: ReactElement }
) => {
    const setFormType = useSetAtom(ModulesState.ModulesFormTypeAtom);

    return (
        <Modal
            open={true}
            onClose={() => setFormType(ModulesFormType.EMPTY)}
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <ModalDialog variant={"outlined"} size={"lg"} sx={{p: 0, maxWidth: 600}}>
                {children}
            </ModalDialog>
        </Modal>
    )
}

const RegisterModule = ({moduleUUID}: { moduleUUID?: string }) => {
    const setFormType = useSetAtom(ModulesState.ModulesFormTypeAtom);
    const updateList = useSetAtom(ModulesState.ModuleUpdateAtom);

    const {register, handleSubmit, setValue, formState: {errors}} = useForm();

    const handleFormModules = handleSubmit((data: FieldValues) => {
        modulesUseCase.createModule({
            label: data.label,
            code: data.code,
            path: data.path,
            uuid: moduleUUID
        }).then((response) => {
            if (response.error) {
                popup.toast("error", response.error, 2000);
            } else {
                popup.toast("success", "The module is included with success", 2000);
                updateList(prev => !prev);
                setFormType(ModulesFormType.EMPTY);
            }
        })
    });

    useEffect(() => {
        if (moduleUUID) {
            modulesUseCase.getModuleByUUID(moduleUUID).then((response) => {
                if (!response.error) {
                    setValue("code", response.module?.code)
                    setValue("label", response.module?.label)
                    setValue("path", response.module?.path)
                }
            })
        }
    }, [moduleUUID, setValue]);

    return (
        <CrmContainer>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                }}
                component={"form"}
                onSubmit={handleFormModules}
            >
                <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
                    <Typography level={"body-md"} fontWeight={"bold"}>
                        {moduleUUID ? "Edit" : "Register"} Module
                    </Typography>
                    <IconButton
                        size={"sm"}
                        onClick={() => setFormType(ModulesFormType.EMPTY)}
                    >
                        <CloseRounded/>
                    </IconButton>
                </Box>
                <FormControl>
                    <FormLabel>Code</FormLabel>
                    <TextInput
                        {...register("code", {required: "The code is required"})}
                        size={"md"}
                        variant={"soft"}
                    />
                    <FormHelperText sx={{minHeight: "1rem"}}>
                        {errors?.code?.message as string}
                    </FormHelperText>
                </FormControl>
                <FormControl>
                    <FormLabel>Label</FormLabel>
                    <TextInput
                        {...register("label", {required: "The label is required"})}
                        size={"md"}
                        variant={"soft"}
                    />
                    <FormHelperText sx={{minHeight: "1rem"}}>
                        {errors?.label?.message as string}
                    </FormHelperText>
                </FormControl>
                <FormControl>
                    <FormLabel>Path</FormLabel>
                    <TextInput
                        {...register("path", {required: "The path is required"})}
                        size={"md"}
                        variant={"soft"}
                    />
                    <FormHelperText sx={{minHeight: "1rem"}}>
                        {errors?.path?.message as string}
                    </FormHelperText>
                </FormControl>
                <Button type={"submit"}>{moduleUUID ? "save" : "register"}</Button>
            </Box>
        </CrmContainer>
    );
}

const RegisterRole = ({moduleUUID}: { moduleUUID: string }) => {
    const setFormType = useSetAtom(ModulesState.ModulesFormTypeAtom);
    const formMethods = useForm();

    const {register, handleSubmit, formState: {errors}} = formMethods;

    const {modules: userModules} = useAuth();

    const systemRoles = userModules?.find(x => x.code === "SYSTEM_ROLES");

    const [module, setModule] = useState<ModuleWithRolesResponse>();
    const [update, setUpdate] = useState(false)

    const handleFormRoles = handleSubmit((data: FieldValues) => {
        modulesUseCase.registerRole({
            moduleUUID: moduleUUID,
            code: data.code,
            label: data.label,
            roleType: data.roleType
        }).then((response) => {
            if (response.error) {
                popup.toast("error", response.error, 2000);
            } else {
                popup.toast("success", "The module is included with success", 2000);
                setUpdate(prev => !prev);
            }
        })
    });

    const handleDeleteRole = (roleUUID: string) => {
        if (!systemRoles || systemRoles?.roles?.find(x => x.code === "DELETE_ROLE") === undefined) {
            popup.toast("warning", "You don't have permission to delete roles", 2000);
            return;
        }

        popup.confirm("question", "Delete role?", "Are sure that want delete this role?", "Yes").then((r) => {
            if (r.isConfirmed) {
                modulesUseCase.deleteRoleByUUID(roleUUID).then((response) => {
                    if (response.error) {
                        popup.toast("error", response.error, 2000);
                    } else {
                        popup.toast("success", response.message as string, 2000);
                    }
                    setUpdate(prev => !prev);
                });
            }
        });
    }

    useEffect(() => {
        modulesUseCase.getModuleWithRoles(moduleUUID).then((response) => {
            if (!response.error) {
                setModule(response)
            }
        })
    }, [moduleUUID, update]);

    return (
        <CrmContainer>
            <FormProvider {...formMethods}>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                    }}
                    component={"form"}
                    onSubmit={handleFormRoles}
                >
                    <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
                        <Typography level={"body-md"} fontWeight={"bold"}>
                            Register Role
                        </Typography>
                        <IconButton
                            size={"sm"}
                            onClick={() => setFormType(ModulesFormType.EMPTY)}
                        >
                            <CloseRounded/>
                        </IconButton>
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            mt: 1
                        }}
                    >
                        <Typography
                            level={"body-md"}
                            fontWeight={"bold"}
                        >
                            {module?.module?.label ?? ''}
                        </Typography>
                    </Box>
                    <CrmTableContainer sx={{maxHeight: 150}}>
                        <CrmTable
                            sx={{
                                "& thead th:nth-child(1)": {
                                    width: 150
                                },
                                "& thead th:nth-child(2)": {
                                    width: 200
                                },
                                "& thead th:nth-child(3)": {
                                    width: 100
                                },
                                "& thead th:nth-child(4)": {
                                    width: 50
                                },
                            }}
                        >
                            <thead>
                            <tr>
                                <th>Code</th>
                                <th>Label</th>
                                <th>Role type</th>
                                <th>Remove</th>
                            </tr>
                            </thead>
                            <tbody>
                            {module && module.roles!.length > 0 ? module.roles?.map((role: Role) => (
                                <tr key={`role_list_key_${role.uuid}`}>
                                    <td>{role.code}</td>
                                    <td>{role.label}</td>
                                    <td>{role.roleType}</td>
                                    <td>
                                        <IconButton
                                            size={"sm"}
                                            onClick={() => {
                                                handleDeleteRole(role?.uuid ?? '')
                                            }}
                                        >
                                            <DeleteOutlineRounded/>
                                        </IconButton>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td
                                        colSpan={4}
                                        style={{
                                            textAlign: "center"
                                        }}
                                    >
                                        No role for this module
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </CrmTable>
                    </CrmTableContainer>
                    <Box
                        sx={{
                            display: "flex",
                            mt: 1
                        }}
                    >
                        <Typography
                            level={"body-md"}
                            fontWeight={"bold"}
                        >
                            Include new role
                        </Typography>
                    </Box>
                    <FormControl>
                        <FormLabel>Code</FormLabel>
                        <TextInput
                            {...register("code", {required: "The code is required"})}
                            size={"md"}
                            variant={"soft"}
                        />
                        <FormHelperText sx={{minHeight: "1rem"}}>
                            {errors?.code?.message as string}
                        </FormHelperText>
                    </FormControl>
                    <FormControl>
                        <FormLabel>Label</FormLabel>
                        <TextInput
                            {...register("label", {required: "The label is required"})}
                            size={"md"}
                            variant={"soft"}
                        />
                        <FormHelperText sx={{minHeight: "1rem"}}>
                            {errors?.label?.message as string}
                        </FormHelperText>
                    </FormControl>
                    <CrmSelect
                        name={"roleType"}
                        label={"Role type"}
                        options={[
                            {
                                value: "USER",
                                label: "User",
                            },
                            {
                                value: "DEV",
                                label: "Developer",
                            },
                        ]}
                    />
                    <Button type={"submit"}>Register</Button>
                </Box>
            </FormProvider>
        </CrmContainer>
    )
}