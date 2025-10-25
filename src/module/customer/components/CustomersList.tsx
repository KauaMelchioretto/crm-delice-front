import {useTranslation} from "react-i18next";
import {Customer, CustomerStatus, getCustomerStatusProps} from "../entities/entities.ts";
import CustomersState from "../state/CustomersState.ts";
import {useAtomValue, useSetAtom} from "jotai";
import {CrmContainer} from "../../../utils/components/core/CrmContainer";
import {CrmTableContainer} from "../../../utils/components/core/CrmTableContainer";
import {CircularProgress, IconButton} from "@mui/joy";
import {CrmTable} from "../../../utils/components/core/CrmTable";
import {maskCNPJ} from "../../../utils/functions/DocumentValidation";
import {EditRounded} from "@mui/icons-material";
import {CrmPaginationAtom} from "../../../utils/components/pagination/CrmPagination";
import PublishedWithChangesRounded from "@mui/icons-material/PublishedWithChangesRounded";

import {FilterComponent} from "../../../utils/components/filter/FilterComponent.tsx";
import CrmState from "../../../utils/state/CrmState.ts";
import {
    CrmDefaultRoles,
    CrmField,
    CrmFormType,
    CrmModules,
} from "../../../utils/entities/entities.ts";
import {useAuth} from "../../../core/auth/provider/AuthProvider.tsx";
import {CrmTableHead} from "../../../utils/components/core/CrmTableHead.tsx";
import {CrmError} from "../../../utils/components/core/CrmError.tsx";
import {CrmCardStatus} from "../../../utils/components/core/CrmCardStatus.tsx";

export const CustomersList = () => {
    const {t} = useTranslation();

    const modifiedCustomer = useSetAtom(CrmState.EntityFormUUID);
    const modifiedCustomerForm = useSetAtom(CrmState.FormType);
    const customersAtom = useAtomValue(CustomersState.ListAtom);

    const {getRolesByModule} = useAuth();

    const roles = getRolesByModule(CrmModules.Customer);

    const canCreate = roles.filter(
        (x) => x.code === CrmDefaultRoles.CREATE_CUSTOMER || x.code === CrmDefaultRoles.ALL_CUSTOMER
    ).length > 0;

    const canApproval = roles.filter(
        (x) => x.code === CrmDefaultRoles.APPROVAL_CUSTOMER || x.code === CrmDefaultRoles.ALL_CUSTOMER
    ).length > 0;

    const customerFields: CrmField[] = [
        {
            key: "company_name",
            label: t("customers.fields.company_name"),
            filterable: true,
            sortable: true
        },
        {
            key: "trading_name",
            label: t("customers.fields.trading_name"),
            filterable: true,
            sortable: true
        },
        {
            key: "person_name",
            label: t("customers.fields.person_name"),
            filterable: true,
            sortable: true
        },
        {
            key: "document",
            label: t("customers.fields.document"),
            filterable: true,
            sortable: true
        },
        {
            key: "state",
            label: t("customers.fields.state"),
            filterable: true,
            sortable: true
        },
        {
            key: "city",
            label: t("customers.fields.city"),
            filterable: true,
            sortable: true
        },
        {
            key: "status",
            label: t("customers.fields.status"),
            filterable: true,
            sortable: true,
            filterOptions: [
                {
                    value: CustomerStatus.PENDING.toString(),
                    label: t("customers.page.customer_status.pending"),
                },
                {
                    value: CustomerStatus.FIT.toString(),
                    label: t("customers.page.customer_status.fit"),
                },
                {
                    value: CustomerStatus.NOT_FIT.toString(),
                    label: t("customers.page.customer_status.not_fit"),
                },
                {
                    value: CustomerStatus.INACTIVE.toString(),
                    label: t("customers.page.customer_status.inactive"),
                }
            ]
        },
        {
            key: "edit",
            label: t("actions.edit")
        },
        {
            key: "approve",
            label: t("actions.approve")
        },
    ]

    switch (customersAtom.state) {
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
                        fields={customerFields}
                        filterAtom={CustomersState.FilterAtom}
                    />
                    <CrmTableContainer>
                        <CrmTable
                            sx={{
                                "& thead th:nth-child(1)": {
                                    width: 200,
                                },
                                "& thead th:nth-child(2)": {
                                    width: 200,
                                },
                                "& thead th:nth-child(3)": {
                                    width: 200,
                                },
                                "& thead th:nth-child(4)": {
                                    width: 100,
                                },
                                "& thead th:nth-child(5)": {
                                    width: 150,
                                },
                                "& thead th:nth-child(6)": {
                                    width: 100,
                                },
                                "& thead th:nth-child(7)": {
                                    width: 100,
                                },
                                "& thead th:nth-child(8)": {
                                    width: 60,
                                },
                                "& thead th:nth-child(9)": {
                                    width: 60,
                                },
                                "& td": {
                                    textWrap: "nowrap",
                                    textOverflow: "ellipsis",
                                    overflow: "hidden",
                                },
                            }}
                        >
                            <CrmTableHead
                                fields={customerFields}
                                orderByAtom={CustomersState.OrderByAtom}
                            />
                            <tbody>
                            {customersAtom.data.items?.map((customer: Customer) => (
                                <tr key={`customer_list_key_${customer.uuid}`}>
                                    <td>{customer.companyName}</td>
                                    <td>{customer.tradingName}</td>
                                    <td>{customer.personName}</td>
                                    <td>
                                        <CrmCardStatus {...getCustomerStatusProps(customer.status!)}/>
                                    </td>
                                    <td>{maskCNPJ(customer.document ?? "")}</td>
                                    <td>{customer.state}</td>
                                    <td>{customer.city}</td>
                                    {canCreate && (
                                        <td>
                                            <IconButton
                                                size={"sm"}
                                                onClick={() => {
                                                    modifiedCustomer(customer?.uuid ?? "");
                                                    modifiedCustomerForm(CrmFormType.EDIT_CUSTOMER);
                                                }}
                                            >
                                                <EditRounded/>
                                            </IconButton>
                                        </td>
                                    )}
                                    {canApproval && (
                                        <td>
                                            <IconButton
                                                size={"sm"}
                                                onClick={() => {
                                                    modifiedCustomer(customer?.uuid ?? "");
                                                    modifiedCustomerForm(CrmFormType.APPROVAL_CUSTOMER);
                                                }}
                                            >
                                                <PublishedWithChangesRounded/>
                                            </IconButton>
                                        </td>
                                    )}
                                </tr>
                            ))}
                            </tbody>
                        </CrmTable>
                    </CrmTableContainer>
                    <CrmPaginationAtom
                        page={CustomersState.PageAtom}
                        count={CustomersState.ListTotalCountAtom}
                    />
                </CrmContainer>
            )
    }
};