import {Board as BoardProps} from "../../entities/entities.ts";
import {Box, Typography} from "@mui/joy";
import {Column} from "../column/Column.tsx";
import {useKanban} from "../../provider/Provider.tsx";
import {DndContext} from "@dnd-kit/core";
import {DragEndEvent} from "@dnd-kit/core/dist/types/events";
import {CrmContainer} from "../../../../utils/components/core/CrmContainer.tsx";
import {CrmTitleContainer} from "../../../../utils/components/core/CrmTitleContainer.tsx";

export const Board = (props: BoardProps) => {
    const {columns, cards, moveCard} = useKanban();

    const onDragEnd = (event: DragEndEvent) => {
        const {over} = event

        if (!over) return;

        const cardUUID = event.active.id as string;
        const targetColumnUUID = over.id as string;

        const card = cards.find(c => c.uuid === cardUUID);
        const targetColumn = columns.find(c => c.uuid === targetColumnUUID);

        if (!card || !targetColumn) return;

        if (card.columnUUID === targetColumnUUID) return;

        if (card.onChange) {
            card.onChange(event.activatorEvent, {uuid: cardUUID, toColumnUUID: targetColumnUUID})
        }

        moveCard(cardUUID, targetColumnUUID);
    }

    return (
        <DndContext onDragEnd={onDragEnd}>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    height: "-webkit-fill-available",
                    gap: 1,
                }}
            >
                <CrmTitleContainer
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        overflow: "hidden",
                        justifyContent: "space-between",
                        alignItems: "start"
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        <Typography
                            level={"body-lg"}
                            fontWeight={"bold"}
                        >
                            {props.title}
                        </Typography>
                        <Typography
                            level={"body-md"}
                            sx={{
                                textOverflow: "ellipsis",
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                            }}
                        >
                            {props.description}
                        </Typography>
                    </Box>
                </CrmTitleContainer>
                <CrmContainer
                    sx={{
                        display: "flex",
                        width: "100%",
                        overflowX: "hidden",
                        height: "-webkit-fill-available",
                        borderRadius: "8px",
                        p: 0,
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            width: "100%",
                            overflowX: "auto",
                            height: "100%",
                            gap: 1,
                            p: 1
                        }}
                    >
                        {
                            columns?.map(x => <Column {...x}/>)
                        }
                    </Box>
                </CrmContainer>
            </Box>
        </DndContext>
    )
}