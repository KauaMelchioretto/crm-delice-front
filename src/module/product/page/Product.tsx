import {Box, Button, Typography} from "@mui/joy";
import {useSetAtom} from "jotai";
import {CrmTitleContainer} from "../../../utils/components/core/CrmTitleContainer.tsx";
import {ProductList} from "../components/ProductList.tsx";
import CrmState from "../../../utils/state/CrmState.ts";
import {CrmFormType, CrmModules} from "../../../utils/entities/entities.ts";
import {useTranslation} from "react-i18next";
import {useAuth} from "../../../core/auth/provider/AuthProvider.tsx";

export const Product = () => {
    const modifiedProductFormType = useSetAtom(CrmState.FormType)
    const {t} = useTranslation();

    const {getRolesByModule} = useAuth()

    const roles = getRolesByModule(CrmModules.Product)

    const canCreate = roles.filter(x => x.code === "CREATE_PRODUCT" || x.code === "ALL_PRODUCT").length > 0

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
                        >
                            {t("products.page.buttons.register")}
                        </Button>
                    )
                }
            </CrmTitleContainer>
            <Box display={"flex"} gap={2}>
                <ProductList/>
            </Box>
        </Box>
    )
}