import {useTranslation} from "react-i18next";
import {Customer, CustomerFormType} from "../entities/entities.ts";
import CustomersState from "../state/CustomersState.ts";
import {useAtom, useAtomValue, useSetAtom} from "jotai";
import {CrmContainer} from "../../../utils/components/core/CrmContainer";
import {CrmTableContainer} from "../../../utils/components/core/CrmTableContainer";
import {CircularProgress, IconButton} from "@mui/joy";
import {CrmTable} from "../../../utils/components/core/CrmTable";
import {maskCNPJ} from "../../../utils/functions/DocumentValidation";
import {EditRounded} from "@mui/icons-material";
import {ChangeEvent} from "react";
import {CrmPagination} from "../../../utils/components/pagination/CrmPagination";

export const CustomersList = () => {
    const {t} = useTranslation();

    const modifiedCustomer = useSetAtom(CustomersState.CustomerFormUUIDAtom);
    const modifiedCustomerForm = useSetAtom(CustomersState.CustomerFormTypeAtom);
    const customersAtom = useAtomValue(CustomersState.CustomersListAtom);

    let customers: Customer[] = [];

    if (customersAtom.state === "loading") {
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

    if (customersAtom.state === "hasData") {
        customers = customersAtom.data.items ?? [];
    }

    return (
        <CrmContainer>
            <CrmTableContainer sx={{height: 450}}>
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
                            width: 50,
                        },
                        "& td": {
                            textWrap: "nowrap"
                        }
                    }}
                >
                    <thead>
                    <tr>
                        <th>{t("customers.fields.companyName")}</th>
                        <th>{t("customers.fields.tradingName")}</th>
                        <th>{t("customers.fields.personName")}</th>
                        <th>{t("customers.fields.status")}</th>
                        <th>{t("customers.fields.document")}</th>
                        <th>{t("customers.fields.state")}</th>
                        <th>{t("customers.fields.city")}</th>
                        <th>{t("customers.fields.status")}</th>
                    </tr>
                    </thead>
                    <tbody>
                    {customers.map((customer: Customer) => (
                        <tr key={`customer_list_key_${customer.uuid}`}>
                            <td>{customer.companyName}</td>
                            <td>{customer.tradingName}</td>
                            <td>{customer.personName}</td>
                            <td>{customer.status}</td>
                            <td>{maskCNPJ(customer.document ?? "")}</td>
                            <td>{customer.state}</td>
                            <td>{customer.city}</td>
                            <td>
                                <IconButton
                                    size={"sm"}
                                    onClick={() => {
                                        modifiedCustomer(customer?.uuid ?? "");
                                        modifiedCustomerForm(CustomerFormType.EDIT_CUSTOMER);
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
        </CrmContainer>
    );
};

export const CustomerPagination = () => {
    const [page, setPage] = useAtom(CustomersState.CustomersListPage);
    const pageCount = useAtomValue(CustomersState.CustomersListTotalCountAtom);

    if (pageCount.state === "loading") return;

    const count = pageCount.state === "hasData" ? pageCount.data : 0;
    const handleChange = (_: ChangeEvent<unknown>, value: number) => {
        setPage(--value);
    };

    return (
        <CrmPagination page={page + 1} count={count} onChange={handleChange}/>
    );
};
