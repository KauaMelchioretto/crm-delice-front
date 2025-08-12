import {useAtom, useAtomValue, useSetAtom} from "jotai/index";
import CrmState from "../../../utils/state/CrmState.ts";
import {CrmFormType} from "../../../utils/entities/entities.ts";
import {CrmModal} from "../../../utils/components/core/CrmModal.tsx";
import {FieldValues, FormProvider, useFieldArray, useForm, useFormContext} from "react-hook-form";
import {CrmContainer} from "../../../utils/components/core/CrmContainer.tsx";
import {Box, Button, FormControl, FormHelperText, FormLabel, IconButton, Typography} from "@mui/joy";
import CloseRounded from "@mui/icons-material/CloseRounded";
import {ColumnRuleForm, ColumnRuleMetadata, ColumnRuleType} from "../entities/entities.ts";
import {CrmSelect, OptionType} from "../../../utils/components/core/SelectInput.tsx";
import {TextInput} from "../../../utils/components/core/TextInput.tsx";
import {Fragment, useEffect} from "react";
import KanbanState from "../state/KanbanState.ts";
import AddCircleRounded from "@mui/icons-material/AddCircleRounded";
import RemoveCircleRounded from "@mui/icons-material/RemoveCircleRounded";
import UserState from "../../user/state/UserState.ts";
import {useTranslation} from "react-i18next";
import {kanbanUseCase} from "../usecase/kanbanUseCase.ts";
import {popup} from "../../../utils/alerts/Popup.ts";

export const RuleForm = () => {
    const [formType, setFormType] = useAtom(CrmState.FormType);
    const columnUUID = useAtomValue(CrmState.EntityFormUUID);
    const ruleUUID = useAtomValue(KanbanState.RuleAtomUUID);

    const simpleUsersAtom = useAtomValue(UserState.SimpleUsersAtom)

    if (simpleUsersAtom.state === "loading") {
        return <></>
    }

    switch (formType) {
        case CrmFormType.EMPTY:
            return <></>;
        case CrmFormType.REGISTER_RULE:
            return (
                <CrmModal
                    open={true}
                    onClose={() => setFormType(CrmFormType.EMPTY)}
                >
                    <BoardRuleFormRegister columnUUID={columnUUID}/>
                </CrmModal>
            );
        case CrmFormType.EDIT_RULE:
            return (
                <CrmModal
                    open={true}
                    onClose={() => setFormType(CrmFormType.EMPTY)}
                >
                    <BoardRuleFormRegister columnUUID={columnUUID} ruleUUID={ruleUUID}/>
                </CrmModal>
            );
        case CrmFormType.REGISTER_ALLOWED_COLUMN:
            return (
                <CrmModal
                    open={true}
                    onClose={() => setFormType(CrmFormType.EMPTY)}
                >
                    <BoardAllowedColumnFormRegister columnUUID={columnUUID}/>
                </CrmModal>
            );
    }
}

const BoardRuleFormRegister = (
    {columnUUID, ruleUUID}: { columnUUID: string, ruleUUID?: string }
) => {
    const board = useAtomValue(KanbanState.BoardAtom)

    const updateList = useSetAtom(KanbanState.UpdateAtom)

    const setFormType = useSetAtom(CrmState.FormType)
    const formMethods = useForm({
        defaultValues: {
            type: ColumnRuleType.ADD_TAG,
            tag: board?.tags ? board?.tags[0]?.uuid : ""
        } as ColumnRuleForm
    });

    const {register, handleSubmit, control, setValue, formState: {errors}} = formMethods;

    const usersControl = useFieldArray({
        control: control,
        name: "notifyUsers"
    })

    const emailControl = useFieldArray({
        control: control,
        name: "emails"
    })

    const handleBoardRule = handleSubmit((data: FieldValues) => {
        let metadata: ColumnRuleMetadata | undefined

        switch (data.type) {
            case ColumnRuleType.ADD_TAG:
                metadata = {tag: data.tag}
                break;
            case ColumnRuleType.SEND_EMAIL:
                metadata = {emails: data.emails?.map((x: { value: string }) => x.value)}
                break;
            case ColumnRuleType.NOTIFY_USER:
                metadata = {notifyUsers: data.notifyUsers?.map((x: { uuid: string }) => x.uuid)}
                break;
        }

        kanbanUseCase.saveColumnRule({
            uuid: ruleUUID ? ruleUUID : undefined,
            columnUUID: columnUUID,
            title: data.title,
            type: data.type,
            metadata: metadata
        }).then((response) => {
            if (response.error) {
                popup.toast("error", response.error, 2000);
            } else {
                popup.toast("success", "The module is included with success", 2000);

                updateList(prev => !prev)
                setFormType(CrmFormType.EMPTY);
            }
        })
    })

    useEffect(() => {
        if (ruleUUID) {
            kanbanUseCase.getColumnRuleByUUID(ruleUUID).then(response => {
                if (response.columnRule) {
                    const value = response.columnRule

                    setValue("type", value.type)
                    setValue("title", value.title)

                    switch (value.type) {
                        case ColumnRuleType.ADD_TAG:
                            setValue("tag", value.metadata?.tag)
                            break
                        case ColumnRuleType.NOTIFY_USER:
                            value.metadata?.notifyUsers?.forEach((x, i) => {
                                if (i >= usersControl.fields.length) {
                                    usersControl.append({
                                        uuid: x
                                    })
                                } else {
                                    setValue(`notifyUsers.${i}.uuid`, x)
                                }
                            })
                            break
                        case ColumnRuleType.SEND_EMAIL:
                            value.metadata?.emails?.forEach((x, i) => {
                                if (i >= emailControl.fields.length) {
                                    emailControl.append({
                                        value: x
                                    })
                                } else {
                                    setValue(`emails.${i}.value`, x)
                                }
                            })
                            break
                    }
                }
            })
        }
    }, [ruleUUID]);

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
                    onSubmit={handleBoardRule}
                >
                    <Box
                        display={"flex"}
                        justifyContent={"space-between"}
                        alignItems={"center"}
                    >
                        <Typography level={"body-md"} fontWeight={"bold"}>
                            Cadastrar Regras
                        </Typography>
                        <IconButton
                            size={"sm"}
                            onClick={() => setFormType(CrmFormType.EMPTY)}
                        >
                            <CloseRounded/>
                        </IconButton>
                    </Box>

                    <FormControl>
                        <FormLabel>Titulo</FormLabel>
                        <TextInput
                            {...register("title", {required: "The title is required"})}
                            size={"md"}
                            variant={"soft"}
                        />
                        <FormHelperText sx={{minHeight: "1rem"}}>
                            {errors?.title?.message as string}
                        </FormHelperText>
                    </FormControl>
                    <RuleTypeWatcher/>
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

const RuleTypeWatcher = () => {
    const {t} = useTranslation()
    const {watch, control, register} = useFormContext()

    const emailControl = useFieldArray({
        control: control,
        name: "emails"
    })

    const usersControl = useFieldArray({
        control: control,
        name: "notifyUsers"
    })

    const simpleUsersAtom = useAtomValue(UserState.SimpleUsersAtom)

    const board = useAtomValue(KanbanState.BoardAtom)

    const ruleTypes: OptionType[] = Object.entries(ColumnRuleType).map(
        ([k, v]) => ({
            value: v,
            label: t(`kanbans.columnRule.type.${k}`)
        })
    )

    const tags: OptionType[] | undefined = board?.tags?.map((tag) => ({
        value: tag.uuid ?? "",
        label: tag.title
    }))

    const type = watch("type") as ColumnRuleType

    const users: OptionType[] | undefined = simpleUsersAtom.state === "hasData" ? (simpleUsersAtom.data.users ?? []).map((x) => (
        {value: x?.uuid ?? "", label: x?.login ?? ""})
    ) : undefined

    useEffect(() => {
        if (type === ColumnRuleType.SEND_EMAIL) {
            if (emailControl.fields.length === 0) {
                emailControl.append("")
            }
        }
        if (type === ColumnRuleType.NOTIFY_USER && users) {
            if (usersControl.fields.length === 0) {
                usersControl.append({
                    uuid: users[0].value
                })
            }
        }
    }, [type, users, emailControl, usersControl]);

    return (
        <Fragment>
            <Box sx={{width: "100%"}}>
                <CrmSelect
                    name={"type"}
                    options={ruleTypes}
                    label={"Tipo"}
                    // @ts-ignore
                    rules={{rules: {required: "The rule type is required"}}}
                />
            </Box>
            {type === ColumnRuleType.ADD_TAG && tags && (
                <Box sx={{width: "100%"}}>
                    <CrmSelect
                        name={"tag"}
                        options={tags}
                        label={"Tag"}
                        // @ts-ignore
                        rules={{rules: {required: "The rule type is required"}}}
                    />
                </Box>
            )}
            {type === ColumnRuleType.SEND_EMAIL && (
                <Box sx={{width: "100%"}}>
                    <FormControl>
                        <FormLabel>E-mail</FormLabel>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                maxHeight: "200px",
                                minHeight: "4rem",
                                width: "100%",
                                overflowY: "auto"
                            }}
                        >
                            {
                                emailControl.fields.map((field, i) => (
                                    <Box
                                        key={field.id}
                                        display={"flex"}
                                        alignItems={"center"}
                                        gap={1}
                                        sx={{mt: 1, width: "100%",}}
                                    >
                                        <TextInput
                                            {...register(`emails.${i}.value`)}
                                            size={"md"}
                                            variant={"soft"}
                                            sx={{flex: 1}}
                                        />
                                        {
                                            (emailControl.fields.length - 1) === i ? (
                                                <IconButton
                                                    onClick={() => {
                                                        emailControl.append({
                                                            value: ""
                                                        })
                                                    }}
                                                    color={"primary"}
                                                >
                                                    <AddCircleRounded/>
                                                </IconButton>
                                            ) : (
                                                <IconButton
                                                    onClick={() => {
                                                        emailControl.remove(i)
                                                    }}
                                                    color={"danger"}
                                                >
                                                    <RemoveCircleRounded/>
                                                </IconButton>
                                            )
                                        }
                                    </Box>
                                ))
                            }
                        </Box>
                    </FormControl>
                </Box>
            )}
            {type === ColumnRuleType.NOTIFY_USER && users && (
                <Box sx={{width: "100%"}}>
                    <FormControl>
                        <FormLabel>Usuários</FormLabel>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                maxHeight: "200px",
                                minHeight: "4rem",
                                width: "100%",
                                overflowY: "auto"
                            }}
                        >
                            {
                                usersControl.fields.map((field, i) => (
                                    <Box
                                        key={field.id}
                                        display={"flex"}
                                        alignItems={"center"}
                                        gap={1}
                                        sx={{mt: 1, width: "100%",}}
                                    >
                                        <Box sx={{width: "100%"}}>
                                            <CrmSelect
                                                name={`notifyUsers.${i}.uuid`}
                                                options={users}
                                                label={""}
                                            />
                                        </Box>
                                        {
                                            (usersControl.fields.length - 1) === i ? (
                                                <IconButton
                                                    onClick={() => {
                                                        usersControl.append({
                                                            uuid: users[0].value
                                                        })
                                                    }}
                                                    color={"primary"}
                                                >
                                                    <AddCircleRounded/>
                                                </IconButton>
                                            ) : (
                                                <IconButton
                                                    onClick={() => {
                                                        usersControl.remove(i)
                                                    }}
                                                    color={"danger"}
                                                >
                                                    <RemoveCircleRounded/>
                                                </IconButton>
                                            )
                                        }
                                    </Box>
                                ))
                            }
                        </Box>
                    </FormControl>
                </Box>
            )}
        </Fragment>
    )
}

const BoardAllowedColumnFormRegister = ({columnUUID}: { columnUUID: string }) => {
    const board = useAtomValue(KanbanState.BoardAtom)

    const currentColumn = board?.columns?.find(
        x => x.uuid === columnUUID
    )?.allowedColumns?.map(
        x => ({uuid: x})
    )?.filter(
        x => x.uuid != columnUUID
    )

    const columnOptions: OptionType[] | undefined = board?.columns?.map(
        c => ({value: c.uuid ?? "", label: c.title})
    )?.filter(
        c => c.value != columnUUID
    )

    const updateList = useSetAtom(KanbanState.UpdateAtom)

    const setFormType = useSetAtom(CrmState.FormType)
    const formMethods = useForm({
        defaultValues: {
            allowed: currentColumn && currentColumn.length > 0 ? currentColumn : [
                {uuid: columnOptions ? (columnOptions[0]?.value ?? "") : ""}
            ]
        }
    });

    const {handleSubmit, control, setValue} = formMethods;

    const handleColumnAllowed = handleSubmit((data: FieldValues) => {
        const allowed: string[] = data.allowed?.map((x: { uuid: string }) => x.uuid)

        kanbanUseCase.saveAllowedColumns(columnUUID, allowed).then((response) => {
            if (response.error) {
                popup.toast("error", response.error, 2000);
            } else {
                popup.toast("success", "The module is included with success", 2000);

                updateList(prev => !prev)
                setFormType(CrmFormType.EMPTY);
            }
        })
    });

    const allowedControl = useFieldArray({
        control: control,
        name: "allowed"
    })

    useEffect(() => {
        kanbanUseCase.getColumnByUUID(columnUUID).then((response) => {
            if (response.column) {
                const columns = response.column.allowedColumns?.filter(x => x != columnUUID)

                columns?.forEach((x, i) => {
                    if (i >= allowedControl.fields.length) {
                        allowedControl.append({
                            uuid: x
                        })
                    } else {
                        setValue(`allowed.${i}.uuid`, x)
                    }
                })
            }
        })
    }, [columnUUID]);

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
                    onSubmit={handleColumnAllowed}
                >
                    <Box
                        display={"flex"}
                        justifyContent={"space-between"}
                        alignItems={"center"}
                    >
                        <Typography level={"body-md"} fontWeight={"bold"}>
                            Cadastrar Regras
                        </Typography>
                        <IconButton
                            size={"sm"}
                            onClick={() => setFormType(CrmFormType.EMPTY)}
                        >
                            <CloseRounded/>
                        </IconButton>
                    </Box>
                    <Box sx={{width: "100%"}}>
                        <FormControl>
                            <FormLabel>Colunas</FormLabel>
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    maxHeight: "200px",
                                    minHeight: "4rem",
                                    width: "100%",
                                    overflowY: "auto"
                                }}
                            >
                                {
                                    columnOptions && allowedControl.fields.map((field, i) => (
                                        <Box
                                            key={field.id}
                                            display={"flex"}
                                            alignItems={"center"}
                                            gap={1}
                                            sx={{mt: 1, width: "100%",}}
                                        >
                                            <Box sx={{width: "100%"}}>
                                                <CrmSelect
                                                    name={`allowed.${i}.uuid`}
                                                    options={columnOptions}
                                                    label={""}
                                                />
                                            </Box>
                                            {
                                                (allowedControl.fields.length - 1) === i ? (
                                                    <IconButton
                                                        onClick={() => {
                                                            allowedControl.append({
                                                                uuid: columnOptions[0].value ?? ""
                                                            })
                                                        }}
                                                        color={"primary"}
                                                    >
                                                        <AddCircleRounded/>
                                                    </IconButton>
                                                ) : (
                                                    <IconButton
                                                        onClick={() => {
                                                            allowedControl.remove(i)
                                                        }}
                                                        color={"danger"}
                                                    >
                                                        <RemoveCircleRounded/>
                                                    </IconButton>
                                                )
                                            }
                                        </Box>
                                    ))
                                }
                            </Box>
                        </FormControl>
                    </Box>
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