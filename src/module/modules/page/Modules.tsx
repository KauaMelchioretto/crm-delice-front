import {Box, Typography} from "@mui/joy";
import {useContext} from "react";
import Layout from "../../../utils/layout/Layout.tsx";

export const Modules = () => {
    const {changeShow,show} = useContext(Layout.RootContext)

    return (
        <Box
            sx={{
                heigth: "100%",
                width: "100%"
            }}
        >
            <Typography level={"body-lg"}>Modules</Typography>
            <button onClick={() => changeShow ? changeShow(!show) : undefined}>OPA</button>
        </Box>
    )
}