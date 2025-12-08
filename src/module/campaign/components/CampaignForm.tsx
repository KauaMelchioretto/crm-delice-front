import {useAtom, useAtomValue} from "jotai/index";
import CrmState from "../../../utils/state/CrmState.ts";
import {CrmFormType} from "../../../utils/entities/entities.ts";
import {CrmModal} from "../../../utils/components/core/CrmModal.tsx";
import {CrmContainer} from "../../../utils/components/core/CrmContainer.tsx";
import {FieldValues, FormProvider, useForm} from "react-hook-form";
import {Box, Button, FormControl, FormHelperText, FormLabel, IconButton, Typography} from "@mui/joy";
import CloseRounded from "@mui/icons-material/CloseRounded";
import {useTranslation} from "react-i18next";
import {useSetAtom} from "jotai";
import {TextInput} from "../../../utils/components/core/TextInput.tsx";
import {DateTimeInput} from "../../../utils/components/inputs/DateInput.tsx";
import {CrmTextarea} from "../../../utils/components/core/CrmTextarea.tsx";
import {CrmSelect, OptionType} from "../../../utils/components/core/SelectInput.tsx";
import {CampaignStatus, CampaignType} from "../entities/entities.ts";
import {campaignUseCase} from "../usecase/CampaignUseCase.ts";
import {popup} from "../../../utils/alerts/Popup.ts";
import CampaignState from "../state/CampaignState.ts";
import {useEffect} from "react";
import dayjs from "dayjs";
import {valueToEnum} from "../../../utils/functions/ValueToEnum.ts";

export const CampaignForm = () => {
    const [formType, setFormType] = useAtom(CrmState.FormType)

    const campaignUUID = useAtomValue(CrmState.EntityFormUUID);

    switch (formType) {
        case CrmFormType.EMPTY:
            return <></>
        case CrmFormType.REGISTER_CAMPAIGN:
            return (
                <CrmModal
                    open={true}
                    onClose={() => setFormType(CrmFormType.EMPTY)}
                >
                    <CampaignRegister/>
                </CrmModal>
            )
        case CrmFormType.EDIT_CAMPAIGN:
            return (
                <CrmModal
                    open={true}
                    onClose={() => setFormType(CrmFormType.EMPTY)}
                >
                    <CampaignRegister uuid={campaignUUID}/>
                </CrmModal>
            )
    }
}

const CampaignRegister = (props: { uuid?: string }) => {
    const {t} = useTranslation()
    const setFormType = useSetAtom(CrmState.FormType)
    const formMethods = useForm()

    const updateList = useSetAtom(CampaignState.UpdateAtom)

    const {handleSubmit, register, formState: {errors}, setValue} = formMethods

    const handleFormCampaign = handleSubmit((data: FieldValues) => {
        if (props.uuid) {
            campaignUseCase.saveCampaign({
                uuid: props.uuid,
                title: data.title,
                description: data.description,
                objective: data.objective,
                status: parseInt(data.status),
                type: parseInt(data.type),
                start: dayjs(data.startDate).isValid() ? data.startDate : null,
                end: dayjs(data.endDate).isValid() ? data.endDate : null,
            }).then((response) => {
                if (response.error) {
                    popup.toast("error", response.error, 2000);
                } else {
                    popup.toast("success", "Campanha salva com sucesso", 2000);
                    updateList(prev => !prev);
                    setFormType(CrmFormType.EMPTY);
                }
            })
        } else {
            campaignUseCase.createCampaign({
                title: data.title,
                description: data.description,
                objective: data.objective,
                type: parseInt(data.type),
                start: dayjs(data.startDate).isValid() ? data.startDate : null,
                end: dayjs(data.endDate).isValid() ? data.endDate : null,
            }).then((response) => {
                if (response.error) {
                    popup.toast("error", response.error, 2000);
                } else {
                    popup.toast("success", "Campanha salva com sucesso", 2000);
                    updateList(prev => !prev);
                    setFormType(CrmFormType.EMPTY);
                }
            })
        }
    })

    const campaignTypeOptions: OptionType[] = [
        {
            value: CampaignType.SALE.toString(),
            label: "Venda"
        },
        {
            value: CampaignType.LEAD.toString(),
            label: "Lead de cliente"
        },
    ]

    useEffect(() => {
        if (props.uuid) {
            campaignUseCase.getCampaignByUUID(props.uuid).then((response) => {
                if (response.campaign) {
                    const campaign = response.campaign

                    setValue("title", campaign.title)
                    setValue("description", campaign.description)
                    setValue("objective", campaign.objective)
                    setValue("type", valueToEnum(campaign.type, CampaignType).toString())
                    setValue("status", valueToEnum(campaign.status, CampaignStatus).toString())
                    if (campaign.start) {
                        setValue("startDate", dayjs(campaign.start).format("YYYY-MM-DDTHH:mm"))
                    }
                    if (campaign.end) {
                        setValue("endDate", dayjs(campaign.end).format("YYYY-MM-DDTHH:mm"))
                    }
                }
            })
        }
    }, [props.uuid]);

    return (
        <CrmContainer sx={{minWidth: "500px"}}>
            <FormProvider {...formMethods}>
                <Box
                    display={"flex"}
                    justifyContent={"space-between"}
                    alignItems={"center"}
                >
                    <Typography level={"body-md"} fontWeight={"bold"}>
                        {props.uuid ? t("actions.edit") : t("actions.register")} {t("campaign.page.title")}
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
                    onSubmit={handleFormCampaign}
                >
                    <FormControl>
                        <FormLabel>Titulo</FormLabel>
                        <TextInput
                            {...register("title", {required: "Title is required"})}
                            size={"sm"}
                            variant={"soft"}
                        />
                        <FormHelperText sx={{minHeight: "1rem"}}>
                            {errors?.title?.message as string}
                        </FormHelperText>
                    </FormControl>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 1
                        }}
                    >
                        <FormControl sx={{flex: 1}}>
                            <FormLabel>Inicio</FormLabel>
                            <DateTimeInput
                                {...register("startDate")}
                                size={"sm"}
                                variant={"soft"}
                            />
                            <FormHelperText sx={{minHeight: "1rem"}}>
                                {errors?.startDate?.message as string}
                            </FormHelperText>
                        </FormControl>
                        <FormControl sx={{flex: 1}}>
                            <FormLabel>Fim</FormLabel>
                            <DateTimeInput
                                {...register("endDate")}
                                size={"sm"}
                                variant={"soft"}
                            />
                            <FormHelperText sx={{minHeight: "1rem"}}>
                                {errors?.endDate?.message as string}
                            </FormHelperText>
                        </FormControl>
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 1
                        }}
                    >
                        <FormControl sx={{flex: 1}}>
                            <FormLabel>Descrição</FormLabel>
                            <CrmTextarea
                                {...register("description")}
                                minRows={3}
                                maxRows={3}
                                size={"sm"}
                                variant={"soft"}
                            />
                            <FormHelperText sx={{minHeight: "1rem"}}>
                                {errors?.description?.message as string}
                            </FormHelperText>
                        </FormControl>
                        <FormControl sx={{flex: 1}}>
                            <FormLabel>Objetivo</FormLabel>
                            <CrmTextarea
                                {...register("objective", {required: "Objective is required"})}
                                minRows={3}
                                maxRows={3}
                                size={"sm"}
                                variant={"soft"}
                            />
                            <FormHelperText sx={{minHeight: "1rem"}}>
                                {errors?.objective?.message as string}
                            </FormHelperText>
                        </FormControl>
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 1
                        }}
                    >
                        <FormControl sx={{flex: 1}}>
                            <FormLabel>Tipo da campanha</FormLabel>
                            <CrmSelect
                                {...register("type", {required: "Type is required"})}
                                size={"sm"}
                                variant={"soft"}
                                options={campaignTypeOptions}
                            />
                            <FormHelperText sx={{minHeight: "1rem"}}>
                                {errors?.type?.message as string}
                            </FormHelperText>
                        </FormControl>
                        {
                            props.uuid && (
                                <FormControl sx={{flex: 1}}>
                                    <FormLabel>Situação</FormLabel>
                                    <CrmSelect
                                        {...register("status")}
                                        size={"sm"}
                                        variant={"soft"}
                                        options={[
                                            {
                                                value: CampaignStatus.FORM_PENDING.toString(),
                                                label: "Pendente"
                                            },
                                            {
                                                value: CampaignStatus.ACTIVE.toString(),
                                                label: "Ativo"
                                            },
                                            {
                                                value: CampaignStatus.INACTIVE.toString(),
                                                label: "Inativo"
                                            }
                                        ]}
                                    />
                                    <FormHelperText sx={{minHeight: "1rem"}}>
                                        {errors?.status?.message as string}
                                    </FormHelperText>
                                </FormControl>
                            )
                        }
                    </Box>
                    <Button
                        type={"submit"}
                        sx={{flex: 1}}
                    >
                        {props.uuid ? t("actions.save") : t("actions.register")}
                    </Button>
                </Box>
            </FormProvider>
        </CrmContainer>
    )
}