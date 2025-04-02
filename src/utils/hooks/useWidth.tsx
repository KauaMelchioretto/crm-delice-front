import {useMediaQuery, useTheme} from "@mui/material";

export const useWidth = () => {
    const theme = useTheme();

    const keys = [...theme.breakpoints.keys];

    return (
        keys.reduce((output, key) => {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const matches = useMediaQuery(theme.breakpoints.only(key));

            return matches ? key : output;
        }, "") ?? "xs"
    );
};