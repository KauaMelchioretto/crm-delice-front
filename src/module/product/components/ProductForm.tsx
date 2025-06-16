import {useAtom, useAtomValue, useSetAtom} from "jotai";
import ProductState from "../state/ProductState.ts";
import {ProductStatus} from "../entities/entities.ts";
import {CrmModal} from "../../../utils/components/core/CrmModal.tsx";
import {FieldValues, FormProvider, useForm} from "react-hook-form";
import {CrmContainer} from "../../../utils/components/core/CrmContainer.tsx";
import {Box, Button, FormControl, FormHelperText, FormLabel, IconButton, Typography} from "@mui/joy";
import CloseRounded from "@mui/icons-material/CloseRounded";
import {TextInput} from "../../../utils/components/core/TextInput.tsx";
import {CrmSelect} from "../../../utils/components/core/SelectInput.tsx";
import {CrmTextarea} from "../../../utils/components/core/CrmTextarea.tsx";
import {NumericInput} from "../../../utils/components/inputs/NumericInput.tsx";
import {ValueInput} from "../../../utils/components/inputs/ValueInput.tsx";
import {popup} from "../../../utils/alerts/Popup.ts";
import {productUseCase} from "../usecase/ProductUseCase.ts";
import {useEffect} from "react";
import CrmState from "../../../utils/state/CrmState.ts";
import {CrmFormType} from "../../../utils/entities/entities.ts";

export const ProductForm = () => {
    const [formType, setFormType] = useAtom(CrmState.FormType);
    const productUUID = useAtomValue(CrmState.EntityFormUUID);

    switch (formType) {
        case CrmFormType.EMPTY:
            return <></>;
        case CrmFormType.REGISTER_PRODUCT:
            return (
                <CrmModal
                    open={true}
                    onClose={() => setFormType(CrmFormType.EMPTY)}
                >
                    <ProductFormRegister/>
                </CrmModal>
            );
        case CrmFormType.EDIT_PRODUCT:
            return (
                <CrmModal
                    open={true}
                    onClose={() => setFormType(CrmFormType.EMPTY)}
                >
                    <ProductFormRegister producUUID={productUUID}/>
                </CrmModal>
            );
    }
}

const ProductFormRegister = ({producUUID}: { producUUID?: string }) => {
    const setFormType = useSetAtom(CrmState.FormType)
    const updateList = useSetAtom(ProductState.UpdateAtom)
    const formMethods = useForm();

    const {handleSubmit, register, formState: {errors}, setValue} = formMethods

    const handleSubmitProduct = handleSubmit((data: FieldValues) => {
        if (producUUID) {
            productUseCase.updateProduct({
                uuid: producUUID,
                status: data.status,
                code: data.code,
                name: data.name,
                price: data.price.replace(".", "").replace(",", "."),
                weight: data.weight,
                description: data.description
            }).then((response) => {
                if (response.error) {
                    popup.toast("error", response.error, 2000);
                } else {
                    popup.toast("success", "The wallet is changed with success", 2000);
                    updateList(prev => !prev);
                    setFormType(CrmFormType.EMPTY);
                }
            })
            return
        }
        productUseCase.createProduct({
            code: data.code,
            name: data.name,
            price: data.price.replace(".", "").replace(",", "."),
            weight: data.weight,
            description: data.description
        }).then((response) => {
            if (response.error) {
                popup.toast("error", response.error, 2000);
            } else {
                popup.toast("success", "The wallet is changed with success", 2000);
                updateList(prev => !prev);
                setFormType(CrmFormType.EMPTY);
            }
        })
    })

    useEffect(() => {
        if (producUUID) {
            productUseCase.getProductUUID(producUUID).then((response) => {
                if (response.product) {
                    const product = response.product

                    setValue("code", product.code)
                    setValue("status", product.status)
                    setValue("name", product.name)
                    setValue("price", product.price?.toFixed(2).replace(".", ","))
                    setValue("weight", product.weight)
                    setValue("description", product.description)
                }
            })
        }
    }, [producUUID]);

    return (
        <CrmContainer>
            <FormProvider {...formMethods}>
                <Box
                    display={"flex"}
                    justifyContent={"space-between"}
                    alignItems={"center"}
                >
                    <Typography level={"body-md"} fontWeight={"bold"}>
                        {producUUID ? "Edit" : "Register"} Product
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
                    onSubmit={handleSubmitProduct}
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
                            <FormLabel>Code</FormLabel>
                            <NumericInput
                                {...register("code", {required: "The code is required"})}
                                size={"sm"}
                                variant={"soft"}
                                disabled={!!producUUID}
                            />
                            <FormHelperText sx={{minHeight: "1rem"}}>
                                {errors?.code?.message as string}
                            </FormHelperText>
                        </FormControl>
                        {
                            producUUID && (
                                <Box sx={{width: "100%", flex: 1}}>
                                    <CrmSelect
                                        name={"status"}
                                        options={[
                                            {
                                                label: "Active",
                                                value: ProductStatus.ACTIVE
                                            },
                                            {
                                                label: "Inactive",
                                                value: ProductStatus.INACTIVE
                                            }
                                        ]}
                                        label={"Status"}
                                        // @ts-ignore
                                        rules={{rules: {required: "The status is required"}}}
                                    />
                                </Box>
                            )
                        }
                    </Box>
                    <FormControl sx={{flex: 1}}>
                        <FormLabel>Name</FormLabel>
                        <TextInput
                            {...register("name", {required: "The name is required"})}
                            size={"sm"}
                            variant={"soft"}
                        />
                        <FormHelperText sx={{minHeight: "1rem"}}>
                            {errors?.name?.message as string}
                        </FormHelperText>
                    </FormControl>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "start",
                            gap: 2
                        }}
                    >
                        <FormControl sx={{flex: 1}}>
                            <FormLabel>Price (R$)</FormLabel>
                            <ValueInput
                                {...register("price", {required: "The price is required"})}
                                size={"sm"}
                                variant={"soft"}
                            />
                            <FormHelperText sx={{minHeight: "1rem"}}>
                                {errors?.price?.message as string}
                            </FormHelperText>
                        </FormControl>
                        <FormControl sx={{flex: 1}}>
                            <FormLabel>Weight (g)</FormLabel>
                            <NumericInput
                                {...register("weight", {required: "The weight is required"})}
                                size={"sm"}
                                variant={"soft"}
                            />
                            <FormHelperText sx={{minHeight: "1rem"}}>
                                {errors?.weight?.message as string}
                            </FormHelperText>
                        </FormControl>
                    </Box>
                    <FormControl>
                        <FormLabel>Descrição</FormLabel>
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
                        {producUUID ? "Save" : "Register"}
                    </Button>
                </Box>
            </FormProvider>
        </CrmContainer>
    )
}