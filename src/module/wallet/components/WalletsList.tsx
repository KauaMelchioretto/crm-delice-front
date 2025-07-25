import {CrmContainer} from "../../../utils/components/core/CrmContainer.tsx";
import {CrmTableContainer} from "../../../utils/components/core/CrmTableContainer.tsx";
import {CrmTable} from "../../../utils/components/core/CrmTable.tsx";
import {useTranslation} from "react-i18next";
import {useAtomValue, useSetAtom} from "jotai";
import WalletState from "../state/WalletState.ts";
import {Box, CircularProgress, IconButton, Typography} from "@mui/joy";
import {Wallet, WalletStatus} from "../entities/entities.ts";
import {EditRounded} from "@mui/icons-material";
import dayjs from "dayjs";
import {useAtom} from "jotai/index";
import {ChangeEvent} from "react";
import {CrmPagination} from "../../../utils/components/pagination/CrmPagination.tsx";
import {getColorContrast} from "../../../utils/functions/GetColorContrast.ts";
import VerifiedRounded from "@mui/icons-material/VerifiedRounded";
import CancelRounded from "@mui/icons-material/CancelRounded";
import CrmState from "../../../utils/state/CrmState.ts";
import {CrmFormType, CrmModules} from "../../../utils/entities/entities.ts";
import {FilterComponent} from "../../../utils/components/filter/FilterComponent.tsx";
import {useAuth} from "../../../core/auth/provider/AuthProvider.tsx";

export const WalletsList = () => {
    const {t} = useTranslation()

    const walletAtom = useAtomValue(WalletState.ListAtom)
    const modifiedWallet = useSetAtom(CrmState.EntityFormUUID)
    const modifiedWalletForm = useSetAtom(CrmState.FormType)

    const {getRolesByModule} = useAuth()

    const roles = getRolesByModule(CrmModules.Wallet)

    const canCreate = roles.filter(x => x.code === "CREATE_WALLET" || x.code === "ALL_WALLET").length > 0

    const walletFields = [
        {value: "", label: t("filter_keys.none")},
        {value: "label", label: t("wallets.fields.title")},
        {value: "accountable", label: t("wallets.fields.accountable")},
    ]

    const walletStatus = {
        [WalletStatus.ACTIVE]: {
            color: "#118D57",
            label: "Ativo",
            icon: VerifiedRounded
        },
        [WalletStatus.INACTIVE]: {
            color: "#ff543f",
            label: "Inativo",
            icon: CancelRounded
        },
    }

    const CardStatus = ({status}: { status: string }) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const s = walletStatus[WalletStatus[status]]

        const colors = getColorContrast(s.color)

        const Icon = s.icon

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
                        gap: 0.5
                    }}
                >
                    <Icon
                        sx={{
                            color: s.color,
                            fontSize: "14pt"
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
        )
    }

    let wallets: Wallet[] = []

    if (walletAtom.state === "loading") {
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

    if (walletAtom.state === "hasData") {
        wallets = walletAtom.data.items ?? []
    }

    return (
        <CrmContainer>
            <FilterComponent fields={walletFields} filterAtom={WalletState.FilterAtom}/>
            <CrmTableContainer sx={{height: 450, pt: 2}}>
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
                            overflow: "hidden"
                        }
                    }}
                >
                    <thead>
                    <tr>
                        <th>{t("wallets.fields.title")}</th>
                        <th>{t("wallets.fields.accountable")}</th>
                        <th>{t("wallets.fields.customers_quantity")}</th>
                        <th>{t("wallets.fields.status")}</th>
                        <th>{t("wallets.fields.created_at")}</th>
                        {canCreate && (<th>{t("actions.edit")}</th>)}
                    </tr>
                    </thead>
                    <tbody>
                    {wallets.map((wallet: Wallet) => (
                        <tr key={`wallet_list_key_${wallet.uuid}`}>
                            <td>{wallet.label}</td>
                            <td>{wallet.accountable?.login}</td>
                            <td>{wallet.customers?.length}</td>
                            <td>
                                <CardStatus status={wallet?.status ?? "ACTIVE"}/>
                            </td>
                            <td>{dayjs(wallet.createdAt).format("DD/MM/YYYY")}</td>
                            {
                                canCreate && (
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
                                )
                            }
                        </tr>
                    ))}
                    </tbody>
                </CrmTable>
            </CrmTableContainer>
            <CustomerPagination/>
        </CrmContainer>
    )
}

export const CustomerPagination = () => {
    const [page, setPage] = useAtom(WalletState.PageAtom);
    const pageCount = useAtomValue(WalletState.ListTotalCountAtom);

    if (pageCount.state === "loading") return;

    const count = pageCount.state === "hasData" ? pageCount.data : 0;
    const handleChange = (_: ChangeEvent<unknown>, value: number) => {
        setPage(--value);
    };

    return (
        <CrmPagination page={page + 1} count={count} onChange={handleChange}/>
    );
};