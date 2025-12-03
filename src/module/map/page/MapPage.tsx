// src/module/map/page/MapPage.tsx
import React from 'react';
import { useAtomValue } from "jotai";
import { useTranslation } from "react-i18next";
import { Box, Grid, Typography } from "@mui/joy";
import { CrmContainer } from "../../../utils/components/core/CrmContainer";
import { CrmTitleContainer } from "../../../utils/components/core/CrmTitleContainer";
import { FilterComponent } from '../../../utils/components/filter/FilterComponent';
import { CrmField, CrmModules } from "../../../utils/entities/entities";
import { useAuth } from "../../../core/auth/provider/AuthProvider";
import { useApp } from "../../../core/config/app/AppProvider";
import MapState from '../state/MapState.tsx';
import { CircularProgress } from "@mui/joy";
import { CrmError } from "../../../utils/components/core/CrmError";
import { LeafletMap } from '../components/Leaflet.tsx';

export const MapPage = () => {
    const { t } = useTranslation();
    
    const customersByStateAtom = useAtomValue(MapState.CustomersByStateAtom);
    
    const { getRolesByModule } = useAuth();
    const { getModuleByCode } = useApp();

    const roles = getRolesByModule(CrmModules.Map);
    const module = getModuleByCode(CrmModules.Map);
    
    const ModuleIcon = module?.icon;

    // const mapFilterFields: CrmField[] = [
    //     {
    //         key: "customerName", 
    //         label: t("map.fields.customer_name") || "Nome do Cliente",
    //         filterable: true,
    //         sortable: false
    //     },
    //     {
    //         key: "walletName",
    //         label: t("map.fields.wallet_name") || "Nome da Carteira", 
    //         filterable: true,
    //         sortable: false
    //     },
    //     {
    //         key: "operatorName",
    //         label: t("map.fields.operator_name") || "Nome do Operador",
    //         filterable: true,
    //         sortable: false
    //     },
    //     {
    //         key: "state",
    //         label: t("map.fields.state") || "Estado",
    //         filterable: true,
    //         sortable: false
    //     },
    // ];

    const renderAtomContent = (atom: any) => {
        switch (atom.state) {
            case "hasError":
                return <CrmError />;
            case "loading":
                return (
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 400 }}>
                        <CircularProgress />
                    </Box>
                );
            case "hasData":
                return (
                    <LeafletMap 
                        data={atom.data?.customersByState} 
                        error={atom.data?.error}
                        isLoading={false}
                    />
                );
            default:
                return <div>Loading...</div>;
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
                <Typography level={"body-lg"} fontWeight={"bold"}>
                    {t("map.page.title") || "Mapa de Clientes por Estado"}
                </Typography>
            </CrmTitleContainer>

            {/* <FilterComponent
                fields={mapFilterFields}
                filterAtom={MapState.MapFilterAtom}
            /> */}

            <Grid container spacing={2} sx={{ height: "100%", flex: 1 }}>
                <Grid xs={12}>
                    <Box
                        sx={{
                            p: 2,
                            borderRadius: "md",
                            boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px",
                            bgcolor: "background.body",
                            height: "calc(100vh - 200px)"
                        }}
                    >
                        <Typography level="title-md" mb={2}>
                            {t("map.charts.customers_by_state") || "Distribuição de Clientes por Estado"}
                        </Typography>
                        
                        {renderAtomContent(customersByStateAtom)}
                    </Box>
                </Grid>
            </Grid>
        </CrmContainer>
    );
};