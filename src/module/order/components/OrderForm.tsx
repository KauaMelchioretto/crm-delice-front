import {CrmContainer} from "../../../utils/components/core/CrmContainer.tsx";
import CrmState from "../../../utils/state/CrmState.ts";
import {CrmFormType} from "../../../utils/entities/entities.ts";
import {CrmModal} from "../../../utils/components/core/CrmModal.tsx";
import WalletState from "../../wallet/state/WalletState.ts";
import {CrmSelect, OptionType} from "../../../utils/components/core/SelectInput.tsx";
import {useAtomValue, useSetAtom, useAtom} from "jotai";
import {useEffect, useState} from "react";
import {FieldValues, FormProvider, useForm} from "react-hook-form";
import {Box, Button, FormControl, FormHelperText, FormLabel, IconButton, Typography} from "@mui/joy";
import CloseRounded from "@mui/icons-material/CloseRounded";
import {useTranslation} from "react-i18next";
import {Order} from "../entities/entities.ts";
import {ValueInput} from "../../../utils/components/inputs/ValueInput.tsx";

export const OrderForm = () => {
    const [formType, setFormType] = useAtom(CrmState.FormType);
    const orderUUID = useAtomValue(CrmState.EntityFormUUID);

    switch (formType) {
        case CrmFormType.EMPTY:
            return <></>;
        case CrmFormType.REGISTER_ORDER:
            return (
                <CrmModal
                    open={true}
                    onClose={() => setFormType(CrmFormType.EMPTY)}
                >
                    <OrderRegister/>
                </CrmModal>
            )
        case CrmFormType.UPDATE_ORDER:
            return (
                <CrmModal
                    open={true}
                    onClose={() => setFormType(CrmFormType.EMPTY)}
                >
                    <OrderRegister orderUUID={orderUUID}/>
                </CrmModal>
            )
    }
}

const OrderRegister = ({orderUUID}: { orderUUID?: string }) => {
    const {t} = useTranslation()

    const simpleCustomersAtom = useAtomValue(WalletState.FreeCustomersAtom)
    const setFormType = useSetAtom(CrmState.FormType);

    const [customers, setCustomers] = useState<OptionType[]>([])

    const formMethods = useForm({
        defaultValues: {
            customer: {
                uuid: ""
            },
        } as Order
    })

    const {handleSubmit, register, formState: {errors}, setValue} = formMethods

    const handleSubmitOrder = handleSubmit((data: FieldValues) => {
        console.log(data)
    })

    useEffect(() => {
        let tempCustomers: OptionType[] = []

        if (simpleCustomersAtom.state === "hasData") {
            tempCustomers = (simpleCustomersAtom.data ?? []).map((x) => (
                {value: x?.uuid ?? "", label: x?.companyName ?? ""})
            )
        }

        if(tempCustomers.length > 0){
            setValue("customer.uuid", tempCustomers[0]?.value ?? "")
        }

        setCustomers(tempCustomers)
    }, [orderUUID, simpleCustomersAtom]);

    return (
        <CrmContainer sx={{minWidth: "500px"}}>
            <FormProvider {...formMethods}>
                <Box
                    display={"flex"}
                    justifyContent={"space-between"}
                    alignItems={"center"}
                >
                    <Typography level={"body-md"} fontWeight={"bold"}>
                        {orderUUID ? t("actions.edit") : t("actions.register")} {t("modules.order")}
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
                    onSubmit={handleSubmitOrder}
                >
                    <Box sx={{width: "100%", flex: 1}}>
                        <CrmSelect
                            name={"customer.uuid"}
                            options={customers}
                            label={"Cliente"}
                            // @ts-ignore
                            rules={{rules: {required: "Operator must be informed"}}}
                        />
                    </Box>
                    <FormControl sx={{flex: 1}}>
                        <FormLabel>Desconto padrão (%)</FormLabel>
                        <ValueInput
                            {...register("defaultDiscount")}
                            size={"sm"}
                            variant={"soft"}
                        />
                        <FormHelperText sx={{minHeight: "1rem"}}>
                            {errors?.defaultDiscount?.message as string}
                        </FormHelperText>
                    </FormControl>
                    <Button
                        type={"submit"}
                        sx={{flex: 1}}
                    >
                        Criar
                    </Button>
                </Box>
            </FormProvider>
        </CrmContainer>
    )
}