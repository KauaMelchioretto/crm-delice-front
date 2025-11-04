import SentimentDissatisfiedRoundedIcon from '@mui/icons-material/SentimentDissatisfiedRounded';
import {Box, Typography} from "@mui/joy";

export const CrmNotFound = () => (
    <Box
        sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2
        }}
    >
        <SentimentDissatisfiedRoundedIcon
            sx={{
                fontSize: "5rem"
            }}
        />
        <Typography>Página não encontrada</Typography>
    </Box>
)