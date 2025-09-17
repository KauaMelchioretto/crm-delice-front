import {useAtomValue} from "jotai";
import OrderState from "../state/OrderState.ts";
import {getColorContrast} from "../../../utils/functions/GetColorContrast.ts";
import {Box, CircularProgress, IconButton, Typography} from "@mui/joy";
import {CrmContainer} from "../../../utils/components/core/CrmContainer.tsx";
import {CrmTableContainer} from "../../../utils/components/core/CrmTableContainer.tsx";
import {Order, OrderStatus} from "../entities/entities.ts";
import VerifiedRounded from "@mui/icons-material/VerifiedRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import TurnedInRoundedIcon from "@mui/icons-material/TurnedInRounded";
import {CrmTable} from "../../../utils/components/core/CrmTable.tsx";
import {CrmTableHead} from "../../../utils/components/core/CrmTableHead.tsx";
import {EditRounded} from "@mui/icons-material";
import {useAtom} from "jotai/index";
import {ChangeEvent} from "react";
import {CrmPagination} from "../../../utils/components/pagination/CrmPagination.tsx";
import {FilterComponent} from "../../../utils/components/filter/FilterComponent.tsx";
import {useNavigate} from "react-router-dom";
import {maskDecimal, maskMoney} from "../../../utils/functions/MarkFormat.ts";

export const OrderList = () => {
    const orderAtom = useAtomValue(OrderState.ListAtom)

    const navigate = useNavigate()

    let orders: Order[] = [];

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

    if (orderAtom.state === "loading") {
        return (
            <CrmContainer sx={{width: "100%"}}>
                <CrmTableContainer
                    sx={{
                        height: 500,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <CircularProgress/>
                </CrmTableContainer>
            </CrmContainer>
        );
    }

    if (orderAtom.state === "hasData") {
        orders = orderAtom.data.items ?? [];
    }

    const orderFields = [
        {value: "", label: "Nenhum"},
        {value: "code", label: "Código"},
        {value: "tradingName", label: "Nome fantasia"},
        {value: "companyName", label: "Nome da empresa"},
        {value: "totalItems", label: "Total de itens"},
        {value: "discount", label: "Desconto total (%)"},
        {value: "grossPrice", label: "Valor bruto"},
        {value: "netPrice", label: "Valor líquido"},
        {value: "status", label: "Situação"},
    ];

    return (
        <CrmContainer>
            <FilterComponent
                fields={orderFields}
                filterAtom={OrderState.FilterAtom}
            />
            <CrmTableContainer sx={{height: 450, pt: 2}}>
                <CrmTable
                    sx={{
                        "& thead th:nth-child(1)": {
                            width: 50,
                        },
                        "& thead th:nth-child(2)": {
                            width: 100,
                        },
                        "& thead th:nth-child(3)": {
                            width: 200,
                        },
                        "& thead th:nth-child(4)": {
                            width: 100,
                        },
                        "& thead th:nth-child(5)": {
                            width: 100,
                        },
                        "& thead th:nth-child(6)": {
                            width: 100,
                        },
                        "& thead th:nth-child(7)": {
                            width: 100,
                        },
                        "& thead th:nth-child(8)": {
                            width: 100,
                        },
                        "& thead th:nth-child(9)": {
                            width: 50,
                        },
                        "& td": {
                            textWrap: "nowrap",
                            textOverflow: "ellipsis",
                            overflow: "hidden",
                        },
                    }}
                >
                    <thead>
                    <tr>
                        <CrmTableHead field={orderFields.find(x => x.value === "code")!}
                                      orderByAtom={OrderState.OrderByAtom}/>
                        <CrmTableHead field={orderFields.find(x => x.value === "tradingName")!}
                                      orderByAtom={OrderState.OrderByAtom}/>
                        <CrmTableHead field={orderFields.find(x => x.value === "companyName")!}
                                      orderByAtom={OrderState.OrderByAtom}/>
                        <CrmTableHead field={orderFields.find(x => x.value === "totalItems")!}
                                      orderByAtom={OrderState.OrderByAtom}/>
                        <CrmTableHead field={orderFields.find(x => x.value === "discount")!}
                                      orderByAtom={OrderState.OrderByAtom}/>
                        <CrmTableHead field={orderFields.find(x => x.value === "grossPrice")!}
                                      orderByAtom={OrderState.OrderByAtom}/>
                        <CrmTableHead field={orderFields.find(x => x.value === "netPrice")!}
                                      orderByAtom={OrderState.OrderByAtom}/>
                        <CrmTableHead field={orderFields.find(x => x.value === "status")!}
                                      orderByAtom={OrderState.OrderByAtom}/>
                        <th>Editar</th>
                    </tr>
                    </thead>
                    <tbody>
                    {orders?.map((order: Order) => (
                        <tr key={`order_list_key_${order.uuid}`}>
                            <td>{order.code}</td>
                            <td>{order.customer?.tradingName}</td>
                            <td>{order.customer?.companyName}</td>
                            <td>{order.totalItems}</td>
                            <td>{maskDecimal(order.discount ?? 0)}</td>
                            <td>{maskMoney(order.grossPrice ?? 0)}</td>
                            <td>{maskMoney(order.netPrice ?? 0)}</td>
                            <td>
                                <CardStatus status={order?.status ?? OrderStatus.OPEN}/>
                            </td>
                            <td>
                                <IconButton
                                    size={"sm"}
                                    onClick={() => {
                                        navigate(`/orders/${order?.uuid ?? ""}`);
                                    }}
                                >
                                    <EditRounded/>
                                </IconButton>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </CrmTable>
            </CrmTableContainer>
            <OrderPagination/>
        </CrmContainer>
    )
}

const OrderPagination = () => {
    const [page, setPage] = useAtom(OrderState.PageAtom);
    const pageCount = useAtomValue(OrderState.ListTotalCountAtom);

    if (pageCount.state === "loading") return;

    const count = pageCount.state === "hasData" ? pageCount.data : 0;
    const handleChange = (_: ChangeEvent<unknown>, value: number) => {
        setPage(--value);
    };

    return (
        <CrmPagination page={page + 1} count={count} onChange={handleChange}/>
    );
};