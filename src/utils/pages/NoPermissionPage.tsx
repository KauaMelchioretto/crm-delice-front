import {Box, Typography, Link} from "@mui/joy";

import PersonOffRounded from '@mui/icons-material/PersonOffRounded';

export const NoPermissionPage = () => (
    <Box
        sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%",
            flexDirection: "column",
            gap: 2
        }}
    >
        <PersonOffRounded fontSize={"large"} color={"action"}/>
        <Typography level={"body-md"}>You don't have permission to access this page</Typography>
        <Link href={"/app/home"}>Back to home</Link>
    </Box>
)