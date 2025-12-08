import {useAtomValue, useSetAtom} from "jotai";
import LeadState from "../state/LeadState.ts";
import {CrmDefaultRoles, CrmField, CrmModules} from "../../../utils/entities/entities.ts";
import {useTranslation} from "react-i18next";
import {getLeadStatusProps, Lead, LeadStatus} from "../entities/entities.ts";
import {CrmContainer} from "../../../utils/components/core/CrmContainer.tsx";
import {CrmError} from "../../../utils/components/core/CrmError.tsx";
import {CircularProgress, IconButton} from "@mui/joy"
import {FilterComponent} from "../../../utils/components/filter/FilterComponent.tsx";
import {CrmTableContainer} from "../../../utils/components/core/CrmTableContainer.tsx";
import {CrmTable} from "../../../utils/components/core/CrmTable.tsx";
import {CrmTableHead} from "../../../utils/components/core/CrmTableHead.tsx";
import {maskCNPJ} from "../../../utils/functions/DocumentValidation.ts";
import {useAuth} from "../../../core/auth/provider/AuthProvider.tsx";
import {CrmPaginationAtom} from "../../../utils/components/pagination/CrmPagination.tsx";
import PublishedWithChangesRounded from "@mui/icons-material/PublishedWithChangesRounded";
import HighlightOffRoundedIcon from '@mui/icons-material/HighlightOffRounded';
import {CrmCardStatus} from "../../../utils/components/core/CrmCardStatus.tsx";
import {leadUseCase} from "../usecase/LeadUseCase.ts";
import {popup} from "../../../utils/alerts/Popup.ts";

export const LeadPagination = () => {
    const {t} = useTranslation();

    const leadsAtom = useAtomValue(LeadState.ListAtom)
    const update = useSetAtom(LeadState.UpdateAtom);

    const {getRolesByModule} = useAuth();

    const roles = getRolesByModule(CrmModules.Leads);

    const canApproval = roles.filter(
        (x) => x.code === CrmDefaultRoles.APPROVAL_LEAD || x.code === CrmDefaultRoles.ALL_LEAD
    ).length > 0;

    const leadFields: CrmField[] = [
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
                    value: LeadStatus.PENDING.toString(),
                    label: "Pendente",
                },
                {
                    value: LeadStatus.APPROVED.toString(),
                    label: "Aprovado",
                },
                {
                    value: LeadStatus.REPROVED.toString(),
                    label: "Reprovado",
                },
            ]
        },
    ]

    if (canApproval) {
        leadFields.push(
            {
                key: "approve",
                label: "Aprovar"
            },
            {
                key: "reprove",
                label: "Reprovar"
            },
        )
    }

    const handleApproval = (leadUUID: string) => {
        leadUseCase.approveLead(leadUUID).then((response) => {
            if (response.error) {
                popup.toast("error", response.error, 2000)
            } else {
                popup.toast("success", "Aprovado com sucesso", 2000)
                update(prev => !prev)
            }
        })
    }

    const handleReject = (leadUUID: string) => {
        leadUseCase.rejectLead(leadUUID).then((response) => {
            if (response.error) {
                popup.toast("error", response.error, 2000)
            } else {
                popup.toast("success", "Reprovado com sucesso", 2000)
                update(prev => !prev)
            }
        })
    }

    switch (leadsAtom.state) {
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
                        fields={leadFields}
                        filterAtom={LeadState.FilterAtom}
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
                                fields={leadFields}
                                orderByAtom={LeadState.OrderByAtom}
                            />
                            <tbody>
                            {leadsAtom.data.leads?.items?.map((lead: Lead) => (
                                <tr key={`customer_list_key_${lead.uuid}`}>
                                    <td>{lead.companyName}</td>
                                    <td>{lead.tradingName}</td>
                                    <td>{lead.personName}</td>
                                    <td>{maskCNPJ(lead.document ?? "")}</td>
                                    <td>{lead.state}</td>
                                    <td>{lead.city}</td>
                                    <td>
                                        <CrmCardStatus {...getLeadStatusProps(lead.status!)}/>
                                    </td>
                                    {canApproval && (
                                        <td>
                                            <IconButton
                                                size={"sm"}
                                                onClick={() => {
                                                    handleApproval(lead.uuid!)
                                                }}
                                                disabled={lead.status !== LeadStatus.PENDING}
                                            >
                                                <PublishedWithChangesRounded/>
                                            </IconButton>
                                        </td>
                                    )}
                                    {canApproval && (
                                        <td>
                                            <IconButton
                                                size={"sm"}
                                                onClick={() => {
                                                    handleReject(lead.uuid!)
                                                }}
                                                disabled={lead.status !== LeadStatus.PENDING}
                                            >
                                                <HighlightOffRoundedIcon/>
                                            </IconButton>
                                        </td>
                                    )}
                                </tr>
                            ))}
                            </tbody>
                        </CrmTable>
                    </CrmTableContainer>
                    <CrmPaginationAtom
                        page={LeadState.PageAtom}
                        count={LeadState.ListTotalCountAtom}
                    />
                </CrmContainer>
            )
    }
}