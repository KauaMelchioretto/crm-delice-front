import {Column as ColumnProps} from "../../entities/entities.ts";
import {Box} from "@mui/joy";
import {Card} from "../card/Card.tsx";
import {useDroppable} from "@dnd-kit/core";
import {useKanban} from "../../provider/Provider.tsx";

export const Column = (props: ColumnProps) => {
    const {cards} = useKanban();
    const {isOver, active} = useDroppable({id: props.uuid ?? ""});

    const filtered = cards.filter(c => c.columnUUID === props.uuid);

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                minWidth: "250px",
                maxWidth: "250px",
                flex: "0 0 250px",
                gap: 1,
                position: "relative",
                p: 0.5,
            }}
        >
            {
                filtered?.map(x => (
                        <Card
                            {...x}
                            hidden={active?.id === x.uuid}
                            lowOpacity={isOver && x.uuid !== active?.data.current?.uuid}
                        />
                    )
                )
            }
        </Box>
    )
}