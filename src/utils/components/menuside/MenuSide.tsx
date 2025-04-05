import {
    Avatar,
    Box,
    Divider, IconButton,
    List,
    ListItem,
    ListItemButton,
    listItemButtonClasses,
    ListItemContent,
    Typography
} from "@mui/joy";
import HomeRounded from "@mui/icons-material/HomeRounded"
import LogoutRounded from "@mui/icons-material/LogoutRounded"
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../../core/auth/provider/AuthProvider.tsx";

export const MenuSide = () => {
    const navigate = useNavigate();

    const {user, logout} = useAuth();

    return (
        <Box
            sx={{
                minHeight: "100%",
                overflow: 'hidden auto',
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                [`& .${listItemButtonClasses.root}`]: {
                    gap: 1.5,
                },
            }}
        >
            <List
                size="sm"
                sx={{
                    gap: 1,
                    '--List-nestedInsetStart': '30px',
                    '--ListItem-radius': (theme) => theme.vars.radius.sm,
                }}
            >
                <ListItem>
                    <ListItemButton onClick={() => navigate("/home")}>
                        <HomeRounded/>
                        <ListItemContent>
                            <Typography level="title-sm">Home</Typography>
                        </ListItemContent>
                    </ListItemButton>
                </ListItem>
                <ListItem>
                    <ListItemButton onClick={() => navigate("/user")}>
                        <HomeRounded/>
                        <ListItemContent>
                            <Typography level="title-sm">User</Typography>
                        </ListItemContent>
                    </ListItemButton>
                </ListItem>
            </List>
            <Divider/>
            <Box
                sx={{
                    display: 'flex',
                    gap: 1,
                    alignItems: 'center',
                    pt: 1,
                    pb: 1
                }}
            >
                <Avatar
                    variant="outlined"
                    size="sm"
                    alt={user?.name.substring(0, 1)}
                    src={user?.avatar}
                />
                <Box sx={{minWidth: 0, flex: 1}}>
                    <Typography level="title-sm">
                        {user?.name} {user?.surname.substring(0, 1)}.
                    </Typography>
                    <Typography level="body-xs">
                        {user?.email ?? ""}
                    </Typography>
                </Box>
                <IconButton
                    size="sm"
                    variant="plain"
                    color="neutral"
                    onClick={() => logout()}
                >
                    <LogoutRounded/>
                </IconButton>
            </Box>
        </Box>
    )
}