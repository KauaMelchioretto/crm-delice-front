import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded';
import {useAtomValue, useSetAtom} from "jotai";
import AppBarState from "../state/AppBarState.ts";
import {IconButton, Badge, Box, Drawer, Typography, Button} from "@mui/joy";
import {Fragment, useState} from "react";
import {CrmContainer} from "../../core/CrmContainer.tsx";
import CloseRounded from "@mui/icons-material/CloseRounded";
import MarkChatUnreadRoundedIcon from '@mui/icons-material/MarkChatUnreadRounded';
import MarkChatUnreadOutlinedIcon from '@mui/icons-material/MarkChatUnreadOutlined';
import dayjs from "dayjs";
import {Empty} from "antd";
import {appBarRepository} from "../repository/AppBarRepository.ts";
import {popup} from "../../../alerts/Popup.ts";

export const Notifications = () => {
    const countNotifications = useAtomValue(AppBarState.CountNotificationsAtom)

    const setIsRead = useSetAtom(AppBarState.NotificationIsReadFilter)

    const setUpdate = useSetAtom(AppBarState.UpdateNotifications)

    const [open, setOpen] = useState(false)

    const notificationButtonIcon = countNotifications == 0
        ? <NotificationsNoneRoundedIcon/>
        : <NotificationsRoundedIcon/>

    const markReadAll = () => {
        popup.confirm("warning", "Marcar tudo como lido?", "", "Sim").then((result) => {
            if (result.isConfirmed) {
                appBarRepository.markAsReadNotificationAll().then((response) => {
                    if (response.error) {
                        popup.toast("error", response.error, 2000)
                    }
                    setUpdate(prev => !prev)
                })
            }
        })
    }

    return (
        <Fragment>
            <IconButton
                onClick={() => {
                    setOpen(true)
                }}
            >
                <Badge
                    badgeContent={countNotifications}
                    variant={"solid"}
                    size={"sm"}
                >
                    {notificationButtonIcon}
                </Badge>
            </IconButton>
            <Drawer
                open={open}
                onClose={() => setOpen(false)}
                anchor={"right"}
                variant={"plain"}
                sx={{
                    backdropFilter: "blur(0px)",
                    '& .MuiDrawer-content': {
                        width: "fit-content",
                    },
                }}
            >
                <CrmContainer
                    sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        minWidth: "45ch"
                    }}
                >
                    <Box
                        display={"flex"}
                        justifyContent={"space-between"}
                        alignItems={"center"}
                    >
                        <Typography level={"body-md"} fontWeight={"bold"}>
                            Notificações
                        </Typography>
                        <IconButton
                            size={"sm"}
                            onClick={() => setOpen(false)}
                        >
                            <CloseRounded/>
                        </IconButton>
                    </Box>
                    <Box
                        display={"flex"}
                        alignItems={"center"}
                        gap={1}
                        sx={{
                            pl: 0.5,
                            pr: 0.5,
                        }}
                    >
                        <Button
                            sx={{flex: 1}}
                            color={"neutral"}
                            size={"sm"}
                            onClick={() => {
                                setIsRead(undefined)
                            }}
                        >
                            Todos
                        </Button>
                        <Button
                            sx={{flex: 1}}
                            color={"primary"}
                            size={"sm"}
                            onClick={() => {
                                setIsRead(true)
                            }}
                            startDecorator={<MarkChatUnreadRoundedIcon/>}
                        >
                            Lido
                        </Button>
                        <Button
                            sx={{flex: 1}}
                            color={"danger"}
                            size={"sm"}
                            onClick={() => {
                                setIsRead(false)
                            }}
                            startDecorator={<MarkChatUnreadOutlinedIcon/>}
                        >
                            Não lido
                        </Button>
                    </Box>
                    <NotificationContent/>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            mt: "auto"
                        }}
                    >
                        <Button
                            sx={{
                                flex: 1
                            }}
                            startDecorator={<MarkChatUnreadRoundedIcon/>}
                            onClick={() => {
                                markReadAll()
                            }}
                        >
                            Ler todos
                        </Button>
                    </Box>
                </CrmContainer>
            </Drawer>
        </Fragment>
    )
}

const NotificationContent = () => {
    const notification = useAtomValue(AppBarState.NotificationsAtom)
    const setUpdate = useSetAtom(AppBarState.UpdateNotifications)

    const markAsRead = (notificationUUID: string) => {
        appBarRepository.markAsReadByNotificationUUID(notificationUUID).then(response => {
            if (response.error) {
                popup.toast("error", response.error, 2000)
            }
            setUpdate(prev => !prev)
        })
    }

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
                mt: 0.5,
                overflowY: "auto",
                p: 1,
                pl: 0.5,
                pr: 0.5,
            }}
        >
            {notification.length === 0 && (
                <Box
                    sx={{
                        width: "100%",
                        boxShadow: "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px",
                        borderRadius: "8px",
                        p: 1,
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <Empty/>
                </Box>
            )}
            {notification.map((n) => (
                <Box
                    sx={{
                        width: "100%",
                        boxShadow: "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px",
                        borderRadius: "8px",
                        p: 1,
                        display: "flex",
                        flexDirection: "column",
                        maxWidth: "40ch"
                    }}
                >
                    <Typography level={"body-sm"} fontWeight={"bold"}>
                        {n.title}
                    </Typography>
                    <Typography level={"body-sm"}>
                        {n.message}
                    </Typography>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                        }}
                    >
                        {
                            !n.read && (
                                <Button
                                    sx={{
                                        width: "fit-content",
                                        textWrap: "nowrap"
                                    }}
                                    variant={"plain"}
                                    size={"sm"}
                                    startDecorator={<MarkChatUnreadRoundedIcon/>}
                                    onClick={() => {
                                        markAsRead(n.uuid)
                                    }}
                                >
                                    Marcar como lido
                                </Button>
                            )
                        }
                        <Typography
                            level={"body-xs"}
                            sx={{
                                textWrap: "nowrap",
                                ml: "auto"
                            }}
                        >
                            {dayjs(n.createdAt).format("DD/MM/YYYY HH:mm:ss")}
                        </Typography>
                    </Box>
                </Box>
            ))}
        </Box>
    )
}