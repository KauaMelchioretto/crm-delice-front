import {Box, Button, Typography} from "@mui/joy";
import {useSetAtom} from "jotai";
import {CrmTitleContainer} from "../../../utils/components/core/CrmTitleContainer.tsx";
import {ProductList} from "../components/ProductList.tsx";
import CrmState from "../../../utils/state/CrmState.ts";
import {CrmFormType} from "../../../utils/entities/entities.ts";
import { useTranslation } from "react-i18next";

export const Product = () => {
    const modifiedProductFormType = useSetAtom(CrmState.FormType)
    const { t } = useTranslation();

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
                <Button
                    size="sm"
                    onClick={() => modifiedProductFormType(CrmFormType.REGISTER_PRODUCT)}
                >
                    {t("products.page.buttons.register")}
                </Button>
            </CrmTitleContainer>
            <Box display={"flex"} gap={2}>
                <ProductList/>
            </Box>
        </Box>
    )
}