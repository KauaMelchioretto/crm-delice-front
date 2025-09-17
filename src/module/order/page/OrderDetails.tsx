import {Avatar, Box, Breadcrumbs, Button, CircularProgress, IconButton, Link, Typography} from "@mui/joy";
import OrderState from "../state/OrderState.ts";
import {CrmTitleContainer} from "../../../utils/components/core/CrmTitleContainer.tsx";
import {useNavigate} from "react-router-dom";
import {CrmContainer} from "../../../utils/components/core/CrmContainer.tsx";
import {Customer} from "../../customer/entities/entities.ts";
import {Order, OrderItem, OrderStatus} from "../entities/entities.ts";
import dayjs from "dayjs";
import {maskZipCode} from "../../../utils/functions/MaskZipCode.ts";
import {maskCNPJ} from "../../../utils/functions/DocumentValidation.ts";
import PostAddRoundedIcon from '@mui/icons-material/PostAddRounded';
import {useSetAtom} from "jotai/index";
import CrmState from "../../../utils/state/CrmState.ts";
import {CrmFormType} from "../../../utils/entities/entities.ts";

import noImage from "../../../utils/assets/images/no-image.svg"
import {Image} from "antd";

import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import {ReactNode} from "react";
import {ValueInput} from "../../../utils/components/inputs/ValueInput.tsx";
import {useTheme} from "@mui/material";
import {getColorContrast} from "../../../utils/functions/GetColorContrast";
import VerifiedRounded from "@mui/icons-material/VerifiedRounded";
import {orderUseCase} from "../usecase/OrderUseCase";
import {useAtom, useAtomValue} from "jotai";
import {FieldValues, useForm} from "react-hook-form";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import {maskDecimal, maskMoney} from "../../../utils/functions/MarkFormat.ts";

import TurnedInRoundedIcon from '@mui/icons-material/TurnedInRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import {popup} from "../../../utils/alerts/Popup.ts";

export const OrderDetails = () => {
    const theme = useTheme()

    const {order, isPending} = OrderState.useOrderDetails()
    const navigate = useNavigate()

    const setFormType = useSetAtom(CrmState.FormType);

    if (isPending) {
        return (
            <Box
                sx={{
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center"
                }}
            >
                <CircularProgress/>
            </Box>
        )
    }

    const crumbs = [
        {
            label: "Pedidos",
            nav: () => navigate(-1)
        },
        {
            label: order?.code,
            nav: () => navigate(0)
        },
        {
            label: "Detalhes"
        }
    ]

    return (
        <Box
            sx={{
                height: "100%",
                width: "100%",
                display: "grid",
                gridTemplateRows: `calc(2.5rem + ${theme.spacing(0.5)} + var(--Button-minHeight, 2rem)) 1fr`
            }}
        >
            <CrmTitleContainer
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "start",
                }}
            >
                <Box
                    sx={{
                        gap: 0.5,
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <Typography
                        level={"body-lg"}
                        fontWeight={"bold"}
                    >
                        Pedido {order?.code}
                    </Typography>
                    <Breadcrumbs sx={{p: 0}}>
                        {
                            crumbs.map((item) => (
                                <Link
                                    level={"body-xs"}
                                    color={"neutral"}
                                    onClick={() => {
                                        if (item.nav) {
                                            item.nav()
                                        }
                                    }}
                                >
                                    {item.label}
                                </Link>
                            ))
                        }
                    </Breadcrumbs>
                </Box>
                <Button
                    variant={"solid"}
                    startDecorator={<PostAddRoundedIcon/>}
                    size={"sm"}
                    onClick={() => {
                        setFormType(CrmFormType.REGISTER_ORDER_ITEM)
                    }}
                >
                    Adicionar produto
                </Button>
            </CrmTitleContainer>
            <CrmContainer
                sx={{
                    width: "100%",
                    borderRadius: "8px",
                    p: 1,
                    display: "flex",
                    flexDirection: "column",
                    overflowY: "auto",
                    gap: 1
                }}
            >
                <Box
                    sx={{
                        width: "100%",
                        display: "flex",
                        gap: 1
                    }}
                >
                    {order?.customer && (
                        <CustomerInfo customer={order.customer}/>
                    )}
                    {order && (
                        <OrderInfo order={order}/>
                    )}
                </Box>
                {order?.items != undefined && order.items.length > 0 && (
                    <OrderItems/>
                )}
                {order && (
                    <OrderTotals order={order}/>
                )}
            </CrmContainer>
        </Box>
    )
}

const CustomerInfo = ({customer}: { customer: Customer }) => {
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
        <CrmContainer
            sx={{
                display: "flex",
                borderRadius: "8px",
                p: 1,
                flexDirection: "column",
                flex: 1,
                gap: 0.5,
                backgroundColor: "background.level1",
            }}
        >
            <Typography
                level={"body-md"}
                fontWeight={"bold"}
            >
                Cliente
            </Typography>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    flexDirection: "row",
                    alignItems: "center",
                    mt: 1.5
                }}
            >
                <Typography
                    level={"body-sm"}
                    fontWeight={"bold"}
                >
                    CNPJ
                </Typography>
                <Typography
                    level={"body-sm"}
                >
                    {maskCNPJ(customer?.document ?? "")}
                </Typography>
            </Box>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    flexDirection: "row",
                    alignItems: "center",
                }}
            >
                <Typography
                    level={"body-sm"}
                    fontWeight={"bold"}
                >
                    Nome fantasia
                </Typography>
                <Typography
                    level={"body-sm"}
                >
                    {customer.tradingName}
                </Typography>
            </Box>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    flexDirection: "row",
                    alignItems: "center",
                }}
            >
                <Typography
                    level={"body-sm"}
                    fontWeight={"bold"}
                >
                    Razão social
                </Typography>
                <Typography
                    level={"body-sm"}
                >
                    {customer.companyName}
                </Typography>
            </Box>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    flexDirection: "row",
                    alignItems: "center",
                }}
            >
                <Typography
                    level={"body-sm"}
                    fontWeight={"bold"}
                >
                    Endereço
                </Typography>
                <Typography
                    level={"body-sm"}
                >
                    {address()}
                </Typography>
            </Box>
        </CrmContainer>
    )
}

const OrderInfo = ({order}: { order: Order }) => {
    const orderStatus = {
        [OrderStatus.OPEN]: {
            color: "#2685E2",
            label: "Aberto",
            icon: VerifiedRounded,
        },
        [OrderStatus.CANCELED]: {
            color: "#ff543f",
            label: "Cancelado",
            icon: CancelRoundedIcon,
        },
        [OrderStatus.CLOSED]: {
            color: "#1f7a1f",
            label: "Fechado",
            icon: TurnedInRoundedIcon,
        },
    };

    const CardStatus = ({status}: { status: OrderStatus }) => {
        const s = orderStatus[status];

        if (!s) return

        const colors = getColorContrast(s.color);

        const Icon = s.icon;

        return (
            <Box sx={{display: "flex", alignItems: "center", gap: 1}}>
                <Box
                    sx={{
                        backgroundColor: colors.transparent,
                        p: 0.5,
                        borderRadius: "8px",
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 0.5,
                    }}
                >
                    <Icon
                        sx={{
                            color: s.color,
                            fontSize: "14pt",
                        }}
                    />
                    <Typography
                        sx={{
                            color: s.color,
                            fontWeight: "bold",
                            fontSize: "9pt",
                        }}
                    >
                        {s.label}
                    </Typography>
                </Box>
            </Box>
        );
    };

    return (
        <CrmContainer
            sx={{
                display: "flex",
                width: "100%",
                borderRadius: "8px",
                p: 1,
                flexDirection: "column",
                flex: 1,
                gap: 0.5,
                backgroundColor: "background.level1",
            }}
        >
            <Typography
                level={"body-md"}
                fontWeight={"bold"}
            >
                Pedido
            </Typography>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    flexDirection: "row",
                    alignItems: "center",
                    mt: 1.5
                }}
            >
                <Typography
                    level={"body-sm"}
                    fontWeight={"bold"}
                >
                    Criação
                </Typography>
                <Typography
                    level={"body-sm"}
                >
                    {dayjs(order?.createdAt).format("DD/MM/YYYY HH:mm")}
                </Typography>
            </Box>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    flexDirection: "row",
                    alignItems: "center"
                }}
            >
                <Typography
                    level={"body-sm"}
                    fontWeight={"bold"}
                >
                    Modificação
                </Typography>
                <Typography
                    level={"body-sm"}
                >
                    {dayjs(order?.modifiedAt).format("DD/MM/YYYY HH:mm")}
                </Typography>
            </Box>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    flexDirection: "row",
                    alignItems: "center"
                }}
            >
                <Typography
                    level={"body-sm"}
                    fontWeight={"bold"}
                >
                    Operador
                </Typography>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 1
                    }}
                >
                    <Typography
                        level={"body-sm"}
                    >
                        {order?.operator?.login} - {order?.operator?.name} {order?.operator?.surname}
                    </Typography>
                    <Avatar
                        variant="outlined"
                        size="sm"
                        alt={order?.operator?.name.substring(0, 1)}
                        src={order?.operator?.avatar}
                        sx={{
                            cursor: "pointer"
                        }}
                    />
                </Box>
            </Box>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    flexDirection: "row",
                    alignItems: "center"
                }}
            >
                <Typography
                    level={"body-sm"}
                    fontWeight={"bold"}
                >
                    Situação do pedido
                </Typography>
                <Typography
                    level={"body-sm"}
                >
                    <CardStatus status={order.status ?? OrderStatus.OPEN}/>
                </Typography>
            </Box>
        </CrmContainer>
    )
}

const OrderItems = () => {
    const items = useAtomValue(OrderState.OrderItems)

    return (
        <CrmContainer
            sx={{
                display: "flex",
                width: "100%",
                borderRadius: "8px",
                p: 1,
                flexDirection: "column",
                flex: 1,
                gap: 0.5,
                backgroundColor: "background.level1",
                overflow: "visible",
            }}
        >
            <Typography
                level={"body-md"}
                fontWeight={"bold"}
            >
                Itens
            </Typography>
            {items.map((item, i) => (
                <OrderItemTile
                    key={`order_item_${i}`}
                    item={item}
                />
            ))}
        </CrmContainer>
    )
}

const OrderItemTile = (
    {item}: { item: OrderItem }
) => {
    const image = item.product.images ? item.product.images[0]?.image ?? noImage : noImage

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
            <OrderInfoLabel
                label={`${item.product.code} - ${item.product.name}`}
                child={item.product.description}
                width={10}
            />
            <OrderInfoLabel
                label={"Preço unitário"}
                child={maskMoney(item.product.price ?? 0)}
                width={10}
            />
            <OrderInfoLabel
                label={"Peso (g)"}
                child={maskDecimal(item.product.weight ?? 0)}
                width={6}
            />
            <OrderInfoLabel
                label={"Valor bruto"}
                child={maskMoney(item.grossPrice ?? 0)}
                width={10}
            />
            <OrderInfoLabel
                label={"Valor líquido"}
                child={maskMoney(item.netPrice ?? 0)}
                width={10}
            />
            <OrderItemQuantity item={item}/>
            <OrderItemDiscount item={item}/>
            <OrderItemRemove item={item}/>
        </Box>
    )
}

const OrderItemDiscount = (
    {item}: { item: OrderItem }
) => {
    const [order, setOrder] = useAtom(OrderState.Order)

    const {register, handleSubmit} = useForm({
        defaultValues: {
            discount: item.discount
        }
    })

    const setOrderItems = useSetAtom(OrderState.OrderItems)

    const handleSubmitDiscount = handleSubmit((data: FieldValues) => {
        const value = parseFloat(data.discount.replace(",", "."))

        orderUseCase.saveItemInOrder(
            order?.uuid ?? "",
            {
                quantity: item.quantity,
                products: [item.product?.uuid ?? ""],
                discount: value
            }
        ).then((response) => {
            if (response.order) {
                setOrder(response.order)
                setOrderItems(response.order.items ?? [])
            }
        })
    })

    if (order!.status != OrderStatus.OPEN) {
        return
    }

    return (
        <OrderInfoLabel
            label={"Desconto (%)"}
            width={8}
            child={
                <form onSubmit={handleSubmitDiscount}>
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

const OrderItemQuantity = (
    {item}: { item: OrderItem }
) => {
    const [order, setOrder] = useAtom(OrderState.Order)

    const setOrderItems = useSetAtom(OrderState.OrderItems)

    const changeQuantity = (symbol: '-' | '+') => {
        const newQuantity = symbol === "-" ? item.quantity - 1 : item.quantity + 1

        orderUseCase.saveItemInOrder(
            order?.uuid ?? "",
            {
                quantity: newQuantity,
                products: [item.product?.uuid ?? ""],
                discount: item.discount
            }
        ).then((response) => {
            if (response.order) {
                setOrder(response.order)
                setOrderItems(response.order.items ?? [])
            }
        })
    }

    if (order!.status != OrderStatus.OPEN) {
        return
    }

    return (
        <OrderInfoLabel
            label={"Quantidade"}
            width={7}
            child={
                <Box
                    sx={{
                        display: "flex",
                        gap: 1,
                        width: "50%",
                        height: "1.5rem",
                        mt: 0.4,
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            borderRadius: "5px",
                            height: "1.5rem",
                        }}
                    >
                        <IconButton
                            size={"sm"}
                            variant={"outlined"}
                            sx={{
                                borderRadius: "5px 0px 0px 5px",
                                backgroundColor: "var(--joy-palette-background-surface)"
                            }}
                            onClick={() => {
                                changeQuantity("-")
                            }}
                        >
                            <RemoveRoundedIcon
                                sx={{
                                    fontSize: "11pt",
                                }}
                            />
                        </IconButton>
                        <Box
                            sx={{
                                border: "1px solid var(--joy-palette-neutral-outlinedBorder)",
                                borderRight: "none",
                                borderLeft: "none",
                                width: "1.5rem",
                                height: "var(--IconButton-size, 2rem)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: "var(--joy-palette-background-surface)"
                            }}
                        >
                            <Typography
                                sx={{
                                    textAlign: "center",
                                    fontWeight: "bold",
                                }}
                            >
                                {item.quantity}
                            </Typography>
                        </Box>
                        <IconButton
                            size="sm"
                            variant={"outlined"}
                            sx={{
                                borderRadius: "0px 5px 5px 0px",
                                backgroundColor: "var(--joy-palette-background-surface)"
                            }}
                            onClick={() => {
                                changeQuantity("+")
                            }}
                        >
                            <AddRoundedIcon
                                sx={{
                                    fontSize: "11pt",
                                }}
                            />
                        </IconButton>
                    </Box>
                </Box>
            }
        />
    )
}

const OrderItemRemove = (
    {item}: { item: OrderItem }
) => {
    const [order, setOrder] = useAtom(OrderState.Order)
    const setOrderItems = useSetAtom(OrderState.OrderItems)

    const handleRemoveItem = () => {
        popup.confirm(
            "question",
            "Remover?",
            "Você deseja remover este item do pedido?",
            "Sim",
            "Não"
        ).then((result) => {
            if (result.isConfirmed) {
                removeItem()
            }
        })
    }

    const removeItem = () => {
        orderUseCase.removeItemInOrder(
            order?.uuid ?? "",
            {
                products: [item.product?.uuid ?? ""],
                quantity: 0,
                discount: 0
            }
        ).then((response) => {
            if (response.order) {
                setOrder(response.order)
                setOrderItems(response.order.items ?? [])
            }
        })
    }

    if (order!.status != OrderStatus.OPEN) {
        return
    }

    return (
        <OrderInfoLabel
            width={10}
            child={
                <Button
                    variant={"solid"}
                    color={"danger"}
                    size={"sm"}
                    startDecorator={<DeleteOutlineOutlinedIcon/>}
                    onClick={() => handleRemoveItem()}
                >
                    Remover item
                </Button>
            }
        />
    )
}

const OrderTotals = ({order}: { order: Order }) => {
    const navigate = useNavigate()

    const handleChangeOrderStatus = (status: OrderStatus) => {
        orderUseCase.saveOrder(
            order?.uuid ?? "",
            {
                status: status,
                discount: order.defaultDiscount
            }
        ).then((response) => {
            if (response.order) {
                navigate("/orders")
            }
            if (response.error) {
                popup.toast("error", response.error, 2000);
            }
        })
    }

    return (
        <CrmContainer
            sx={{
                display: "flex",
                width: "100%",
                borderRadius: "8px",
                p: 1,
                flexDirection: "column",
                flex: 1,
                gap: 0.5,
                backgroundColor: "background.level1",
                minHeight: "fit-content"
            }}
        >
            <Typography
                level={"body-md"}
                fontWeight={"bold"}
            >
                Totais
            </Typography>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 1
                }}
            >
                {order.status == OrderStatus.OPEN ? (
                    <OrderDiscount/>
                ) : (
                    <OrderInfoLabel
                        label={"Desconto (%)"}
                        child={maskDecimal(order.defaultDiscount ?? 0)}
                        width={8}
                    />
                )}
                <OrderInfoLabel
                    label={"Quantidade de produtos"}
                    child={order.totalProducts}
                    width={12}
                />
                <OrderInfoLabel
                    label={"Quantidade de itens"}
                    child={order.totalItems}
                    width={10}
                />
                <OrderInfoLabel
                    label={"Desconto total (%)"}
                    child={maskDecimal(order.discount ?? 0)}
                    width={8}
                />
                <OrderInfoLabel
                    label={"Peso total (g)"}
                    child={maskDecimal(order.weight ?? 0)}
                    width={8}
                />
                <OrderInfoLabel
                    label={"Valor bruto"}
                    child={maskMoney(order.grossPrice ?? 0)}
                    width={8}
                />
                <OrderInfoLabel
                    label={"Valor líquido"}
                    child={maskMoney(order.netPrice ?? 0)}
                    width={8}
                />
            </Box>
            {order.status == OrderStatus.OPEN && (
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 1,
                        mt: "auto"
                    }}
                >
                    <Button
                        sx={{flex: 1}}
                        color={"danger"}
                        startDecorator={<CancelRoundedIcon/>}
                        onClick={() => {
                            handleChangeOrderStatus(OrderStatus.CANCELED)
                        }}
                    >
                        Cancelar pedido
                    </Button>
                    <Button
                        sx={{flex: 1}}
                        color={"success"}
                        startDecorator={<TurnedInRoundedIcon/>}
                        onClick={() => {
                            handleChangeOrderStatus(OrderStatus.CLOSED)
                        }}
                    >
                        Finalizar pedido
                    </Button>
                </Box>
            )}
        </CrmContainer>
    )
}

const OrderDiscount = () => {
    const [order, setOrder] = useAtom(OrderState.Order)

    const {register, handleSubmit} = useForm({
        defaultValues: {
            discount: order!.defaultDiscount
        }
    })

    const setOrderItems = useSetAtom(OrderState.OrderItems)

    const handleSubmitDiscount = handleSubmit((data: FieldValues) => {
        const value = parseFloat(data.discount.replace(",", "."))

        orderUseCase.saveOrder(
            order?.uuid ?? "",
            {
                status: order!.status ?? OrderStatus.OPEN,
                discount: value
            }
        ).then((response) => {
            if (response.order) {
                setOrder(response.order)
                setOrderItems(response.order.items ?? [])
            }
        })
    })

    return (
        <OrderInfoLabel
            label={"Desconto (%)"}
            width={8}
            child={
                <form onSubmit={handleSubmitDiscount}>
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

const OrderInfoLabel = (
    {label, child, width}: { label?: string, child?: string | ReactNode, width: number }
) => (
    <Box
        sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
            minHeight: "70px",
            gap: 1,
            minWidth: `${width}rem`,
            maxWidth: `${width}rem`,
        }}
    >
        <Typography
            level={"body-sm"}
            fontWeight={"bold"}
        >
            {label ?? <>&nbsp;</>}
        </Typography>
        <Typography
            level={"body-sm"}
        >
            {child ?? <>-</>}
        </Typography>
    </Box>
)