import {Box, Button, Typography} from "@mui/joy";
import {useSetAtom} from "jotai";
import ProductState from "../state/ProductState.ts";
import {CrmTitleContainer} from "../../../utils/components/core/CrmTitleContainer.tsx";
import {ProductFormType} from "../entities/entities.ts";

export const Product = () => {
    const modifiedProductFormType = useSetAtom(ProductState.FormType)

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
                    Products
                </Typography>
                <Button
                    size="sm"
                    onClick={() => modifiedProductFormType(ProductFormType.REGISTER_PRODUCT)}
                >
                    Register product
                </Button>
            </CrmTitleContainer>
            <Box display={"flex"} gap={2}>

            </Box>
        </Box>
    )
}