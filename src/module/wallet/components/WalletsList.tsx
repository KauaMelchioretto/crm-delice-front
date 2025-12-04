import {CrmContainer} from "../../../utils/components/core/CrmContainer.tsx";
import {CrmTableContainer} from "../../../utils/components/core/CrmTableContainer.tsx";
import {CrmTable} from "../../../utils/components/core/CrmTable.tsx";
import {useTranslation} from "react-i18next";
import {useAtomValue, useSetAtom} from "jotai";
import WalletState from "../state/WalletState.ts";
import {CircularProgress, IconButton} from "@mui/joy";
import {getWalletStatusProps, Wallet, WalletStatus} from "../entities/entities.ts";
import {EditRounded} from "@mui/icons-material";
import dayjs from "dayjs";
import CrmState from "../../../utils/state/CrmState.ts";
import {
    CrmDefaultRoles,
    CrmField,
    CrmFieldType,
    CrmFormType,
    CrmModules,
} from "../../../utils/entities/entities.ts";
import {FilterComponent} from "../../../utils/components/filter/FilterComponent.tsx";
import {useAuth} from "../../../core/auth/provider/AuthProvider.tsx";
import {CrmTableHead} from "../../../utils/components/core/CrmTableHead.tsx";
import {CrmError} from "../../../utils/components/core/CrmError.tsx";
import {CrmCardStatus} from "../../../utils/components/core/CrmCardStatus.tsx";
import {CrmPaginationAtom} from "../../../utils/components/pagination/CrmPagination.tsx";

export const WalletsList = () => {
    const {t} = useTranslation();

    const walletAtom = useAtomValue(WalletState.ListAtom);
    const modifiedWallet = useSetAtom(CrmState.EntityFormUUID);
    const modifiedWalletForm = useSetAtom(CrmState.FormType);

    const {getRolesByModule} = useAuth();

    const roles = getRolesByModule(CrmModules.Wallet);

    const canCreate = roles.filter(
        (x) => x.code === CrmDefaultRoles.CREATE_WALLET || x.code === CrmDefaultRoles.ALL_WALLET
    ).length > 0;

    const walletFields: CrmField[] = [
        {
            key: "label",
            label: t("wallets.fields.title"),
            sortable: true,
            filterable: true
        },
        {
            key: "accountable",
            label: t("wallets.fields.accountable"),
            sortable: true,
            filterable: true
        },
        {
            key: "customers_quantity",
            label: t("wallets.fields.customers_quantity"),
            sortable: true
        },
        {
            key: "status",
            label: t("wallets.fields.status"),
            sortable: true,
            filterable: true,
            filterOptions: [
                {
                    label: t('wallets.status.active'),
                    value: WalletStatus.ACTIVE
                },
                {
                    label: t('wallets.status.inactive'),
                    value: WalletStatus.INACTIVE
                }
            ]
        },
        {
            key: "created_at",
            label: t("wallets.fields.created_at"),
            filterType: CrmFieldType.Date,
            sortable: true,
            filterable: true
        },
        {
            key: "edit",
            label: t("actions.edit")
        },
    ]

    switch (walletAtom.state) {
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
                        fields={walletFields}
                        filterAtom={WalletState.FilterAtom}
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
                                    width: 100,
                                },
                                "& thead th:nth-child(4)": {
                                    width: 100,
                                },
                                "& thead th:nth-child(5)": {
                                    width: 100,
                                },
                                "& thead th:nth-child(6)": {
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
                                fields={walletFields}
                                orderByAtom={WalletState.OrderByAtom}
                            />
                            <tbody>
                            {walletAtom.data.items?.map((wallet: Wallet) => (
                                <tr key={`wallet_list_key_${wallet.uuid}`}>
                                    <td>{wallet.label}</td>
                                    <td>{wallet.accountable?.login}</td>
                                    <td>{wallet.customers?.length}</td>
                                    <td>
                                        <CrmCardStatus {...getWalletStatusProps(wallet.status!.toString())}/>
                                    </td>
                                    <td>
                                        {dayjs(wallet.createdAt).format("DD/MM/YYYY")}
                                    </td>
                                    {canCreate && (
                                        <td>
                                            <IconButton
                                                size={"sm"}
                                                onClick={() => {
                                                    modifiedWallet(wallet?.uuid ?? "");
                                                    modifiedWalletForm(CrmFormType.EDIT_WALLET);
                                                }}
                                            >
                                                <EditRounded/>
                                            </IconButton>
                                        </td>
                                    )}
                                </tr>
                            ))}
                            </tbody>
                        </CrmTable>
                    </CrmTableContainer>
                    <CrmPaginationAtom
                        page={WalletState.PageAtom}
                        count={WalletState.ListTotalCountAtom}
                    />
                </CrmContainer>
            )
    }
};