import {Box, Button, Typography} from "@mui/joy";
import CrmState from "../../../utils/state/CrmState.ts";
import {useSetAtom} from "jotai";
import {CrmDefaultRoles, CrmFormType, CrmModules} from "../../../utils/entities/entities.ts";
import {OrderList} from "../components/OrderList.tsx";
import {CrmTitleContainer} from "../../../utils/components/core/CrmTitleContainer.tsx";
import {useAuth} from "../../../core/auth/provider/AuthProvider.tsx";
import {useApp} from "../../../core/config/app/AppProvider.tsx";
import { useTranslation } from "react-i18next";

export const Order = () => {
    const setFormType = useSetAtom(CrmState.FormType);

    const {getRolesByModule} = useAuth()
    const {getModuleByCode} = useApp()
    const {t} = useTranslation();

    const roles = getRolesByModule(CrmModules.Order)
    const module = getModuleByCode(CrmModules.Order)

    const canCreate = roles.filter(
        x => x.code === CrmDefaultRoles.CREATE_ORDER || x.code === CrmDefaultRoles.ALL_ORDER
    ).length > 0

    const ModuleIcon = module.icon!

    return (
        <Box
            sx={{
                height: "100%",
                width: "100%",
                gap: 2,
                display: "flex",
                flexDirection: "column",
            }}
        >
            <CrmTitleContainer
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    overflow: "hidden"
                }}
            >
                <Typography
                    level={"body-lg"}
                    fontWeight={"bold"}
                >
                    {t('orders.title')}
                </Typography>
                {
                    canCreate && (
                        <Button
                            size="sm"
                            onClick={() => {
                                setFormType(CrmFormType.REGISTER_ORDER)
                            }}
                            startDecorator={<ModuleIcon/>}
                        >
                            {t('orders.actions.register_order')}
                        </Button>
                    )
                }
            </CrmTitleContainer>
            <OrderList/>
        </Box>
    )
}