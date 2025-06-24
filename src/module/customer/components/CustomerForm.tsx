import CustomersState from "../state/CustomersState.ts";
import {ContactType, Customer, CustomerStatus, EconomicActivity} from "../entities/entities.ts";
import {CrmModal} from "../../../utils/components/core/CrmModal.tsx";
import {useAtom, useAtomValue, useSetAtom} from "jotai";
import {CrmContainer} from "../../../utils/components/core/CrmContainer.tsx";
import {FieldValues, FormProvider, useFieldArray, useForm, useFormContext} from "react-hook-form";
import {
    Accordion, AccordionDetails, AccordionGroup, AccordionSummary, accordionSummaryClasses,
    Box,
    Button, CircularProgress,
    Divider,
    FormControl,
    FormHelperText,
    FormLabel,
    IconButton,
    Tab,
    TabList,
    TabPanel,
    Tabs,
    Typography
} from "@mui/joy";
import CloseRounded from "@mui/icons-material/CloseRounded";
import {TextInput} from "../../../utils/components/core/TextInput.tsx";
import {CnpjInput} from "../../../utils/components/inputs/CnpjInput.tsx";
import {ZipCodeInput} from "../../../utils/components/inputs/ZipCodeInput.tsx";
import {NumericInput} from "../../../utils/components/inputs/NumericInput.tsx";
import {CrmTextarea} from "../../../utils/components/core/CrmTextarea.tsx";
import {CrmSelect, OptionType} from "../../../utils/components/core/SelectInput.tsx";
import AddCircleRounded from '@mui/icons-material/AddCircleRounded';
import RemoveCircleRounded from '@mui/icons-material/RemoveCircleRounded';
import {customersUseCase} from "../usecase/CustomersUseCase.tsx";
import {maskZipCode} from "../../../utils/functions/MaskZipCode.ts";
import {CrmCheckbox} from "../../../utils/components/core/CrmCheckbox.tsx";
import {Fragment, useEffect, useRef, useState} from "react";
import {PhoneInput} from "../../../utils/components/inputs/PhoneInput.tsx";
import {maskPhone} from "../../../utils/functions/MaskPhone.ts";
import {popup} from "../../../utils/alerts/Popup.ts";
import {maskCNPJ} from "../../../utils/functions/DocumentValidation.ts";
import AddBusinessRounded from '@mui/icons-material/AddBusinessRounded';
import KeyboardArrowRightRounded from "@mui/icons-material/KeyboardArrowRightRounded";
import PublishedWithChangesRounded from "@mui/icons-material/PublishedWithChangesRounded";
import SearchRounded from '@mui/icons-material/SearchRounded';
import {useTranslation} from "react-i18next";

import CrmState from "../../../utils/state/CrmState.ts";
import {CrmFormType} from "../../../utils/entities/entities.ts";

export const CustomerForm = () => {
    const [formType, setFormType] = useAtom(CrmState.FormType)

    const customerUUID = useAtomValue(CrmState.EntityFormUUID);

    switch (formType) {
        case CrmFormType.EMPTY:
            return <></>;
        case CrmFormType.REGISTER_CUSTOMER:
            return (
                <CrmModal
                    open={true}
                    onClose={() => setFormType(CrmFormType.EMPTY)}
                >
                    <CustomerRegister/>
                </CrmModal>
            );
        case CrmFormType.EDIT_CUSTOMER:
            return (
                <CrmModal
                    open={true}
                    onClose={() => setFormType(CrmFormType.EMPTY)}
                >
                    <CustomerRegister customerUUID={customerUUID}/>
                </CrmModal>
            );
        case CrmFormType.APPROVAL_CUSTOMER:
            return (
                <CrmModal
                    open={true}
                    onClose={() => setFormType(CrmFormType.EMPTY)}
                >
                    <ApprovalCustomer customerUUID={customerUUID}/>
                </CrmModal>
            );
    }
}

const CustomerRegister = ({customerUUID}: { customerUUID?: string }) => {
    const updateList = useSetAtom(CustomersState.CustomerUpdateAtom)
    const {t} = useTranslation();
    const setFormType = useSetAtom(CrmState.FormType)

    const formMethods = useForm({
        defaultValues: {
            contacts: [
                {
                    label: "",
                    contactType: ContactType.EMAIL,
                    isPrincipal: true
                }
            ],
            economicActivitiesCodesForm: [
                {
                    value: ""
                }
            ]
        } as Customer
    });

    const inputCNPJ = useRef(null);
    const [loading, setLoading] = useState(false);

    const {handleSubmit, register, formState: {errors}, control, setValue} = formMethods

    const contacts = useFieldArray({
        control: control,
        name: "contacts"
    })

    const economicActivitiesCodes = useFieldArray({
        control: control,
        name: "economicActivitiesCodesForm"
    })

    const handleFormCustomers = handleSubmit((data: FieldValues) => {
        setLoading(true);
        if (customerUUID) {
            customersUseCase.saveCustomer({
                uuid: customerUUID,
                companyName: data.companyName,
                tradingName: data.tradingName,
                personName: data.personName,
                document: data.document,
                contacts: data.contacts,
                state: data.state,
                city: data.city,
                zipCode: data.zipCode,
                address: data.address,
                complement: data.complement,
                addressNumber: data.addressNumber,
                status: data.status,
                economicActivitiesCodes: data.economicActivitiesCodesForm.map((x: { value: string }) => x.value),
                observation: data.observation,
            }).then((response) => {
                if (response.error) {
                    popup.toast("error", response.error, 2000);
                } else {
                    popup.toast("success", t("customers.messages.customer_included_success"), 2000);
                    updateList(prev => !prev);
                    setFormType(CrmFormType.EMPTY);
                }

                setLoading(false);
            })
            return;
        }
        customersUseCase.createCustomer({
            companyName: data.companyName,
            tradingName: data.tradingName,
            personName: data.personName,
            document: data.document,
            contacts: data.contacts,
            state: data.state,
            city: data.city,
            zipCode: data.zipCode,
            address: data.address,
            complement: data.complement,
            addressNumber: data.addressNumber,
            economicActivitiesCodes: data.economicActivitiesCodesForm.map((x: { value: string }) => x.value),
            observation: data.observation,
        }).then((response) => {
            if (response.error) {
                popup.toast("error", response.error, 2000);
            } else {
                popup.toast("success", t("customers.messages.customer_included_success"), 2000);
                updateList(prev => !prev);
                setFormType(CrmFormType.EMPTY);
            }

            setLoading(false);
        })
    });

    const handleGetPreCustomer = (document: string) => {
        setLoading(true)
        customersUseCase.getPreCustomer(document).then((response) => {
            if (response.customer != undefined) {
                const preCustomer = response.customer;

                setValue("companyName", preCustomer.companyName)
                setValue("tradingName", preCustomer.tradingName)
                setValue("personName", preCustomer.personName)
                setValue("zipCode", maskZipCode(preCustomer.zipCode ?? ""))
                setValue("city", preCustomer.city)
                setValue("state", preCustomer.state)
                setValue("complement", preCustomer.complement)
                setValue("address", preCustomer.address)
                setValue("addressNumber", preCustomer.addressNumber)

                preCustomer.economicActivitiesCodes?.forEach((x, i) => {
                    if (i >= economicActivitiesCodes.fields.length) {
                        economicActivitiesCodes.append({
                            value: x
                        })
                    } else {
                        setValue(`economicActivitiesCodesForm.${i}.value`, x)
                    }
                })

                preCustomer.contacts?.forEach((x, i) => {
                    const type = x.contactType as ContactType
                    const label = type == ContactType.PHONE ? maskPhone(x?.label ?? "") : x?.label ?? ""

                    if (i >= contacts.fields.length) {
                        contacts.append({
                            label: label,
                            contactType: type,
                            isPrincipal: x.isPrincipal
                        })
                    } else {
                        setValue(`contacts.${i}.label`, label)
                        setValue(`contacts.${i}.contactType`, type)
                        setValue(`contacts.${i}.isPrincipal`, x.isPrincipal)
                    }
                })
            }
            setLoading(false);
        })
    }

    useEffect(() => {
        if (customerUUID) {
            customersUseCase.getCustomerByUUID(customerUUID).then((response) => {
                if (response.customer) {
                    const customer = response.customer

                    setValue("document", maskCNPJ(customer?.document ?? ""))
                    setValue("companyName", customer.companyName)
                    setValue("tradingName", customer.tradingName)
                    setValue("personName", customer.personName)
                    setValue("zipCode", maskZipCode(customer.zipCode ?? ""))
                    setValue("city", customer.city)
                    setValue("state", customer.state)
                    setValue("complement", customer.complement)
                    setValue("address", customer.address)
                    setValue("addressNumber", customer.addressNumber)
                    setValue("observation", customer.observation)
                    setValue("status", customer.status)

                    customer.economicActivities?.map(x => x.code)?.forEach((x, i) => {
                        if (i >= economicActivitiesCodes.fields.length) {
                            economicActivitiesCodes.append({
                                value: x
                            })
                        } else {
                            setValue(`economicActivitiesCodesForm.${i}.value`, x)
                        }
                    })

                    customer.contacts?.forEach((x, i) => {
                        const type = x.contactType as ContactType
                        const label = type == ContactType.PHONE ? maskPhone(x?.label ?? "") : x?.label ?? ""

                        if (i >= contacts.fields.length) {
                            contacts.append({
                                label: label,
                                contactType: type,
                                isPrincipal: x.isPrincipal
                            })
                        } else {
                            setValue(`contacts.${i}.label`, label)
                            setValue(`contacts.${i}.contactType`, type)
                            setValue(`contacts.${i}.isPrincipal`, x.isPrincipal)
                        }
                    })
                }
            })
        }
    }, [customerUUID]);

    return (
        <CrmContainer>
            <FormProvider {...formMethods}>
                <Box
                    display={"flex"}
                    justifyContent={"space-between"}
                    alignItems={"center"}
                >
                    <Typography level={"body-md"} fontWeight={"bold"}>
                        {customerUUID ? t("actions.edit") : t("actions.register")} {t("customers.page.title")}
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
                    onSubmit={handleFormCustomers}
                >
                    <input type={"hidden"} {...register("status")} />
                    <Tabs defaultValue={0} sx={{pt: 0.5}}>
                        <TabList>
                            <Tab>{t("customers.page.tabs.customer_data")}</Tab>
                            <Tab disabled={loading}>{t("customers.page.tabs.comercial_informations")}</Tab>
                        </TabList>
                        <TabPanel value={0} sx={{pl: 0, pr: 0}}>
                            <Box display={"flex"} alignItems={"center"} gap={1}>
                                <FormControl>
                                    <FormLabel>{t("customers.fields.document")}</FormLabel>
                                    <CnpjInput
                                        {...register(
                                            "document",
                                            {
                                                required: t("customers.messages.document_required"),
                                            }
                                        )}
                                        inputRef={inputCNPJ}
                                        size={"sm"}
                                        variant={"soft"}
                                        disabled={!!customerUUID}
                                        endDecorator={
                                            loading ? (
                                                <CircularProgress size={"sm"}/>
                                            ) : (
                                                <IconButton
                                                    onClick={() => {
                                                        if (inputCNPJ.current === null) return

                                                        const query = (inputCNPJ.current as HTMLInputElement).value ?? ""

                                                        if (!query) return

                                                        handleGetPreCustomer(query)
                                                    }}
                                                >
                                                    <SearchRounded/>
                                                </IconButton>
                                            )
                                        }
                                    />
                                    <FormHelperText sx={{minHeight: "1rem"}}>
                                        {errors?.document?.message as string}
                                    </FormHelperText>
                                </FormControl>
                                <FormControl sx={{flex: 1}}>
                                    <FormLabel>{t("customers.fields.person_name")}</FormLabel>
                                    <TextInput
                                        {...register("personName", {required: t("customers.messages.person_name_required")})}
                                        size={"sm"}
                                        variant={"soft"}
                                        disabled={loading}
                                    />
                                    <FormHelperText sx={{minHeight: "1rem"}}>
                                        {errors?.personName?.message as string}
                                    </FormHelperText>
                                </FormControl>
                            </Box>
                            <FormControl>
                                <FormLabel>{t("customers.fields.company_name")}</FormLabel>
                                <TextInput
                                    {...register("companyName", {required: t("customers.messages.company_name_required")})}
                                    size={"sm"}
                                    variant={"soft"}
                                    disabled={loading}
                                />
                                <FormHelperText sx={{minHeight: "1rem"}}>
                                    {errors?.companyName?.message as string}
                                </FormHelperText>
                            </FormControl>
                            <FormControl>
                                <FormLabel>{t("customers.fields.trading_name")}</FormLabel>
                                <TextInput
                                    {...register("tradingName", {required: t("customers.messages.trading_name_required")})}
                                    size={"sm"}
                                    variant={"soft"}
                                    disabled={loading}
                                />
                                <FormHelperText sx={{minHeight: "1rem"}}>
                                    {errors?.tradingName?.message as string}
                                </FormHelperText>
                            </FormControl>
                            <Box display={"flex"} alignItems={"center"} gap={1}>
                                <FormControl>
                                    <FormLabel>{t("customers.fields.zip_code")}</FormLabel>
                                    <ZipCodeInput
                                        {...register("zipCode", {required: t("customers.messages.zip_code_required")})}
                                        size={"sm"}
                                        variant={"soft"}
                                        disabled={loading}
                                    />
                                    <FormHelperText sx={{minHeight: "1rem"}}>
                                        {errors?.zipCode?.message as string}
                                    </FormHelperText>
                                </FormControl>
                                <FormControl>
                                    <FormLabel>{t("customers.fields.city")}</FormLabel>
                                    <TextInput
                                        {...register("city", {required: t("customers.messages.city_required")})}
                                        size={"sm"}
                                        variant={"soft"}
                                        disabled={loading}
                                    />
                                    <FormHelperText sx={{minHeight: "1rem"}}>
                                        {errors?.city?.message as string}
                                    </FormHelperText>
                                </FormControl>
                                <FormControl>
                                    <FormLabel>{t("customers.fields.state")}</FormLabel>
                                    <TextInput
                                        {...register("state", {required: t("customers.messages.state_required")})}
                                        size={"sm"}
                                        variant={"soft"}
                                        disabled={loading}
                                    />
                                    <FormHelperText sx={{minHeight: "1rem"}}>
                                        {errors?.state?.message as string}
                                    </FormHelperText>
                                </FormControl>
                                <FormControl>
                                    <FormLabel>{t("customers.fields.complement")}</FormLabel>
                                    <TextInput
                                        {...register("complement", {required: t("customers.messages.complement_required")})}
                                        size={"sm"}
                                        variant={"soft"}
                                        disabled={loading}
                                    />
                                    <FormHelperText sx={{minHeight: "1rem"}}>
                                        {errors?.complement?.message as string}
                                    </FormHelperText>
                                </FormControl>
                            </Box>
                            <Box display={"flex"} alignItems={"center"} gap={1}>
                                <FormControl sx={{flex: 1}}>
                                    <FormLabel>{t("customers.fields.address")}</FormLabel>
                                    <TextInput
                                        {...register("address", {required: t("customers.messages.address_required")})}
                                        size={"sm"}
                                        variant={"soft"}
                                        disabled={loading}
                                    />
                                    <FormHelperText sx={{minHeight: "1rem"}}>
                                        {errors?.address?.message as string}
                                    </FormHelperText>
                                </FormControl>
                                <FormControl>
                                    <FormLabel>{t("customers.fields.number")}</FormLabel>
                                    <NumericInput
                                        {...register("addressNumber", {required: t("customers.messages.number_required")})}
                                        size={"sm"}
                                        variant={"soft"}
                                        disabled={loading}
                                    />
                                    <FormHelperText sx={{minHeight: "1rem"}}>
                                        {errors?.addressNumber?.message as string}
                                    </FormHelperText>
                                </FormControl>
                            </Box>
                        </TabPanel>
                        <TabPanel value={1} sx={{pl: 0, pr: 0}}>
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 1.5,
                                    minWidth: "700px"
                                }}
                            >
                                <Divider>{t("customers.page.sections.contacts")}</Divider>
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 0.5,
                                        maxHeight: "250px",
                                        overflowY: "auto",
                                    }}
                                >
                                    {
                                        contacts.fields.map((_, i) => (
                                            <Box
                                                key={`contact_field_${i}`}
                                                display={"flex"}
                                                alignItems={"center"}
                                                gap={1}
                                            >
                                                <CustomerContact index={i}/>
                                                <FormControl
                                                    sx={{
                                                        display: "flex",
                                                        flexDirection: "row",
                                                        alignItems: "center",
                                                        gap: 1,
                                                        justifyContent: "center"
                                                    }}
                                                >
                                                    <CrmCheckbox
                                                        type={"checkbox"}
                                                        {...register(`contacts.${i}.isPrincipal`)}
                                                    />
                                                    <FormLabel>{t("customers.fields.main")}</FormLabel>
                                                </FormControl>
                                                {
                                                    (contacts.fields.length - 1) === i ? (
                                                        <IconButton
                                                            onClick={() => {
                                                                contacts.append({
                                                                    label: "",
                                                                    contactType: ContactType.EMAIL
                                                                })
                                                            }}
                                                            color={"primary"}
                                                        >
                                                            <AddCircleRounded/>
                                                        </IconButton>
                                                    ) : (
                                                        <IconButton
                                                            onClick={() => {
                                                                contacts.remove(i)
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
                                <Divider sx={{mt: 2}}>{t("customers.page.sections.economic_activities")}</Divider>
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 0.5,
                                        maxHeight: "250px",
                                        overflowY: "auto",
                                    }}
                                >
                                    {
                                        economicActivitiesCodes.fields.map((_, i) => (
                                            <Box
                                                key={`economic_activity_code_${i}`}
                                                display={"flex"}
                                                alignItems={"center"}
                                                gap={1}
                                            >
                                                <FormControl sx={{flex: 1}}>
                                                    <NumericInput
                                                        {...register(`economicActivitiesCodesForm.${i}.value`)}
                                                        size={"sm"}
                                                        variant={"soft"}
                                                        placeholder={t("customers.fields.economic_activity")}
                                                        slotProps={{
                                                            input: {
                                                                maxLength: 5,
                                                            },
                                                        }}
                                                    />
                                                </FormControl>
                                                {
                                                    (economicActivitiesCodes.fields.length - 1) === i ? (
                                                        <IconButton
                                                            onClick={() => {
                                                                economicActivitiesCodes.append({
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
                                                                economicActivitiesCodes.remove(i)
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
                                <FormControl>
                                    <FormLabel>{t("customers.fields.observations")}</FormLabel>
                                    <CrmTextarea
                                        {...register("observation")}
                                        size={"sm"}
                                        variant={"soft"}
                                        minRows={2}
                                        maxRows={3}
                                    />
                                    <FormHelperText sx={{minHeight: "1rem"}}></FormHelperText>
                                </FormControl>
                            </Box>
                        </TabPanel>
                    </Tabs>
                    <Button
                        type={"submit"}
                        sx={{flex: 1}}
                    >
                        {customerUUID ? t("actions.save") : t("actions.register")}
                    </Button>
                </Box>
            </FormProvider>
        </CrmContainer>
    )
}

const CustomerContact = ({index}: { index: number }) => {
    const {register, watch} = useFormContext()
    const {t} = useTranslation();
    const contactTypes: OptionType[] = [
        {
            value: ContactType.EMAIL,
            label: t("customers.page.contacts_types.email")
        },
        {
            value: ContactType.PHONE,
            label: t("customers.page.contacts_types.phone")
        },
        {
            value: ContactType.MEDIA,
            label: t("customers.page.contacts_types.social_media")
        },
        {
            value: ContactType.NONE,
            label: t("customers.page.contacts_types.others")
        }
    ]

    const type = watch(`contacts.${index}.contactType`) as ContactType

    const Component = () => {
        switch (type) {
            case ContactType.PHONE:
                return (
                    <PhoneInput
                        {...register(`contacts.${index}.label`)}
                        size={"sm"}
                        variant={"soft"}
                        placeholder={t("customers.page.placeholders.inform_the_contact")}
                    />
                )
            default:
                return (
                    <TextInput
                        {...register(`contacts.${index}.label`)}
                        size={"sm"}
                        variant={"soft"}
                        placeholder={t("customers.page.placeholders.inform_the_contact")}
                    />
                )
        }
    }

    return (
        <Fragment>
            <Box sx={{width: "100%", flex: 1}}>
                <CrmSelect
                    name={`contacts.${index}.contactType`}
                    options={contactTypes}
                    label={""}
                />
            </Box>
            <FormControl sx={{flex: 1}}>
                <Component/>
            </FormControl>
        </Fragment>
    )
}

const ApprovalCustomer = ({customerUUID}: { customerUUID: string }) => {
    const updateList = useSetAtom(CustomersState.CustomerUpdateAtom)
    const setFormType = useSetAtom(CrmState.FormType)
    const formMethods = useForm({
        defaultValues: {
            status: CustomerStatus.PENDING
        }
    });
    const {t} = useTranslation();

    const customerStatus: OptionType[] = [
        {
            value: CustomerStatus.PENDING.toString(),
            label: t("customers.page.customer_status.pending")
        },
        {
            value: CustomerStatus.FIT.toString(),
            label: t("customers.page.customer_status.fit")
        },
        {
            value: CustomerStatus.NOT_FIT.toString(),
            label: t("customers.page.customer_status.not_fit")
        },
        {
            value: CustomerStatus.INACTIVE.toString(),
            label: t("customers.page.customer_status.inactive")
        },
    ]

    const [customer, setCustomer] = useState<Customer>()
    const [activities, setActivities] = useState<EconomicActivity[]>([])

    const {handleSubmit, setValue} = formMethods

    const handleFormApproval = handleSubmit((data: FieldValues) => {
        customersUseCase.approvalCustomer(customerUUID, CustomerStatus[data.status as keyof typeof CustomerStatus]).then((response) => {
            if (response.error) {
                popup.toast("error", response.error, 2000);
            } else {
                popup.toast("success", t("customers.messages.customer_included_success"), 2000);
                updateList(prev => !prev);
                setFormType(CrmFormType.EMPTY);
            }
        })
    });

    useEffect(() => {
        Promise.all([
            customersUseCase.getCustomerByUUID(customerUUID),
            customersUseCase.listCustomerEconomicActivities(customerUUID),
        ]).then((response) => {
            const temp1 = response[0]

            if (temp1.customer) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                const status = CustomerStatus[temp1.customer?.status ?? "PENDING"]
                setValue("status", status.toString())

                setCustomer(temp1.customer)
            }

            const temp2 = response[1]

            if (temp2.activities) {
                setActivities(temp2.activities)
            }
        })
    }, [customerUUID]);

    const address = () => {
        return `${
            maskZipCode(customer?.zipCode ?? "")
        } ${
            customer?.address ?? ""
        }, Nº ${
            customer?.addressNumber ?? ""
        } - ${
            customer?.city ?? ""
        } ${customer?.state ?? ""}`
    }

    return (
        <CrmContainer>
            <FormProvider {...formMethods}>
                <Box
                    display={"flex"}
                    justifyContent={"space-between"}
                    alignItems={"center"}
                    width={700}
                >
                    <Typography level={"body-md"} fontWeight={"bold"}>
                        {customerUUID ? t("actions.edit") : t("actions.register")} {t("customers.page.entity")}
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
                    onSubmit={handleFormApproval}
                >
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <span
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: 5
                            }}
                        >
                            <AddBusinessRounded sx={{fontSize: 25}}/>
                            <Typography
                                level={"body-md"}
                                fontWeight={"bold"}
                            >
                                {customer?.companyName ?? ""}
                            </Typography>
                        </span>
                        <Typography
                            level={"body-md"}
                            fontWeight={"bold"}
                        >
                            {maskCNPJ(customer?.document ?? "")}
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <Typography
                            level={"body-sm"}
                        >
                            {t("customers.fields.trading_name")}
                        </Typography>
                        <Typography
                            level={"body-sm"}
                        >
                            {customer?.tradingName ?? ""}
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <Typography
                            level={"body-sm"}
                        >
                            {t("customers.fields.observations")}
                        </Typography>
                        <Typography
                            level={"body-sm"}
                        >
                            {customer?.observation ?? ""}
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <Typography
                            level={"body-sm"}
                        >
                            {t("customers.fields.address")}
                        </Typography>
                        <Typography
                            level={"body-sm"}
                        >
                            {address()}
                        </Typography>
                    </Box>
                    <Divider>{t("customers.fields.economic_activities")}</Divider>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            maxHeight: "400px",
                            overflowY: "auto",
                            gap: 1
                        }}
                    >
                        {
                            activities.map((a, i) => (
                                <CustomerEconomicActivity activity={a} key={`customer_economic_activity_${i}`}/>
                            ))
                        }
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "end",
                            gap: 1
                        }}
                    >
                        <Box sx={{width: "100%", flex: 1}}>
                            <CrmSelect
                                name={"status"}
                                options={customerStatus}
                                label={t("customers.fields.customer_approval")}
                            />
                        </Box>
                        <Button
                            type={"submit"}
                            sx={{flex: 1}}
                            startDecorator={
                                <PublishedWithChangesRounded/>
                            }
                        >
                            {t("actions.save")}
                        </Button>
                    </Box>
                </Box>
            </FormProvider>
        </CrmContainer>
    )
}

export const CustomerEconomicActivity = (props: { activity: EconomicActivity }) => {
    const [open, setOpen] = useState(false)
    const {t} = useTranslation();

    return (
        <AccordionGroup
            sx={{
                [`& .${accordionSummaryClasses.indicator}`]: {
                    display: "none"
                },
                [`& .${accordionSummaryClasses.button}`]: {
                    p: 0,
                    width: "100%"
                },
                [`& .${accordionSummaryClasses.root}`]: {
                    m: 0,
                    width: "-webkit-fill-available"
                },
            }}
        >
            <Accordion expanded={open}>
                <AccordionSummary
                    indicator={<></>}
                    onClick={() => setOpen(prev => !prev)}
                >
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            width: "100%"
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "start",
                                justifyContent: "space-between",
                            }}
                        >
                            <Typography
                                level={"body-sm"}
                                fontWeight={"bold"}
                            >
                                {props.activity.code}
                            </Typography>
                            <Typography
                                level={"body-sm"}
                                sx={{
                                    maxWidth: "550px",
                                    minWidth: "550px",
                                    display: "-webkit-box",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden",
                                    textAlign: "start"
                                }}
                            >
                                {props.activity.description}
                            </Typography>
                        </Box>
                        <Divider>
                            <IconButton
                                variant={"plain"}
                                size={"sm"}
                                sx={{
                                    borderRadius: "50%",
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    minWidth: "1.4rem !important",
                                    minHeight: "1.4rem !important",
                                    transform: open ? "rotate(270deg)" : "rotate(90deg)",
                                    transition: "transform 100ms linear"
                                }}
                            >
                                {
                                    <KeyboardArrowRightRounded sx={{fontSize: "0.9rem"}}/>
                                }
                            </IconButton>
                        </Divider>
                    </Box>
                </AccordionSummary>
                <AccordionDetails>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "start",
                                justifyContent: "space-between",
                            }}
                        >
                            <Typography
                                level={"body-sm"}
                                fontWeight={"bold"}
                            >
                                {t("customers.fields.session")} {props.activity.section?.code ?? ""}
                            </Typography>
                            <Typography
                                level={"body-sm"}
                                sx={{
                                    maxWidth: "550px",
                                    minWidth: "550px",
                                    display: "-webkit-box",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden",
                                    textAlign: "start"
                                }}
                            >
                                {t("customers.fields.session")}{props.activity.section?.description ?? ""}
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "start",
                                justifyContent: "space-between",
                            }}
                        >
                            <Typography
                                level={"body-sm"}
                                fontWeight={"bold"}
                            >
                                {t("customers.fields.division")} {props.activity.division?.code ?? ""}
                            </Typography>
                            <Typography
                                level={"body-sm"}
                                sx={{
                                    maxWidth: "550px",
                                    minWidth: "550px",
                                    display: "-webkit-box",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden",
                                    textAlign: "start"
                                }}
                            >
                                {props.activity.division?.description ?? ""}
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "start",
                                justifyContent: "space-between",
                            }}
                        >
                            <Typography
                                level={"body-sm"}
                                fontWeight={"bold"}
                            >
                                {t("customers.fields.group")} {props.activity.group?.code ?? ""}
                            </Typography>
                            <Typography
                                level={"body-sm"}
                                sx={{
                                    maxWidth: "550px",
                                    minWidth: "550px",
                                    display: "-webkit-box",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden",
                                    textAlign: "start"
                                }}
                            >
                                {props.activity.group?.description ?? ""}
                            </Typography>
                        </Box>
                    </Box>
                </AccordionDetails>
            </Accordion>
        </AccordionGroup>
    )
}