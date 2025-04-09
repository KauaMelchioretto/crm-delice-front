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
import RuleRounded from "@mui/icons-material/RuleRounded"
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../../core/auth/provider/AuthProvider.tsx";
import {Fragment, useContext} from "react";
import Layout from "../../layout/Layout.tsx";

export const MenuSide = () => {
    const navigate = useNavigate();

    const {open} = useContext(Layout.SideNavContext)

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
                    gap: open ? 0.5 : 0,
                    '--List-nestedInsetStart': '30px',
                    '--ListItem-radius': (theme) => theme.vars.radius.sm,
                }}
            >
                <ListItem onClick={() => navigate("/home")}>
                    {
                        open ? (
                            <ListItemButton>
                                <HomeRounded fontSize={"small"}/>
                                <ListItemContent>
                                    <Typography level="title-sm" sx={{textWrap: "nowrap"}}>Home</Typography>
                                </ListItemContent>
                            </ListItemButton>
                        ) : (
                            <IconButton size={"sm"}>
                                <HomeRounded fontSize={"small"}/>
                            </IconButton>
                        )
                    }
                </ListItem>
                <ListItem onClick={() => navigate("/user")}>
                    {
                        open ? (
                            <ListItemButton>
                                <HomeRounded fontSize={"small"}/>
                                <ListItemContent>
                                    <Typography level="title-sm" sx={{textWrap: "nowrap"}}>User</Typography>
                                </ListItemContent>
                            </ListItemButton>
                        ) : (
                            <IconButton size={"sm"}>
                                <HomeRounded fontSize={"small"}/>
                            </IconButton>
                        )
                    }
                </ListItem>
                <ListItem onClick={() => navigate("/modules")}>
                    {
                        open ? (
                            <ListItemButton>
                                <RuleRounded fontSize={"small"}/>
                                <ListItemContent>
                                    <Typography level="title-sm" sx={{textWrap: "nowrap"}}>Modules config</Typography>
                                </ListItemContent>
                            </ListItemButton>
                        ) : (
                            <IconButton size={"sm"}>
                                <RuleRounded fontSize={"small"}/>
                            </IconButton>
                        )
                    }
                </ListItem>
            </List>
            <Divider/>
            <Box
                sx={{
                    display: 'flex',
                    gap: 1,
                    alignItems: 'center',
                    justifyContent: open ? "start" : "center",
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
                {
                    open && (
                        <Fragment>
                            <Box sx={{minWidth: 0, flex: 1}}>
                                <Typography level="title-sm" sx={{textWrap: "nowrap"}}>
                                    {user?.name} {user?.surname.substring(0, 1)}.
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
                        </Fragment>
                    )
                }
            </Box>
        </Box>
    )
}