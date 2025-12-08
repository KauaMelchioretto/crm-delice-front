import {campaignLeadFieldLabel, CampaignLeadFields, CampaignLeadFieldType} from "../../campaign/entities/entities.ts";
import {Box, FormControl, FormLabel, Stack, Button} from "@mui/joy";
import {CnpjInput} from "../../../utils/components/inputs/CnpjInput.tsx";
import {TextInput} from "../../../utils/components/core/TextInput.tsx";
import {PhoneInput} from "../../../utils/components/inputs/PhoneInput.tsx";
import {ZipCodeInput} from "../../../utils/components/inputs/ZipCodeInput.tsx";
import {NumericInput} from "../../../utils/components/inputs/NumericInput.tsx";
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import {FieldValues, FormProvider, useForm, useFormContext} from "react-hook-form";
import {leadUseCase} from "../usecase/LeadUseCase.ts";
import {useNavigate} from "react-router-dom";
import {popup} from "../../../utils/alerts/Popup.ts";

interface LeadFormProps {
    fields: CampaignLeadFields[]
}

export const LeadForm = (props: LeadFormProps) => {
    const navigate = useNavigate()

    const hasField = (type: CampaignLeadFieldType) => props.fields.some(
        x => x.type === type
    )

    const formMethods = useForm()

    const {handleSubmit} = formMethods

    const handleSubmitForm = handleSubmit((data: FieldValues) => {
        leadUseCase.registerLead({
            document: data[CampaignLeadFieldType.DOCUMENT] ?? undefined,
            companyName: data[CampaignLeadFieldType.COMPANY_NAME] ?? undefined,
            tradingName: data[CampaignLeadFieldType.TRADING_NAME] ?? undefined,
            personName: data[CampaignLeadFieldType.PERSONAL_NAME] ?? undefined,
            email: data[CampaignLeadFieldType.EMAIL] ?? undefined,
            phone: data[CampaignLeadFieldType.PHONE_NUMBER] ?? undefined,
            state: data[CampaignLeadFieldType.STATE] ?? undefined,
            city: data[CampaignLeadFieldType.CITY] ?? undefined,
            zipCode: data[CampaignLeadFieldType.CEP] ?? undefined,
            address: data[CampaignLeadFieldType.ADDRESS] ?? undefined,
            complement: data[CampaignLeadFieldType.COMPLEMENT] ?? undefined,
            addressNumber: data[CampaignLeadFieldType.ADDRESS_NUMBER] ?? undefined,
            economicActivity: data[CampaignLeadFieldType.ECONOMIC_ACTIVITY] ?? undefined,
        }).then((response) => {
            if (response.error) {
                popup.toast("error", response.error, 2000)
            } else {
                navigate("/success")
            }
        })
    })

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
            }}
            component={"form"}
            onSubmit={handleSubmitForm}
        >
            <FormProvider {...formMethods}>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 1,
                    }}
                >
                    {
                        hasField(CampaignLeadFieldType.DOCUMENT) && (
                            <LeadFormInput
                                type={CampaignLeadFieldType.DOCUMENT}
                            />
                        )
                    }
                    {
                        hasField(CampaignLeadFieldType.PERSONAL_NAME) && (
                            <LeadFormInput
                                type={CampaignLeadFieldType.PERSONAL_NAME}
                            />
                        )
                    }
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 1,
                    }}
                >
                    {
                        hasField(CampaignLeadFieldType.EMAIL) && (
                            <LeadFormInput
                                type={CampaignLeadFieldType.EMAIL}
                            />
                        )
                    }
                    {
                        hasField(CampaignLeadFieldType.PHONE_NUMBER) && (
                            <LeadFormInput
                                type={CampaignLeadFieldType.PHONE_NUMBER}
                            />
                        )
                    }
                </Box>
                {
                    hasField(CampaignLeadFieldType.COMPANY_NAME) && (
                        <LeadFormInput
                            type={CampaignLeadFieldType.COMPANY_NAME}
                        />
                    )
                }
                {
                    hasField(CampaignLeadFieldType.TRADING_NAME) && (
                        <LeadFormInput
                            type={CampaignLeadFieldType.TRADING_NAME}
                        />
                    )
                }
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 1
                    }}
                >
                    {
                        hasField(CampaignLeadFieldType.CEP) && (
                            <LeadFormInput
                                type={CampaignLeadFieldType.CEP}
                            />
                        )
                    }
                    {
                        hasField(CampaignLeadFieldType.CITY) && (
                            <LeadFormInput
                                type={CampaignLeadFieldType.CITY}
                            />
                        )
                    }
                    {
                        hasField(CampaignLeadFieldType.STATE) && (
                            <LeadFormInput
                                type={CampaignLeadFieldType.STATE}
                            />
                        )
                    }
                    {
                        hasField(CampaignLeadFieldType.COMPLEMENT) && (
                            <LeadFormInput
                                type={CampaignLeadFieldType.COMPLEMENT}
                            />
                        )
                    }
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 1
                    }}
                >
                    {
                        hasField(CampaignLeadFieldType.ADDRESS) && (
                            <LeadFormInput
                                type={CampaignLeadFieldType.ADDRESS}
                            />
                        )
                    }
                    {
                        hasField(CampaignLeadFieldType.ADDRESS_NUMBER) && (
                            <LeadFormInput
                                type={CampaignLeadFieldType.ADDRESS_NUMBER}
                            />
                        )
                    }
                </Box>
                <Button
                    startDecorator={<AutoAwesomeRoundedIcon/>}
                    type={"submit"}
                >
                    Enviar formulário
                </Button>
            </FormProvider>
        </Box>
    )
}

interface LeadFormInputProps {
    type: CampaignLeadFieldType
}

const LeadFormInput = (props: LeadFormInputProps) => {
    const {register} = useFormContext()

    const FormInput = () => {
        switch (props.type) {
            case CampaignLeadFieldType.DOCUMENT:
                return (
                    <CnpjInput
                        inputRef={null}
                        {...register(props.type, {required: true})}
                    />
                )
            case CampaignLeadFieldType.COMPANY_NAME:
            case CampaignLeadFieldType.TRADING_NAME:
            case CampaignLeadFieldType.EMAIL:
            case CampaignLeadFieldType.CITY:
            case CampaignLeadFieldType.STATE:
            case CampaignLeadFieldType.COMPLEMENT:
            case CampaignLeadFieldType.ADDRESS:
            case CampaignLeadFieldType.PERSONAL_NAME:
                return (
                    <TextInput
                        {...register(props.type, {required: true})}
                    />
                )
            case CampaignLeadFieldType.PHONE_NUMBER:
                return (
                    <PhoneInput
                        {...register(props.type, {required: true})}
                    />
                )
            case CampaignLeadFieldType.CEP:
                return (
                    <ZipCodeInput
                        {...register(props.type, {required: true})}
                    />
                )
            case CampaignLeadFieldType.ECONOMIC_ACTIVITY:
            case CampaignLeadFieldType.ADDRESS_NUMBER:
                return (
                    <NumericInput
                        {...register(props.type, {required: true})}
                    />
                )
        }
    }

    return (
        <FormControl sx={{flex: 1}}>
            <Stack
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between"
                }}
            >
                <FormLabel>
                    {campaignLeadFieldLabel(props.type)}
                </FormLabel>
            </Stack>
            <FormInput/>
        </FormControl>
    )
}