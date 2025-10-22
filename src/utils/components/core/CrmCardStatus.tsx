import {CrmCardStatusProps} from "../../entities/entities.ts";
import {getColorContrast} from "../../functions/GetColorContrast.ts";
import {Box, Typography} from "@mui/joy";
import {useTranslation} from "react-i18next";

export const CrmCardStatus = (props: CrmCardStatusProps) => {
    const {t} = useTranslation()

    const colors = getColorContrast(props.color);

    const Icon = props.icon;

    return (
        <Box sx={{display: "flex", alignItems: "center", gap: 1}}>
            <Box
                sx={{
                    backgroundColor: colors.transparent,
                    p: 0.5,
                    borderRadius: "8px",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 0.5,
                }}
            >
                <Icon
                    sx={{
                        color: props.color,
                        fontSize: "14pt",
                    }}
                />
                <Typography
                    sx={{
                        color: props.color,
                        fontWeight: "bold",
                        fontSize: "9pt",
                    }}
                >
                    {t(props.label)}
                </Typography>
            </Box>
        </Box>
    );
}