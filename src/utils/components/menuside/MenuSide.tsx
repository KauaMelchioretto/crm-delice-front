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
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import LogoutRounded from "@mui/icons-material/LogoutRounded"
import RuleRounded from "@mui/icons-material/RuleRounded"
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../../core/auth/provider/AuthProvider.tsx";
import {useContext} from "react";
import Layout from "../../layout/Layout.tsx";
import {useTranslation} from "react-i18next";
import {popup} from "../../alerts/Popup.ts";

export const MenuSide = () => {
    const navigate = useNavigate();
    const {t} = useTranslation();
    const {open} = useContext(Layout.SideNavContext)

    const {logout, modules} = useAuth();

    const SYSTEM_MODULES = [
        {
            code: "USER_MODULE",
            icon: AccountCircleRoundedIcon,
            label: t("modules.user")
        },
        {
            code: "CUSTOMER",
            icon: PeopleAltRoundedIcon,
            label: t("modules.customers")
        },
        {
            code: "SYSTEM_ROLES",
            icon: RuleRounded,
            label: t("modules.modules_config")
        },
    ]

    const handleConfirmLogout = () => {
        popup.confirm("question", "Deseja sair da sua conta?", "", "Sim").then((response) => {
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
                    SYSTEM_MODULES?.map((m, i) => {
                        const module = modules?.find(x => x.code === m.code);

                        if(!module) return

                        const Icon = m.icon

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
                                        Desvincular conta
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