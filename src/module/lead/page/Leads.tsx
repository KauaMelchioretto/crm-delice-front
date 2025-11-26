import {Box, Typography} from "@mui/joy"
import {CrmTitleContainer} from "../../../utils/components/core/CrmTitleContainer.tsx";
import {LeadPagination} from "../components/LeadPagination.tsx";

export const Leads = () => {
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
                    Leads
                </Typography>
            </CrmTitleContainer>
            <LeadPagination/>
        </Box>
    );
}