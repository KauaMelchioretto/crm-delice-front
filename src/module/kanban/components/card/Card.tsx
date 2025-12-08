import {Card as CardProps} from "../../entities/entities.ts";
import {Box, Chip, Typography} from "@mui/joy";
import {useDraggable} from "@dnd-kit/core";
import {NoDragZone} from "../../../../utils/components/core/NoDragZone.tsx";
import {useApp} from "../../../../core/config/app/AppProvider.tsx";
import {CrmFormType, CrmModules} from "../../../../utils/entities/entities.ts";
import {useTheme} from "@mui/material";
import CrmState from "../../../../utils/state/CrmState.ts";
import {useSetAtom} from "jotai";
import dayjs from "dayjs";
import {useTranslation} from "react-i18next";

export const Card = (props: CardProps) => {
    const setFormType = useSetAtom(CrmState.FormType)
    const setEntityUUID = useSetAtom(CrmState.EntityFormUUID)
    const {t} = useTranslation();

    const {attributes, listeners, setNodeRef, transform, isDragging} = useDraggable({
        id: props.uuid,
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
                opacity: props.lowOpacity ? "50%" : props.hidden ? "0%" : "100%",
                transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
                cursor: "pointer",
                zIndex: isDragging ? 3 : 2,
                backgroundColor: "background.level2",
                borderRadius: "4px",
                borderLeft: props.tag ? `5px solid ${props.tag.color}` : undefined,
                boxShadow: "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px",
                p: 1
            }}
        >
            <NoDragZone
                component={Typography}
                sx={{
                    ":hover": {
                        textDecoration: "underline"
                    },
                    userSelect: "none",
                    textOverflow: "ellipsis",
                    textWrap: "nowrap",
                    overflow: "hidden",
                    fontWeight: "bold"
                }}
                onClick={() => {
                    setFormType(CrmFormType.READ_CARD)
                    setEntityUUID(props.uuid)
                }}
                level={"body-sm"}
            >
                {props.code} {props.title}
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
                {t('kanbans.cards.fields.modified_at') + ': '} {dayjs(props.modifiedAt).format("DD/MM/YYYY HH:mm")}
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
                                        maxWidth: props.metadata?.wallet ? `calc(50% - ${theme.spacing(0.5)})` : "100%"
                                    }}
                                    startDecorator={CustomerIcon && <CustomerIcon/>}
                                >
                                    {props.metadata.customer.tradingName}
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