import { Box, Button, Typography } from "@mui/joy";
import { CrmContainer } from "../../../utils/components/core/CrmContainer"; 
import { useSetAtom } from "jotai/ts3.8/react";


export const User = () => {
    return(
        <Box 
            sx={{
                height: "100%",
                width: "100%",
                gap: 2,
                display: "flex",
                flexDirection: "column"
            }}
        >

            <CrmContainer
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}
            >
                <Typography level={"body-lg"} fontWeight={"bold"}>Users</Typography>
                <Button size="sm">
                    Register user
                </Button>
            </CrmContainer>

            <Box display={"flex"} gap={2}>

            </Box>
        </Box>
    );
}