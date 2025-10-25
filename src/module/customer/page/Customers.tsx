import {Box, Button, Typography} from "@mui/joy";
import {CrmTitleContainer} from "../../../utils/components/core/CrmTitleContainer";
import {useTranslation} from "react-i18next";
import {useSetAtom} from "jotai";
import CrmState from "../../../utils/state/CrmState.ts";
import {CrmDefaultRoles, CrmFormType, CrmModules} from "../../../utils/entities/entities.ts";
import {useAuth} from "../../../core/auth/provider/AuthProvider.tsx";
import {useApp} from "../../../core/config/app/AppProvider.tsx";
import {CustomersList} from "../components/CustomersList.tsx";

export const Customers = () => {
    const {t} = useTranslation();

    const setFormType = useSetAtom(CrmState.FormType);

    const {getRolesByModule} = useAuth()
    const {getModuleByCode} = useApp()

    const roles = getRolesByModule(CrmModules.Customer)
    const module = getModuleByCode(CrmModules.Customer)

    const canCreate = roles.filter(
        x => x.code === CrmDefaultRoles.CREATE_CUSTOMER || x.code === CrmDefaultRoles.ALL_CUSTOMER
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
                }}
            >
                <Typography
                    level={"body-lg"}
                    fontWeight={"bold"}
                >
                    {t("customers.page.title")}
                </Typography>
                {
                    canCreate && (
                        <Button
                            size="sm"
                            onClick={() => setFormType(CrmFormType.REGISTER_CUSTOMER)}
                            startDecorator={<ModuleIcon/>}
                        >
                            {t('customers.page.buttons.register')}
                        </Button>
                    )
                }
            </CrmTitleContainer>
            <CustomersList/>
        </Box>
    );
};
