import {Board as BoardProps, Card as CardProps} from "../../entities/entities.ts";
import {Box, Typography} from "@mui/joy";
import {Column} from "../column/Column.tsx";
import {useKanban} from "../../provider/Provider.tsx";
import {DndContext, DragOverlay, DragStartEvent} from "@dnd-kit/core";
import {DragEndEvent} from "@dnd-kit/core/dist/types/events";
import {CrmContainer} from "../../../../utils/components/core/CrmContainer.tsx";
import {CrmTitleContainer} from "../../../../utils/components/core/CrmTitleContainer.tsx";
import {ColumnTitle} from "../column/ColumnTitle.tsx";
import {useState} from "react";
import {Card} from "../card/Card.tsx";
import {ColumnZone} from "../column/ColumnZone.tsx";

export const Board = (props: BoardProps) => {
    const {columns, cards, moveCard} = useKanban();

    const [activeCard, setActiveCard] = useState<CardProps | null>(null);

    const onDragEnd = (event: DragEndEvent) => {
        const {over} = event

        setActiveCard(null)

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

    const onDragStart = (event: DragStartEvent) => {
        const cardUUID = event.active.id as string;
        const card = cards.find(c => c.uuid === cardUUID);
        if (card) setActiveCard(card);
    }

    const onDragCancel = () => setActiveCard(null);

    return (
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
                    flexDirection: "column",
                    width: "100%",
                    overflow: "hidden",
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
                        gap: 1,
                        p: 1
                    }}
                >
                    {
                        columns?.map(x => <ColumnTitle title={x.title}/>)
                    }
                </Box>
                <DndContext
                    onDragStart={onDragStart}
                    onDragEnd={onDragEnd}
                    onDragCancel={onDragCancel}
                >
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            width: "100%",
                            height: "100%",
                            overflowX: "auto",
                            flex: 1,
                            gap: 1,
                            p: 1,
                            position: "relative",
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                width: "calc(100% - 8px)",
                                overflowX: "auto",
                                flex: 1,
                                gap: 1,
                                position: "absolute",
                                top: 8,
                                height: "calc(100% - 16px)",
                                overflowY: "scroll"
                            }}
                        >
                            {
                                columns?.map(x => <Column {...x}/>)
                            }
                        </Box>
                        {
                            columns?.map(x => <ColumnZone {...x}/>)
                        }
                    </Box>
                    <DragOverlay>
                        {activeCard ? <Card {...activeCard} /> : null}
                    </DragOverlay>
                </DndContext>
            </CrmContainer>
        </Box>
    )
}