import {Column as ColumnProps} from "../../entities/entities.ts";
import {Box} from "@mui/joy";
import {useDroppable} from "@dnd-kit/core";
import {useKanban} from "../../provider/Provider.tsx";
import DoDisturbRoundedIcon from '@mui/icons-material/DoDisturbRounded';
import ContentPasteGoRoundedIcon from '@mui/icons-material/ContentPasteGoRounded';
import EqualizerRoundedIcon from '@mui/icons-material/EqualizerRounded';

export const ColumnZone = (props: ColumnProps) => {
    const {cards} = useKanban();
    const {setNodeRef, isOver, active} = useDroppable({id: props.uuid ?? ""});

    const filtered = cards.filter(c => c.columnUUID === props.uuid);

    const cannotMove = isOver && !props.allowedColumns?.includes(active?.data.current?.columnUUID)

    const overColor = isOver ? cannotMove ? "#f64545" : "#259de4" : "#f3f3f3"

    return (
        <Box
            ref={setNodeRef}
            sx={{
                display: "flex",
                flexDirection: "column",
                minWidth: "250px",
                maxWidth: "250px",
                flex: "0 0 250px",
                height: "100%",
                overflow: "hidden",
                tabIndex: -1,
                justifyContent: filtered.length === 0 ? "center" : "start",
                gap: 1,
                borderRadius: "8px",
                border: active ? `3px dashed ${overColor}` : undefined,
                position: "relative",
                p: 0.5,
                boxShadow: isOver ? undefined : "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px",
                backgroundColor: "background.level1",
            }}
        >
            {filtered.length === 0 && !isOver && (
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                        height: "100%",
                        position: "absolute",
                    }}
                >
                    <EqualizerRoundedIcon
                        sx={{
                            fontSize: "20pt",
                        }}
                    />
                </Box>
            )}
            {isOver && !cannotMove && (
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                        height: "100%",
                        position: "absolute",
                    }}
                >
                    <ContentPasteGoRoundedIcon
                        sx={{
                            fontSize: "20pt",
                            color: overColor,
                        }}
                    />
                </Box>
            )}
            {
                isOver && cannotMove && (
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            width: "100%",
                            height: "100%",
                            position: "absolute",
                        }}
                    >
                        <DoDisturbRoundedIcon
                            sx={{
                                fontSize: "20pt",
                                color: overColor,
                            }}
                        />
                    </Box>
                )
            }
        </Box>
    )
}