import {Campaign, DiscountedProduct} from "../entities/entities.ts";
import {Box, Button, FormControl, FormHelperText, FormLabel, IconButton, Typography} from "@mui/joy";
import PostAddRoundedIcon from '@mui/icons-material/PostAddRounded';
import {CrmContainer} from "../../../utils/components/core/CrmContainer.tsx";
import {Fragment, ReactNode, useState} from "react";
import {CrmModal} from "../../../utils/components/core/CrmModal.tsx";
import {useAtomValue} from "jotai/index";
import ProductState from "../../product/state/ProductState.ts";
import {MultiAutocomplete} from "../../../utils/components/inputs/MultiAutocomplete.tsx";
import {FieldValues, FormProvider, useForm} from "react-hook-form";
import CloseRounded from "@mui/icons-material/CloseRounded";
import {ValueInput} from "../../../utils/components/inputs/ValueInput.tsx";
import {campaignUseCase} from "../usecase/CampaignUseCase.ts";
import {popup} from "../../../utils/alerts/Popup.ts";
import {useSetAtom} from "jotai";
import CampaignState from "../state/CampaignState.ts";
import {Empty, Image} from "antd";
import noImage from "../../../utils/assets/images/no-image.svg";
import {maskDecimal, maskMoney} from "../../../utils/functions/MarkFormat.ts";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import {SxProps} from "@mui/material";

export const SaleCampaignConfig = (props: { campaign: Campaign }) => {
    const products = props.campaign.metadata?.products ?? []

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
                height: "100%"
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between"
                }}
            >
                <Typography
                    level={"body-md"}
                    fontWeight={"bold"}
                >
                    Produtos da campanha
                </Typography>
                <CampaignProductModal
                    campaignUUID={props.campaign.uuid!}
                    products={products}
                />
            </Box>
            {
                products.length === 0 && (
                    <Box
                        sx={{
                            mt: 10
                        }}
                    >
                        <Empty/>
                    </Box>
                )
            }
            {
                products?.map((product: DiscountedProduct) => (
                    <CampaignItemTile
                        key={`campaign_product_${product.product.uuid}`}
                        {...product}
                    />
                ))
            }
        </Box>
    )
}

const CampaignItemTile = (props: DiscountedProduct) => {
    const image = props.product.image ? props.product.image ?? noImage : noImage

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "row",
                gap: 1
            }}
        >
            <CrmContainer
                sx={{
                    height: "70px",
                    minWidth: "70px",
                    maxWidth: "70px",
                    p: 0.5,
                    display: "flex",
                    alignItem: "center",
                    justifyContent: "center"
                }}
            >
                <Image
                    src={image}
                    style={{
                        height: "100%"
                    }}
                    draggable={false}
                />
            </CrmContainer>
            <CampaignInfoLabel
                label={`${props.product.code} - ${props.product.name}`}
                child={props.product.description}
                width={20}
            />
            <CampaignInfoLabel
                label={"Preço unitário"}
                child={maskMoney(props.product.price ?? 0)}
                width={10}
            />
            <CampaignInfoLabel
                label={"Peso (g)"}
                child={maskDecimal(props.product.weight ?? 0)}
                width={6}
            />
            <OrderItemDiscount {...props}/>
            <OrderItemRemove {...props}/>
        </Box>
    )
}

const OrderItemDiscount = (props: DiscountedProduct) => {
    const {register, handleSubmit} = useForm({
        defaultValues: {
            discount: props.discount
        }
    })

    const {campaign} = CampaignState.useCampaignDetails()

    const products = campaign!.metadata!.products!

    const setUpdate = useSetAtom(CampaignState.UpdateAtom)

    const handleConfirmDiscount = handleSubmit((data: FieldValues) => {
        const temp = products.map((x) => {
            if (x.product.uuid === props.product.uuid) {
                return {
                    product: {
                        uuid: x.product.uuid ?? ""
                    },
                    discount: parseFloat(data?.discount.replace(",", ".")) ?? 0
                } as DiscountedProduct
            } else {
                return {
                    product: {
                        uuid: x.product.uuid ?? ""
                    },
                    discount: x.discount
                } as DiscountedProduct
            }
        })

        campaignUseCase.saveCampaignMetadata(campaign!.uuid!, {
            products: temp
        }).then((response) => {
            if (response.error) {
                popup.toast("error", response.error, 2000);
                return
            } else {
                setUpdate(prev => !prev)
            }
        })
    })

    return (
        <CampaignInfoLabel
            label={"Desconto (%)"}
            width={8}
            sx={{
                ml: "auto"
            }}
            child={
                <form onSubmit={handleConfirmDiscount}>
                    <ValueInput
                        size={"sm"}
                        sx={{width: "6.5rem"}}
                        onClick={(evt) => {
                            (evt.target as HTMLInputElement).select();
                        }}
                        {...register("discount")}
                    />
                </form>
            }
        />
    )
}

const OrderItemRemove = (props: DiscountedProduct) => {
    const {campaign} = CampaignState.useCampaignDetails()

    const products = campaign!.metadata!.products!

    const setUpdate = useSetAtom(CampaignState.UpdateAtom)

    const handleConfirmRemove = () => {
        const temp = products.filter((x) => x.product.uuid !== props.product.uuid)

        campaignUseCase.saveCampaignMetadata(campaign!.uuid!, {
            products: temp
        }).then((response) => {
            if (response.error) {
                popup.toast("error", response.error, 2000);
                return
            } else {
                setUpdate(prev => !prev)
            }
        })
    }

    return (
        <CampaignInfoLabel
            width={10}
            child={
                <Button
                    variant={"solid"}
                    color={"danger"}
                    size={"sm"}
                    startDecorator={<DeleteOutlineOutlinedIcon/>}
                    onClick={() => {
                        handleConfirmRemove()
                    }}
                    sx={{width: "100%"}}
                >
                    Remover item
                </Button>
            }
        />
    )
}

const CampaignInfoLabel = (
    {label, child, width, sx}: { label?: string, child?: string | ReactNode, width: number, sx?: SxProps }
) => (
    <Box
        sx={[
            {
                display: "flex",
                flexDirection: "column",
                alignItems: "start",
                minHeight: "70px",
                gap: 1,
                minWidth: `${width}rem`,
                maxWidth: `${width}rem`,
            },
            {...sx}
        ]}
    >
        <Typography
            level={"body-sm"}
            fontWeight={"bold"}
        >
            {label ?? <>&nbsp;</>}
        </Typography>
        <Typography
            level={"body-sm"}
            sx={{width: "100%"}}
        >
            {child ?? <>-</>}
        </Typography>
    </Box>
)

const CampaignProductModal = (
    props: { campaignUUID: string, products: DiscountedProduct[] }
) => {
    const [openModal, setOpenModal] = useState<boolean>(false)

    const formMethods = useForm();

    const {handleSubmit, register, formState: {errors}} = formMethods

    let products = useAtomValue(ProductState.SimpleProducts)

    const included = props.products.map(x => x.product.uuid)
    products = products.filter(x => !included.includes(x.value as string))

    const setUpdate = useSetAtom(CampaignState.UpdateAtom)

    const handleSubmitProduct = handleSubmit((data: FieldValues) => {
        const temp = props.products
            .map(x => ({product: {uuid: x.product.uuid}, discount: x.discount} as DiscountedProduct))

        const products: DiscountedProduct[] = data.products
            ?.map((x: { uuid: string }) => ({
                product: {
                    uuid: x?.uuid ?? ""
                },
                discount: parseFloat(data?.discount.replace(",", ".")) ?? 0
            } as DiscountedProduct))
            .filter((x: DiscountedProduct) => x.product.uuid !== "")

        if (products.length === 0) {
            return
        }

        campaignUseCase.saveCampaignMetadata(props.campaignUUID, {
            products: [...products, ...temp]
        }).then((response) => {
            if (response.error) {
                popup.toast("error", response.error, 2000);
                return
            } else {
                setUpdate(prev => !prev)
                setOpenModal(false)
            }
        })
    })

    return (
        <Fragment>
            <Button
                variant={"solid"}
                startDecorator={<PostAddRoundedIcon/>}
                size={"sm"}
                onClick={() => {
                    setOpenModal(true)
                }}
            >
                Adicionar produto
            </Button>
            <CrmModal
                open={openModal}
                onClose={() => setOpenModal(false)}
            >
                <CrmContainer sx={{minWidth: "500px"}}>
                    <FormProvider {...formMethods}>
                        <Box
                            display={"flex"}
                            justifyContent={"space-between"}
                            alignItems={"center"}
                        >
                            <Typography level={"body-md"} fontWeight={"bold"}>
                                Adicionar produto
                            </Typography>
                            <IconButton
                                size={"sm"}
                                onClick={() => setOpenModal(false)}
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
                            <FormControl sx={{flex: 1}}>
                                <FormLabel>Produtos</FormLabel>
                                <MultiAutocomplete
                                    options={
                                        products.map(x => ({
                                            label: x.label,
                                            uuid: x.value as string
                                        }))
                                    }
                                    name={"products"}
                                />
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
                            <Button
                                type={"submit"}
                                sx={{flex: 1}}
                            >
                                Incluir na campanha
                            </Button>
                        </Box>
                    </FormProvider>
                </CrmContainer>
            </CrmModal>
        </Fragment>
    )
}