import {CrmContainer} from "../../../utils/components/core/CrmContainer.tsx";
import CrmState from "../../../utils/state/CrmState.ts";
import {CrmFormType} from "../../../utils/entities/entities.ts";
import {CrmModal} from "../../../utils/components/core/CrmModal.tsx";
import WalletState from "../../wallet/state/WalletState.ts";
import {CrmSelect, OptionType} from "../../../utils/components/core/SelectInput.tsx";
import {useAtom, useAtomValue, useSetAtom} from "jotai";
import {useEffect, useState} from "react";
import {FieldValues, FormProvider, useForm} from "react-hook-form";
import {Box, Button, FormControl, FormHelperText, FormLabel, IconButton, Typography} from "@mui/joy";
import CloseRounded from "@mui/icons-material/CloseRounded";
import {useTranslation} from "react-i18next";
import {Order} from "../entities/entities.ts";
import {ValueInput} from "../../../utils/components/inputs/ValueInput.tsx";
import {orderUseCase} from "../usecase/OrderUseCase.ts";
import {popup} from "../../../utils/alerts/Popup.ts";
import {useNavigate} from "react-router-dom";
import {AutoCompleteOptions, MultiAutocomplete} from "../../../utils/components/inputs/MultiAutocomplete.tsx";
import ProductState from "../../product/state/ProductState.ts";
import {NumericInput} from "../../../utils/components/inputs/NumericInput.tsx";
import OrderState from "../state/OrderState.ts";

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
        case CrmFormType.REGISTER_ORDER_ITEM:
            return (
                <CrmModal
                    open={true}
                    onClose={() => setFormType(CrmFormType.EMPTY)}
                >
                    <OrderItemRegister/>
                </CrmModal>
            )
    }
}

const OrderRegister = ({orderUUID}: { orderUUID?: string }) => {
    const {t} = useTranslation()

    const setFormType = useSetAtom(CrmState.FormType);

    const simpleCustomersAtom = useAtomValue(WalletState.FreeCustomersAtom)

    const [customers, setCustomers] = useState<OptionType[]>([])
    const navigate = useNavigate()

    const formMethods = useForm({
        defaultValues: {
            customer: {
                uuid: ""
            },
        } as Order
    })

    const {handleSubmit, register, formState: {errors}, setValue} = formMethods

    const handleSubmitOrder = handleSubmit((data: FieldValues) => {
        orderUseCase.registerOrder({
            customer: {
                uuid: data.customer.uuid
            },
            defaultDiscount: parseFloat(
                (data?.defaultDiscount ?? "0").replace(".", "").replace(",", ".")
            )
        }).then((response) => {
            if (response.error) {
                popup.toast("error", response.error, 2000);
            }
            if (response.order) {
                setFormType(CrmFormType.EMPTY)
                navigate(`/orders/${response.order.uuid}`)
            }
        })
    })

    useEffect(() => {
        let tempCustomers: OptionType[] = []

        if (simpleCustomersAtom.state === "hasData") {
            tempCustomers = (simpleCustomersAtom.data ?? []).map((x) => (
                {value: x?.uuid ?? "", label: x?.companyName ?? ""})
            )
        }

        if (tempCustomers.length > 0) {
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

const OrderItemRegister = () => {
    const setFormType = useSetAtom(CrmState.FormType);

    const order = useAtomValue(OrderState.Order)
    const updateList = useSetAtom(OrderState.UpdateAtom)

    const simpleProductsAtom = useAtomValue(ProductState.SimpleProducts)

    const [products, setProducts] = useState<AutoCompleteOptions[]>([])

    const formMethods = useForm();

    const {handleSubmit, register, formState: {errors}} = formMethods

    const handleSubmitOrder = handleSubmit((data: FieldValues) => {
        const products = (data?.products?.map((x: { uuid: string }) => x.uuid) ?? []) as string[]

        orderUseCase.saveItemInOrder(
            order?.uuid ?? "",
            {
                products: products,
                discount: parseFloat(
                    (data?.discount ?? "0").replace(".", "").replace(",", ".")
                ),
                quantity: data?.quantity ?? 0
            }
        ).then((response) => {
            if (response.error) {
                popup.toast("error", response.error, 2000);
            } else {
                popup.toast("success", "Item adicionado com sucesso", 2000);
                updateList(prev => !prev);
                setFormType(CrmFormType.EMPTY);
            }
        })
    })

    useEffect(() => {
        let tempProducts: AutoCompleteOptions[] = []

        if (simpleProductsAtom.state === "hasData") {
            tempProducts = (simpleProductsAtom.data?.products ?? []).map((x) => (
                {uuid: x?.uuid ?? "", label: x?.name ?? ""})
            )
        }

        setProducts(tempProducts)
    }, [simpleProductsAtom.state]);

    return (
        <CrmContainer sx={{minWidth: "500px"}}>
            <FormProvider {...formMethods}>
                <Box
                    display={"flex"}
                    justifyContent={"space-between"}
                    alignItems={"center"}
                >
                    <Typography level={"body-md"} fontWeight={"bold"}>
                        Adicionar itens
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
                    <FormControl sx={{flex: 1}}>
                        <FormLabel>Produtos</FormLabel>
                        <MultiAutocomplete
                            options={products}
                            name={"products"}
                        />
                    </FormControl>
                    <Box
                        display={"flex"}
                        justifyContent={"space-between"}
                        alignItems={"center"}
                        gap={1}
                    >
                        <FormControl sx={{flex: 1}}>
                            <FormLabel>Quantidade</FormLabel>
                            <NumericInput
                                {...register("quantity", {required: "Quantity is required"})}
                                size={"sm"}
                                variant={"soft"}
                            />
                            <FormHelperText sx={{minHeight: "1rem"}}>
                                {errors?.quantity?.message as string}
                            </FormHelperText>
                        </FormControl>
                        <FormControl sx={{flex: 1}}>
                            <FormLabel>Desconto</FormLabel>
                            <ValueInput
                                {...register("discount", {required: "Discount is required"})}
                                size={"sm"}
                                variant={"soft"}
                            />
                            <FormHelperText sx={{minHeight: "1rem"}}>
                                {errors?.discount?.message as string}
                            </FormHelperText>
                        </FormControl>
                    </Box>
                    <Button
                        type={"submit"}
                        sx={{flex: 1}}
                    >
                        Incluir no pedido
                    </Button>
                </Box>
            </FormProvider>
        </CrmContainer>
    )
}