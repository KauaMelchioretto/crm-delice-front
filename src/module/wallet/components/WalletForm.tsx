import {useAtom, useAtomValue, useSetAtom} from "jotai";
import WalletState from "../state/WalletState.ts";
import {Wallet, WalletStatus} from "../entities/entities.ts";
import {CrmModal} from "../../../utils/components/core/CrmModal.tsx";
import {CrmContainer} from "../../../utils/components/core/CrmContainer.tsx";
import {FieldValues, FormProvider, useFieldArray, useForm} from "react-hook-form";
import {Box, Button, FormControl, FormHelperText, FormLabel, IconButton, Typography} from "@mui/joy";
import CloseRounded from "@mui/icons-material/CloseRounded";
import UserState from "../../user/state/UserState.ts";
import {CrmSelect, OptionType} from "../../../utils/components/core/SelectInput.tsx";
import {TextInput} from "../../../utils/components/core/TextInput.tsx";
import {CrmTextarea} from "../../../utils/components/core/CrmTextarea.tsx";
import AddCircleRounded from "@mui/icons-material/AddCircleRounded";
import RemoveCircleRounded from "@mui/icons-material/RemoveCircleRounded";
import {walletUseCase} from "../usecase/WalletUseCase.ts";
import {popup} from "../../../utils/alerts/Popup.ts";
import {useEffect, useState} from "react";
import CrmState from "../../../utils/state/CrmState.ts";
import {CrmFormType} from "../../../utils/entities/entities.ts";
import {useTranslation} from "react-i18next";

export const WalletForm = () => {
    const [formType, setFormType] = useAtom(CrmState.FormType)
    const walletUUID = useAtomValue(CrmState.EntityFormUUID)

    const simpleUsersAtom = useAtomValue(UserState.SimpleUsersAtom)
    const simpleCustomersAtom = useAtomValue(WalletState.FreeCustomersAtom)

    if (simpleUsersAtom.state === "loading" || simpleCustomersAtom.state === "loading") {
        return <></>
    }

    switch (formType) {
        case CrmFormType.EMPTY:
            return <></>
        case CrmFormType.REGISTER_WALLET:
            return (
                <CrmModal
                    open={true}
                    onClose={() => setFormType(CrmFormType.EMPTY)}
                >
                    <WalletFormRegister/>
                </CrmModal>
            );
        case CrmFormType.EDIT_WALLET:
            return (
                <CrmModal
                    open={true}
                    onClose={() => setFormType(CrmFormType.EMPTY)}
                >
                    <WalletFormRegister walletUUID={walletUUID}/>
                </CrmModal>
            );
    }
}

const WalletFormRegister = ({walletUUID}: { walletUUID?: string }) => {
    const setFormType = useSetAtom(CrmState.FormType)
    const {t} = useTranslation();

    const updateList = useSetAtom(WalletState.UpdateAtom)

    const simpleUsersAtom = useAtomValue(UserState.SimpleUsersAtom)
    const simpleCustomersAtom = useAtomValue(WalletState.FreeCustomersAtom)

    const [users, setUsers] = useState<OptionType[]>([])
    const [customers, setCustomers] = useState<OptionType[]>([])

    const formMethods = useForm({
        defaultValues: {
            customers: [{
                uuid: ""
            }],
            accountable: {
                uuid: ""
            }
        } as Wallet
    })

    const {handleSubmit, register, formState: {errors}, control, setValue} = formMethods

    const customersControl = useFieldArray({
        control: control,
        name: "customers"
    })

    const handleSubmitWallet = handleSubmit((data: FieldValues) => {
        if (walletUUID) {
            walletUseCase.updateWallet({
                uuid: walletUUID,
                label: data.label,
                observation: data.observation,
                accountable: data.accountable,
                customers: data.customers,
                status: data.status,
            }).then((response) => {
                if (response.error) {
                    popup.toast("error", t(`wallets.errors.${response.error}`), 2000);
                } else {
                    popup.toast("success", t("wallets.messages.update_success"), 2000);
                    updateList(prev => !prev);
                    setFormType(CrmFormType.EMPTY);
                }
            })
            return
        }
        walletUseCase.createWallet({
            label: data.label,
            observation: data.observation,
            accountable: data.accountable,
            customers: data.customers
        }).then((response) => {
            if (response.error) {
                popup.toast("error", t(`wallets.errors.${response.error}`), 2000);
            } else {
                popup.toast("success", t("wallets.messages.create_success"), 2000);
                updateList(prev => !prev);
                setFormType(CrmFormType.EMPTY);
            }
        })
    })

    useEffect(() => {
        let tempUsers: OptionType[] = []
        let tempCustomers: OptionType[] = []

        if (simpleUsersAtom.state === "hasData") {
            tempUsers = (simpleUsersAtom.data.users ?? []).map((x) => (
                {value: x?.uuid ?? "", label: x?.login ?? ""}
            ));
        }

        if (simpleCustomersAtom.state === "hasData") {
            tempCustomers = (simpleCustomersAtom.data ?? []).map((x) => (
                {value: x?.uuid ?? "", label: x?.companyName ?? ""})
            )
        }

        if (walletUUID) {
            walletUseCase.getWalletUUID(walletUUID).then((response) => {
                if (response.wallet) {
                    setValue("label", response.wallet?.label)
                    setValue("accountable.uuid", response.wallet?.accountable?.uuid)
                    setValue("observation", response.wallet?.observation)
                    setValue("status", response.wallet?.status)

                    response.wallet.customers?.forEach((x, i) => {
                        tempCustomers.push({value: x?.uuid ?? "", label: x?.companyName ?? ""})

                        if (i >= customersControl.fields.length) {
                            customersControl.append({
                                uuid: x.uuid
                            })
                        } else {
                            setValue(`customers.${i}.uuid`, x?.uuid)
                        }
                    })

                    setUsers(tempUsers)
                    setCustomers(tempCustomers)
                }
            })
        } else {
            setUsers(tempUsers)
            if (tempUsers.length > 0) {
                setValue("accountable.uuid", tempUsers[0].value!)
            }

            setCustomers(tempCustomers)
            if(tempCustomers.length > 0){
                setValue("customers.0.uuid", tempCustomers[0].value!)
            }
        }
    }, [walletUUID]);

    return (
        <CrmContainer>
            <FormProvider {...formMethods}>
                <Box
                    display={"flex"}
                    justifyContent={"space-between"}
                    alignItems={"center"}
                >
                    <Typography level={"body-md"} fontWeight={"bold"}>
                        {walletUUID ? t("actions.edit") : t("actions.register")} {t("modules.wallet")}
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
                    onSubmit={handleSubmitWallet}
                >
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "start",
                            gap: 2
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column"
                            }}
                        >
                            <FormControl sx={{flex: 1}}>
                                <FormLabel>{t("wallets.fields.title")}</FormLabel>
                                <TextInput
                                    {...register("label", {required: t("wallets.messages.title_required")})}
                                    size={"sm"}
                                    variant={"soft"}
                                />
                                <FormHelperText sx={{minHeight: "1rem"}}>
                                    {errors?.label?.message as string}
                                </FormHelperText>
                            </FormControl>
                            <Box sx={{width: "100%", flex: 1}}>
                                <CrmSelect
                                    name={"accountable.uuid"}
                                    options={users}
                                    label={t("wallets.fields.accountable")}
                                    // @ts-ignore
                                    rules={{rules: {required: t("wallets.messages.user_required")}}}
                                />
                            </Box>
                            {
                                walletUUID && (
                                    <Box sx={{width: "100%", flex: 1}}>
                                        <CrmSelect
                                            name={"status"}
                                            options={[
                                                {
                                                    label: "Active",
                                                    value: WalletStatus.ACTIVE
                                                },
                                                {
                                                    label: "Inactive",
                                                    value: WalletStatus.INACTIVE
                                                }
                                            ]}
                                            label={"Status"}
                                            // @ts-ignore
                                            rules={{rules: {required: t('wallets.messages.status_required')}}}
                                        />
                                    </Box>
                                )
                            }
                        </Box>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                            }}
                        >
                            <FormLabel>{t('wallets.fields.customers')}</FormLabel>
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    maxHeight: "200px",
                                    overflowY: "auto"
                                }}
                            >
                                {
                                    customersControl.fields.map((field, i) => (
                                        <Box
                                            key={field.id}
                                            display={"flex"}
                                            alignItems={"center"}
                                            gap={1}
                                            sx={{mt: 0.5}}
                                        >
                                            <Box sx={{width: "300px"}}>
                                                <CrmSelect
                                                    name={`customers.${i}.uuid`}
                                                    options={customers}
                                                    label={""}
                                                />
                                            </Box>
                                            {
                                                (customersControl.fields.length - 1) === i ? (
                                                    <IconButton
                                                        onClick={() => {
                                                            customersControl.append({
                                                                uuid: customers[0].value ?? ""
                                                            })
                                                        }}
                                                        color={"primary"}
                                                    >
                                                        <AddCircleRounded/>
                                                    </IconButton>
                                                ) : (
                                                    <IconButton
                                                        onClick={() => {
                                                            customersControl.remove(i)
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
                        </Box>
                    </Box>
                    <FormControl>
                        <FormLabel>{t("wallets.fields.observations")}</FormLabel>
                        <CrmTextarea
                            {...register("observation")}
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
                        {walletUUID ? t("actions.save") : t("actions.register")}
                    </Button>
                </Box>
            </FormProvider>
        </CrmContainer>
    )
}