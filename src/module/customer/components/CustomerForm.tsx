import CustomersState from "../state/CustomersState.ts";
import {ContactType, Customer, CustomerFormType} from "../entities/entities.ts";
import {CrmModal} from "../../../utils/components/core/CrmModal.tsx";
import {useAtom, useAtomValue, useSetAtom} from "jotai";
import {CrmContainer} from "../../../utils/components/core/CrmContainer.tsx";
import {FieldValues, FormProvider, useFieldArray, useForm, useFormContext} from "react-hook-form";
import {
    Box,
    Button,
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
import {Fragment, useEffect} from "react";
import {PhoneInput} from "../../../utils/components/inputs/PhoneInput.tsx";
import {maskPhone} from "../../../utils/functions/MaskPhone.ts";
import {popup} from "../../../utils/alerts/Popup.ts";
import {maskCNPJ} from "../../../utils/functions/DocumentValidation.ts";

export const CustomerForm = () => {
    const [formType, setFormType] = useAtom(CustomersState.CustomerFormTypeAtom)

    const customerUUID = useAtomValue(CustomersState.CustomerFormUUIDAtom);

    switch (formType) {
        case CustomerFormType.EMPTY:
            return <></>;
        case CustomerFormType.REGISTER_CUSTOMER:
            return (
                <CrmModal
                    open={true}
                    onClose={() => setFormType(CustomerFormType.EMPTY)}
                >
                    <CustomerRegister/>
                </CrmModal>
            );
        case CustomerFormType.EDIT_CUSTOMER:
            return (
                <CrmModal
                    open={true}
                    onClose={() => setFormType(CustomerFormType.EMPTY)}
                >
                    <CustomerRegister customerUUID={customerUUID}/>
                </CrmModal>
            )
    }
}

const contactTypes: OptionType[] = [
    {
        value: ContactType.EMAIL,
        label: "E-mail"
    },
    {
        value: ContactType.PHONE,
        label: "Telefone"
    },
    {
        value: ContactType.MEDIA,
        label: "Mídia social"
    },
    {
        value: ContactType.NONE,
        label: "Outros"
    }
]

const CustomerRegister = ({customerUUID}: { customerUUID?: string }) => {
    const updateList = useSetAtom(CustomersState.CustomerUpdateAtom)
    const setFormType = useSetAtom(CustomersState.CustomerFormTypeAtom)
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
                economicActivitiesCodes: data.economicActivitiesCodesForm.map((x: { value: string }) => x.value),
                observation: data.observation,
            }).then((response) => {
                if (response.error) {
                    popup.toast("error", response.error, 2000);
                } else {
                    popup.toast("success", "The customer is included with success", 2000);
                    updateList(prev => !prev);
                    setFormType(CustomerFormType.EMPTY);
                }
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
                popup.toast("success", "The customer is included with success", 2000);
                updateList(prev => !prev);
                setFormType(CustomerFormType.EMPTY);
            }
        })
    });

    const handleGetPreCustomer = (document: string) => {
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
                        {customerUUID ? "Edit" : "Register"} Customer
                    </Typography>
                    <IconButton
                        size={"sm"}
                        onClick={() => setFormType(CustomerFormType.EMPTY)}
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
                    <Tabs defaultValue={0} sx={{pt: 0.5}}>
                        <TabList>
                            <Tab>Register</Tab>
                            <Tab>Infomações comerciais</Tab>
                        </TabList>
                        <TabPanel value={0} sx={{pl: 0, pr: 0}}>
                            <Box display={"flex"} alignItems={"center"} gap={1}>
                                <FormControl>
                                    <FormLabel>CNPJ</FormLabel>
                                    <CnpjInput
                                        {...register(
                                            "document",
                                            {
                                                required: "The CNPJ is required",
                                                onBlur: (evt) => {
                                                    handleGetPreCustomer(evt.target.value)
                                                }
                                            }
                                        )}
                                        size={"sm"}
                                        variant={"soft"}
                                    />
                                    <FormHelperText sx={{minHeight: "1rem"}}>
                                        {errors?.document?.message as string}
                                    </FormHelperText>
                                </FormControl>
                                <FormControl sx={{flex: 1}}>
                                    <FormLabel>Nome pessoal</FormLabel>
                                    <TextInput
                                        {...register("personName", {required: "The person name is required"})}
                                        size={"sm"}
                                        variant={"soft"}
                                    />
                                    <FormHelperText sx={{minHeight: "1rem"}}>
                                        {errors?.personName?.message as string}
                                    </FormHelperText>
                                </FormControl>
                            </Box>
                            <FormControl>
                                <FormLabel>Razão social</FormLabel>
                                <TextInput
                                    {...register("companyName", {required: "The company name is required"})}
                                    size={"sm"}
                                    variant={"soft"}
                                />
                                <FormHelperText sx={{minHeight: "1rem"}}>
                                    {errors?.companyName?.message as string}
                                </FormHelperText>
                            </FormControl>
                            <FormControl>
                                <FormLabel>Nome fantasia</FormLabel>
                                <TextInput
                                    {...register("tradingName", {required: "The trading name is required"})}
                                    size={"sm"}
                                    variant={"soft"}
                                />
                                <FormHelperText sx={{minHeight: "1rem"}}>
                                    {errors?.tradingName?.message as string}
                                </FormHelperText>
                            </FormControl>
                            <Box display={"flex"} alignItems={"center"} gap={1}>
                                <FormControl>
                                    <FormLabel>CEP</FormLabel>
                                    <ZipCodeInput
                                        {...register("zipCode", {required: "The zip code is required"})}
                                        size={"sm"}
                                        variant={"soft"}
                                    />
                                    <FormHelperText sx={{minHeight: "1rem"}}>
                                        {errors?.zipCode?.message as string}
                                    </FormHelperText>
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Cidade</FormLabel>
                                    <TextInput
                                        {...register("city", {required: "The city is required"})}
                                        size={"sm"}
                                        variant={"soft"}
                                    />
                                    <FormHelperText sx={{minHeight: "1rem"}}>
                                        {errors?.city?.message as string}
                                    </FormHelperText>
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Estado</FormLabel>
                                    <TextInput
                                        {...register("state", {required: "The state is required"})}
                                        size={"sm"}
                                        variant={"soft"}
                                    />
                                    <FormHelperText sx={{minHeight: "1rem"}}>
                                        {errors?.state?.message as string}
                                    </FormHelperText>
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Complemento</FormLabel>
                                    <TextInput
                                        {...register("complement", {required: "The complement is required"})}
                                        size={"sm"}
                                        variant={"soft"}
                                    />
                                    <FormHelperText sx={{minHeight: "1rem"}}>
                                        {errors?.complement?.message as string}
                                    </FormHelperText>
                                </FormControl>
                            </Box>
                            <Box display={"flex"} alignItems={"center"} gap={1}>
                                <FormControl sx={{flex: 1}}>
                                    <FormLabel>Endereço</FormLabel>
                                    <TextInput
                                        {...register("address", {required: "The address is required"})}
                                        size={"sm"}
                                        variant={"soft"}
                                    />
                                    <FormHelperText sx={{minHeight: "1rem"}}>
                                        {errors?.address?.message as string}
                                    </FormHelperText>
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Nº</FormLabel>
                                    <NumericInput
                                        {...register("addressNumber", {required: "The address number is required"})}
                                        size={"sm"}
                                        variant={"soft"}
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
                                <Divider>Contatos</Divider>
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 0.5,
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
                                                    <FormLabel>Principal</FormLabel>
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
                                <Divider sx={{mt: 2}}>Atividades economicas - CNAE</Divider>
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 0.5,
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
                                                        placeholder={"Atividade economica"}
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
                                    <FormLabel>Observação</FormLabel>
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
                        {customerUUID ? "Salvar" : "Registrar"}
                    </Button>
                </Box>
            </FormProvider>
        </CrmContainer>
    )
}

const CustomerContact = ({index}: { index: number }) => {
    const {register, watch} = useFormContext()

    const type = watch(`contacts.${index}.contactType`) as ContactType

    const Component = () => {
        switch (type) {
            case ContactType.PHONE:
                return (
                    <PhoneInput
                        {...register(`contacts.${index}.label`)}
                        size={"sm"}
                        variant={"soft"}
                        placeholder={"Informe o contato"}
                    />
                )
            default:
                return (
                    <TextInput
                        {...register(`contacts.${index}.label`)}
                        size={"sm"}
                        variant={"soft"}
                        placeholder={"Informe o contato"}
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