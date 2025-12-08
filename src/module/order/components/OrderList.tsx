import {useAtomValue} from "jotai";
import OrderState from "../state/OrderState.ts";
import {CircularProgress, IconButton} from "@mui/joy";
import {CrmContainer} from "../../../utils/components/core/CrmContainer.tsx";
import {CrmTableContainer} from "../../../utils/components/core/CrmTableContainer.tsx";
import {getOrderStatusProps, Order, OrderStatus} from "../entities/entities.ts";
import {CrmTable} from "../../../utils/components/core/CrmTable.tsx";
import {CrmTableHead} from "../../../utils/components/core/CrmTableHead.tsx";
import {EditRounded} from "@mui/icons-material";
import {CrmPaginationAtom} from "../../../utils/components/pagination/CrmPagination.tsx";
import {FilterComponent} from "../../../utils/components/filter/FilterComponent.tsx";
import {useNavigate} from "react-router-dom";
import {maskDecimal, maskMoney} from "../../../utils/functions/MarkFormat.ts";
import {CrmField} from "../../../utils/entities/entities.ts";
import {CrmError} from "../../../utils/components/core/CrmError.tsx";
import {CrmCardStatus} from "../../../utils/components/core/CrmCardStatus.tsx";
import { useTranslation } from "react-i18next";

export const OrderList = () => {
    const orderAtom = useAtomValue(OrderState.ListAtom)
    const {t} = useTranslation();
    
    const navigate = useNavigate()

    const orderFields: CrmField[] = [
        {
            key: "code",
            label: t("orders.fields.code"),
            filterable: true,
            sortable: true
        },
        {
            key: "trading_name",
            label: t('customers.fields.trading_name'),
            filterable: true,
            sortable: true
        },
        {
            key: "company_name",
            label: t("orders.labels.company_name"),
            filterable: true,
            sortable: true
        },
        {
            key: "total_items",
            label: t('orders.labels.total_items'),
            sortable: true
        },
        {
            key: "discount",
            label: t('orders.labels.total_discount') + " (%)",
            sortable: false,
        },
        {
            key: "gross_price",
            label: t('orders.labels.gross_price'),
            sortable: false
        },
        {
            key: "net_price",
            label: t('orders.labels.net_price'),
            sortable: false
        },
        {
            key: "status",
            label: t('orders.fields.status'),
            filterable: true,
            sortable: true,
            filterOptions: [
                {
                    label: t('orders.status.canceled'),
                    value: OrderStatus.CANCELED.toString()
                },
                {
                    label: t('orders.status.closed'),
                    value: OrderStatus.CLOSED.toString()
                },
                {
                    label: t('orders.status.open'),
                    value: OrderStatus.OPEN.toString()
                }
            ]
        },
        {
            key: "edit",
            label: t('actions.edit')
        }
    ]

    switch (orderAtom.state) {
        case "hasError":
            return (
                <CrmContainer
                    sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%"
                    }}
                >
                    <CrmError/>
                </CrmContainer>
            );
        case "loading":
            return (
                <CrmContainer
                    sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%"
                    }}
                >
                    <CircularProgress/>
                </CrmContainer>
            );
        case "hasData":
            return (
                <CrmContainer
                    sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        gap: 1
                    }}
                >
                    <FilterComponent
                        fields={orderFields}
                        filterAtom={OrderState.FilterAtom}
                    />
                    <CrmTableContainer>
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
                            <CrmTableHead
                                fields={orderFields}
                                orderByAtom={OrderState.OrderByAtom}
                            />
                            <tbody>
                            {orderAtom.data.items?.map((order: Order) => (
                                <tr key={`order_list_key_${order.uuid}`}>
                                    <td>{order.code}</td>
                                    <td>{order.customer?.tradingName}</td>
                                    <td>{order.customer?.companyName}</td>
                                    <td>{order.totalItems}</td>
                                    <td>{maskDecimal(order.discount ?? 0)}</td>
                                    <td>{maskMoney(order.grossPrice ?? 0)}</td>
                                    <td>{maskMoney(order.netPrice ?? 0)}</td>
                                    <td>
                                        <CrmCardStatus {...getOrderStatusProps(order.status!.toString())}/>
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
                    <CrmPaginationAtom
                        page={OrderState.PageAtom}
                        count={OrderState.ListTotalCountAtom}
                    />
                </CrmContainer>
            )
    }
}