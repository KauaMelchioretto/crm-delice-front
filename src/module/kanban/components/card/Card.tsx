import {Card as CardProps} from "../../entities/entities.ts";
import {Box, Chip, Typography} from "@mui/joy";
import {useDraggable} from "@dnd-kit/core";
import {NoDragZone} from "../../../../utils/components/core/NoDragZone.tsx";
import {useApp} from "../../../../core/config/app/AppProvider.tsx";
import {CrmModules} from "../../../../utils/entities/entities.ts";
import {useTheme} from "@mui/material";

export const Card = (props: CardProps) => {
    const {attributes, listeners, setNodeRef, transform, isDragging} = useDraggable({
        id: props.uuid,
        disabled: !props.movable,
        data: props
    });

    const theme = useTheme()

    const {crmModules} = useApp()

    const CustomerIcon = crmModules.find(
        m => m.code == CrmModules.Customer
    )?.icon

    const WalletIcon = crmModules.find(
        m => m.code == CrmModules.Wallet
    )?.icon

    return (
        <Box
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            sx={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                height: "8rem",
                backgroundColor: "background.level2",
                borderRadius: "4px",
                opacity: props.hidden ? "50%" : "100%",
                transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
                boxShadow: "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px",
                p: 1,
                cursor: "pointer",
                zIndex: isDragging ? 3 : 2,
                borderLeft: props.tag ? `5px solid ${props.tag.color}` : undefined,
            }}
        >
            <NoDragZone
                component={Typography}
                sx={{
                    ":hover": props.onClick ? {
                        textDecoration: "underline"
                    } : undefined,
                    userSelect: "none",
                    textOverflow: "ellipsis",
                    textWrap: "nowrap",
                    overflow: "hidden",
                    fontWeight: "bold"
                }}
                onClick={props.onClick}
                level={"body-sm"}
            >
                {props.title}
            </NoDragZone>
            <Typography
                sx={{
                    userSelect: "none",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                }}
                level="body-xs"
            >
                {props.description}
            </Typography>
            <Typography
                sx={{
                    userSelect: "none",
                    mt: "auto",
                }}
                level="body-xs"
            >
                Alterado: 25/07/2025 15:12
            </Typography>
            {
                props.metadata && (
                    <Box
                        sx={{
                            mt: 1,
                            display: "flex",
                            flexDirection: "row",
                            width: "100%",
                            gap: 1
                        }}
                    >
                        {
                            props.metadata?.customer && (
                                <Chip
                                    variant={"solid"}
                                    color={"primary"}
                                    sx={{
                                        borderRadius: "8px",
                                        maxWidth: `calc(50% - ${theme.spacing(0.5)})`
                                    }}
                                    startDecorator={CustomerIcon && <CustomerIcon/>}
                                >
                                    {props.metadata.customer.companyName}
                                </Chip>
                            )
                        }
                        {
                            props.metadata?.wallet && (
                                <Chip
                                    variant={"solid"}
                                    color={"warning"}
                                    sx={{
                                        borderRadius: "8px",
                                        maxWidth: `calc(50% - ${theme.spacing(0.5)})`
                                    }}
                                    startDecorator={WalletIcon && <WalletIcon/>}
                                >
                                    {props.metadata.wallet.label}
                                </Chip>
                            )
                        }
                    </Box>
                )
            }
        </Box>
    )
}