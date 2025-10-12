import {Box, Typography} from "@mui/joy";
import SentimentVeryDissatisfiedRoundedIcon from '@mui/icons-material/SentimentVeryDissatisfiedRounded';

export const CrmError = () => (
    <Box
        sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2
        }}
    >
        <SentimentVeryDissatisfiedRoundedIcon
            sx={{
                fontSize: "5rem"
            }}
        />
        <Typography>Ocorreu um erro inesperado</Typography>
    </Box>
)