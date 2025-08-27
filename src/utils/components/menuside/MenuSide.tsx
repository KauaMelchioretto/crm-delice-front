import {
    Box,
    Divider,
    List,
    ListItem,
    ListItemButton,
    listItemButtonClasses,
    ListItemContent,
    Typography
} from "@mui/joy";
import HomeRounded from "@mui/icons-material/HomeRounded"
import LogoutRounded from "@mui/icons-material/LogoutRounded"
import {useLocation, useNavigate} from "react-router-dom";
import {useAuth} from "../../../core/auth/provider/AuthProvider.tsx";
import {useContext} from "react";
import Layout from "../../layout/Layout.tsx";
import {useTranslation} from "react-i18next";
import {popup} from "../../alerts/Popup.ts";
import {useApp} from "../../../core/config/app/AppProvider.tsx";
import {SvgIconComponent} from "@mui/icons-material";

export const MenuSide = () => {
    const navigate = useNavigate();
    const {t} = useTranslation();
    const {open} = useContext(Layout.SideNavContext)

    const {logout, modules} = useAuth();
    const {crmModules} = useApp()

    const sideBarModules = crmModules.filter(x => {
        if(modules?.find(m => m.code === x.code) && x.sideBar){
            return x
        }
    })

    const handleConfirmLogout = () => {
        popup.confirm(
            "question",
            t('logout_message.label'),
            "",
            t('logout_message.confirm'),
            t('logout_message.cancel')
        ).then((response) => {
            if (response.isConfirmed) {
                logout();
            }
        })
    }

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
                    gap: 0,
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
                                    <Typography
                                        level="title-sm"
                                        sx={{textWrap: "nowrap"}}
                                    >
                                        {t("modules.home")}
                                    </Typography>
                                </ListItemContent>
                            </ListItemButton>
                        ) : (
                            <ListItemButton>
                                <HomeRounded fontSize={"small"}/>
                            </ListItemButton>
                        )
                    }
                </ListItem>
                {
                    sideBarModules?.map((m, i) => {
                        const module = modules?.find(x => x.code === m.code);

                        if(!module) return

                        const Icon = m.icon as SvgIconComponent

                        return (
                            <ListItem
                                key={`module_menu_side_${i}`}
                                onClick={() => navigate(module?.path ?? "")}
                            >
                                {
                                    open ? (
                                        <ListItemButton>
                                            <Icon fontSize={"small"}/>
                                            <ListItemContent>
                                                <Typography
                                                    level="title-sm"
                                                    sx={{
                                                        textWrap: "nowrap"
                                                    }}
                                                >
                                                    {m.label}
                                                </Typography>
                                            </ListItemContent>
                                        </ListItemButton>
                                    ) : (
                                        <ListItemButton>
                                            <Icon fontSize={"small"}/>
                                        </ListItemButton>
                                    )
                                }
                            </ListItem>
                        )
                    })
                }
            </List>
            <Divider/>
            <Box
                sx={{
                    display: 'flex',
                    gap: 1,
                    alignItems: 'center',
                    justifyContent: open ? "start" : "center",
                    pt: 1,
                }}
            >
                <List
                    size="sm"
                    sx={{
                        gap: 0,
                        '--List-nestedInsetStart': '30px',
                        '--ListItem-radius': (theme) => theme.vars.radius.sm,
                    }}
                >
                    {
                        open ? (
                            <ListItemButton onClick={() => handleConfirmLogout()}>
                                <LogoutRounded fontSize={"small"}/>
                                <ListItemContent>
                                    <Typography
                                        level="title-sm"
                                        sx={{
                                            textWrap: "nowrap"
                                        }}
                                    >
                                        {t("logout_button")}
                                    </Typography>
                                </ListItemContent>
                            </ListItemButton>
                        ) : (
                            <ListItemButton onClick={() => handleConfirmLogout()}>
                                <LogoutRounded fontSize={"small"}/>
                            </ListItemButton>
                        )
                    }
                </List>
            </Box>
        </Box>
    )
}