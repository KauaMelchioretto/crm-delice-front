import {Box, Chip, Typography} from "@mui/joy";

interface ColumnTitleProps {
    title: string,
    count?: number,
    value?: number
}

export const ColumnTitle = (props: ColumnTitleProps) => (
    <Box
        sx={{
            minWidth: "250px",
            maxWidth: "250px",
            flex: "0 0 auto",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            pt: 1,
            pb: 1,
            borderRadius: "8px",
            boxShadow: "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px",
            backgroundColor: "background.level1",
            position: "relative",
            zIndex: 4
        }}
    >
        <Typography
            level={"body-md"}
            fontWeight={"bold"}
        >
            {props.title}
        </Typography>
        {props.count && props.count > 0 && (
            <Chip
                variant={"outlined"}
                color={"primary"}
                sx={{
                    borderRadius: "8px",
                    position: "absolute",
                    right: "4px",
                }}
            >
                {props.count}
            </Chip>
        )}
    </Box>
)