import {CrmContainer} from "../../../utils/components/core/CrmContainer.tsx";
import CrmState from "../../../utils/state/CrmState.ts";
import {CrmFormType} from "../../../utils/entities/entities.ts";
import {CrmModal} from "../../../utils/components/core/CrmModal.tsx";
import {CrmSelect} from "../../../utils/components/core/SelectInput.tsx";
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
import CustomersState from "../../customer/state/CustomersState.ts";

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

    const navigate = useNavigate()

    const customers = useAtomValue(CustomersState.SimpleCustomersAtom)

    const formMethods = useForm({
        defaultValues: {
            customer: {
                uuid: ""
            },
        } as Order
    })

    const {handleSubmit, register, formState: {errors}} = formMethods

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
                popup.toast("error", t(`orders.errors.${response.error}`), 2000);
            }
            if (response.order) {
                setFormType(CrmFormType.EMPTY)
                navigate(`/orders/${response.order.uuid}`)
            }
        })
    })

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
                    <FormControl sx={{flex: 1}}>
                        <FormLabel>{t('customers.page.entity')}</FormLabel>
                        <CrmSelect
                            {...register("customer.uuid", {required: t('orders.messages.customer_must_be_informed')})}
                            size={"sm"}
                            variant={"soft"}
                            options={customers}
                        />
                        <FormHelperText sx={{minHeight: "1rem"}}>
                            {errors?.customer?.message as string}
                        </FormHelperText>
                    </FormControl>
                    <FormControl sx={{flex: 1}}>
                        <FormLabel>{t('orders.fields.default_discount') + ' (%)'}</FormLabel>
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
                        {t('actions.save')}
                    </Button>
                </Box>
            </FormProvider>
        </CrmContainer>
    )
}

const OrderItemRegister = () => {
    const setFormType = useSetAtom(CrmState.FormType);
    const {t} = useTranslation()

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
                popup.toast("error", t(`orders.errors.${response.error}`), 2000);
            } else {
                popup.toast("success", t('orders.messages.item_added_successfully'), 2000);
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
                        {t('orders.actions.add_items')}
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
                        <FormLabel>{t('products.title')}</FormLabel>
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
                            <FormLabel>{t('orders.labels.quantity')}</FormLabel>
                            <NumericInput
                                {...register("quantity", {required: t('orders.messages.quantity_is_required')})}
                                size={"sm"}
                                variant={"soft"}
                            />
                            <FormHelperText sx={{minHeight: "1rem"}}>
                                {errors?.quantity?.message as string}
                            </FormHelperText>
                        </FormControl>
                        <FormControl sx={{flex: 1}}>
                            <FormLabel>{t('orders.labels.discount')}</FormLabel>
                            <ValueInput
                                {...register("discount", {required: t('orders.messages.discount_is_required')})}
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
                        {t('orders.actions.include_in_order')}
                    </Button>
                </Box>
            </FormProvider>
        </CrmContainer>
    )
}