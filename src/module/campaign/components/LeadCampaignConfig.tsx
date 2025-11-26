import {Campaign, campaignLeadFieldLabel, CampaignLeadFields, CampaignLeadFieldType} from "../entities/entities.ts";
import {useNavigate} from "react-router-dom";
import {ChangeEvent, useRef, useState} from "react";
import {campaignUseCase} from "../usecase/CampaignUseCase.ts";
import {popup} from "../../../utils/alerts/Popup.ts";
import {Box, Button, FormControl, FormLabel, Stack, Switch, Typography} from "@mui/joy";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import {CnpjInput} from "../../../utils/components/inputs/CnpjInput.tsx";
import {TextInput} from "../../../utils/components/core/TextInput.tsx";
import {PhoneInput} from "../../../utils/components/inputs/PhoneInput.tsx";
import {ZipCodeInput} from "../../../utils/components/inputs/ZipCodeInput.tsx";
import {NumericInput} from "../../../utils/components/inputs/NumericInput.tsx";

export const LeadCampaignConfig = (props: { campaign: Campaign }) => {
    const navigate = useNavigate()

    const activeFields = (props.campaign?.metadata?.campaignLeadFields ?? [])

    const activeFieldTypes = activeFields
        .map(x => x.type)

    const verifyActiveField = (type: CampaignLeadFieldType) => {
        return activeFieldTypes.includes(type)
    }

    const selectedInput = useRef<CampaignLeadFields[]>(activeFields)

    const handleSelectInput = (type: CampaignLeadFields) => {
        const selected = selectedInput.current.filter(x => x.type != type.type)

        if (type.active) {
            selectedInput.current = [...selected, type]
        } else {
            selectedInput.current = selected
        }
    }

    const handleSubmitMetadata = () => {
        campaignUseCase.saveCampaignMetadata(
            props.campaign.uuid!,
            {campaignLeadFields: selectedInput.current}
        ).then((response) => {
            if (response.error) {
                popup.toast("error", response.error, 2000);
                return
            } else {
                navigate("/campaign")
            }
        })
    }

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
                height: "100%"
            }}
        >
            <Typography
                level={"body-md"}
                fontWeight={"bold"}
            >
                Campos para o formulário de leads
            </Typography>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 1,
                }}
            >
                <ConfigurableInput
                    type={CampaignLeadFieldType.DOCUMENT}
                    active={verifyActiveField(CampaignLeadFieldType.DOCUMENT)}
                    handleSelectInput={handleSelectInput}
                />
                <ConfigurableInput
                    type={CampaignLeadFieldType.PERSONAL_NAME}
                    active={verifyActiveField(CampaignLeadFieldType.PERSONAL_NAME)}
                    handleSelectInput={handleSelectInput}
                />
            </Box>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 1,
                }}
            >
                <ConfigurableInput
                    type={CampaignLeadFieldType.EMAIL}
                    active={verifyActiveField(CampaignLeadFieldType.EMAIL)}
                    handleSelectInput={handleSelectInput}
                />
                <ConfigurableInput
                    type={CampaignLeadFieldType.PHONE_NUMBER}
                    active={verifyActiveField(CampaignLeadFieldType.PHONE_NUMBER)}
                    handleSelectInput={handleSelectInput}
                />
            </Box>
            <ConfigurableInput
                type={CampaignLeadFieldType.COMPANY_NAME}
                active={verifyActiveField(CampaignLeadFieldType.COMPANY_NAME)}
                handleSelectInput={handleSelectInput}
            />
            <ConfigurableInput
                type={CampaignLeadFieldType.TRADING_NAME}
                active={verifyActiveField(CampaignLeadFieldType.TRADING_NAME)}
                handleSelectInput={handleSelectInput}
            />
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 1
                }}
            >
                <ConfigurableInput
                    type={CampaignLeadFieldType.CEP}
                    active={verifyActiveField(CampaignLeadFieldType.CEP)}
                    handleSelectInput={handleSelectInput}
                />
                <ConfigurableInput
                    type={CampaignLeadFieldType.CITY}
                    active={verifyActiveField(CampaignLeadFieldType.CITY)}
                    handleSelectInput={handleSelectInput}
                />
                <ConfigurableInput
                    type={CampaignLeadFieldType.STATE}
                    active={verifyActiveField(CampaignLeadFieldType.STATE)}
                    handleSelectInput={handleSelectInput}
                />
                <ConfigurableInput
                    type={CampaignLeadFieldType.COMPLEMENT}
                    active={verifyActiveField(CampaignLeadFieldType.COMPLEMENT)}
                    handleSelectInput={handleSelectInput}
                />
            </Box>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 1
                }}
            >
                <ConfigurableInput
                    type={CampaignLeadFieldType.ADDRESS}
                    active={verifyActiveField(CampaignLeadFieldType.ADDRESS)}
                    handleSelectInput={handleSelectInput}
                />
                <ConfigurableInput
                    type={CampaignLeadFieldType.ADDRESS_NUMBER}
                    active={verifyActiveField(CampaignLeadFieldType.ADDRESS_NUMBER)}
                    handleSelectInput={handleSelectInput}
                />
            </Box>
            <Box
                sx={{
                    display: "flex",
                    gap: 1,
                    mt: "auto"
                }}
            >
                <Button
                    variant={"solid"}
                    startDecorator={<ClearRoundedIcon/>}
                    size={"sm"}
                    color={"neutral"}
                    onClick={() => {
                        navigate("/campaign")
                    }}
                    sx={{flex: 1}}
                >
                    Cancelar
                </Button>
                <Button
                    variant={"solid"}
                    startDecorator={<SaveRoundedIcon/>}
                    size={"sm"}
                    onClick={() => {
                        handleSubmitMetadata()
                    }}
                    sx={{flex: 1}}
                >
                    Salvar
                </Button>
            </Box>
        </Box>
    )
}

interface ConfigurableInputProps {
    type: CampaignLeadFieldType,
    active: boolean,
    handleSelectInput: (type: CampaignLeadFields) => void
}

const ConfigurableInput = (props: ConfigurableInputProps) => {
    const [active, setActive] = useState<boolean>(props.active)

    const ActiveSwitch = () => (
        <FormControl
            sx={{
                display: "flex",
                flexDirection: "row",
                gap: 1
            }}
        >
            <FormLabel sx={{fontWeight: "normal"}}>
                Ativar
            </FormLabel>
            <Switch
                size={"sm"}
                checked={active}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    props.handleSelectInput({type: props.type, active: event.target.checked})

                    setActive(event.target.checked)
                }}
            />
        </FormControl>
    )

    const FormInput = () => {
        switch (props.type) {
            case CampaignLeadFieldType.DOCUMENT:
                return (
                    <CnpjInput
                        inputRef={null}
                        readOnly
                        disabled={!active}
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
                        readOnly
                        disabled={!active}
                    />
                )
            case CampaignLeadFieldType.PHONE_NUMBER:
                return (
                    <PhoneInput
                        readOnly
                        disabled={!active}
                    />
                )
            case CampaignLeadFieldType.CEP:
                return (
                    <ZipCodeInput
                        readOnly
                        disabled={!active}
                    />
                )
            case CampaignLeadFieldType.ECONOMIC_ACTIVITY:
            case CampaignLeadFieldType.ADDRESS_NUMBER:
                return (
                    <NumericInput
                        readOnly
                        disabled={!active}
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
                <FormLabel>{campaignLeadFieldLabel(props.type)}</FormLabel>
                <ActiveSwitch/>
            </Stack>
            <FormInput/>
        </FormControl>
    )
}
