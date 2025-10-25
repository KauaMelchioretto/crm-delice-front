import {Box, Button, Typography} from "@mui/joy";
import {useSetAtom} from "jotai";
import {CrmTitleContainer} from "../../../utils/components/core/CrmTitleContainer.tsx";
import {ProductList} from "../components/ProductList.tsx";
import CrmState from "../../../utils/state/CrmState.ts";
import {CrmDefaultRoles, CrmFormType, CrmModules} from "../../../utils/entities/entities.ts";
import {useTranslation} from "react-i18next";
import {useAuth} from "../../../core/auth/provider/AuthProvider.tsx";
import {useApp} from "../../../core/config/app/AppProvider.tsx";

export const Product = () => {
    const modifiedProductFormType = useSetAtom(CrmState.FormType)
    const {t} = useTranslation();

    const {getRolesByModule} = useAuth()
    const {getModuleByCode} = useApp()

    const roles = getRolesByModule(CrmModules.Product)
    const module = getModuleByCode(CrmModules.Product)

    const canCreate = roles.filter(
        x => x.code === CrmDefaultRoles.CREATE_PRODUCT || x.code === CrmDefaultRoles.ALL_PRODUCT
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
                    {t("products.title")}
                </Typography>
                {
                    canCreate && (
                        <Button
                            size="sm"
                            onClick={() => modifiedProductFormType(CrmFormType.REGISTER_PRODUCT)}
                            startDecorator={<ModuleIcon/>}
                        >
                            {t("products.page.buttons.register")}
                        </Button>
                    )
                }
            </CrmTitleContainer>
            <ProductList/>
        </Box>
    )
}