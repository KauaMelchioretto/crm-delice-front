import {Box, Button, Typography} from "@mui/joy";
import CrmState from "../../../utils/state/CrmState.ts";
import {useSetAtom} from "jotai";
import {CrmFormType} from "../../../utils/entities/entities.ts";
import {OrderList} from "../components/OrderList.tsx";
import {CrmTitleContainer} from "../../../utils/components/core/CrmTitleContainer.tsx";

export const Order = () => {
    const setFormType = useSetAtom(CrmState.FormType);

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
                    Pedidos
                </Typography>
                <Button
                    onClick={() => {
                        setFormType(CrmFormType.REGISTER_ORDER)
                    }}
                >
                    Cadastrar pedido
                </Button>
            </CrmTitleContainer>
            <Box display={"flex"} gap={2}>
                <OrderList/>
            </Box>
        </Box>
    )
}