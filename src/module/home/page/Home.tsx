import React from 'react';
import { useAtomValue, useSetAtom } from "jotai";
import { useTranslation } from "react-i18next";
import CrmState from "../../../utils/state/CrmState";
import { useAuth } from "../../../core/auth/provider/AuthProvider";
import { useApp } from "../../../core/config/app/AppProvider";
import { CrmField, CrmModules } from "../../../utils/entities/entities";
import { Box, Grid, Typography } from "@mui/joy";
import { CrmTitleContainer } from "../../../utils/components/core/CrmTitleContainer";
import { CrmTableContainer } from "../../../utils/components/core/CrmTableContainer";
import { CrmContainer } from "../../../utils/components/core/CrmContainer";
import { CrmTable } from "../../../utils/components/core/CrmTable";
import DashboardState from "../state/DashboardState";
import { CircularProgress } from "@mui/joy";
import { CrmError } from "../../../utils/components/core/CrmError";
import { SimpleProductWithSales } from "../../product/entities/entities";
import CustomBarChars from '../components/CustomBarChars';
import { DashboardMonthSold } from '../entities/entities';
import { FilterComponent } from '../../../utils/components/filter/FilterComponent';

export const Home = () => {
    const { t } = useTranslation();

    const setFormType = useSetAtom(CrmState.FormType);

    const monthSoldAtom = useAtomValue(DashboardState.DashboardMonthSoldAtom);
    const rankBestAtom = useAtomValue(DashboardState.DashboardRankBestAtom);
    const rankLessAtom = useAtomValue(DashboardState.DashboardRankLessAtom);
    const customerAtom = useAtomValue(DashboardState.DashboardCustomerAtom);
    const orderAtom = useAtomValue(DashboardState.DashboardOrderAtom);
    const totalSoldAtom = useAtomValue(DashboardState.DashboardTotalSoldAtom);
    const mostWalletAtom = useAtomValue(DashboardState.DashboardMostWalletAtom);
    const mostOperatorAtom = useAtomValue(DashboardState.DashboardMostOperatorAtom);

    const { getRolesByModule } = useAuth()
    const { getModuleByCode } = useApp()

    const roles = getRolesByModule(CrmModules.Home)
    const module = getModuleByCode(CrmModules.Home)

    const ModuleIcon = module.icon!

    const dashboardFilterFields: CrmField[] = [
        {
            key: "customerName", 
            label: t("home.fields.customer_name"),
            filterable: true,
            sortable: false
        },
        {
            key: "walletName",
            label: t("home.fields.wallet_name"), 
            filterable: true,
            sortable: false
        },
        {
            key: "operatorName",
            label: t("home.fields.operator_name"),
            filterable: true,
            sortable: false
        },
    ];

    const renderAtomContent = (atom: any, renderFunction: (data: any) => React.JSX.Element) => {
        switch (atom.state) {
            case "hasError":
                return React.createElement(CrmError);
            case "loading":
                return React.createElement(Box, {
                    sx: { display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }
                }, React.createElement(CircularProgress));
            case "hasData":
                return renderFunction(atom.data);
            default:
                return React.createElement("div", null, "Loading...");
        }
    };

    return (
        <CrmContainer
            sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                gap: 2
            }}
        >
            <CrmTitleContainer
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <Typography
                    level={"body-lg"}
                    fontWeight={"bold"}
                >
                    {t("home.page.title")}
                </Typography>
            </CrmTitleContainer>

            <FilterComponent
                fields={dashboardFilterFields}
                filterAtom={DashboardState.FilterAtom}
            />

            <Grid container spacing={2} sx={{ height: "100%", flex: 1 }}>
                {/* Coluna principal - Cards e Gráficos */}
                <Grid xs={12} md={8}>
                    <Box
                        sx={{
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            gap: 2
                        }}
                    >
                        {/* Primeira linha de cards */}
                        <Grid container spacing={2}>
                            <Grid xs={12} md={3}>
                                <Box sx={{
                                    p: 2,
                                    borderRadius: "md",
                                    boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px",
                                    bgcolor: "background.body"
                                }}>
                                    <Typography level="body-sm">{t("home.cards.customer_pending")}</Typography>
                                    {renderAtomContent(customerAtom, (data) => (
                                        <Typography level="title-lg" fontWeight="bold">
                                            {data?.pending ?? 0}
                                        </Typography>
                                    ))}
                                </Box>
                            </Grid>

                            <Grid xs={12} md={3}>
                                <Box sx={{
                                    p: 2,
                                    borderRadius: "md",
                                    boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px",
                                    bgcolor: "background.body"
                                }}>
                                    <Typography level="body-sm">{t("home.cards.customer_inactive")}</Typography>
                                    {renderAtomContent(customerAtom, (data) => (
                                        <Typography level="title-lg" fontWeight="bold">
                                            {data?.inactive ?? 0}
                                        </Typography>
                                    ))}
                                </Box>
                            </Grid>

                            <Grid xs={12} md={3}>
                                <Box sx={{
                                    p: 2,
                                    borderRadius: "md",
                                    boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px",
                                    bgcolor: "background.body"
                                }}>
                                    <Typography level="body-sm">{t("home.cards.customer_fit")}</Typography>
                                    {renderAtomContent(customerAtom, (data) => (
                                        <Typography level="title-lg" fontWeight="bold">
                                            {data?.fit ?? 0}
                                        </Typography>
                                    ))}
                                </Box>
                            </Grid>

                            <Grid xs={12} md={3}>
                                <Box sx={{
                                    p: 2,
                                    borderRadius: "md",
                                    boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px",
                                    bgcolor: "background.body"
                                }}>
                                    <Typography level="body-sm">{t("home.cards.customer_not_fit")}</Typography>
                                    {renderAtomContent(customerAtom, (data) => (
                                        <Typography level="title-lg" fontWeight="bold">
                                            {data?.notFit ?? 0}
                                        </Typography>
                                    ))}
                                </Box>
                            </Grid>
                        </Grid>

                        {/* Segunda linha de cards */}
                        <Grid container spacing={2}>
                            <Grid xs={12} md={3}>
                                <Box sx={{
                                    p: 2,
                                    borderRadius: "md",
                                    boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px",
                                    bgcolor: "background.body"
                                }}>
                                    <Typography level="body-sm">{t("home.cards.order_open")}</Typography>
                                    {renderAtomContent(orderAtom, (data) => (
                                        <Typography level="title-lg" fontWeight="bold">
                                            {data?.open ?? 0}
                                        </Typography>
                                    ))}
                                </Box>
                            </Grid>

                            <Grid xs={12} md={3}>
                                <Box sx={{
                                    p: 2,
                                    borderRadius: "md",
                                    boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px",
                                    bgcolor: "background.body"
                                }}>
                                    <Typography level="body-sm">{t("home.cards.order_closed")}</Typography>
                                    {renderAtomContent(orderAtom, (data) => (
                                        <Typography level="title-lg" fontWeight="bold">
                                            {data?.closed ?? 0}
                                        </Typography>
                                    ))}
                                </Box>
                            </Grid>

                            <Grid xs={12} md={3}>
                                <Box sx={{
                                    p: 2,
                                    borderRadius: "md",
                                    boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px",
                                    bgcolor: "background.body"
                                }}>
                                    <Typography level="body-sm">{t("home.cards.order_canceled")}</Typography>
                                    {renderAtomContent(orderAtom, (data) => (
                                        <Typography level="title-lg" fontWeight="bold">
                                            {data?.canceled ?? 0}
                                        </Typography>
                                    ))}
                                </Box>
                            </Grid>

                            <Grid xs={12} md={3}>
                                <Box sx={{
                                    p: 2,
                                    borderRadius: "md",
                                    boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px",
                                    bgcolor: "background.body"
                                }}>
                                    <Typography level="body-sm">{t("home.cards.total_sold")}</Typography>
                                    {renderAtomContent(totalSoldAtom, (data) => (
                                        <Typography level="title-lg" fontWeight="bold">
                                            R$ {data?.data?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) ?? '0,00'}
                                        </Typography>
                                    ))}
                                </Box>
                            </Grid>
                        </Grid>

                        {/* Terceira linha de cards */}
                        <Grid container spacing={2}>
                            <Grid xs={12} md={6}>
                                <Box sx={{
                                    p: 2,
                                    borderRadius: "md",
                                    boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px",
                                    bgcolor: "background.body"
                                }}>
                                    <Typography level="body-sm">{t("home.cards.wallet_most_sold")}</Typography>
                                    {renderAtomContent(mostWalletAtom, (data) => (
                                        <Box>
                                            <Typography level="title-lg" fontWeight="bold">
                                                {data?.label ?? "N/A"}
                                            </Typography>
                                            <Typography level="body-sm">
                                                {data?.sold?.toLocaleString('pt-BR', {
                                                    minimumFractionDigits: 2
                                                }) ?? '0,00'}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>
                            </Grid>

                            <Grid xs={12} md={6}>
                                <Box sx={{
                                    p: 2,
                                    borderRadius: "md",
                                    boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px",
                                    bgcolor: "background.body"
                                }}>
                                    <Typography level="body-sm">{t("home.cards.operator_most_sold")}</Typography>
                                    {renderAtomContent(mostOperatorAtom, (data) => (
                                        <Box>
                                            <Typography level="title-lg" fontWeight="bold">
                                                {data?.name ?? "N/A"}
                                            </Typography>
                                            <Typography level="body-sm">
                                                {data?.sold?.toLocaleString('pt-BR', {
                                                    minimumFractionDigits: 2
                                                }) ?? '0,00'}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>
                            </Grid>
                        </Grid>

                        {/* Gráfico */}
                        <Grid container spacing={2}>
                            <Grid xs={12} md={12}>
                                <Box sx={{
                                    p: 2,
                                    borderRadius: "md",
                                    boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px",
                                    bgcolor: "background.body"
                                }}>
                                    <Typography level="title-md" mb={2}>
                                        {t("home.charts.monthly_sales")}
                                    </Typography>
                                    {renderAtomContent(monthSoldAtom, (data) => {
                                        const parsed = data?.dashboardMonthSold?.map((item: DashboardMonthSold) => ({
                                            category: item.monthYear,
                                            value: item.total,
                                        }));

                                        return <CustomBarChars data={parsed} />;
                                    })}
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>

                {/* Coluna lateral - Tabelas */}
                <Grid xs={12} md={4}>
                    <Box
                        sx={{
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            gap: 2
                        }}
                    >
                        {/* Tabela de Produtos Mais Vendidos */}
                        <CrmTableContainer sx={{
                            p: 2,
                            borderRadius: "md",
                            boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px",
                            bgcolor: "background.body"
                        }}>
                            <Typography level="title-sm" sx={{ mb: 1, px: 2, pt: 2 }}>
                                {t("home.tables.best_selling_products")}
                            </Typography>
                            {renderAtomContent(rankBestAtom, (data) => {
                                return (
                                    <CrmTable
                                        sx={{
                                            "& thead th:nth-child(1)": { width: "55%" },
                                            "& thead th:nth-child(2)": { width: "20%" },
                                            "& thead th:nth-child(3)": { width: "25%" },
                                            "& td": {
                                                textWrap: "nowrap",
                                                textOverflow: "ellipsis",
                                                overflow: "hidden",
                                            },
                                        }}
                                    >
                                        <thead>
                                            <tr>
                                                <th>{t("home.tables.product")}</th>
                                                <th>{t("home.tables.quantity")}</th>
                                                <th>{t("home.tables.sold")}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.products?.map((product: SimpleProductWithSales) => (
                                                <tr key={`product_list_key_${product.uuid}`}>
                                                    <td>{product.name}</td>
                                                    <td>{product.quantity}</td>
                                                    <td>{product.sold.toFixed(2)?.replace(".", ",")}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </CrmTable>
                                );
                            })}
                        </CrmTableContainer>

                        <CrmTableContainer sx={{
                            p: 2,
                            borderRadius: "md",
                            boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px",
                            bgcolor: "background.body"
                        }}>
                            <Typography level="title-sm" sx={{ mb: 1, px: 2, pt: 2 }}>
                                {t("home.tables.least_selling_products")}
                            </Typography>
                            {renderAtomContent(rankLessAtom, (data) => {
                                return (
                                    <CrmTable
                                        sx={{
                                            "& thead th:nth-child(1)": { width: "55%" },
                                            "& thead th:nth-child(2)": { width: "20%" },
                                            "& thead th:nth-child(3)": { width: "25%" },
                                            "& td": {
                                                textWrap: "nowrap",
                                                textOverflow: "ellipsis",
                                                overflow: "hidden",
                                            },
                                        }}
                                    >
                                        <thead>
                                            <tr>
                                                <th>{t("home.tables.product")}</th>
                                                <th>{t("home.tables.quantity")}</th>
                                                <th>{t("home.tables.sold")}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.products?.map((product: SimpleProductWithSales) => (
                                                <tr key={`product_list_key_${product.uuid}`}>
                                                    <td>{product.name}</td>
                                                    <td>{product.quantity}</td>
                                                    <td>{product.sold.toFixed(2).replace(".", ",")}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </CrmTable>
                                );
                            })}
                        </CrmTableContainer>
                    </Box>
                </Grid>
            </Grid>
        </CrmContainer>
    );
}