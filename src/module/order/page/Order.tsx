import {Box, Button} from "@mui/joy";
import CrmState from "../../../utils/state/CrmState.ts";
import {useSetAtom} from "jotai";
import {CrmFormType} from "../../../utils/entities/entities.ts";

export const Order = () => {
    const setFormType = useSetAtom(CrmState.FormType);

    return (
        <Box>
            Order
            <Button
                onClick={() => {
                    setFormType(CrmFormType.REGISTER_ORDER)
                }}
            >
                criar pedido
            </Button>
        </Box>
    )
}