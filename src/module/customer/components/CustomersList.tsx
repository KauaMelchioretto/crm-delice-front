import { useTranslation } from "react-i18next";
import { Customer, CustomerStatus } from "../entities/entities.ts";
import CustomersState from "../state/CustomersState.ts";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { CrmContainer } from "../../../utils/components/core/CrmContainer";
import { CrmTableContainer } from "../../../utils/components/core/CrmTableContainer";
import { Box, CircularProgress, IconButton, Typography } from "@mui/joy";
import { CrmTable } from "../../../utils/components/core/CrmTable";
import { maskCNPJ } from "../../../utils/functions/DocumentValidation";
import { EditRounded } from "@mui/icons-material";
import { ChangeEvent } from "react";
import { CrmPagination } from "../../../utils/components/pagination/CrmPagination";
import PublishedWithChangesRounded from "@mui/icons-material/PublishedWithChangesRounded";
import { getColorContrast } from "../../../utils/functions/GetColorContrast.ts";

import VerifiedRounded from "@mui/icons-material/VerifiedRounded";
import NewReleasesRounded from "@mui/icons-material/NewReleasesRounded";
import QueryBuilderRounded from "@mui/icons-material/QueryBuilderRounded";
import CancelRounded from "@mui/icons-material/CancelRounded";
import { FilterComponent } from "../../../utils/components/filter/FilterComponent.tsx";
import CrmState from "../../../utils/state/CrmState.ts";
import { CrmFieldOption, CrmFormType, CrmModules } from "../../../utils/entities/entities.ts";
import { useAuth } from "../../../core/auth/provider/AuthProvider.tsx";
import { CrmTableHead } from "../../../utils/components/core/CrmTableHead.tsx";

export const CustomersList = () => {
  const { t } = useTranslation();

  const modifiedCustomer = useSetAtom(CrmState.EntityFormUUID);
  const modifiedCustomerForm = useSetAtom(CrmState.FormType);
  const customersAtom = useAtomValue(CustomersState.ListAtom);

  const { getRolesByModule } = useAuth();

  const roles = getRolesByModule(CrmModules.Customer);

  const canCreate =
    roles.filter(
      (x) => x.code === "CREATE_CUSTOMER" || x.code === "ALL_CUSTOMER"
    ).length > 0;
  const canApproval =
    roles.filter(
      (x) => x.code === "APPROVAL_CUSTOMER" || x.code === "ALL_CUSTOMER"
    ).length > 0;

  let customers: Customer[] = [];

  const customerStatus = {
    [CustomerStatus.PENDING]: {
      color: "#2685E2",
      label: t("customers.page.customer_status.pending"),
      icon: QueryBuilderRounded,
    },
    [CustomerStatus.FIT]: {
      color: "#118D57",
      label: t("customers.page.customer_status.fit"),
      icon: VerifiedRounded,
    },
    [CustomerStatus.NOT_FIT]: {
      color: "#e28a26",
      label: t("customers.page.customer_status.not_fit"),
      icon: NewReleasesRounded,
    },
    [CustomerStatus.INACTIVE]: {
      color: "#ff543f",
      label: t("customers.page.customer_status.inactive"),
      icon: CancelRounded,
    },
  };

  const customerStatusOptions: CrmFieldOption[] = [
    { value: "", label: t("filter_keys.none") },
    ...Object.entries(customerStatus).map(([key, value]) => ({
      value: key,
      label: value.label,
    })),
  ];

  const customerFields = [
    { value: "", label: t("filter_keys.none") },
    { value: "company_name", label: t("customers.fields.company_name") },
    { value: "trading_name", label: t("customers.fields.trading_name") },
    { value: "person_name", label: t("customers.fields.person_name") },
    { value: "document", label: t("customers.fields.document") },
    { value: "state", label: t("customers.fields.state") },
    { value: "city", label: t("customers.fields.city") },
    {
      value: "status",
      label: t("customers.fields.status"),
      filterableByOptions: true,
      filterOptions: customerStatusOptions,
    },
  ];

  const CardStatus = ({ status }: { status: string }) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const s = customerStatus[CustomerStatus[status]];

    const colors = getColorContrast(s.color);

    const Icon = s.icon;

    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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

  if (customersAtom.state === "loading") {
    return (
      <CrmContainer sx={{ width: "100%" }}>
        <CrmTableContainer
          sx={{
            height: 500,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </CrmTableContainer>
      </CrmContainer>
    );
  }

  if (customersAtom.state === "hasData") {
    customers = customersAtom.data.items ?? [];
  }

  return (
    <CrmContainer>
      <FilterComponent
        fields={customerFields}
        filterAtom={CustomersState.FilterAtom}
      />
      <CrmTableContainer sx={{ height: 450, pt: 2 }}>
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
              <CrmTableHead
                field={customerFields.find((x) => x.value === "company_name")!}
                orderByAtom={CustomersState.OrderByAtom}
              />
              <CrmTableHead
                field={customerFields.find((x) => x.value === "trading_name")!}
                orderByAtom={CustomersState.OrderByAtom}
              />
              <CrmTableHead
                field={customerFields.find((x) => x.value === "person_name")!}
                orderByAtom={CustomersState.OrderByAtom}
              />
              <CrmTableHead
                field={customerFields.find((x) => x.value === "status")!}
                orderByAtom={CustomersState.OrderByAtom}
              />
              <CrmTableHead
                field={customerFields.find((x) => x.value === "document")!}
                orderByAtom={CustomersState.OrderByAtom}
              />
              <CrmTableHead
                field={customerFields.find((x) => x.value === "state")!}
                orderByAtom={CustomersState.OrderByAtom}
              />
              <CrmTableHead
                field={customerFields.find((x) => x.value === "city")!}
                orderByAtom={CustomersState.OrderByAtom}
              />
              {canCreate && <th>{t("actions.edit")}</th>}
              {canApproval && <th>{t("actions.approve")}</th>}
            </tr>
          </thead>
          <tbody>
            {customers.map((customer: Customer) => (
              <tr key={`customer_list_key_${customer.uuid}`}>
                <td>{customer.companyName}</td>
                <td>{customer.tradingName}</td>
                <td>{customer.personName}</td>
                <td>
                  <CardStatus status={customer?.status ?? "PENDING"} />
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
                      <EditRounded />
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
                      <PublishedWithChangesRounded />
                    </IconButton>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </CrmTable>
      </CrmTableContainer>
      <CustomerPagination />
    </CrmContainer>
  );
};

export const CustomerPagination = () => {
  const [page, setPage] = useAtom(CustomersState.PageAtom);
  const pageCount = useAtomValue(CustomersState.ListTotalCountAtom);

  if (pageCount.state === "loading") return;

  const count = pageCount.state === "hasData" ? pageCount.data : 0;
  const handleChange = (_: ChangeEvent<unknown>, value: number) => {
    setPage(--value);
  };

  return (
    <CrmPagination page={page + 1} count={count} onChange={handleChange} />
  );
};
