import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded';
import {useAtomValue} from "jotai";
import AppBarState from "../state/AppBarState.ts";
import {IconButton, Badge, Box} from "@mui/joy";
import {Fragment, useState} from "react";
import {CrmModal} from "../../core/CrmModal.tsx";
import {CrmContainer} from "../../core/CrmContainer.tsx";

export const Notifications = () => {
    const countNotifications = useAtomValue(AppBarState.CountNotificationsAtom)

    const [open, setOpen] = useState(false)

    const notificationButtonIcon = countNotifications == 0
        ? <NotificationsNoneRoundedIcon/>
        : <NotificationsRoundedIcon/>

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
            <CrmModal
                open={open}
                onClose={() => {
                    setOpen(false)
                }}
            >
                <NotificationContent/>
            </CrmModal>
        </Fragment>
    )
}

const NotificationContent = () => {
    const notification = useAtomValue(AppBarState.NotificationsAtom)

    return (
        <CrmContainer>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                }}
            >OPA</Box>
        </CrmContainer>
    )
}