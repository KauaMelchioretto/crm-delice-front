import {useAtom, useAtomValue, useSetAtom} from "jotai";
import ProductState from "../state/ProductState.ts";
import {ProductMedia, ProductStatus} from "../entities/entities.ts";
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
import {ChangeEvent, Fragment, useEffect, useRef, useState} from "react";
import CrmState from "../../../utils/state/CrmState.ts";
import {CrmFormType} from "../../../utils/entities/entities.ts";
import { useTranslation } from "react-i18next";
import {Image, Carousel, Empty} from "antd";
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import {CrmAntImage} from "../../../utils/components/image/CrmAntImage.tsx";
import uuid from "react-native-uuid"

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
                    <ProductFormRegister productUUID={productUUID}/>
                </CrmModal>
            );
        case CrmFormType.PRODUCT_MEDIA:
            return (
                <CrmModal
                    open={true}
                    onClose={() => setFormType(CrmFormType.EMPTY)}
                >
                    <ProductMediaRegister productUUID={productUUID}/>
                </CrmModal>
            );
    }
}

const ProductFormRegister = ({productUUID}: { productUUID?: string }) => {
    const setFormType = useSetAtom(CrmState.FormType)
    const updateList = useSetAtom(ProductState.UpdateAtom)
    const formMethods = useForm();
    const { t } = useTranslation();

    const {handleSubmit, register, formState: {errors}, setValue} = formMethods

    const handleSubmitProduct = handleSubmit((data: FieldValues) => {
        if (productUUID) {
            productUseCase.updateProduct({
                uuid: productUUID,
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
                    popup.toast("success", t("products.messages.update_success"), 2000);
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
                popup.toast("success", t("products.messages.create_success"), 2000);
                updateList(prev => !prev);
                setFormType(CrmFormType.EMPTY);
            }
        })
    })

    useEffect(() => {
        if (productUUID) {
            productUseCase.getProductUUID(productUUID).then((response) => {
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
    }, [productUUID]);

    return (
        <CrmContainer>
            <FormProvider {...formMethods}>
                <Box
                    display={"flex"}
                    justifyContent={"space-between"}
                    alignItems={"center"}
                >
                    <Typography level={"body-md"} fontWeight={"bold"}>
                        {producUUID ? t("actions.edit") : t("actions.register")} {t("products.title")}
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
                            <FormLabel>{t("products.fields.code")}</FormLabel>
                            <NumericInput
                                {...register("code", {required: t("products.messages.code_required")})}
                                size={"sm"}
                                variant={"soft"}
                                disabled={!!productUUID}
                            />
                            <FormHelperText sx={{minHeight: "1rem"}}>
                                {errors?.code?.message as string}
                            </FormHelperText>
                        </FormControl>
                        {
                            productUUID && (
                                <Box sx={{width: "100%", flex: 1}}>
                                    <CrmSelect
                                        name={"status"}
                                        options={[
                                            {
                                                label: t("products.status.active"),
                                                value: ProductStatus.ACTIVE
                                            },
                                            {
                                                label: t("products.status.inactive"),
                                                value: ProductStatus.INACTIVE
                                            }
                                        ]}
                                        label={"Status"}
                                        // @ts-ignore
                                        rules={{rules: {required: t("products.messages.status_required")}}}
                                    />
                                </Box>
                            )
                        }
                    </Box>
                    <FormControl sx={{flex: 1}}>
                        <FormLabel>{t("products.fields.name")}</FormLabel>
                        <TextInput
                            {...register("name", {required: t("products.messages.name_required")})}
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
                            <FormLabel>{t("products.fields.price")} (R$)</FormLabel>
                            <ValueInput
                                {...register("price", {required: t("products.messages.price_required")})}
                                size={"sm"}
                                variant={"soft"}
                            />
                            <FormHelperText sx={{minHeight: "1rem"}}>
                                {errors?.price?.message as string}
                            </FormHelperText>
                        </FormControl>
                        <FormControl sx={{flex: 1}}>
                            <FormLabel>{t("products.fields.weight")} (g)</FormLabel>
                            <NumericInput
                                {...register("weight", {required: t("products.messages.weight_required")})}
                                size={"sm"}
                                variant={"soft"}
                            />
                            <FormHelperText sx={{minHeight: "1rem"}}>
                                {errors?.weight?.message as string}
                            </FormHelperText>
                        </FormControl>
                    </Box>
                    <FormControl>
                        <FormLabel>{t("products.fields.description")}</FormLabel>
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
                        {producUUID ? t("actions.save") : t("actions.register")}
                    </Button>
                </Box>
            </FormProvider>
        </CrmContainer>
    )
}

const ProductMediaRegister = ({productUUID}: { productUUID: string }) => {
    const setFormType = useSetAtom(CrmState.FormType)

    const [principal, setPrincipal] = useState<ProductMedia | null>(null)
    const [images, setImages] = useState<ProductMedia[]>([])

    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (productUUID) {
            productUseCase.getProductUUID(productUUID).then((response) => {
                if (response.product) {
                    const tempPrincipal = response.product?.images?.find(x => x.isPrincipal)

                    if (tempPrincipal) {
                        setPrincipal(tempPrincipal)
                    }

                    const tempImages = response.product?.images?.filter(x => !x.isPrincipal);

                    if (tempImages) {
                        setImages(tempImages)
                    }
                }
            })
        }
    }, [productUUID]);

    const addImage = (evt: ChangeEvent<HTMLInputElement>) => {
        if (evt?.target?.files) {
            const files = Array.from(evt.target.files);
            const tempImages: ProductMedia[] = [];
            let loadedCount = 0;

            files.forEach((file) => {
                const reader = new FileReader();

                reader.onload = (event) => {
                    const fileBase64 = event?.target?.result;

                    tempImages.push({
                        image: fileBase64!.toString(),
                        isPrincipal: false,
                        uuid: uuid.v4()
                    });

                    loadedCount++;
                    if (loadedCount === files.length) {
                        setImages(prev => [...prev, ...tempImages]);
                    }
                };

                reader.readAsDataURL(file);
            });
        }
    };

    const changeToPrincipal = (media: ProductMedia) => {
        media.isPrincipal = true
        setPrincipal(media)
        if (principal) {
            setImages(prev => [...(prev.filter(x => x.uuid !== media.uuid)), principal as ProductMedia])
        } else {
            setImages(prev => [...(prev.filter(x => x.uuid !== media.uuid))])
        }
    }

    const saveProductMedia = () => {
        if(!images) return

        if(!principal) return

        const temp: ProductMedia[] = [...images.map(x => ({...x, isPrincipal: false})), principal]

        productUseCase.saveProductMedia(temp, productUUID).then((response) => {
            if (response.error) {
                popup.toast("error", response.error, 2000);
            } else {
                popup.toast("success", "The product images is saved with success", 2000);
                setFormType(CrmFormType.EMPTY);
            }
        })
    }

    return (
        <CrmContainer sx={{minWidth: "750px", maxWidth: "750px"}}>
            <Box
                display={"flex"}
                justifyContent={"space-between"}
                alignItems={"center"}
            >
                <Typography level={"body-md"} fontWeight={"bold"}>
                    Product Media
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
                    mt: 2
                }}
            >
                <Image.PreviewGroup>
                    {
                        principal && (
                            <Fragment>
                                <Typography level={"title-md"}>Image principal</Typography>
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "start",
                                        gap: 1,
                                        userSelect: "none"
                                    }}
                                >
                                    <Image
                                        height={150}
                                        src={principal.image}
                                    />
                                    <IconButton
                                        size={"sm"}
                                        color={"danger"}
                                        variant={"solid"}
                                        onClick={() => {
                                            setPrincipal(null)
                                        }}
                                    >
                                        <DeleteRoundedIcon/>
                                    </IconButton>
                                </Box>
                            </Fragment>
                        )
                    }
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center"
                        }}
                    >
                        <Typography level={"title-md"}>Images</Typography>
                        <Button
                            size={"sm"}
                            onClick={() => {
                                if (inputRef.current) {
                                    inputRef.current.click();
                                }
                            }}
                        >
                            Add image
                        </Button>
                    </Box>
                    {
                        images && (
                            images.length == 0 ? (
                                <Empty/>
                            ) : (
                                <Carousel
                                    arrows
                                    infinite={false}
                                    slidesPerRow={3}
                                    dots={false}
                                    draggable={true}
                                    style={{
                                        boxShadow: "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px",
                                        padding: "5px",
                                        paddingLeft: "0px",
                                        paddingRight: "0px",
                                        borderRadius: "11px"
                                    }}
                                >
                                    {
                                        images.map((m, i) => (
                                            <Box
                                                key={`image_product_${productUUID}_${i}`}
                                                sx={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    gap: 1,
                                                    pl: "5px",
                                                    pr: "5px",
                                                    userSelect: "none",
                                                }}
                                            >
                                                <CrmAntImage src={m.image}/>
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        flexDirection: "row",
                                                        gap: 1
                                                    }}
                                                >
                                                    <Button
                                                        size={"sm"}
                                                        sx={{flex: 1}}
                                                        onClick={() => {
                                                            changeToPrincipal(m)
                                                        }}
                                                    >
                                                        Change to principal
                                                    </Button>
                                                    <IconButton
                                                        size={"sm"}
                                                        color={"danger"}
                                                        variant={"solid"}
                                                        onClick={() => {
                                                            setImages(prev => prev.filter(x => x.uuid !== m.uuid))
                                                        }}
                                                    >
                                                        <DeleteRoundedIcon/>
                                                    </IconButton>
                                                </Box>
                                            </Box>
                                        ))
                                    }
                                </Carousel>
                            )
                        )
                    }
                </Image.PreviewGroup>
                <input
                    id={"file_product_image"}
                    type="file"
                    onChange={(evt) => addImage(evt)}
                    accept=".png,.jpeg,.jpg"
                    style={{display: "none"}}
                    multiple={true}
                    ref={inputRef}
                />
                <Button
                    sx={{flex: 1, mt: 2}}
                    onClick={() => saveProductMedia()}
                >
                    Save
                </Button>
            </Box>
        </CrmContainer>
    )
}