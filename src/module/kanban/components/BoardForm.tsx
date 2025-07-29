import {useAtom, useAtomValue, useSetAtom} from "jotai/index";
import CrmState from "../../../utils/state/CrmState.ts";
import {CrmFormType} from "../../../utils/entities/entities.ts";
import {CrmModal} from "../../../utils/components/core/CrmModal.tsx";
import {FieldValues, FormProvider, useForm} from "react-hook-form";
import {Box, Button, FormControl, FormHelperText, FormLabel, IconButton, Typography} from "@mui/joy";
import CloseRounded from "@mui/icons-material/CloseRounded";
import {NumericInput} from "../../../utils/components/inputs/NumericInput.tsx";
import {CrmSelect} from "../../../utils/components/core/SelectInput.tsx";
import {TextInput} from "../../../utils/components/core/TextInput.tsx";
import {CrmTextarea} from "../../../utils/components/core/CrmTextarea.tsx";
import {CrmContainer} from "../../../utils/components/core/CrmContainer.tsx";
import {useTranslation} from "react-i18next";
import KanbanState from "../state/KanbanState.ts";
import {BoardStatus} from "../entities/entities.ts";
import {useEffect} from "react";
import {kanbanUseCase} from "../usecase/kanbanUseCase.ts";
import {popup} from "../../../utils/alerts/Popup.ts";

export const BoardForm = () => {
    const [formType, setFormType] = useAtom(CrmState.FormType);
    const productUUID = useAtomValue(CrmState.EntityFormUUID);

    switch (formType) {
        case CrmFormType.EMPTY:
            return <></>;
        case CrmFormType.REGISTER_BOARD:
            return (
                <CrmModal
                    open={true}
                    onClose={() => setFormType(CrmFormType.EMPTY)}
                >
                    <BoardFormRegister/>
                </CrmModal>
            );
        case CrmFormType.EDIT_BOARD:
            return (
                <CrmModal
                    open={true}
                    onClose={() => setFormType(CrmFormType.EMPTY)}
                >
                    <BoardFormRegister boardUUID={productUUID}/>
                </CrmModal>
            );
        case CrmFormType.EDIT_TAGS:
            return (
                <CrmModal
                    open={true}
                    onClose={() => setFormType(CrmFormType.EMPTY)}
                >
                    <TagBoardForm boardUUID={productUUID}/>
                </CrmModal>
            );
    }
}

const BoardFormRegister = ({boardUUID}: { boardUUID?: string }) => {
    const setFormType = useSetAtom(CrmState.FormType)
    const updateList = useSetAtom(KanbanState.UpdateAtom)
    const formMethods = useForm();
    const {t} = useTranslation();

    const {handleSubmit, register, formState: {errors}, setValue} = formMethods

    const handleSubmitBoard = handleSubmit((data: FieldValues) => {
        kanbanUseCase.saveBoard({
            uuid: boardUUID,
            code: data.code,
            title: data.title,
            status: data.status,
            description: data.description
        }).then((response) => {
            if (response.error) {
                popup.toast("error", response.error, 2000);
            } else {
                popup.toast("success", "Quadro cadastrado com sucesso", 2000);
                updateList(prev => !prev);
                setFormType(CrmFormType.EMPTY);
            }
        })
    })

    useEffect(() => {
        if (boardUUID) {
            kanbanUseCase.getBoardByUUID(boardUUID).then((response) => {
                if (response.board) {
                    const board = response.board

                    setValue("code", board.code)
                    setValue("status", board.status)
                    setValue("title", board.title)
                    setValue("description", board.description)
                }
            })
        }
    }, [boardUUID]);

    return (
        <CrmContainer>
            <FormProvider {...formMethods}>
                <Box
                    display={"flex"}
                    justifyContent={"space-between"}
                    alignItems={"center"}
                >
                    <Typography level={"body-md"} fontWeight={"bold"}>
                        {boardUUID ? t("actions.edit") : t("actions.register")} {t("kanbans.title.boards")}
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
                    onSubmit={handleSubmitBoard}
                >
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "start",
                            gap: 2
                        }}
                    >
                        <FormControl sx={{flex: 1}}>
                            <FormLabel>Código</FormLabel>
                            <NumericInput
                                {...register("code", {required: "Código é obrigatório"})}
                                size={"sm"}
                                variant={"soft"}
                                disabled={!!boardUUID}
                            />
                            <FormHelperText sx={{minHeight: "1rem"}}>
                                {errors?.code?.message as string}
                            </FormHelperText>
                        </FormControl>
                        {
                            boardUUID && (
                                <Box sx={{width: "100%", flex: 1}}>
                                    <CrmSelect
                                        name={"status"}
                                        options={[
                                            {
                                                label: t("kanbans.status.board.active"),
                                                value: BoardStatus.ACTIVE
                                            },
                                            {
                                                label: t("kanbans.status.board.inactive"),
                                                value: BoardStatus.INACTIVE
                                            }
                                        ]}
                                        label={"Status"}
                                        // @ts-ignore
                                        rules={{rules: {required: "Situação é obrigatório"}}}
                                    />
                                </Box>
                            )
                        }
                    </Box>
                    <FormControl sx={{flex: 1}}>
                        <FormLabel>Titulo</FormLabel>
                        <TextInput
                            {...register("title", {required: "Titulo é obrigatorio"})}
                            size={"sm"}
                            variant={"soft"}
                        />
                        <FormHelperText sx={{minHeight: "1rem"}}>
                            {errors?.name?.message as string}
                        </FormHelperText>
                    </FormControl>
                    <FormControl>
                        <FormLabel>{t("products.fields.description")}</FormLabel>
                        <CrmTextarea
                            {...register("description")}
                            size={"sm"}
                            variant={"soft"}
                            minRows={2}
                            maxRows={3}
                        />
                        <FormHelperText sx={{minHeight: "1rem"}}></FormHelperText>
                    </FormControl>
                    <Button
                        type={"submit"}
                        sx={{flex: 1}}
                    >
                        {boardUUID ? t("actions.save") : t("actions.register")}
                    </Button>
                </Box>
            </FormProvider>
        </CrmContainer>
    )
}

const TagBoardForm = ({boardUUID}: { boardUUID: string }) => {
    return (
        <div>tag {boardUUID}</div>
    )
}