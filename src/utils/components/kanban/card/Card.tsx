import {Card as CardProps} from "../entities/entities.ts";
import {Box, Typography} from "@mui/joy";
import {useDraggable} from "@dnd-kit/core";

export const Card = (props: CardProps) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: props.uuid,
        disabled: !props.movable,
        data: props
    });

    return (
        <Box
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            sx={{
                display: "flex",
                width: "100%",
                height: "7rem",
                backgroundColor: "background.level2",
                borderRadius: "4px",
                opacity: props.hidden ? "50%" : "100%",
                transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
                boxShadow: "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px",
                p: 1,
                cursor: "pointer",
                zIndex: 2
            }}
        >
            <Typography
                level={"body-md"}
            >
                {props.title}
            </Typography>
        </Box>
    )
}